import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { getServices } from '@/lib/supabase';
import { Heart, Globe, Briefcase, Sparkles, ChevronLeft, ChevronRight, Scale } from 'lucide-react';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import { useCallback, useEffect, useState } from 'react';

const ICON_MAP: Record<string, any> = { Heart, Globe, Briefcase, Sparkles };

const FALLBACK_SERVICES = [
  { id: 'f1', title: 'Luxury Weddings',      description: 'Exquisite wedding celebrations in Kothamangalam and Ernakulam, crafted with unparalleled attention to detail and elegance.', icon: 'Heart',     image_url: '', sort_order: 1, created_at: '' },
  { id: 'f2', title: 'Destination Weddings', description: "Breathtaking destination wedding ceremonies across Kerala and India's most stunning exclusive locations.",                  icon: 'Globe',     image_url: '', sort_order: 2, created_at: '' },
  { id: 'f3', title: 'Corporate Events',     description: 'Sophisticated corporate events and business gatherings in Ernakulam that leave lasting professional impressions.',          icon: 'Briefcase', image_url: '', sort_order: 3, created_at: '' },
  { id: 'f4', title: 'Private Celebrations', description: 'Intimate private celebrations and anniversary events designed to create unforgettable personal memories in Kerala.',       icon: 'Sparkles',  image_url: '', sort_order: 4, created_at: '' },
];

