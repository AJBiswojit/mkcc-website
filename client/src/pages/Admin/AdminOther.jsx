import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import api from '../../utils/api';
import ImageUpload from '../../components/ImageUpload/ImageUpload';

// ─── Admin Gallery ────────────────────────────────────────────────────────────
export function AdminGallery() {
  const [photos, setPhotos] = useState([]);
  const [form, setForm] = useState({ title: '', imageUrl: '', imageFileId: '', category: 'Cricket', caption: '' });
  const [showForm, setShowForm] = useState(false);

  const load = () => api.get('/gallery').then(r => setPhotos(r.data.data)).catch(() => {});
  useEffect(() => { load(); }, []);

  const submit = async (e) => {
    e.preventDefault();
    if (!form.imageUrl) { toast.error('Please upload an image first.'); return; }
    try {
      await api.post('/gallery', form);
      toast.success('Photo added!');
      setForm({ title: '', imageUrl: '', imageFileId: '', category: 'Cricket', caption: '' });
      setShowForm(false);
      load();
    } catch { toast.error('Failed.'); }
  };

  const del = async (id) => {
    if (!confirm('Delete photo?')) return;
    try { await api.delete(`/gallery/${id}`); toast.success('Deleted!'); load(); }
    catch { toast.error('Failed.'); }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-4xl text-white uppercase">Gallery Manager</h1>
        <button onClick={() => setShowForm(s => !s)} className="btn-primary text-sm py-2">
          {showForm ? '✕ Cancel' : '+ Add Photo'}
        </button>
      </div>

      {showForm && (
        <div className="bg-mkcc-card border border-mkcc-border rounded-xl p-6 mb-8">
          <h2 className="font-heading font-bold text-white text-xl mb-5">Add New Photo</h2>
          <form onSubmit={submit} className="space-y-5">

            {/* Image Upload */}
            <div>
              <label className="block font-heading text-gray-300 text-xs mb-2 uppercase tracking-wider">
                Photo * <span className="text-mkcc-muted normal-case tracking-normal">(uploads to ImageKit CDN)</span>
              </label>
              <ImageUpload
                label="Upload Gallery Photo"
                folder="/mkcc/gallery"
                preview={form.imageUrl}
                onUpload={(url, fileId) => setForm(f => ({ ...f, imageUrl: url, imageFileId: fileId || '' }))}
              />
              {/* Fallback manual URL */}
              {!form.imageUrl && (
                <div className="mt-2">
                  <p className="text-mkcc-muted text-xs font-body mb-1">— or paste a direct URL —</p>
                  <input
                    type="url"
                    value={form.imageUrl}
                    onChange={e => setForm(f => ({ ...f, imageUrl: e.target.value }))}
                    placeholder="https://ik.imagekit.io/..."
                    className="w-full bg-mkcc-dark border border-mkcc-border rounded px-3 py-2.5 text-white font-body text-sm focus:border-mkcc-red focus:outline-none"
                  />
                </div>
              )}
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-heading text-gray-300 text-xs mb-1 uppercase tracking-wider">Title *</label>
                <input type="text" required value={form.title}
                  onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                  className="w-full bg-mkcc-dark border border-mkcc-border rounded px-3 py-2.5 text-white font-body text-sm focus:border-mkcc-red focus:outline-none" />
              </div>
              <div>
                <label className="block font-heading text-gray-300 text-xs mb-1 uppercase tracking-wider">Category</label>
                <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                  className="w-full bg-mkcc-dark border border-mkcc-border rounded px-3 py-2.5 text-white font-body text-sm focus:border-mkcc-red focus:outline-none">
                  {['Ganesh Puja','Cricket','Club Activities','Tournament','Other'].map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
            </div>

            <div>
              <label className="block font-heading text-gray-300 text-xs mb-1 uppercase tracking-wider">Caption</label>
              <input type="text" value={form.caption}
                onChange={e => setForm(f => ({ ...f, caption: e.target.value }))}
                placeholder="Optional caption..."
                className="w-full bg-mkcc-dark border border-mkcc-border rounded px-3 py-2.5 text-white font-body text-sm focus:border-mkcc-red focus:outline-none" />
            </div>

            <div className="flex gap-3 justify-end">
              <button type="button" onClick={() => setShowForm(false)}
                className="font-heading text-mkcc-muted text-sm px-4 py-2 border border-mkcc-border rounded hover:text-white transition-colors">
                Cancel
              </button>
              <button type="submit" className="btn-primary text-sm py-2">
                Save Photo
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {photos.map(p => (
          <div key={p._id} className="relative group rounded-lg overflow-hidden aspect-square bg-mkcc-card border border-mkcc-border">
            <img src={p.imageUrl} alt={p.title} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-3">
              <p className="text-white font-heading text-xs font-semibold truncate">{p.title}</p>
              <p className="text-mkcc-gold text-xs mb-2">{p.category}</p>
              <button onClick={() => del(p._id)}
                className="bg-mkcc-red text-white text-xs font-heading py-1.5 rounded w-full hover:bg-red-700 transition-colors">
                🗑 Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Admin Membership Requests ────────────────────────────────────────────────
export function AdminMembers() {
  const [requests, setRequests] = useState([]);
  const [filter, setFilter] = useState('pending');

  const load = () => api.get(`/join?status=${filter}`).then(r => setRequests(r.data.data)).catch(() => setRequests([]));
  useEffect(() => { load(); }, [filter]);

  const updateStatus = async (id, status) => {
    try { await api.put(`/join/${id}`, { status }); toast.success(`Request ${status}!`); load(); }
    catch { toast.error('Failed.'); }
  };
  const del = async (id) => {
    if (!confirm('Delete?')) return;
    try { await api.delete(`/join/${id}`); toast.success('Deleted!'); load(); } catch { toast.error('Failed.'); }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-4xl text-white uppercase">Membership Requests</h1>
      </div>
      <div className="flex gap-2 mb-6">
        {['pending', 'approved', 'rejected'].map(s => (
          <button key={s} onClick={() => setFilter(s)}
            className={`font-heading text-sm font-semibold uppercase tracking-wider px-4 py-2 rounded border transition-all capitalize
              ${filter === s ? 'bg-mkcc-red text-white border-mkcc-red' : 'text-mkcc-muted border-mkcc-border hover:text-white'}`}>{s}</button>
        ))}
      </div>

      <div className="space-y-3">
        {requests.length === 0 && (
          <div className="text-center py-12 text-mkcc-muted font-body">No {filter} requests</div>
        )}
        {requests.map(r => (
          <div key={r._id} className="bg-mkcc-card border border-mkcc-border rounded-xl p-5 flex items-center gap-4 flex-wrap">
            <div className="w-10 h-10 bg-mkcc-red/10 rounded-full flex items-center justify-center font-display text-mkcc-red text-xl">
              {r.name[0]}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-heading font-bold text-white">{r.name}</p>
              <p className="text-mkcc-muted text-xs font-body">{r.phone} · {r.village || 'N/A'} · <span className="text-mkcc-gold">{r.role}</span></p>
              {r.message && <p className="text-gray-400 text-xs mt-1 font-body italic">"{r.message}"</p>}
            </div>
            <p className="text-mkcc-muted text-xs font-body">{new Date(r.createdAt).toLocaleDateString('en-IN')}</p>
            <div className="flex gap-2">
              {r.status === 'pending' && (
                <>
                  <button onClick={() => updateStatus(r._id, 'approved')}
                    className="font-heading text-xs text-green-400 border border-green-700 px-3 py-1 rounded hover:bg-green-900/30 transition-colors">
                    ✓ Approve
                  </button>
                  <button onClick={() => updateStatus(r._id, 'rejected')}
                    className="font-heading text-xs text-mkcc-red border border-mkcc-red/30 px-3 py-1 rounded hover:bg-mkcc-red/10 transition-colors">
                    ✕ Reject
                  </button>
                </>
              )}
              <button onClick={() => del(r._id)} className="font-heading text-xs text-gray-500 border border-mkcc-border px-3 py-1 rounded hover:text-mkcc-red transition-colors">Del</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Admin Announcements ──────────────────────────────────────────────────────
export function AdminAnnouncements() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({ title: '', content: '', type: 'info', isActive: true });
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const load = () => api.get('/announcements/all').then(r => setItems(r.data.data)).catch(() => {});
  useEffect(() => { load(); }, []);

  const submit = async (e) => {
    e.preventDefault();
    try {
      if (editing) { await api.put(`/announcements/${editing}`, form); toast.success('Updated!'); }
      else { await api.post('/announcements', form); toast.success('Created!'); }
      setForm({ title: '', content: '', type: 'info', isActive: true }); setEditing(null); setShowForm(false); load();
    } catch { toast.error('Failed.'); }
  };

  const del = async (id) => {
    if (!confirm('Delete?')) return;
    try { await api.delete(`/announcements/${id}`); toast.success('Deleted!'); load(); } catch { toast.error('Failed.'); }
  };

  const TYPE_COLORS = { info: 'text-blue-400', warning: 'text-yellow-400', success: 'text-green-400', urgent: 'text-mkcc-red' };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-4xl text-white uppercase">Announcements</h1>
        <button onClick={() => { setForm({ title: '', content: '', type: 'info', isActive: true }); setEditing(null); setShowForm(true); }} className="btn-primary text-sm py-2">+ Add</button>
      </div>

      {showForm && (
        <div className="bg-mkcc-card border border-mkcc-border rounded-xl p-6 mb-8">
          <form onSubmit={submit} className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-heading text-gray-300 text-xs mb-1 uppercase tracking-wider">Title *</label>
                <input type="text" required value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                  className="w-full bg-mkcc-dark border border-mkcc-border rounded px-3 py-2.5 text-white font-body text-sm focus:border-mkcc-red focus:outline-none" />
              </div>
              <div>
                <label className="block font-heading text-gray-300 text-xs mb-1 uppercase tracking-wider">Type</label>
                <select value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))}
                  className="w-full bg-mkcc-dark border border-mkcc-border rounded px-3 py-2.5 text-white font-body text-sm focus:border-mkcc-red focus:outline-none">
                  {['info','warning','success','urgent'].map(t => <option key={t}>{t}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label className="block font-heading text-gray-300 text-xs mb-1 uppercase tracking-wider">Content *</label>
              <textarea required value={form.content} onChange={e => setForm(f => ({ ...f, content: e.target.value }))} rows={3}
                className="w-full bg-mkcc-dark border border-mkcc-border rounded px-3 py-2.5 text-white font-body text-sm focus:border-mkcc-red focus:outline-none resize-none" />
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" id="active" checked={form.isActive} onChange={e => setForm(f => ({ ...f, isActive: e.target.checked }))} className="accent-mkcc-red" />
              <label htmlFor="active" className="font-heading text-white text-sm">Active</label>
            </div>
            <div className="flex gap-3 justify-end">
              <button type="button" onClick={() => setShowForm(false)} className="font-heading text-mkcc-muted text-sm px-4 py-2 border border-mkcc-border rounded">Cancel</button>
              <button type="submit" className="btn-primary text-sm py-2">{editing ? 'Update' : 'Create'}</button>
            </div>
          </form>
        </div>
      )}

      <div className="space-y-3">
        {items.map(item => (
          <div key={item._id} className="bg-mkcc-card border border-mkcc-border rounded-xl p-5 flex items-start gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <p className="font-heading font-bold text-white">{item.title}</p>
                <span className={`text-xs font-heading uppercase ${TYPE_COLORS[item.type] || 'text-gray-400'}`}>{item.type}</span>
                {!item.isActive && <span className="text-xs text-gray-500 font-heading">(inactive)</span>}
              </div>
              <p className="text-gray-400 text-sm font-body">{item.content}</p>
            </div>
            <div className="flex gap-2 flex-shrink-0">
              <button onClick={() => { setForm(item); setEditing(item._id); setShowForm(true); }}
                className="font-heading text-xs text-mkcc-gold border border-mkcc-gold/30 px-3 py-1 rounded hover:border-mkcc-gold transition-colors">Edit</button>
              <button onClick={() => del(item._id)}
                className="font-heading text-xs text-mkcc-red border border-mkcc-red/30 px-3 py-1 rounded hover:border-mkcc-red transition-colors">Del</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Admin Donations ──────────────────────────────────────────────────────────
const STATUS_COLOR = { pending: 'text-yellow-400', approved: 'text-green-400', rejected: 'text-red-400' };
const STATUS_BG    = { pending: 'bg-yellow-900/20 border-yellow-600/30', approved: 'bg-green-900/20 border-green-600/30', rejected: 'bg-red-900/20 border-red-600/30' };

export function AdminDonations() {
  const [donations, setDonations] = useState([]);
  const [filter, setFilter]       = useState('all');
  const [stats, setStats]         = useState({ totalAmount: 0, totalDonors: 0 });
  const [lightbox, setLightbox]   = useState(null);

  const load = () => {
    const q = filter !== 'all' ? `?status=${filter}` : '';
    api.get(`/donations${q}`).then(r => setDonations(r.data.data)).catch(() => {});
    api.get('/donations/stats').then(r => setStats(r.data.data)).catch(() => {});
  };

  useEffect(() => { load(); }, [filter]);

  const updateStatus = async (id, status) => {
    try {
      await api.put(`/donations/${id}`, { status });
      toast.success(`Donation ${status}!`);
      load();
    } catch { toast.error('Failed to update.'); }
  };

  const del = async (id) => {
    if (!confirm('Delete this donation record?')) return;
    try { await api.delete(`/donations/${id}`); toast.success('Deleted!'); load(); }
    catch { toast.error('Failed.'); }
  };

  return (
    <div>
      <h1 className="font-display text-4xl text-white uppercase mb-2">Donations</h1>
      <p className="text-mkcc-muted font-body text-sm mb-6">Review, approve or reject donation submissions.</p>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-mkcc-card border border-mkcc-gold/30 rounded-xl p-4 text-center">
          <p className="font-display text-3xl text-mkcc-gold">₹{stats.totalAmount?.toLocaleString('en-IN')}</p>
          <p className="font-heading text-mkcc-muted text-xs uppercase tracking-wider mt-1">Total Raised</p>
        </div>
        <div className="bg-mkcc-card border border-green-600/30 rounded-xl p-4 text-center">
          <p className="font-display text-3xl text-green-400">{stats.totalDonors}</p>
          <p className="font-heading text-mkcc-muted text-xs uppercase tracking-wider mt-1">Approved Donors</p>
        </div>
        <div className="bg-mkcc-card border border-yellow-600/30 rounded-xl p-4 text-center">
          <p className="font-display text-3xl text-yellow-400">{donations.filter(d => d.status === 'pending').length}</p>
          <p className="font-heading text-mkcc-muted text-xs uppercase tracking-wider mt-1">Pending Review</p>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {['all','pending','approved','rejected'].map(s => (
          <button key={s} onClick={() => setFilter(s)}
            className={`font-heading text-sm uppercase px-4 py-2 rounded-lg transition-all
              ${filter === s ? 'bg-mkcc-red text-white' : 'bg-mkcc-card border border-mkcc-border text-mkcc-muted hover:text-white hover:border-mkcc-gold'}`}>
            {s === 'all' ? '📋 All' : s === 'pending' ? '⏳ Pending' : s === 'approved' ? '✅ Approved' : '❌ Rejected'}
          </button>
        ))}
      </div>

      {/* Donations list */}
      {donations.length === 0 ? (
        <div className="text-center py-16 border-2 border-dashed border-mkcc-border rounded-2xl">
          <p className="text-4xl mb-2">💛</p>
          <p className="font-heading text-white text-lg">No donations yet</p>
          <p className="text-mkcc-muted text-sm font-body mt-1">Donations submitted from the public page will appear here.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {donations.map(d => (
            <div key={d._id} className={`rounded-xl border p-5 ${STATUS_BG[d.status] || 'bg-mkcc-card border-mkcc-border'}`}>
              <div className="flex flex-col sm:flex-row sm:items-start gap-4">

                {/* Screenshot thumbnail */}
                {d.screenshotUrl && (
                  <button onClick={() => setLightbox(d.screenshotUrl)}
                    className="flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border border-mkcc-border hover:border-mkcc-gold transition-colors">
                    <img src={d.screenshotUrl} alt="Screenshot" className="w-full h-full object-cover" />
                  </button>
                )}

                {/* Info */}
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-3 flex-wrap">
                    <p className="font-heading font-bold text-white text-lg">{d.name}</p>
                    <span className={`font-heading font-bold text-xl ${STATUS_COLOR[d.status]}`}>
                      ₹{d.amount?.toLocaleString('en-IN')}
                    </span>
                    <span className={`font-heading text-xs uppercase px-2 py-0.5 rounded-full border ${STATUS_BG[d.status]} ${STATUS_COLOR[d.status]}`}>
                      {d.status}
                    </span>
                  </div>
                  {d.phone && <p className="text-mkcc-muted text-sm font-body">📞 {d.phone}</p>}
                  {d.upiTransactionId && <p className="text-mkcc-muted text-sm font-body">🔖 TXN: <span className="text-gray-300 font-mono">{d.upiTransactionId}</span></p>}
                  {d.message && <p className="text-gray-400 text-sm font-body italic">"{d.message}"</p>}
                  <p className="text-mkcc-muted text-xs font-body">
                    {new Date(d.createdAt).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex flex-row sm:flex-col gap-2 flex-shrink-0">
                  {d.status !== 'approved' && (
                    <button onClick={() => updateStatus(d._id, 'approved')}
                      className="font-heading text-xs text-green-400 border border-green-600/40 px-3 py-1.5 rounded hover:bg-green-900/30 transition-colors whitespace-nowrap">
                      ✅ Approve
                    </button>
                  )}
                  {d.status !== 'rejected' && (
                    <button onClick={() => updateStatus(d._id, 'rejected')}
                      className="font-heading text-xs text-red-400 border border-red-600/40 px-3 py-1.5 rounded hover:bg-red-900/20 transition-colors whitespace-nowrap">
                      ❌ Reject
                    </button>
                  )}
                  <button onClick={() => del(d._id)}
                    className="font-heading text-xs text-mkcc-muted border border-mkcc-border px-3 py-1.5 rounded hover:text-red-400 hover:border-red-600/40 transition-colors">
                    🗑 Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Screenshot lightbox */}
      {lightbox && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setLightbox(null)}>
          <div className="relative max-w-lg w-full">
            <img src={lightbox} alt="Payment screenshot" className="w-full rounded-xl shadow-2xl" />
            <button onClick={() => setLightbox(null)}
              className="absolute top-3 right-3 w-9 h-9 bg-black/60 text-white rounded-full flex items-center justify-center hover:bg-mkcc-red transition-colors font-heading text-lg">
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
