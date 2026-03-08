import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import GalleryGrid from '../../components/GalleryGrid/GalleryGrid';
import api from '../../utils/api';

const CATEGORIES = ['All', 'Ganesh Puja', 'Cricket', 'Club Activities', 'Tournament'];

export default function Gallery() {
  const [photos, setPhotos] = useState([]);
  const [active, setActive] = useState('All');

  useEffect(() => {
    api.get('/gallery').then(r => setPhotos(r.data.data)).catch(() => {});
  }, []);

  const filtered = active === 'All' ? photos : photos.filter(p => p.category === active);

  return (
    <div className="pt-20">
      {/* Hero */}
      <div className="relative bg-mkcc-dark py-20 text-center overflow-hidden">
        <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at center, rgba(212,175,55,0.08) 0%, transparent 60%)' }} />
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="relative">
          <span className="font-heading text-mkcc-gold text-sm uppercase tracking-[0.3em]">Memories Forever</span>
          <h1 className="font-display text-7xl md:text-8xl text-white mt-2 uppercase">
            Photo <span className="text-gradient-gold">Gallery</span>
          </h1>
          <p className="text-gray-400 font-body text-lg mt-3 italic">Moments from the field, festivals, and beyond</p>
        </motion.div>
      </div>

      {/* Category Filter */}
      <div className="bg-mkcc-black sticky top-16 z-30 border-b border-mkcc-border">
        <div className="max-w-7xl mx-auto px-6 py-3 flex gap-2 flex-wrap">
          {CATEGORIES.map(cat => (
            <button key={cat} onClick={() => setActive(cat)}
              className={`font-heading text-sm font-semibold uppercase tracking-wider px-4 py-2 rounded-full transition-all border
                ${active === cat ? 'bg-mkcc-gold text-mkcc-black border-mkcc-gold' : 'text-mkcc-muted border-mkcc-border hover:border-mkcc-gold hover:text-mkcc-gold'}`}>
              {cat}
            </button>
          ))}
          <span className="ml-auto font-heading text-mkcc-muted text-sm self-center">{filtered.length} photos</span>
        </div>
      </div>

      {/* Grid */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        {filtered.length === 0 ? (
          <div className="text-center py-24">
            <div className="text-6xl mb-4">📸</div>
            <h3 className="font-heading font-bold text-white text-2xl mb-2">No Photos Yet</h3>
            <p className="text-mkcc-muted font-body">
              {active === 'All'
                ? 'Photos will appear here once uploaded by the admin.'
                : `No photos in "${active}" yet. Check back soon!`}
            </p>
          </div>
        ) : (
          <GalleryGrid photos={filtered} />
        )}
      </div>
    </div>
  );
}
