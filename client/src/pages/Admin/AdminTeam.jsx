import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import api from '../../utils/api';
import ImageUpload from '../../components/ImageUpload/ImageUpload';

const EMPTY_M = { name: '', role: 'Player', photo: '', jerseyNumber: '', battingStyle: '', bowlingStyle: '', village: 'Patuli, Olaver', bio: '', order: 99 };

export function AdminTeam() {
  const [members, setMembers] = useState([]);
  const [form, setForm] = useState(EMPTY_M);
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const load = () => api.get('/members').then(r => setMembers(r.data.data)).catch(() => {});
  useEffect(() => { load(); }, []);

  const submit = async (e) => {
    e.preventDefault();
    try {
      if (editing) { await api.put(`/members/${editing}`, form); toast.success('Updated!'); }
      else { await api.post('/members', form); toast.success('Added!'); }
      setForm(EMPTY_M); setEditing(null); setShowForm(false); load();
    } catch { toast.error('Failed.'); }
  };

  const del = async (id) => {
    if (!confirm('Remove member?')) return;
    try { await api.delete(`/members/${id}`); toast.success('Removed!'); load(); }
    catch { toast.error('Failed.'); }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-4xl text-white uppercase">Team Manager</h1>
        <button onClick={() => { setForm(EMPTY_M); setEditing(null); setShowForm(s => !s); }}
          className="btn-primary text-sm py-2">
          {showForm ? '✕ Cancel' : '+ Add Member'}
        </button>
      </div>

      {showForm && (
        <div className="bg-mkcc-card border border-mkcc-border rounded-xl p-6 mb-8">
          <h2 className="font-heading font-bold text-white text-xl mb-5">
            {editing ? 'Edit Member' : 'Add New Member'}
          </h2>
          <form onSubmit={submit} className="space-y-5">

            {/* Profile Photo Upload */}
            <div>
              <label className="block font-heading text-gray-300 text-xs mb-2 uppercase tracking-wider">
                Profile Photo <span className="text-mkcc-muted normal-case tracking-normal">(uploads to ImageKit CDN)</span>
              </label>
              <div className="max-w-xs">
                <ImageUpload
                  label="Upload Profile Photo"
                  folder="/mkcc/members"
                  preview={form.photo}
                  onUpload={(url) => setForm(f => ({ ...f, photo: url }))}
                />
              </div>
              {/* Fallback manual URL */}
              <div className="mt-2">
                <p className="text-mkcc-muted text-xs font-body mb-1">— or paste a photo URL —</p>
                <input
                  type="url"
                  value={form.photo}
                  onChange={e => setForm(f => ({ ...f, photo: e.target.value }))}
                  placeholder="https://..."
                  className="w-full bg-mkcc-dark border border-mkcc-border rounded px-3 py-2.5 text-white font-body text-sm focus:border-mkcc-red focus:outline-none"
                />
              </div>
            </div>

            {/* Text fields */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-heading text-gray-300 text-xs mb-1 uppercase tracking-wider">Name *</label>
                <input type="text" required value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  className="w-full bg-mkcc-dark border border-mkcc-border rounded px-3 py-2.5 text-white font-body text-sm focus:border-mkcc-red focus:outline-none" />
              </div>
              <div>
                <label className="block font-heading text-gray-300 text-xs mb-1 uppercase tracking-wider">Role</label>
                <select value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value }))}
                  className="w-full bg-mkcc-dark border border-mkcc-border rounded px-3 py-2.5 text-white font-body text-sm focus:border-mkcc-red focus:outline-none">
                  {['President','Vice President','Secretary','Treasurer','Captain','Vice Captain','Player','Committee Member'].map(r => <option key={r}>{r}</option>)}
                </select>
              </div>
              <div>
                <label className="block font-heading text-gray-300 text-xs mb-1 uppercase tracking-wider">Village</label>
                <input type="text" value={form.village}
                  onChange={e => setForm(f => ({ ...f, village: e.target.value }))}
                  className="w-full bg-mkcc-dark border border-mkcc-border rounded px-3 py-2.5 text-white font-body text-sm focus:border-mkcc-red focus:outline-none" />
              </div>
              <div>
                <label className="block font-heading text-gray-300 text-xs mb-1 uppercase tracking-wider">Jersey #</label>
                <input type="number" value={form.jerseyNumber}
                  onChange={e => setForm(f => ({ ...f, jerseyNumber: e.target.value }))}
                  className="w-full bg-mkcc-dark border border-mkcc-border rounded px-3 py-2.5 text-white font-body text-sm focus:border-mkcc-red focus:outline-none" />
              </div>
              <div>
                <label className="block font-heading text-gray-300 text-xs mb-1 uppercase tracking-wider">Display Order</label>
                <input type="number" value={form.order}
                  onChange={e => setForm(f => ({ ...f, order: +e.target.value }))}
                  className="w-full bg-mkcc-dark border border-mkcc-border rounded px-3 py-2.5 text-white font-body text-sm focus:border-mkcc-red focus:outline-none" />
              </div>
              <div>
                <label className="block font-heading text-gray-300 text-xs mb-1 uppercase tracking-wider">Batting Style</label>
                <select value={form.battingStyle} onChange={e => setForm(f => ({ ...f, battingStyle: e.target.value }))}
                  className="w-full bg-mkcc-dark border border-mkcc-border rounded px-3 py-2.5 text-white font-body text-sm focus:border-mkcc-red focus:outline-none">
                  <option value="">— Select —</option>
                  <option>Right-handed</option>
                  <option>Left-handed</option>
                </select>
              </div>
            </div>

            <div className="flex gap-3 justify-end">
              <button type="button" onClick={() => setShowForm(false)}
                className="font-heading text-mkcc-muted text-sm px-4 py-2 border border-mkcc-border rounded hover:text-white transition-colors">
                Cancel
              </button>
              <button type="submit" className="btn-primary text-sm py-2">
                {editing ? 'Update Member' : 'Add Member'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Members grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {members.map(m => (
          <div key={m._id} className="bg-mkcc-card border border-mkcc-border rounded-xl overflow-hidden">
            {m.photo
              ? <img src={m.photo} alt={m.name} className="w-full h-36 object-cover object-top" />
              : <div className="w-full h-36 bg-mkcc-dark flex items-center justify-center text-4xl opacity-30">👤</div>
            }
            <div className="p-4">
              <p className="font-heading font-bold text-white">{m.name}</p>
              <p className="text-mkcc-muted text-xs mt-0.5">{m.role}</p>
              {m.jerseyNumber && <p className="text-mkcc-red text-xs font-heading mt-0.5">#{m.jerseyNumber}</p>}
              <div className="flex gap-2 mt-3">
                <button
                  onClick={() => {
                    setForm({ ...m, jerseyNumber: m.jerseyNumber || '' });
                    setEditing(m._id);
                    setShowForm(true);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="flex-1 text-center font-heading text-xs text-mkcc-gold border border-mkcc-gold/30 px-2 py-1.5 rounded hover:border-mkcc-gold hover:bg-mkcc-gold/5 transition-colors">
                  ✏️ Edit
                </button>
                <button onClick={() => del(m._id)}
                  className="flex-1 text-center font-heading text-xs text-mkcc-red border border-mkcc-red/30 px-2 py-1.5 rounded hover:border-mkcc-red hover:bg-mkcc-red/5 transition-colors">
                  🗑 Remove
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
