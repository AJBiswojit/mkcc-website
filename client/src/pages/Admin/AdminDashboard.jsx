import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import api from '../../utils/api';

const StatCard = ({ icon, label, value, color, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay }}
    className={`bg-mkcc-card border border-mkcc-border rounded-xl p-6 hover:border-${color}-500 transition-colors`}
  >
    <div className="text-3xl mb-3">{icon}</div>
    <div className="font-display text-4xl text-white">{value}</div>
    <div className="font-heading text-mkcc-muted text-sm uppercase tracking-wider mt-1">{label}</div>
  </motion.div>
);

export default function AdminDashboard() {
  const [stats, setStats] = useState({ events: 0, members: 0, gallery: 0, requests: 0 });

  useEffect(() => {
    Promise.allSettled([
      api.get('/events'),
      api.get('/members'),
      api.get('/gallery'),
      api.get('/join'),
    ]).then(([ev, mb, gal, jr]) => {
      setStats({
        events:   ev.value?.data?.count  || 0,
        members:  mb.value?.data?.data?.length || 0,
        gallery:  gal.value?.data?.data?.length || 0,
        requests: jr.value?.data?.count  || 0,
      });
    });
  }, []);

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display text-5xl text-white uppercase tracking-wide">Dashboard</h1>
        <p className="text-mkcc-muted font-body mt-1">Welcome back! Here's an overview of MKCC.</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        <StatCard icon="📅" label="Total Events"   value={stats.events}   color="red"    delay={0} />
        <StatCard icon="👥" label="Team Members"   value={stats.members}  color="gold"   delay={0.1} />
        <StatCard icon="🖼️" label="Gallery Photos" value={stats.gallery}  color="blue"   delay={0.2} />
        <StatCard icon="📋" label="Join Requests"  value={stats.requests} color="green"  delay={0.3} />
      </div>

      {/* Quick Actions */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
        className="bg-mkcc-card border border-mkcc-border rounded-xl p-6 mb-6">
        <h2 className="font-heading font-bold text-white text-xl mb-4 uppercase tracking-wider">Quick Actions</h2>
        <div className="flex flex-wrap gap-3">
          {[
            { to: '/admin/events',    label: '+ Add Event',        cls: 'btn-primary text-sm py-2 px-4' },
            { to: '/admin/team',      label: '+ Add Member',       cls: 'btn-gold text-sm py-2 px-4' },
            { to: '/admin/gallery',   label: '+ Add Photo',        cls: 'btn-outline text-sm py-2 px-4' },
            { to: '/admin/announcements', label: '+ Announcement', cls: 'bg-mkcc-card border border-mkcc-border text-white font-heading text-sm py-2 px-4 rounded uppercase tracking-widest hover:border-mkcc-gold hover:text-mkcc-gold transition-colors' },
          ].map(({ to, label, cls }) => (
            <a key={to} href={to} className={cls}>{label}</a>
          ))}
        </div>
      </motion.div>

      {/* Info */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
        className="bg-mkcc-red/10 border border-mkcc-red/30 rounded-xl p-5">
        <h3 className="font-heading font-bold text-mkcc-red mb-2">🏏 MKCC Admin Panel</h3>
        <p className="text-gray-400 font-body text-sm">
          Use the sidebar to manage events, gallery, team members, membership requests, and announcements.
          All changes are reflected live on the public website.
        </p>
      </motion.div>
    </div>
  );
}
