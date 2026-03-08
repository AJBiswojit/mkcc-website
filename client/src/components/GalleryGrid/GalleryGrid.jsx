import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function GalleryGrid({ photos }) {
  const [lightbox, setLightbox] = useState(null); // index

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {photos.map((photo, i) => (
          <motion.div
            key={photo._id || i}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3, delay: i * 0.04 }}
            className="relative group aspect-square overflow-hidden rounded-lg cursor-pointer card-glow"
            onClick={() => setLightbox(i)}
          >
            <img
              src={photo.imageUrl}
              alt={photo.title || 'Gallery'}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-mkcc-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3">
              {photo.title && (
                <p className="text-white font-heading text-sm font-semibold truncate">{photo.title}</p>
              )}
              {photo.category && (
                <p className="text-mkcc-gold text-xs font-body">{photo.category}</p>
              )}
            </div>
            {/* Expand icon */}
            <div className="absolute top-2 right-2 w-7 h-7 bg-mkcc-black/60 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <span className="text-white text-xs">⤢</span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="lightbox-overlay"
            onClick={() => setLightbox(null)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="relative max-w-4xl max-h-[90vh] mx-4"
              onClick={e => e.stopPropagation()}
            >
              <img
                src={photos[lightbox].imageUrl}
                alt={photos[lightbox].title}
                className="max-w-full max-h-[80vh] rounded-xl object-contain"
              />
              {/* Caption */}
              {photos[lightbox].title && (
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/90 to-transparent rounded-b-xl">
                  <p className="text-white font-heading font-semibold">{photos[lightbox].title}</p>
                  <p className="text-mkcc-gold text-sm">{photos[lightbox].category}</p>
                </div>
              )}

              {/* Controls */}
              <button onClick={() => setLightbox(null)}
                className="absolute -top-4 -right-4 w-10 h-10 bg-mkcc-red rounded-full flex items-center justify-center text-white font-bold text-lg hover:bg-red-700 transition-colors">
                ✕
              </button>
              {lightbox > 0 && (
                <button onClick={() => setLightbox(l => l - 1)}
                  className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-mkcc-black/70 rounded-full flex items-center justify-center text-white hover:bg-mkcc-red transition-colors">
                  ←
                </button>
              )}
              {lightbox < photos.length - 1 && (
                <button onClick={() => setLightbox(l => l + 1)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-mkcc-black/70 rounded-full flex items-center justify-center text-white hover:bg-mkcc-red transition-colors">
                  →
                </button>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
