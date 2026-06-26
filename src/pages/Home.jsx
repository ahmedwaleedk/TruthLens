import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const { user } = useAuth();

  return (
    <>
      <section className="tl-hero">
        <div className="container">
          <div className="row align-items-center gy-5">
            <div className="col-lg-7">
              <p className="tl-text-cyan fw-semibold mb-2" style={{ fontSize: '0.85rem', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
                Cyber Intelligence Platform
              </p>
              <h1 className="tl-hero-title mb-4">
                See Beyond the Headlines with <span className="brand-accent">TruthLens</span>
              </h1>
              <p className="tl-hero-lead mb-4">
                Multimodal fake news detection powered by PyTorch. Analyze text, images, and URLs together
                to surface credibility signals with explainable AI verdicts.
              </p>
              <div className="d-flex flex-wrap gap-3">
                {user ? (
                  <>
                    <Link to="/detect" className="btn tl-btn-primary btn-lg tl-hero-btn">
                      Start Detection
                    </Link>
                    <Link to="/dashboard" className="btn tl-btn-secondary btn-lg">
                      View Dashboard
                    </Link>
                  </>
                ) : (
                  <>
                    <Link to="/register" className="btn tl-btn-primary btn-lg tl-hero-btn">
                      Get Started
                    </Link>
                    <Link to="/login" className="btn tl-btn-secondary btn-lg">
                      Login
                    </Link>
                  </>
                )}
              </div>
            </div>
            <div className="col-lg-5">
              <div className="tl-hero-panel">
                <h5>Why TruthLens?</h5>
                <ul className="list-unstyled mb-0 mt-3">
                  <li className="mb-3">◈ Multimodal fusion — text, images, and URLs analyzed together.</li>
                  <li className="mb-3">◈ Explainable verdicts with confidence scoring.</li>
                  <li className="mb-0">◈ Real PyTorch model with persistent detection history.</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="tl-page">
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="tl-section-title" style={{ fontSize: '1.75rem' }}>Multimodal Signal Layers</h2>
            <p className="tl-section-subtitle">Three complementary perspectives to assess news credibility.</p>
          </div>
          <div className="tl-feature-grid">
            <div className="tl-feature-card">
              <div className="tl-feature-icon tl-feature-icon--cyan">T</div>
              <h5>Text Analysis</h5>
              <p>
                Inspect language patterns, sensational framing, and contextual cues within the article body.
              </p>
            </div>
            <div className="tl-feature-card">
              <div className="tl-feature-icon tl-feature-icon--violet">I</div>
              <h5>Image Analysis</h5>
              <p>
                Evaluate attached visuals for manipulation, reuse, or mismatch with the narrative.
              </p>
            </div>
            <div className="tl-feature-card">
              <div className="tl-feature-icon tl-feature-icon--emerald">U</div>
              <h5>URL / Source Analysis</h5>
              <p>
                Factor in domain reputation, historical reliability, and cross-source consistency.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;
