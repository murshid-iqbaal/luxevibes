import { getPortfolioItems, type PortfolioItem } from '@/lib/supabase';
import { AnimatePresence, motion, useInView } from 'framer-motion';
import { X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

import fallback1 from '@/assets/portfolio-1.jpg';
import fallback2 from '@/assets/portfolio-2.jpg';
import fallback3 from '@/assets/portfolio-3.jpg';
import fallback4 from '@/assets/portfolio-4.jpg';

const fallbackData: PortfolioItem[] = [
  { id: '1', title: 'Royal Garden Wedding', image_url: fallback1, category: 'Weddings', description: 'A breathtaking garden ceremony in   with ocean views.', created_at: '' },
  { id: '2', title: 'Emerald Gala Night', image_url: fallback2, category: 'Corporate', description: 'Sophisticated corporate gala in Ernakulam with teal uplighting.', created_at: '' },
  { id: '3', title: 'Intimate Anniversary', image_url: fallback3, category: 'Private', description: 'A warm, candlelit anniversary celebration in Kerala.', created_at: '' },
  { id: '4', title: 'Classic White Wedding', image_url: fallback4, category: 'Weddings', description: 'Timeless elegance with white florals in  .', created_at: '' },
];

const categories = ['All', 'Weddings', 'Corporate', 'Private', 'Destination'];

export default function PortfolioSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });
  const [items, setItems] = useState<PortfolioItem[]>(fallbackData);
  const [filter, setFilter] = useState('All');
  const [lightbox, setLightbox] = useState<PortfolioItem | null>(null);

  useEffect(() => {
    getPortfolioItems().then((data) => {
      if (data.length > 0) setItems(data);
    });
  }, []);

  const filtered = filter === 'All' ? items : items.filter((i) => i.category === filter);

  return (
    <section id="portfolio" className="relative py-40 grain-overlay overflow-hidden">
      {/* Background Decorative Element */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[160px] -z-10" />

      <div className="container mx-auto px-6">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-24"
        >
          <div className="inline-flex items-center gap-3 mb-6">
            <div className="w-10 h-px bg-primary/40" />
            <p className="text-primary text-[10px] tracking-[0.5em] uppercase font-bold">The Portfolio</p>
            <div className="w-10 h-px bg-primary/40" />
          </div>
          <h2 className="font-heading text-4xl md:text-6xl tracking-tight leading-none italic mb-8">
            Curated <span className="text-gradient">Excellence</span>
          </h2>
          <p className="text-muted-foreground/60 text-xs tracking-[0.2em] uppercase max-w-lg mx-auto leading-relaxed">
            A showcase of Kerala's most cinematic and prestigious celebrations
          </p>
        </motion.div>

        <div className="flex flex-wrap justify-center gap-3 mb-20">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-5 py-2 text-[9px] tracking-[0.3em] uppercase transition-all duration-700 rounded-full border ${filter === cat
                  ? 'border-primary/50 bg-primary/10 text-primary shadow-[0_0_20px_rgba(var(--primary),0.1)]'
                  : 'border-white/5 text-muted-foreground hover:border-white/20 hover:text-white'
                }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <motion.div
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          <AnimatePresence mode="popLayout">
            {filtered.map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                onClick={() => setLightbox(item)}
                className="group cursor-pointer overflow-hidden relative rounded-xl border border-white/5 hover:border-primary/30 transition-all duration-700 aspect-[9/16]"
              >
                <div className="absolute inset-0">
                  <img
                    src={item.image_url}
                    alt={`${item.title} - luxury event by Luxevibes in Kerala`}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-[2000ms] ease-out group-hover:scale-110"
                  />
                  {/* Glass Overlay on Hover */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all duration-700 backdrop-blur-[2px]" />

                  <div className="absolute inset-0 flex items-end p-6 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-700 ease-out">
                    <div className="w-full backdrop-blur-sm bg-black/20 p-4 rounded-lg border border-white/5">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-6 h-px bg-primary" />
                        <p className="text-primary text-[8px] tracking-[0.4em] uppercase font-bold">{item.category}</p>
                      </div>
                      <h3 className="font-heading text-lg text-white italic tracking-wide">{item.title}</h3>
                      <div className="h-0 group-hover:h-8 transition-all duration-700 overflow-hidden">
                        <p className="text-[10px] text-white/60 mt-2 line-clamp-1 italic font-light tracking-wider">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>

      <AnimatePresence>
        {lightbox && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-background/95 backdrop-blur-xl flex items-center justify-center p-6"
            onClick={() => setLightbox(null)}
          >
            <button onClick={() => setLightbox(null)} aria-label="Close lightbox" className="absolute top-6 right-6 text-foreground hover:text-primary transition-colors">
              <X className="w-8 h-8" />
            </button>
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="max-w-4xl w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <img src={lightbox.image_url} alt={`${lightbox.title} - Luxevibes luxury event photography`} className="w-full max-h-[70vh] object-contain" />
              <div className="mt-4 text-center">
                <p className="text-primary text-xs tracking-widest uppercase">{lightbox.category}</p>
                <h3 className="font-heading text-2xl mt-2">{lightbox.title}</h3>
                <p className="text-muted-foreground text-sm mt-2">{lightbox.description}</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
