import { useLocation, useNavigate, Link } from 'react-router-dom';

const Result = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const result = location.state?.result;

  if (!result) {
    navigate('/detect');
    return null;
  }

  const confPercent = result.confidence <= 1 ? result.confidence * 100 : result.confidence;
  const isFake = result.label === 'Fake';

  return (
    <section className="tl-page">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-9 col-xl-8">
            <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
              <h1 className="tl-page-title mb-0">Detection Result</h1>
              <Link to="/detect" className="btn tl-btn-ghost btn-sm">Run Another</Link>
            </div>

            <div className="tl-glass-card mb-4">
              <div className="tl-verdict-card">
                <div className={`tl-verdict-ring ${isFake ? 'tl-verdict-ring--fake' : 'tl-verdict-ring--real'}`}>
                  {isFake ? '✕' : '✓'}
                </div>
                <div className="text-uppercase tl-text-dim small mb-2" style={{ letterSpacing: '0.1em' }}>
                  Overall Verdict
                </div>
                {isFake ? (
                  <span className="tl-badge-fake fs-6 px-3 py-2">Fake News</span>
                ) : (
                  <span className="tl-badge-real fs-6 px-3 py-2">Real News</span>
                )}

                <div className="mt-4">
                  <div className="tl-text-dim small text-uppercase mb-1" style={{ letterSpacing: '0.08em' }}>
                    Confidence
                  </div>
                  <div className={`tl-confidence-display ${isFake ? 'tl-text-danger' : 'tl-text-emerald'}`}>
                    {Math.round(confPercent)}%
                  </div>
                </div>

                <div className="mt-3 px-3">
                  <div className="tl-progress tl-progress-lg">
                    <div
                      className={`progress-bar ${isFake ? 'tl-progress-bar-fake' : 'tl-progress-bar-real'}`}
                      role="progressbar"
                      style={{ width: `${confPercent <= 100 ? confPercent : 100}%` }}
                      aria-valuenow={Math.round(confPercent)}
                      aria-valuemin="0"
                      aria-valuemax="100"
                    />
                  </div>
                  <div className="tl-text-dim small mt-2">
                    Higher confidence indicates a stronger model belief in this verdict.
                  </div>
                </div>
              </div>
            </div>

            <div className="row g-4 mb-4">
              <div className="col-md-6">
                <div className="tl-glass-card h-100">
                  <div className="tl-card-body">
                    <h5 className="tl-section-title mb-3">Why this result?</h5>
                    <p className="tl-text-muted mb-0" style={{ lineHeight: 1.65 }}>{result.explanation}</p>
                  </div>
                </div>
              </div>
              <div className="col-md-6">
                <div className="tl-glass-card h-100">
                  <div className="tl-card-body">
                    <h5 className="tl-section-title mb-3">Input summary</h5>
                    <div className="d-flex flex-column gap-2" style={{ fontSize: '0.875rem' }}>
                      <div>
                        <span className="tl-text-dim">Timestamp (UTC):</span>{' '}
                        <span className="tl-mono tl-text-muted">{result.timestamp}</span>
                      </div>
                      <div>
                        <span className="tl-text-dim">Text snippet:</span>
                        <div className="tl-text-muted mt-1">
                          {result.text_snippet || '—'}
                          {result.text_snippet?.length === 200 && '…'}
                        </div>
                      </div>
                      <div>
                        <span className="tl-text-dim">URL:</span>{' '}
                        <span className="tl-text-muted">{result.url || '—'}</span>
                      </div>
                      <div>
                        <span className="tl-text-dim">Image:</span>{' '}
                        <span className="tl-text-muted tl-mono">{result.image_path || '—'}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="d-flex flex-wrap gap-2 justify-content-between">
              <Link to="/detect" className="btn tl-btn-primary">Try Another Detection</Link>
              <div className="d-flex gap-2">
                <Link to="/history" className="btn tl-btn-secondary">View History</Link>
                <Link to="/dashboard" className="btn tl-btn-ghost">Go to Dashboard</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Result;
