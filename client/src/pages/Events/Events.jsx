import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import EventCard from '../../components/EventCard/EventCard';
import api from '../../utils/api';

export default function Events() {
  const [events, setEvents] = useState([]);
  const [tab, setTab] = useState('upcoming');
  const [category, setCategory] = useState('All');

  useEffect(() => {
    api.get('/events').then(r => setEvents(r.data.data)).catch(() => {});
  }, []);

  const categories = ['All', 'Cricket', 'Tournament', 'Puja', 'Cultural', 'Other'];

  const filtered = events.filter(e => {
    const matchTab = tab === 'upcoming' ? e.status === 'upcoming' : e.status === 'completed';
    const matchCat = category === 'All' || e.category === category;
    return matchTab && matchCat;
  });

  return (
    <div className="pt-20">
      {/* Hero */}
      <div className="relative bg-mkcc-dark py-20 text-center overflow-hidden">
        <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at center, rgba(196,30,58,0.15) 0%, transparent 60%)' }} />
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="relative">
          <span className="font-heading text-mkcc-red text-sm uppercase tracking-[0.3em]">On & Off The Field</span>
          <h1 className="font-display text-7xl md:text-8xl text-white mt-2 uppercase">
            <span className="text-gradient-gold">Events</span>
          </h1>
          <p className="text-gray-400 font-body text-lg mt-3 italic">Cricket, Culture & Community — all under one club</p>
        </motion.div>
      </div>

      {/* Tabs + Filter */}
      <div className="bg-mkcc-black sticky top-16 z-30 border-b border-mkcc-border">
        <div className="max-w-7xl mx-auto px-6 py-3 flex flex-wrap gap-3 items-center">
          {/* Upcoming / Past toggle */}
          <div className="flex bg-mkcc-card rounded-lg p-1 border border-mkcc-border">
            {['upcoming', 'past'].map(t => (
              <button key={t} onClick={() => setTab(t)}
                className={`font-heading font-semibold text-sm uppercase tracking-wider px-4 py-1.5 rounded transition-all
                  ${tab === t ? 'bg-mkcc-red text-white' : 'text-mkcc-muted hover:text-white'}`}>
                {t === 'upcoming' ? '📅 Upcoming' : '📖 Past'}
              </button>
            ))}
          </div>
          {/* Category filter */}
          <div className="flex gap-2 flex-wrap">
            {categories.map(c => (
              <button key={c} onClick={() => setCategory(c)}
                className={`font-heading text-xs font-semibold uppercase tracking-wider px-3 py-1.5 rounded border transition-all
                  ${category === c ? 'bg-mkcc-gold text-mkcc-black border-mkcc-gold' : 'text-mkcc-muted border-mkcc-border hover:border-mkcc-gold hover:text-mkcc-gold'}`}>
                {c}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Events Grid */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        {filtered.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">🏏</div>
            <h3 className="font-heading font-bold text-white text-2xl">No {tab} events found</h3>
            <p className="text-mkcc-muted font-body mt-2">Check back soon for updates!</p>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-8">
              <h2 className="font-display text-4xl text-white uppercase">
                {tab === 'upcoming' ? 'Upcoming' : 'Past'}{' '}
                <span className={tab === 'upcoming' ? 'text-gradient-red' : 'text-mkcc-muted'}>Events</span>
              </h2>
              <span className="font-heading text-mkcc-muted text-sm">{filtered.length} events</span>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((ev, i) => <EventCard key={ev._id} event={ev} delay={i * 0.08} />)}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
