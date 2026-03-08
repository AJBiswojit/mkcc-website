import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const STATUS_STYLES = {
  upcoming:  { bg: 'bg-mkcc-red/20',  text: 'text-mkcc-red',  dot: 'bg-mkcc-red',  label: 'Upcoming' },
  ongoing:   { bg: 'bg-green-900/30', text: 'text-green-400', dot: 'bg-green-400', label: 'Live' },
  completed: { bg: 'bg-gray-800/40',  text: 'text-gray-400',  dot: 'bg-gray-400',  label: 'Completed' },
};

const CATEGORY_ICONS = {
  Cricket: '🏏', Cultural: '🎭', Puja: '🪔', Tournament: '🏆', Meeting: '📋', Other: '📅'
};

export default function EventCard({ event, delay = 0 }) {
  const st = STATUS_STYLES[event.status] || STATUS_STYLES.completed;
  const icon = CATEGORY_ICONS[event.category] || '📅';
  const dateStr = new Date(event.date).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric'
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      className="card-glow bg-mkcc-card rounded-xl overflow-hidden group"
    >
      {/* Image */}
      <div className="relative h-44 overflow-hidden">
        {event.images?.[0] ? (
          <img
            src={event.images[0]}
            alt={event.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-mkcc-crimson/30 to-mkcc-dark flex items-center justify-center text-5xl">
            {icon}
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-mkcc-card via-transparent to-transparent" />
        {/* Status badge */}
        <div className={`absolute top-3 right-3 flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-heading font-semibold ${st.bg} ${st.text} backdrop-blur-sm border border-current/30`}>
          <span className={`w-1.5 h-1.5 rounded-full ${st.dot} ${event.status === 'ongoing' ? 'animate-pulse' : ''}`} />
          {st.label}
        </div>
        {/* Category */}
        <div className="absolute top-3 left-3 bg-mkcc-black/70 backdrop-blur-sm px-2.5 py-1 rounded text-xs font-heading text-mkcc-gold">
          {icon} {event.category}
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <div className="flex items-center gap-2 text-mkcc-muted text-xs font-heading mb-2">
          <span>📅</span>
          <span>{dateStr}</span>
          {event.venue && <><span>·</span><span className="truncate">📍 {event.venue}</span></>}
        </div>

        <h3 className="font-heading font-bold text-white text-lg leading-tight mb-2 group-hover:text-mkcc-gold transition-colors">
          {event.title}
        </h3>
        <p className="text-mkcc-muted text-sm font-body leading-relaxed line-clamp-2 mb-4">
          {event.description}
        </p>

        {/* Highlights */}
        {event.highlights?.length > 0 && (
          <ul className="flex flex-wrap gap-2 mb-4">
            {event.highlights.slice(0, 3).map((h, i) => (
              <li key={i} className="text-xs bg-mkcc-red/10 text-mkcc-red border border-mkcc-red/20 px-2 py-0.5 rounded font-heading">
                {h}
              </li>
            ))}
          </ul>
        )}

        <Link to={`/events`}
          className="inline-flex items-center gap-2 text-mkcc-gold font-heading text-sm font-semibold hover:gap-3 transition-all">
          View Details <span>→</span>
        </Link>
      </div>
    </motion.div>
  );
}
