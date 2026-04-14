import { motion, useInView } from 'framer-motion';
import { Award, Calendar, MapPin, Users } from 'lucide-react';
import { useRef } from 'react';

const reasons = [
  { icon: Award, title: 'Incredible Detail', desc: 'Every element of your event is curated with a fresh cinematic eye for unrivaled luxury.' },
  { icon: Users, title: 'Bespoke Service', desc: 'We work closely with each family to ensure a deeply personal and exclusive planning experience.' },
  { icon: MapPin, title: 'Local Expertise', desc: 'Deep knowledge of the best venues, vendors, and hidden gems in Ernakulam.' },
  { icon: Calendar, title: 'Flawless Execution', desc: 'Passionate commitment to bringing visionary concepts to life with absolute precision.' },
];

export default function WhyChooseSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section className="py-32 grain-overlay" aria-label="Why choose Luxevibes">
      <div className="container mx-auto px-6">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <p className="text-primary text-[10px] tracking-[0.4em] uppercase mb-4">Why Us</p>
          <h2 className="font-heading text-3xl md:text-5xl">
            Why Choose <span className="text-gradient">Luxevibes</span>
          </h2>
          <p className="mt-4 text-muted-foreground max-w-2xl mx-auto text-xs leading-relaxed">
            As the leading wedding planners in   and event planners in Ernakulam,
            we bring unmatched expertise, creativity, and dedication to every celebration in Kerala.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {reasons.map((r, i) => (
            <motion.article
              key={r.title}
              initial={{ opacity: 0, y: 40 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: i * 0.15 }}
              className="text-center p-6 border border-border bg-card hover:border-primary/50 transition-all duration-500"
            >
              <r.icon className="w-7 h-7 text-primary mx-auto mb-5" aria-hidden="true" />
              <h3 className="font-heading text-base mb-2">{r.title}</h3>
              <p className="text-muted-foreground text-xs leading-relaxed">{r.desc}</p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
