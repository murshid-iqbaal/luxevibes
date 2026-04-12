import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { getTeamMembers, type TeamMember } from '@/lib/supabase';
import { Instagram, Linkedin, Twitter, Globe, Github } from 'lucide-react';

export default function TeamSection() {
  const { data: team = [], isLoading } = useQuery({
    queryKey: ['teamMembers'],
    queryFn: getTeamMembers
  });

  const DEFAULT_TEAM = [
    {
      $id: 'fallback-sreejith',
      name: "Sreejith",
      role: "Founder",
      bio: "As the founder of Luxe Vibe, Sreejith brings over a decade of luxury event management experience. His visionary approach to cinematic weddings ensures every celebration remains timeless.",
      image_url: "",
      social_links: "[]"
    }
  ];

  const displayTeam = team.length > 0 ? team : DEFAULT_TEAM;

  if (isLoading) return null;

  return (
    <section id="team" className="py-32 bg-background relative border-t border-white/5 grain-overlay">
      <div className="container mx-auto px-6">
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
            className="text-center mb-24"
        >
            <p className="text-primary text-[10px] tracking-[0.4em] uppercase mb-6">Our Experts</p>
            <h2 className="font-heading text-3xl md:text-5xl tracking-wide">
                Creative <span className="text-gradient">Team</span>
            </h2>
            <p className="mt-6 text-muted-foreground/80 font-light max-w-2xl mx-auto text-xs md:text-sm leading-relaxed tracking-wide">
                The visionaries and planners behind Kerala's most cinematic weddings and luxury events.
            </p>
        </motion.div>

        <div className={`flex flex-wrap gap-12 lg:gap-16 justify-center ${displayTeam.length > 1 ? 'md:grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' : ''}`}>
          {displayTeam.map((member, i) => (
            <motion.div
              key={member.$id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 1, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="group relative flex flex-col items-center text-center p-6 rounded-2xl transition-all duration-700 hover:bg-white/[0.02] hover:backdrop-blur-sm border border-transparent hover:border-white/5 max-w-[280px]"
            >
              {/* Card Glow Effect */}
              <div className="absolute -inset-1 bg-gradient-to-b from-primary/10 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 blur transition-opacity duration-700 -z-10" />

              <div className="relative mb-8 w-48 h-48">
                {/* Decorative Elements */}
                <div className="absolute -inset-4 border border-primary/20 rounded-full rotate-45 group-hover:rotate-180 transition-transform duration-[2000ms] ease-out" />
                <div className="absolute -inset-2 border border-primary/10 rounded-full -rotate-12 group-hover:rotate-0 transition-transform duration-[2500ms] ease-out shadow-[0_0_15px_rgba(var(--primary),0.1)]" />
                
                {/* Outer Ring Glow */}
                <div className="absolute inset-0 rounded-full bg-primary/20 blur-2xl opacity-0 group-hover:opacity-40 transition-opacity duration-1000" />

                <div className="relative w-full h-full overflow-hidden rounded-full ring-1 ring-white/10 p-2 group-hover:ring-primary/40 transition-all duration-700 bg-black/40">
                    <img 
                      src={member.image_url || '/placeholder-user.jpg'} 
                      alt={member.name} 
                      className="w-full h-full object-cover rounded-full group-hover:scale-110 transition-transform duration-1000 grayscale group-hover:grayscale-0 contrast-[1.1]"
                    />
                </div>
              </div>

              <div className="relative z-10 transition-transform duration-700 group-hover:-translate-y-2">
                <h4 className="font-heading text-2xl mb-2 tracking-wider group-hover:text-primary transition-colors duration-500">
                  {member.name}
                </h4>
                <p className="text-primary text-[10px] tracking-[0.4em] uppercase mb-5 font-bold">
                  {member.role}
                </p>
                <div className="h-px w-6 bg-primary/30 mx-auto mb-5 group-hover:w-12 transition-all duration-700" />
                <p className="text-muted-foreground/70 text-[11px] font-light leading-relaxed mb-6 px-4 italic">
                  "{member.bio}"
                </p>

                <div className="flex justify-center gap-5 opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-700 delay-100">
                  <a href="#" className="p-2.5 border border-white/5 rounded-full hover:border-primary/50 hover:text-primary hover:bg-primary/5 transition-all group/icon">
                    <Instagram className="w-4 h-4 transition-transform group-hover/icon:scale-110" />
                  </a>
                  <a href="#" className="p-2.5 border border-white/5 rounded-full hover:border-primary/50 hover:text-primary hover:bg-primary/5 transition-all group/icon">
                    <Linkedin className="w-4 h-4 transition-transform group-hover/icon:scale-110" />
                  </a>
                  <a href="#" className="p-2.5 border border-white/5 rounded-full hover:border-primary/50 hover:text-primary hover:bg-primary/5 transition-all group/icon">
                    <Twitter className="w-4 h-4 transition-transform group-hover/icon:scale-110" />
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
