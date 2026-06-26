import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { detectionsAPI, newsAPI } from '../api/api';

const formatDate = (dateStr) => {
  if (!dateStr) return '—';
  try {
    return new Date(dateStr).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  } catch {
    return dateStr;
  }
};

const formatConfidence = (confidence) => {
  if (confidence == null) return '—';
  const pct = confidence <= 1 ? confidence * 100 : confidence;
  return `${Math.round(pct)}%`;
};

const NEWS_REFRESH_MS = 10 * 60 * 1000; // poll every 10 minutes

const formatRelativeUpdate = (isoDate) => {
  if (!isoDate) return null;
  try {
    const normalized = String(isoDate).replace(/Z+$/i, 'Z');
    const parsed = new Date(normalized).getTime();
    if (Number.isNaN(parsed)) return null;
    const diffMs = Date.now() - parsed;
    if (diffMs < 0) return 'Updated just now';
    const mins = Math.floor(diffMs / 60000);
    if (mins < 1) return 'Updated just now';
    if (mins < 60) return `Updated ${mins}m ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 48) return `Updated ${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `Updated ${days}d ago`;
  } catch {
    return null;
  }
};

const NewsCard = ({ article }) => {
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    setImageError(false);
  }, [article.image_url]);

  const hasImageUrl = Boolean(article.image_url);
  const showImage = hasImageUrl && !imageError;

  return (
    <article className="tl-news-card">
      {showImage ? (
        <img
          src={article.image_url}
          alt={article.title ? `${article.title} — The Guardian` : 'The Guardian article'}
          className="tl-news-image"
          loading="lazy"
          referrerPolicy="no-referrer"
          onError={() => setImageError(true)}
        />
      ) : (
        <div className="tl-news-image-placeholder" aria-label="Image unavailable">
          <span className="tl-news-placeholder-icon">◈</span>
          <span>The Guardian</span>
        </div>
      )}
      <div className="tl-news-body">
        <div className="tl-news-source">{article.source || 'The Guardian'}</div>
        <h3 className="tl-news-title">{article.title}</h3>
        {article.summary && <p className="tl-news-summary">{article.summary}</p>}
        <div className="tl-news-meta">{formatDate(article.published_at)}</div>
        {article.link && (
          <a href={article.link} target="_blank" rel="noopener noreferrer" className="tl-news-link">
            Read More →
          </a>
        )}
      </div>
    </article>
  );
};

