import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { detectionsAPI } from '../api/api';

const Detect = () => {
  const [text, setText] = useState('');
  const [url, setUrl] = useState('');
  const [image, setImage] = useState(null);
  const [imageName, setImageName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setImageName(file.name);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      setImage(file);
      setImageName(file.name);
    }
    e.currentTarget.classList.remove('tl-dropzone-hover');
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.currentTarget.classList.add('tl-dropzone-hover');
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.currentTarget.classList.remove('tl-dropzone-hover');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!text.trim() && !url.trim() && !image) {
      setError('Please provide at least Text, Image, or URL.');
      setLoading(false);
      return;
    }

    try {
      const formData = new FormData();
      if (text) formData.append('text', text);
      if (url) formData.append('url', url);
      if (image) formData.append('image', image);

      const response = await detectionsAPI.detect(formData);
      navigate('/result', { state: { result: response.data } });
    } catch (err) {
      setError(err.response?.data?.message || 'Detection failed. Please try again.');
      setLoading(false);
    }
  };

  return (
    <section className="tl-page">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-9 col-xl-8">
            <div className="tl-page-header">
              <h1 className="tl-page-title">Run a Detection</h1>
              <p className="tl-page-subtitle">
                Provide any combination of text, image, or URL. At least one field is required.
              </p>
            </div>

            {error && (
              <div className="tl-alert tl-alert-warning mb-4">{error}</div>
            )}

            <div className="tl-glass-card">
              <div className="tl-card-body">
                <form onSubmit={handleSubmit} id="detect-form">
                  <div className="mb-4">
                    <label htmlFor="text" className="tl-form-label">Text (optional)</label>
                    <textarea
                      className="form-control tl-input"
                      id="text"
                      rows="5"
                      placeholder="Paste the news content here…"
                      value={text}
                      onChange={(e) => setText(e.target.value)}
                    />
                  </div>

                  <div className="mb-4">
                    <label className="tl-form-label">Image (optional)</label>
                    <div
                      id="drop-zone"
                      className="tl-dropzone"
                      onDrop={handleDrop}
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onClick={() => document.getElementById('image').click()}
                    >
                      <input
                        className="form-control d-none"
                        type="file"
                        id="image"
                        accept=".png,.jpg,.jpeg,.webp"
                        onChange={handleImageChange}
                      />
                      <div className="tl-dropzone-content">
                        <span className="tl-dropzone-icon">↑</span>
                        <div className="fw-semibold">Drag & drop an image here</div>
                        <div className="tl-text-dim small mt-1">or click to browse (PNG, JPG, JPEG, WEBP)</div>
                        {imageName && (
                          <div className="tl-text-cyan small mt-2 tl-mono">{imageName}</div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="mb-4">
                    <label htmlFor="url" className="tl-form-label">URL (optional)</label>
                    <input
                      type="url"
                      className="form-control tl-input"
                      id="url"
                      placeholder="https://example.com/news-article"
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                    />
                  </div>

                  <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">
                    <div className="tl-text-dim small">
                      Inputs are sent to the PyTorch model for analysis.
                    </div>
                    <button
                      type="submit"
                      className="btn tl-btn-primary px-4 d-inline-flex align-items-center"
                      disabled={loading}
                    >
                      {loading && (
                        <span className="tl-spinner me-2" style={{ width: '1rem', height: '1rem', borderWidth: '2px' }} />
                      )}
                      <span>{loading ? 'Analyzing…' : 'Run Detection'}</span>
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Detect;