export default function ServicesSection() {
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, align: 'center', containScroll: 'trimSnaps' },
    [Autoplay({ delay: 5000, stopOnInteraction: true })]
  );

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);

  const { data: services } = useQuery({
    queryKey: ['services'],
    queryFn: async () => {
      try {
        const data = await getServices();
        return data.length > 0 ? data : null;
      } catch {
        return null;
      }
    },
    staleTime: 1000 * 60 * 5,
  });

  const activeServices = services ?? FALLBACK_SERVICES;

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    setScrollSnaps(emblaApi.scrollSnapList());
    emblaApi.on('select', onSelect);
    onSelect();
    return () => { emblaApi.off('select', onSelect); };
  }, [emblaApi, onSelect]);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);
  const scrollTo  = useCallback((i: number) => emblaApi?.scrollTo(i), [emblaApi]);

  return (
    <section id="services" className="py-40 grain-overlay overflow-hidden relative">
      {/* Background Ambiance Glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[600px] bg-primary/5 rounded-full blur-[160px] pointer-events-none -z-10" />
      
      <div className="container mx-auto px-6">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-24"
        >
          <div className="inline-flex items-center gap-3 mb-6">
            <div className="w-10 h-px bg-primary/40" />
            <p className="text-primary text-[10px] tracking-[0.5em] uppercase font-bold">Unrivaled Expertise</p>
            <div className="w-10 h-px bg-primary/40" />
          </div>
          <h2 className="font-heading text-3xl md:text-5xl lg:text-6xl tracking-tight leading-none italic mb-8">
            The Art of <span className="text-gradient">Celebration</span>
          </h2>
          <p className="text-muted-foreground/60 text-xs tracking-widest uppercase max-w-lg mx-auto leading-relaxed">
            Elevating every moment into a cinematic masterpiece
          </p>
        </motion.div>

        {/* Carousel wrapper */}
        <div className="relative">
          {/* Elegant Arrows */}
          <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 z-20 flex justify-between px-2 pointer-events-none">
            <button
              onClick={scrollPrev}
              aria-label="Previous service"
              className="pointer-events-auto flex items-center justify-center w-14 h-14 rounded-full border border-white/5 bg-black/20 backdrop-blur-md text-white/40 hover:text-primary hover:border-primary/40 hover:bg-black/40 hover:shadow-[0_0_30px_rgba(var(--primary),0.1)] transition-all duration-500 group"
            >
              <ChevronLeft className="w-6 h-6 transition-transform group-hover:-translate-x-0.5" strokeWidth={1} />
            </button>
            <button
              onClick={scrollNext}
              aria-label="Next service"
              className="pointer-events-auto flex items-center justify-center w-14 h-14 rounded-full border border-white/5 bg-black/20 backdrop-blur-md text-white/40 hover:text-primary hover:border-primary/40 hover:bg-black/40 hover:shadow-[0_0_30px_rgba(var(--primary),0.1)] transition-all duration-500 group"
            >
              <ChevronRight className="w-6 h-6 transition-transform group-hover:translate-x-0.5" strokeWidth={1} />
            </button>
          </div>

          {/* Embla viewport */}
          <div className="overflow-hidden mx-4" ref={emblaRef}>
            <div className="flex gap-10 py-10">
              {activeServices.map((s, i) => {
                const IconComp = ICON_MAP[s.icon] || Sparkles;
                const isActive = i === selectedIndex;
                const displayIndex = (i + 1).toString().padStart(2, '0');

                return (
                  <div
                    key={s.id}
                    style={{ flex: '0 0 min(85%, 380px)' }}
                    className="relative"
                  >
                    <motion.article
                      animate={{
                        scale: isActive ? 1 : 0.9,
                        opacity: isActive ? 1 : 0.4,
                        y: isActive ? 0 : 20,
                      }}
                      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                      className="relative min-h-[420px] p-10 glass border border-white/10 hover:border-primary/40 rounded-2xl overflow-hidden flex flex-col justify-end cursor-pointer group transition-all duration-700 hover:shadow-[0_20px_50px_rgba(0,0,0,0.4)]"
                      onClick={() => scrollTo(i)}
                    >
                      {/* Background Numbering */}
                      <span className="absolute top-4 right-8 font-heading text-8xl text-white/[0.03] select-none pointer-events-none group-hover:text-primary/10 transition-colors duration-1000">
                        {displayIndex}
                      </span>

                      {/* Background image & Parallax */}
                      {s.image_url && (
                        <div className="absolute inset-0 z-[-2] overflow-hidden">
                          <img
                            src={s.image_url}
                            alt={s.title}
                            className="w-full h-full object-cover transition-transform duration-[3000ms] ease-out group-hover:scale-110 motion-safe:group-hover:translate-y-2 opacity-20 group-hover:opacity-40"
                          />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/40 to-transparent z-[-1]" />

                      {/* Active glow overlay */}
                      <motion.div
                        animate={{ opacity: isActive ? 1 : 0 }}
                        transition={{ duration: 0.8 }}
                        className="absolute inset-0 bg-gradient-to-b from-primary/[0.03] to-transparent z-0 pointer-events-none"
                      />

                      {/* Content */}
                      <div className="relative z-10">
                        <motion.div
                          animate={{ y: isActive ? 0 : 15, opacity: isActive ? 1 : 0.6 }}
                          transition={{ duration: 0.8 }}
                        >
                          <div className="relative mb-8 inline-block">
                             <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                             <IconComp
                              className="relative z-10 stroke-[1px] w-12 h-12 text-primary transition-all duration-700 group-hover:scale-110"
                              aria-hidden="true"
                            />
                          </div>
                         
                          <h3 className="font-heading text-3xl mb-4 tracking-tight text-white italic group-hover:text-primary transition-colors duration-500">{s.title}</h3>
                          <div className="w-12 h-px bg-primary/30 mb-5 group-hover:w-24 transition-all duration-700" />
                          <p className="text-muted-foreground/80 font-light text-sm leading-relaxed tracking-wide mb-2 opacity-80 group-hover:opacity-100 transition-opacity duration-500">
                            {s.description}
                          </p>
                        </motion.div>
                      </div>

                      {/* Glass Shine Effect */}
                      <div className="absolute top-0 -left-[100%] w-1/2 h-full bg-gradient-to-r from-transparent via-white/[0.05] to-transparent skew-x-[-25deg] group-hover:left-[150%] transition-all duration-[1500ms]" />
                    </motion.article>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Luxury Progress Navigation */}
          <div className="flex flex-col items-center gap-6 mt-16">
            <div className="flex items-center gap-4 text-[10px] tracking-[0.5em] text-white/20 uppercase font-bold">
              <span>{Math.min(selectedIndex + 1, activeServices.length).toString().padStart(2, '0')}</span>
              <div className="w-48 h-[1px] bg-white/5 relative overflow-hidden">
                <motion.div 
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: (selectedIndex + 1) / activeServices.length }}
                  transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                  className="absolute inset-0 bg-primary origin-left"
                />
              </div>
              <span className="text-white/40">{activeServices.length.toString().padStart(2, '0')}</span>
            </div>
            
            <div className="flex gap-3">
              {scrollSnaps.map((_, i) => (
                <button
                  key={i}
                  onClick={() => scrollTo(i)}
                  className="group relative py-4"
                  aria-label={`Go to slide ${i + 1}`}
                >
                  <motion.div
                    animate={{
                      width: i === selectedIndex ? 40 : 12,
                      backgroundColor: i === selectedIndex ? 'hsl(var(--primary))' : 'hsl(var(--white) / 0.1)',
                    }}
                    transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                    className="h-[2px] rounded-full"
                  />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
