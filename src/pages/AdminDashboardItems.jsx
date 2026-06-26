import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminAPI } from '../api/api';

const AdminDashboardItems = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    url: '',
    source: '',
    tags: '',
    is_active: true,
  });

  useEffect(() => {
    loadItems();
  }, []);

  const loadItems = async () => {
    try {
      const response = await adminAPI.getDashboardItems(false);
      setItems(response.data);
    } catch (err) {
      console.error('Failed to load dashboard items:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingItem(null);
    setFormData({
      title: '',
      description: '',
      url: '',
      source: '',
      tags: '',
      is_active: true,
    });
    setShowForm(true);
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData({
      title: item.title,
      description: item.description,
      url: item.url,
      source: item.source,
      tags: item.tags.join(', '),
      is_active: item.is_active,
    });
    setShowForm(true);
  };

  const handleSave = async () => {
    try {
      const data = {
        ...formData,
        tags: formData.tags.split(',').map(t => t.trim()).filter(t => t),
      };

      if (editingItem) {
        await adminAPI.updateDashboardItem(editingItem.id, data);
      } else {
        await adminAPI.createDashboardItem(data);
      }

      setShowForm(false);
      setEditingItem(null);
      loadItems();
    } catch (err) {
      alert('Failed to save dashboard item.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this item?')) {
      return;
    }

    try {
      await adminAPI.deleteDashboardItem(id);
      loadItems();
    } catch (err) {
      alert('Failed to delete item.');
    }
  };

  const toggleActive = async (item) => {
    try {
      await adminAPI.updateDashboardItem(item.id, { is_active: !item.is_active });
      loadItems();
    } catch (err) {
      alert('Failed to update item.');
    }
  };

  if (loading) {
    return (
      <section className="tl-page">
        <div className="container">
          <div className="tl-loading">
            <div className="tl-spinner" />
            <span className="tl-loading-text">Loading…</span>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="tl-page">
      <div className="container">
        <div className="tl-page-header d-flex justify-content-between align-items-start flex-wrap gap-3">
          <div>
            <h1 className="tl-page-title">Dashboard Items</h1>
            <p className="tl-page-subtitle">Manage trending cards shown on the dashboard.</p>
          </div>
          <div className="d-flex gap-2 flex-wrap">
            <button className="btn tl-btn-primary" onClick={handleCreate}>
              Create New Item
            </button>
            <Link to="/admin/dashboard" className="btn tl-btn-secondary">
              Back to Dashboard
            </Link>
          </div>
        </div>

        <div className="tl-glass-card">
          <div className="tl-card-body">
            {items.length > 0 ? (
              <div className="tl-table-wrap">
                <table className="tl-table">
                  <thead>
                    <tr>
                      <th>Title</th>
                      <th>Description</th>
                      <th>Source</th>
                      <th>Tags</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((item) => (
                      <tr key={item.id}>
                        <td><strong>{item.title}</strong></td>
                        <td className="small">{item.description.substring(0, 100)}...</td>
                        <td>{item.source || '—'}</td>
                        <td>
                          {item.tags.map((tag, i) => (
                            <span key={i} className="tl-badge-cat me-1">{tag}</span>
                          ))}
                        </td>
                        <td>
                          {item.is_active ? (
                            <span className="tl-badge-real">Active</span>
                          ) : (
                            <span className="tl-badge-cat">Inactive</span>
                          )}
                        </td>
                        <td>
                          <div className="d-flex gap-1 flex-wrap">
                            <button className="btn tl-btn-ghost btn-sm" onClick={() => handleEdit(item)}>Edit</button>
                            <button className="btn tl-btn-ghost btn-sm" onClick={() => toggleActive(item)}>
                              {item.is_active ? 'Deactivate' : 'Activate'}
                            </button>
                            <button className="btn tl-btn-danger btn-sm" onClick={() => handleDelete(item.id)}>Delete</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="tl-empty-state">
                <p className="tl-text-muted">No dashboard items found.</p>
                <button className="btn tl-btn-primary" onClick={handleCreate}>
                  Create First Item
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Form Modal */}
        {showForm && (
          <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog modal-lg">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">
                    {editingItem ? 'Edit Dashboard Item' : 'Create Dashboard Item'}
                  </h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => {
                      setShowForm(false);
                      setEditingItem(null);
                    }}
                  />
                </div>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="tl-form-label">Title *</label>
                    <input type="text" className="form-control tl-input"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="tl-form-label">Description</label>
                    <textarea className="form-control tl-input"
                      rows="3"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="tl-form-label">URL</label>
                    <input type="url" className="form-control tl-input"
                      value={formData.url}
                      onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="tl-form-label">Source</label>
                    <input type="text" className="form-control tl-input"
                      value={formData.source}
                      onChange={(e) => setFormData({ ...formData, source: e.target.value })}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="tl-form-label">Tags (comma-separated)</label>
                    <input type="text" className="form-control tl-input"
                      value={formData.tags}
                      onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                      placeholder="Politics, Health, etc."
                    />
                  </div>
                  <div className="mb-3">
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        checked={formData.is_active}
                        onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                      />
                      <label className="form-check-label">Active</label>
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn tl-btn-secondary" onClick={() => { setShowForm(false); setEditingItem(null); }}>Cancel</button>
                  <button type="button" className="btn tl-btn-primary" onClick={handleSave} disabled={!formData.title}>
                    {editingItem ? 'Update' : 'Create'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default AdminDashboardItems;

