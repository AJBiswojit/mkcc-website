import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

// Animates a number from 0 → target
function CountUp({ target, duration = 2000, prefix = '', suffix = '' }) {
  const [display, setDisplay] = useState(0);
  const frameRef = useRef(null);

  useEffect(() => {
    if (target === 0) { setDisplay(0); return; }
    const start = performance.now();
    const tick = (now) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // easeOutExpo
      const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      setDisplay(Math.floor(eased * target));
      if (progress < 1) frameRef.current = requestAnimationFrame(tick);
    };
    frameRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameRef.current);
  }, [target, duration]);

  return (
    <span>
      {prefix}{display.toLocaleString('en-IN')}{suffix}
    </span>
  );
}

export default function DonationCounter({ totalAmount = 0, totalDonors = 0, loading = false }) {
  return (
    <div className="grid grid-cols-2 gap-4">
      {/* Total Raised */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative overflow-hidden bg-gradient-to-br from-mkcc-red/20 to-mkcc-crimson/10 border border-mkcc-red/40 rounded-2xl p-6 text-center"
      >
        {/* Glow */}
        <div className="absolute inset-0 bg-gradient-to-t from-mkcc-red/10 to-transparent pointer-events-none" />
        <div className="text-3xl mb-2">💰</div>
        <div className="font-display text-4xl md:text-5xl text-mkcc-gold leading-none">
          {loading ? (
            <span className="animate-pulse text-mkcc-muted">---</span>
          ) : (
            <CountUp target={totalAmount} prefix="₹" duration={2500} />
          )}
        </div>
        <p className="font-heading text-gray-400 text-sm uppercase tracking-widest mt-2">Total Raised</p>
      </motion.div>

      {/* Total Donors */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="relative overflow-hidden bg-gradient-to-br from-mkcc-gold/10 to-amber-900/10 border border-mkcc-gold/30 rounded-2xl p-6 text-center"
      >
        <div className="absolute inset-0 bg-gradient-to-t from-mkcc-gold/5 to-transparent pointer-events-none" />
        <div className="text-3xl mb-2">🤝</div>
        <div className="font-display text-4xl md:text-5xl text-mkcc-gold leading-none">
          {loading ? (
            <span className="animate-pulse text-mkcc-muted">--</span>
          ) : (
            <CountUp target={totalDonors} duration={2000} />
          )}
        </div>
        <p className="font-heading text-gray-400 text-sm uppercase tracking-widest mt-2">Proud Donors</p>
      </motion.div>
    </div>
  );
}
