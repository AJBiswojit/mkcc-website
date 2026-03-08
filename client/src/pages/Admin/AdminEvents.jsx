import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import api from '../../utils/api';

const EMPTY = { title: '', date: '', description: '', category: 'Cricket', venue: 'Patuli Ground, Olaver', status: 'upcoming', isFeatured: false, highlights: '' };

export default function AdminEvents() {
  const [events, setEvents] = useState([]);
  const [form, setForm] = useState(EMPTY);
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const load = () => api.get('/events').then(r => setEvents(r.data.data)).catch(() => {});
  useEffect(() => { load(); }, []);

  const submit = async (e) => {
    e.preventDefault();
    const payload = { ...form, highlights: form.highlights ? form.highlights.split('\n').filter(Boolean) : [] };
    try {
      if (editing) {
        await api.put(`/events/${editing}`, payload);
        toast.success('Event updated!');
      } else {
        await api.post('/events', payload);
        toast.success('Event created!');
      }
      setForm(EMPTY); setEditing(null); setShowForm(false); load();
    } catch { toast.error('Failed. Try again.'); }
  };

  const del = async (id) => {
    if (!confirm('Delete this event?')) return;
    try { await api.delete(`/events/${id}`); toast.success('Deleted!'); load(); }
    catch { toast.error('Failed.'); }
  };

  const edit = (ev) => {
    setForm({ ...ev, highlights: (ev.highlights || []).join('\n'), date: ev.date?.slice(0, 10) || '' });
    setEditing(ev._id); setShowForm(true);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-4xl text-white uppercase">Events Manager</h1>
        <button onClick={() => { setForm(EMPTY); setEditing(null); setShowForm(true); }} className="btn-primary text-sm py-2">
          + Add Event
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="bg-mkcc-card border border-mkcc-border rounded-xl p-6 mb-8">
          <h2 className="font-heading font-bold text-white text-xl mb-4">{editing ? 'Edit Event' : 'New Event'}</h2>
          <form onSubmit={submit} className="grid sm:grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block font-heading text-gray-300 text-xs mb-1 uppercase tracking-wider">Title *</label>
              <input type="text" required value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                className="w-full bg-mkcc-dark border border-mkcc-border rounded px-3 py-2.5 text-white font-body text-sm focus:border-mkcc-red focus:outline-none" />
            </div>
            <div>
              <label className="block font-heading text-gray-300 text-xs mb-1 uppercase tracking-wider">Date *</label>
              <input type="date" required value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
                className="w-full bg-mkcc-dark border border-mkcc-border rounded px-3 py-2.5 text-white font-body text-sm focus:border-mkcc-red focus:outline-none" />
            </div>
            <div>
              <label className="block font-heading text-gray-300 text-xs mb-1 uppercase tracking-wider">Category</label>
              <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                className="w-full bg-mkcc-dark border border-mkcc-border rounded px-3 py-2.5 text-white font-body text-sm focus:border-mkcc-red focus:outline-none">
                {['Cricket','Tournament','Puja','Cultural','Meeting','Other'].map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div className="col-span-2">
              <label className="block font-heading text-gray-300 text-xs mb-1 uppercase tracking-wider">Venue</label>
              <input type="text" value={form.venue} onChange={e => setForm(f => ({ ...f, venue: e.target.value }))}
                className="w-full bg-mkcc-dark border border-mkcc-border rounded px-3 py-2.5 text-white font-body text-sm focus:border-mkcc-red focus:outline-none" />
            </div>
            <div className="col-span-2">
              <label className="block font-heading text-gray-300 text-xs mb-1 uppercase tracking-wider">Description *</label>
              <textarea required value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                rows={3} className="w-full bg-mkcc-dark border border-mkcc-border rounded px-3 py-2.5 text-white font-body text-sm focus:border-mkcc-red focus:outline-none resize-none" />
            </div>
            <div className="col-span-2">
              <label className="block font-heading text-gray-300 text-xs mb-1 uppercase tracking-wider">Highlights (one per line)</label>
              <textarea value={form.highlights} onChange={e => setForm(f => ({ ...f, highlights: e.target.value }))}
                rows={3} placeholder="16 teams competing&#10;Cash prizes ₹50,000&#10;Trophy & medals"
                className="w-full bg-mkcc-dark border border-mkcc-border rounded px-3 py-2.5 text-white font-body text-sm focus:border-mkcc-red focus:outline-none resize-none" />
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" id="featured" checked={form.isFeatured} onChange={e => setForm(f => ({ ...f, isFeatured: e.target.checked }))}
                className="accent-mkcc-red" />
              <label htmlFor="featured" className="font-heading text-white text-sm">Featured Event</label>
            </div>
            <div className="col-span-2 flex gap-3 justify-end">
              <button type="button" onClick={() => setShowForm(false)}
                className="font-heading text-mkcc-muted hover:text-white text-sm px-4 py-2 border border-mkcc-border rounded transition-colors">
                Cancel
              </button>
              <button type="submit" className="btn-primary text-sm py-2">
                {editing ? 'Update Event' : 'Create Event'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Events Table */}
      <div className="bg-mkcc-card border border-mkcc-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-mkcc-border">
                {['Title','Date','Category','Status','Actions'].map(h => (
                  <th key={h} className="text-left font-heading text-mkcc-muted text-xs uppercase tracking-wider px-5 py-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {events.map(ev => (
                <tr key={ev._id} className="border-b border-mkcc-border/50 hover:bg-mkcc-dark/50 transition-colors">
                  <td className="px-5 py-3 font-heading text-white text-sm font-semibold">{ev.title}</td>
                  <td className="px-5 py-3 text-mkcc-muted text-sm font-body">{new Date(ev.date).toLocaleDateString('en-IN')}</td>
                  <td className="px-5 py-3">
                    <span className="bg-mkcc-red/10 text-mkcc-red text-xs font-heading px-2 py-0.5 rounded">{ev.category}</span>
                  </td>
                  <td className="px-5 py-3">
                    <span className={`text-xs font-heading px-2 py-0.5 rounded ${ev.status === 'upcoming' ? 'bg-green-900/30 text-green-400' : 'bg-gray-800 text-gray-400'}`}>
                      {ev.status}
                    </span>
                  </td>
                  <td className="px-5 py-3 flex gap-2">
                    <button onClick={() => edit(ev)} className="text-mkcc-gold hover:text-white font-heading text-xs border border-mkcc-gold/30 hover:border-mkcc-gold px-3 py-1 rounded transition-colors">
                      Edit
                    </button>
                    <button onClick={() => del(ev._id)} className="text-mkcc-red hover:text-white font-heading text-xs border border-mkcc-red/30 hover:border-mkcc-red px-3 py-1 rounded transition-colors">
                      Del
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
