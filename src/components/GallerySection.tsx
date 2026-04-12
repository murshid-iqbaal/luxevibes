import { motion, AnimatePresence } from 'framer-motion';
import { useState, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getGalleryItems, type GalleryItem } from '@/lib/supabase';
import { X, Maximize2 } from 'lucide-react';

const categories = ['all', 'wedding', 'event', 'destination'];

export default function GallerySection() {
  const [filter, setFilter] = useState('all');
  const [selectedImage, setSelectedImage] = useState<GalleryItem | null>(null);
  const [visibleCount, setVisibleCount] = useState(8);

  const { data: galleryItems = [], isLoading } = useQuery({
    queryKey: ['galleryItems'],
    queryFn: getGalleryItems
  });

  const filteredItems = filter === 'all' 
    ? galleryItems 
    : galleryItems.filter(item => item.category === filter);

  const visibleItems = filteredItems.slice(0, visibleCount);
  const showMore = () => setVisibleCount(prev => prev + 8);

  if (isLoading) return null;

  return (
    <section id="gallery" className="relative py-40 grain-overlay overflow-hidden">
      {/* Background Decorative Element */}
      <div className="absolute -top-24 -right-24 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[140px] -z-10" />
      <div className="absolute -bottom-24 -left-24 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[140px] -z-10" />

      <div className="container mx-auto px-6">
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
            className="text-center mb-24"
        >
            <div className="inline-flex items-center gap-3 mb-6">
              <div className="w-10 h-px bg-primary/40" />
              <p className="text-primary text-[10px] tracking-[0.5em] uppercase font-bold">The Archive</p>
              <div className="w-10 h-px bg-primary/40" />
            </div>
            <h2 className="font-heading text-4xl md:text-6xl tracking-tight leading-none italic mb-8">
                Captured <span className="text-gradient">Moments</span>
            </h2>
            <p className="text-muted-foreground/60 text-xs tracking-[0.2em] uppercase max-w-lg mx-auto leading-relaxed">
              Preserving the fleeting beauty of your most prestigious celebrations
            </p>
        </motion.div>

        {/* Filter Bar */}
        <div className="flex flex-wrap justify-center gap-3 mb-20">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => { setFilter(cat); setVisibleCount(8); }}
              className={`px-6 py-2.5 text-[9px] tracking-[0.3em] uppercase transition-all duration-700 rounded-full border ${
                filter === cat
                  ? 'border-primary/50 bg-primary/10 text-primary shadow-[0_0_20px_rgba(var(--primary),0.1)]'
                  : 'border-white/5 text-muted-foreground hover:border-white/20 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Uniform Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <AnimatePresence mode="popLayout">
            {visibleItems.map((item, index) => (
              <motion.div
                key={item.$id}
                layout
                initial={{ opacity: 0, scale: 0.98, y: 30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.7, delay: (index % 8) * 0.1, ease: [0.22, 1, 0.36, 1] }}
                className="relative group cursor-pointer overflow-hidden rounded-xl border border-white/5 aspect-square"
                onClick={() => setSelectedImage(item)}
              >
                <div className="absolute inset-0">
                  <img
                    src={item.image_url}
                    alt={item.title}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-[2000ms] ease-out group-hover:scale-110"
                  />
                  
                  {/* Glass Overlay */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all duration-700 backdrop-blur-[2px] flex flex-col justify-end p-6">
                    <div className="translate-y-4 group-hover:translate-y-0 transition-all duration-700">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-6 h-px bg-primary" />
                        <p className="text-primary text-[8px] tracking-[0.4em] uppercase font-bold">{item.category}</p>
                      </div>
                      <h3 className="font-heading text-lg text-white italic tracking-wide">{item.title}</h3>
                    </div>
                  </div>

                  <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                    <div className="w-8 h-8 flex items-center justify-center bg-white/10 backdrop-blur-md rounded-full text-white border border-white/10">
                      <Maximize2 className="w-3 h-3" />
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* See More Button */}
        {visibleCount < filteredItems.length && (
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="flex justify-center mt-20"
          >
            <button 
              onClick={showMore}
              className="group relative px-12 py-4 overflow-hidden rounded-full border border-primary/30 transition-all duration-500 hover:border-primary"
            >
              <div className="relative z-10 flex items-center gap-3">
                <span className="text-[10px] tracking-[0.4em] uppercase font-bold text-white group-hover:text-primary transition-colors duration-500">
                  Discover More
                </span>
                <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              </div>
              <div className="absolute inset-x-0 bottom-0 h-0 bg-primary/5 transition-all duration-500 group-hover:h-full" />
            </button>
          </motion.div>
        )}
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-2xl flex items-center justify-center p-6 md:p-12"
            onClick={() => setSelectedImage(null)}
          >
            <button className="absolute top-8 right-8 text-white/50 hover:text-white transition-colors" aria-label="Close">
                <X className="w-8 h-8 stroke-1" />
            </button>
            
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="max-w-6xl w-full flex flex-col md:flex-row items-center gap-12"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex-1 w-full max-h-[60vh] md:max-h-[80vh] flex items-center justify-center">
                <img 
                    src={selectedImage.image_url} 
                    alt={selectedImage.title} 
                    className="max-w-full max-h-full object-contain rounded-sm" 
                />
              </div>
              <div className="w-full md:w-96 text-left shrink-0">
                <div className="inline-flex items-center gap-3 mb-4">
                  <div className="w-8 h-px bg-primary/50" />
                  <p className="text-primary text-[10px] tracking-[0.5em] uppercase font-bold">{selectedImage.category}</p>
                </div>
                <h3 className="font-heading text-4xl text-white mb-6 italic tracking-wide leading-tight">
                    {selectedImage.title}
                </h3>
                <p className="text-white/60 text-sm font-light leading-relaxed mb-10 italic uppercase tracking-widest">
                    {selectedImage.description}
                </p>
                <div className="h-px w-full bg-white/5 mb-10" />
                <button 
                  onClick={() => setSelectedImage(null)}
                  className="text-[10px] tracking-[0.4em] uppercase text-white hover:text-primary transition-all duration-500 flex items-center gap-3 group"
                >
                    <X className="w-3 h-3 transition-transform group-hover:rotate-90" />
                    Back To Moments
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