const loadTrustedNews = async () => {
  try {
    const response = await newsAPI.getTrustedNews();
    return response.data || { available: false, articles: [], last_updated_at: null };
  } catch {
    return { available: false, message: 'Latest trusted news is currently unavailable', articles: [] };
  }
};

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [trending, setTrending] = useState([]);
  const [trustedNews, setTrustedNews] = useState({ available: true, articles: [] });
  const [loading, setLoading] = useState(true);
  const [nowTick, setNowTick] = useState(Date.now());

  useEffect(() => {
    loadDashboard();
  }, []);

  useEffect(() => {
    const tickId = setInterval(() => setNowTick(Date.now()), 60 * 1000);
    return () => clearInterval(tickId);
  }, []);

  useEffect(() => {
    const refreshNews = async () => {
      const newsData = await loadTrustedNews();
      setTrustedNews((prev) => {
        const prevKey = prev.articles?.map((a) => a.id || a.link).join('|') || '';
        const nextKey = newsData.articles?.map((a) => a.id || a.link).join('|') || '';
        if (prevKey === nextKey && prev.last_updated_at === newsData.last_updated_at) {
          return prev;
        }
        return newsData;
      });
    };

    const intervalId = setInterval(refreshNews, NEWS_REFRESH_MS);
    return () => clearInterval(intervalId);
  }, []);

  const loadDashboard = async () => {
    try {
      const [statsRes, trendingRes, newsData] = await Promise.all([
        detectionsAPI.getStats().catch(() => ({ data: null })),
        detectionsAPI.getActiveDashboardItems().catch(() => ({ data: [] })),
        loadTrustedNews(),
      ]);

      setStats(statsRes.data);
      setTrending(trendingRes.data || []);
      setTrustedNews(newsData);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section className="tl-page">
        <div className="container">
          <div className="tl-loading">
            <div className="tl-spinner" />
            <span className="tl-loading-text">Loading intelligence dashboard…</span>
          </div>
        </div>
      </section>
    );
  }

  const hasStats = stats && stats.total_detections > 0;

  return (
    <section className="tl-page">
      <div className="container">
        <div className="tl-page-header d-flex justify-content-between align-items-start flex-wrap gap-3">
          <div>
            <h1 className="tl-page-title">Intelligence Dashboard</h1>
            <p className="tl-page-subtitle">
              Your detection analytics, recent activity, and curated trusted headlines.
            </p>
          </div>
          <Link to="/detect" className="btn tl-btn-primary">
            New Detection
          </Link>
        </div>

        <div className="tl-stat-grid">
          <div className="tl-stat-card tl-stat-card--cyan">
            <div className="tl-stat-label">Total Detections</div>
            <div className="tl-stat-value tl-stat-value--cyan">{stats?.total_detections ?? 0}</div>
          </div>
          <div className="tl-stat-card tl-stat-card--danger">
            <div className="tl-stat-label">Fake Detections</div>
            <div className="tl-stat-value tl-stat-value--danger">{stats?.fake_count ?? 0}</div>
          </div>
          <div className="tl-stat-card tl-stat-card--emerald">
            <div className="tl-stat-label">Real Detections</div>
            <div className="tl-stat-value tl-stat-value--emerald">{stats?.real_count ?? 0}</div>
          </div>
          <div className="tl-stat-card tl-stat-card--violet">
            <div className="tl-stat-label">Avg Confidence</div>
            <div className="tl-stat-value tl-stat-value--violet">
              {stats?.average_confidence != null ? `${stats.average_confidence}%` : '—'}
            </div>
          </div>
        </div>

        <div className="row g-4 mb-5">
          <div className="col-lg-7">
            <div className="tl-section-header">
              <div>
                <h2 className="tl-section-title">Latest Detections</h2>
                <p className="tl-section-subtitle">Recent evaluations from your history.</p>
              </div>
              <Link to="/history" className="btn tl-btn-ghost btn-sm">View All</Link>
            </div>
            <div className="tl-glass-card">
              {stats?.recent_detections?.length > 0 ? (
                stats.recent_detections.map((det) => (
                  <div key={det.id} className="tl-detection-item">
                    <div className="tl-detection-snippet">{det.text_snippet}</div>
                    <div className="d-flex align-items-center gap-2 flex-shrink-0">
                      {det.label === 'Fake' ? (
                        <span className="tl-badge-fake">Fake</span>
                      ) : (
                        <span className="tl-badge-real">Real</span>
                      )}
                      <span className="tl-mono tl-text-dim" style={{ fontSize: '0.8rem' }}>
                        {formatConfidence(det.confidence)}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="tl-empty-state">
                  <h5>No detections yet</h5>
                  <p>Run your first detection to populate this panel.</p>
                  <Link to="/detect" className="btn tl-btn-primary btn-sm">Start Detecting</Link>
                </div>
              )}
            </div>
          </div>

          <div className="col-lg-5">
            <div className="tl-section-header">
              <div>
                <h2 className="tl-section-title">Trending Insights</h2>
                <p className="tl-section-subtitle">Curated items flagged by TruthLens.</p>
              </div>
            </div>
            <div className="tl-glass-card">
              {trending.length > 0 ? (
                trending.slice(0, 4).map((item) => (
                  <div key={item.id} className="tl-detection-item flex-column align-items-start">
                    <div className="d-flex justify-content-between w-100 mb-1">
                      <strong style={{ fontSize: '0.9rem', color: 'var(--tl-text)' }}>{item.title}</strong>
                      {item.tags?.[0] && <span className="tl-badge-cat">{item.tags[0]}</span>}
                    </div>
                    <p className="mb-1 tl-text-muted" style={{ fontSize: '0.82rem' }}>{item.description}</p>
                    {item.url && (
                      <a href={item.url} target="_blank" rel="noopener noreferrer" className="tl-news-link" style={{ fontSize: '0.8rem' }}>
                        View Source →
                      </a>
                    )}
                  </div>
                ))
              ) : (
                <div className="tl-empty-state py-4">
                  <h5>No trending items</h5>
                  <p className="mb-0">Admin-curated insights will appear here when available.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="tl-section-header">
          <div>
            <h2 className="tl-section-title">Latest Trusted News</h2>
            <p className="tl-section-subtitle">
              Headlines from established sources — not evaluated by TruthLens.
              {trustedNews.last_updated_at && (
                <span className="d-block mt-1 tl-text-dim" style={{ fontSize: '0.8rem' }} data-tick={nowTick}>
                  {formatRelativeUpdate(trustedNews.last_updated_at)}
                </span>
              )}
            </p>
          </div>
        </div>

        {!trustedNews.available ? (
          <div className="tl-glass-card tl-empty-state">
            <p className="mb-0 tl-text-muted">
              {trustedNews.message || 'Latest trusted news is currently unavailable'}
            </p>
          </div>
        ) : trustedNews.articles.length > 0 ? (
          <div className="tl-news-grid">
            {trustedNews.articles.map((article) => (
              <NewsCard key={article.id || article.link} article={article} />
            ))}
          </div>
        ) : null}

        {!hasStats && (
          <div className="tl-glass-card tl-empty-state mt-4">
            <h5>Build your intelligence profile</h5>
            <p>Run detections to unlock richer analytics and trend data on this dashboard.</p>
            <Link to="/detect" className="btn tl-btn-primary">Start Detecting</Link>
          </div>
        )}
      </div>
    </section>
  );
};

export default Dashboard;
