import aboutLuxuryImg from '@/assets/about-luxury.jpg';
import { getContentDocument } from '@/lib/supabase';
import { useQuery } from '@tanstack/react-query';
import { motion, useInView } from 'framer-motion';
import { Award, MapPin, Sparkles } from 'lucide-react';
import { useRef } from 'react';

export default function AboutSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  const { data: aboutData } = useQuery({
    queryKey: ['aboutSection'],
    queryFn: async () => {
      try {
        const doc = await getContentDocument('about_section');
        return doc;
      } catch (error) {
        return null;
      }
    }
  });

  const title = aboutData?.title || "Crafting the Future of\nLuxury Celebrations";
  const description = aboutData?.description || "Luxe Vibe stands as the premier destination for cinematic wedding planning and elite event management across Kerala. Based in Kothamangalam and Ernakulam, we blend traditional elegance with contemporary vision to create atmospheric experiences that transcend the ordinary.";
  const image = aboutData?.imageUrl || aboutLuxuryImg;

  return (
    <section id="about" className="relative py-28 grain-overlay overflow-hidden">
      {/* Background Decorative Element */}
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-primary/5 rounded-full blur-[120px] -z-10" />
      <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-primary/5 rounded-full blur-[120px] -z-10" />

      <div className="container mx-auto px-6">
        <div ref={ref} className="grid lg:grid-cols-2 gap-16 items-center">

          {/* Image Column */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
            className="relative flex justify-center lg:justify-start"
          >
            <div className="relative z-10 rounded-2xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] group max-w-lg">
              <img
                src={image}
                alt="Luxevibes luxury event styling showcase"
                loading="lazy"
                width={800}
                height={1000}
                className="w-full object-cover aspect-[4/5] transition-transform duration-[3000ms] group-hover:scale-110"
              />
              {/* Image Overlay Gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60" />
            </div>

            {/* Decorative Frame */}
            <div className="absolute -top-4 -left-4 bottom-4 right-4 border border-primary/20 rounded-2xl -z-10 max-w-lg" />
            <div className="absolute top-4 left-4 -bottom-4 -right-4 border border-primary/10 rounded-2xl -z-20 max-w-lg" />
          </motion.div>

          {/* Text Column */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1.2, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="inline-flex items-center gap-3 mb-8">
              <div className="w-12 h-px bg-primary/40" />
              <p className="text-primary text-[10px] tracking-[0.5em] uppercase font-bold">The Heritage of Luxe</p>
            </div>

            <h2 className="font-heading text-4xl md:text-5xl lg:text-6xl leading-[1.1] mb-10 tracking-tight text-white italic">
              {title}
            </h2>

            <div className="space-y-8 mb-16">
              <p className="text-muted-foreground/90 text-sm md:text-base leading-relaxed max-w-xl font-light tracking-wide first-letter:text-5xl first-letter:font-heading first-letter:text-primary first-letter:mr-3 first-letter:float-left first-letter:mt-1">
                {description}
              </p>
            </div>

            <div className="grid sm:grid-cols-3 gap-8 pt-8 border-t border-white/5">
              <div className="group">
                <Sparkles className="w-5 h-5 text-primary mb-4 opacity-50 group-hover:opacity-100 transition-opacity" />
                <h4 className="font-heading text-sm uppercase tracking-[0.2em] mb-2">Bespoke</h4>
                <p className="text-[10px] text-muted-foreground uppercase tracking-widest">Tailored Visions</p>
              </div>
              <div className="group">
                <Award className="w-5 h-5 text-primary mb-4 opacity-50 group-hover:opacity-100 transition-opacity" />
                <h4 className="font-heading text-sm uppercase tracking-[0.2em] mb-2">Artisan</h4>
                <p className="text-[10px] text-muted-foreground uppercase tracking-widest">Master Crafts</p>
              </div>
              <div className="group">
                <MapPin className="w-5 h-5 text-primary mb-4 opacity-50 group-hover:opacity-100 transition-opacity" />
                <h4 className="font-heading text-sm uppercase tracking-[0.2em] mb-2">Global</h4>
                <p className="text-[10px] text-muted-foreground uppercase tracking-widest">Kerala & Beyond</p>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
