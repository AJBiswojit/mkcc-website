import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import TeamCard from '../../components/TeamCard/TeamCard';
import api from '../../utils/api';

const ROLES_ORDER = ['President','Vice President','Secretary','Treasurer','Captain','Vice Captain','Player','Committee Member'];

export default function Team() {
  const [members, setMembers] = useState([]);
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    api.get('/members').then(r => setMembers(r.data.data)).catch(() => {});
  }, []);

  const categories = ['All', 'Leadership', 'Players'];
  const filtered = filter === 'All' ? members
    : filter === 'Leadership' ? members.filter(m => ['President','Vice President','Secretary','Treasurer','Captain','Vice Captain','Committee Member'].includes(m.role))
    : members.filter(m => m.role === 'Player');

  const leadership = filtered.filter(m => m.role !== 'Player');
  const players = filtered.filter(m => m.role === 'Player');

  return (
    <div className="pt-20">
      {/* Hero */}
      <div className="relative bg-mkcc-dark py-20 text-center overflow-hidden">
        <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at center, rgba(196,30,58,0.15) 0%, transparent 60%)' }} />
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="relative">
          <span className="font-heading text-mkcc-red text-sm uppercase tracking-[0.3em]">The Warriors</span>
          <h1 className="font-display text-7xl md:text-8xl text-white mt-2 uppercase">
            Our <span className="text-gradient-gold">Team</span>
          </h1>
          <p className="text-gray-400 font-body text-lg mt-3 italic">The brave sons of Patuli who carry the MKCC flag</p>
        </motion.div>
      </div>

      {/* Filter */}
      <div className="bg-mkcc-black sticky top-16 z-30 border-b border-mkcc-border">
        <div className="max-w-7xl mx-auto px-6 flex gap-2 py-3">
          {categories.map(cat => (
            <button key={cat} onClick={() => setFilter(cat)}
              className={`font-heading text-sm font-semibold uppercase tracking-wider px-5 py-2 rounded transition-all
                ${filter === cat ? 'bg-mkcc-red text-white' : 'text-mkcc-muted hover:text-white hover:bg-mkcc-card'}`}>
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-16 space-y-16">
        {/* Empty state */}
        {filtered.length === 0 && (
          <div className="text-center py-20 border-2 border-dashed border-mkcc-border rounded-2xl">
            <div className="text-5xl mb-3">👥</div>
            <p className="font-heading text-white text-2xl font-semibold">No Members Yet</p>
            <p className="text-mkcc-muted font-body text-sm mt-2">Team members will appear here once added by the admin.</p>
          </div>
        )}

        {/* Leadership */}
        {(filter === 'All' || filter === 'Leadership') && leadership.length > 0 && (
          <div>
            <h2 className="font-display text-4xl text-white uppercase mb-2">
              Club <span className="text-gradient-gold">Leadership</span>
            </h2>
            <div className="divider-red w-16 mb-8" />
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
              {leadership.map((m, i) => <TeamCard key={m._id} member={m} delay={i * 0.07} />)}
            </div>
          </div>
        )}

        {/* Players */}
        {(filter === 'All' || filter === 'Players') && players.length > 0 && (
          <div>
            <h2 className="font-display text-4xl text-white uppercase mb-2">
              The <span className="text-gradient-red">Squad</span>
            </h2>
            <div className="divider-gold w-16 mb-8" />
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
              {players.map((m, i) => <TeamCard key={m._id} member={m} delay={i * 0.07} />)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
