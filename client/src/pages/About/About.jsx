import { motion } from 'framer-motion';
import MKCCLogo from '../../components/Logo/MKCCLogo';

const FadeIn = ({ children, delay = 0, className = '' }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.6, delay }}
    className={className}
  >
    {children}
  </motion.div>
);

const Card = ({ icon, title, children, className = '' }) => (
  <div className={`card-gold bg-mkcc-card rounded-xl p-6 ${className}`}>
    <div className="text-4xl mb-3">{icon}</div>
    <h3 className="font-heading font-bold text-mkcc-gold text-xl mb-2">{title}</h3>
    <p className="text-gray-400 font-body leading-relaxed text-sm">{children}</p>
  </div>
);

const MILESTONES = [
  { year: '1998', title: 'Foundation', desc: 'MKCC was founded by passionate cricket lovers of Patuli village, Olaver.' },
  { year: '2007', title: 'First Tournament', desc: 'Organized our first inter-village cricket tournament with 8 teams participating.' },
  { year: '2008', title: 'Ganesh Puja Launch', desc: 'Started the annual Ganesh Puja cultural celebration, now a village landmark event.' },
  { year: '2013', title: 'Season Night Match', desc: 'MKCC shines in night tournaments, winning 13 of 17 matches with two proud runners-up finishes.' },
  { year: '2023', title: 'Club Expansion', desc: 'Expanded membership to 15+ active players across Patuli and neighboring villages.' },
  { year: '2025', title: 'Grand Celebration', desc: 'Experience Patuli grand Ganesh Puja celebration, where faith, culture, and community shine brighter than ever.' },
];

