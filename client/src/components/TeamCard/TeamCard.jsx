import { motion } from 'framer-motion';

const ROLE_COLORS = {
  'President':        { border: 'border-mkcc-gold',  text: 'text-mkcc-gold',   bg: 'bg-mkcc-gold/10' },
  'Vice President':   { border: 'border-mkcc-gold',  text: 'text-mkcc-gold',   bg: 'bg-mkcc-gold/10' },
  'Secretary':        { border: 'border-mkcc-red',   text: 'text-mkcc-red',    bg: 'bg-mkcc-red/10' },
  'Treasurer':        { border: 'border-blue-500',   text: 'text-blue-400',    bg: 'bg-blue-900/20' },
  'Captain':          { border: 'border-mkcc-red',   text: 'text-mkcc-red',    bg: 'bg-mkcc-red/10' },
  'Vice Captain':     { border: 'border-orange-500', text: 'text-orange-400',  bg: 'bg-orange-900/20' },
  'Player':           { border: 'border-mkcc-border',text: 'text-gray-400',    bg: 'bg-gray-800/30' },
  'Committee Member': { border: 'border-mkcc-border',text: 'text-gray-400',    bg: 'bg-gray-800/30' },
};

export default function TeamCard({ member, delay = 0 }) {
  const roleStyle = ROLE_COLORS[member.role] || ROLE_COLORS['Player'];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay }}
      whileHover={{ y: -6 }}
      className={`bg-mkcc-card border ${roleStyle.border} rounded-xl overflow-hidden text-center group transition-all duration-300`}
      style={{ boxShadow: '0 4px 24px rgba(0,0,0,0.4)' }}
    >
      {/* Photo */}
      <div className="relative h-52 overflow-hidden">
        {member.photo ? (
          <img
            src={member.photo}
            alt={member.name}
            className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-mkcc-crimson/20 to-mkcc-dark flex items-center justify-center">
            <span className="text-6xl opacity-40">🏏</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-mkcc-card/90 via-transparent to-transparent" />

        {/* Jersey number */}
        {member.jerseyNumber && (
          <div className="absolute top-2 right-2 w-9 h-9 bg-mkcc-red rounded-full flex items-center justify-center">
            <span className="font-display text-white text-lg leading-none">{member.jerseyNumber}</span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-4">
        <h3 className="font-heading font-bold text-white text-lg leading-tight">{member.name}</h3>
        <div className={`inline-block mt-1.5 px-3 py-0.5 rounded-full text-xs font-heading font-semibold uppercase tracking-widest ${roleStyle.bg} ${roleStyle.text} border ${roleStyle.border}`}>
          {member.role}
        </div>
        {member.village && (
          <p className="text-mkcc-muted text-xs mt-2 font-body">📍 {member.village}</p>
        )}
        {member.battingStyle && (
          <p className="text-mkcc-muted text-xs mt-1 font-body">🏏 {member.battingStyle}</p>
        )}
      </div>
    </motion.div>
  );
}