export default function About() {
  return (
    <div className="pt-20">
      {/* ── Hero ── */}
      <div className="relative bg-mkcc-dark py-24 overflow-hidden">
        <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at center, rgba(139,0,0,0.2) 0%, transparent 60%)' }} />
        <div className="max-w-7xl mx-auto px-6 relative text-center">
          <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.6 }}
            className="flex justify-center mb-6">
            <MKCCLogo size={80} className="drop-shadow-[0_0_20px_rgba(196,30,58,0.5)]" />
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <span className="font-heading text-mkcc-red text-sm uppercase tracking-[0.3em]">Our Story</span>
            <h1 className="font-display text-7xl md:text-8xl text-white mt-2 uppercase tracking-wider">
              About <span className="text-gradient-gold">MKCC</span>
            </h1>
            <p className="text-gray-400 font-body text-lg mt-4 max-w-xl mx-auto italic">
              Born in a village. Built on passion. Driven by devotion to Maa Kali.
            </p>
          </motion.div>
        </div>
      </div>

      {/* ── Club History ── */}
      <section className="py-20 bg-mkcc-black">
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center">
          <FadeIn>
            <span className="font-heading text-mkcc-red text-sm uppercase tracking-[0.3em]">Since 1998</span>
            <h2 className="font-display text-5xl text-white mt-2 mb-6 uppercase">Club History</h2>
            <p className="text-gray-300 font-body leading-relaxed mb-4">
              Maa Kali Cricket Club was established in <strong className="text-white">1998</strong> by a group of cricket-loving youth from Patuli village in Olaver, Odisha. What began as a casual evening cricket gathering on a dusty village ground has blossomed into a fully organised sports and cultural club.
            </p>
            <p className="text-gray-400 font-body leading-relaxed mb-4">
              The club is named after <strong className="text-mkcc-red">Maa Kali</strong> — the divine goddess worshipped with great devotion in Patuli — as a symbol of power, protection, and courage. The founders believed that just as Maa Kali protects her devotees, the club would protect and nurture the sporting dreams of village youth.
            </p>
            <p className="text-gray-400 font-body leading-relaxed">
              Over the years, MKCC has grown from 8 founding members to over <strong className="text-mkcc-gold">24 active players</strong> and a community of 1000+ supporters, winning multiple trophies and hearts across Odisha.
            </p>
          </FadeIn>

          {/* Timeline */}
          <FadeIn delay={0.2}>
            <div className="relative">
              <div className="absolute left-6 top-0 bottom-0 w-px bg-gradient-to-b from-mkcc-red via-mkcc-gold to-mkcc-red opacity-40" />
              <div className="space-y-6">
                {MILESTONES.map(({ year, title, desc }, i) => (
                  <motion.div key={year}
                    initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                    className="flex gap-4 pl-16 relative"
                  >
                    <div className="absolute left-3.5 -translate-x-1/2 w-5 h-5 bg-mkcc-red rounded-full border-2 border-mkcc-dark shadow-[0_0_8px_rgba(196,30,58,0.5)]" />
                    <div>
                      <span className="font-display text-mkcc-gold text-xl">{year}</span>
                      <h4 className="font-heading font-bold text-white text-base">{title}</h4>
                      <p className="text-gray-400 text-sm font-body">{desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ── Mission & Vision ── */}
      <section className="py-20 bg-mkcc-dark">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <span className="font-heading text-mkcc-red text-sm uppercase tracking-[0.3em]">What We Stand For</span>
            <h2 className="font-display text-5xl text-white mt-2 uppercase">Mission & Vision</h2>
            <div className="divider-red w-24 mx-auto mt-4" />
          </div>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <FadeIn>
              <Card icon="🎯" title="Our Mission">
                The mission of Maa Kali Cricket Club is to promote cricket, encourage youth participation, and strengthen community unity in Patuli. We aim to organize tournaments, celebrate festivals like Ganesh Chaturthi, and create a positive environment where teamwork, discipline, and cultural values thrive.
              </Card>
            </FadeIn>
            <FadeIn delay={0.1}>
              <Card icon="🌟" title="Our Vision">
                Our vision is to build a strong and united community in Patuli through sports, culture, and youth participation. Maa Kali Cricket Club aims to inspire young talent, promote cricket and traditions, and create opportunities where teamwork, respect, and community spirit grow together for future generations.
              </Card>
            </FadeIn>
          </div>

          {/* Values */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 max-w-4xl mx-auto">
            {[
              { icon: '⚡', val: 'Excellence' },
              { icon: '🤝', val: 'Unity' },
              { icon: '🎭', val: 'Culture' },
              { icon: '💪', val: 'Resilience' },
            ].map(({ icon, val }, i) => (
              <motion.div key={val}
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="card-glow bg-mkcc-card rounded-xl p-5 text-center"
              >
                <div className="text-3xl mb-2">{icon}</div>
                <div className="font-heading font-bold text-white">{val}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Patuli Village ── */}
      <section className="py-20 bg-mkcc-black">
        <div className="max-w-5xl mx-auto px-6 grid md:grid-cols-2 gap-10 items-center">
          <FadeIn>
            <span className="font-heading text-mkcc-red text-sm uppercase tracking-[0.3em]">Our Roots</span>
            <h2 className="font-display text-5xl text-white mt-2 mb-6 uppercase">Patuli Village</h2>
            <p className="text-gray-300 font-body leading-relaxed mb-4">
              <strong className="text-mkcc-gold">Patuli</strong> is a small, close-knit village nestled in <strong className="text-white">Olaver, Odisha</strong>. Known for its warm people, rich traditions, and deep devotion to Maa Kali, Patuli is a village that punches far above its size when it comes to community spirit and cultural pride.
            </p>
            <p className="text-gray-400 font-body leading-relaxed">
              Cricket holds a special place in Patuli's heart. Young boys grow up watching and playing cricket in every open field. MKCC channels this passion into an organised platform, giving village youth a structured path to sporting excellence while honoring their cultural roots.
            </p>
          </FadeIn>
          <FadeIn delay={0.2}>
            <div className="grid grid-cols-2 gap-4">
              <div className="card-glow bg-mkcc-card rounded-xl p-5 col-span-2 text-center">
                <div className="font-display text-6xl text-mkcc-gold">📍</div>
                <h3 className="font-heading font-bold text-white text-lg mt-2">Patuli, Olaver, Odisha</h3>
                <p className="text-mkcc-muted text-sm font-body mt-1">Eastern India · Cricket Heartland</p>
              </div>
              {['Village Ground', 'Maa Kali Temple', 'Community Hall', 'Youth Centre'].map((place, i) => (
                <motion.div key={place}
                  initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
                  viewport={{ once: true }} transition={{ delay: i * 0.1 + 0.3 }}
                  className="bg-mkcc-card border border-mkcc-border rounded-lg p-3 text-center"
                >
                  <p className="font-heading text-mkcc-muted text-xs font-semibold uppercase">{place}</p>
                </motion.div>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ── Ganesh Puja ── */}
      <section className="py-20 bg-mkcc-dark relative overflow-hidden">
        <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at center, rgba(212,175,55,0.08) 0%, transparent 60%)' }} />
        <div className="max-w-5xl mx-auto px-6 relative">
          <FadeIn className="text-center mb-12">
            <span className="font-heading text-mkcc-gold text-sm uppercase tracking-[0.3em]">Our Sacred Celebration</span>
            <h2 className="font-display text-5xl text-white mt-2 mb-4 uppercase">
              Ganesh Puja <span className="text-gradient-gold">Celebration</span>
            </h2>
            <div className="divider-gold w-24 mx-auto" />
          </FadeIn>

          <div className="grid md:grid-cols-2 gap-10 items-center">
            <FadeIn>
              <p className="text-gray-300 font-body leading-relaxed mb-4">
                MKCC's annual <strong className="text-mkcc-gold">Ganesh Puja celebration</strong> is more than a religious event — it is the cultural heartbeat of Patuli village. Started in 2020, this three-day festival brings together the entire community in a grand celebration of devotion, culture, and fellowship.
              </p>
              <p className="text-gray-400 font-body leading-relaxed mb-4">
                The celebration features elaborate Puja rituals, cultural performances by local artists, traditional music, and a grand community feast. The festivities attract over <strong className="text-white">1000+ visitors</strong> from neighboring villages, making it one of the most anticipated events in Olaver.
              </p>
              <p className="text-gray-400 font-body leading-relaxed">
                For MKCC, Ganesh Puja is a reminder of why the club exists — not just to play cricket, but to preserve, celebrate, and pass on the rich cultural heritage of Patuli to future generations.
              </p>
            </FadeIn>
            <FadeIn delay={0.2}>
              <div className="space-y-3">
                {[
                  { icon: '🙏', title: 'Elaborate Puja Rituals', desc: 'Traditional Odiya Puja ceremonies with full vidhi' },
                  { icon: '🎭', title: 'Cultural Programs', desc: 'Dance, drama, and music performances by local artists' },
                  { icon: '🍽️', title: 'Community Feast', desc: 'Traditional Odisha cuisine served to all attendees' },
                  { icon: '🎆', title: 'Fireworks & Celebrations', desc: 'Grand fireworks display on the final night' },
                  { icon: '🏏', title: 'Cricket Exhibition', desc: 'Special cricket matches held during the festival' },
                ].map(({ icon, title, desc }, i) => (
                  <motion.div key={title}
                    initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                    className="flex items-start gap-3 bg-mkcc-card border border-mkcc-border rounded-lg p-4"
                  >
                    <span className="text-2xl flex-shrink-0">{icon}</span>
                    <div>
                      <h4 className="font-heading font-bold text-white text-base">{title}</h4>
                      <p className="text-mkcc-muted text-sm font-body">{desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </FadeIn>
          </div>
        </div>
      </section>
    </div>
  );
}
