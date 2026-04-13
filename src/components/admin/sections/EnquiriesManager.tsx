import { useEffect, useState } from "react";
import { getEnquiries, deleteEnquiry, type Enquiry } from "@/lib/supabase";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, Mail, Trash2, Calendar, User, Tag, MessageSquare } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { format } from "date-fns";

export default function EnquiriesManager() {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchEnquiries();
  }, []);

  const fetchEnquiries = async () => {
    setIsLoading(true);
    try {
      const data = await getEnquiries();
      setEnquiries(data);
    } catch (error: any) {
      toast.error("Failed to fetch enquiries");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Archive this enquiry? This action cannot be undone.")) return;
    
    try {
      await deleteEnquiry(id);
      toast.success("Enquiry archived");
      setEnquiries(enquiries.filter(e => e.id !== id));
    } catch (error: any) {
      toast.error("Failed to delete enquiry");
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 text-primary animate-spin mb-4" />
        <p className="text-sm text-muted-foreground font-medium">Loading enquiries...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-10">
        <section className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight text-foreground font-heading italic">Direct Enquiries</h1>
          <p className="text-muted-foreground text-sm uppercase tracking-widest">Manage your incoming leads and cinematic visions.</p>
        </section>
        <div className="flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full border border-primary/20">
          <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          <span className="text-[10px] uppercase font-bold tracking-widest text-primary">
            {enquiries.length} Enquiries Total
          </span>
        </div>
      </div>

      <div className="grid gap-6">
        <AnimatePresence mode="popLayout">
          {enquiries.map((item) => (
            <motion.div
              key={item.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.5 }}
            >
              <Card className="glass group border-border/50 bg-secondary/5 hover:border-primary/30 transition-all duration-500 overflow-hidden">
                <CardContent className="p-0">
                  <div className="grid md:grid-cols-[250px_1fr_auto] items-stretch">
                    {/* Sidebar Info */}
                    <div className="p-6 bg-white/5 border-r border-border/50 flex flex-col justify-between gap-4">
                      <div className="space-y-4">
                        <div className="flex items-center gap-3 text-muted-foreground">
                          <User className="w-3.5 h-3.5 text-primary" />
                          <p className="text-xs font-bold uppercase tracking-widest truncate">{item.name}</p>
                        </div>
                        <div className="flex items-center gap-3 text-muted-foreground">
                          <Mail className="w-3.5 h-3.5 text-primary" />
                          <a href={`mailto:${item.email}`} className="text-xs hover:text-primary transition-colors truncate">
                            {item.email}
                          </a>
                        </div>
                        <div className="flex items-center gap-3 text-muted-foreground">
                          <Tag className="w-3.5 h-3.5 text-primary" />
                          <span className="text-[10px] px-2 py-0.5 bg-primary/10 text-primary rounded-full uppercase font-bold tracking-tighter">
                            {item.event_type || 'General Inquiry'}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 text-[10px] text-muted-foreground uppercase tracking-widest pt-4 border-t border-border/30">
                        <Calendar className="w-3 h-3" />
                        {format(new Date(item.created_at), 'MMM dd, yyyy • HH:mm')}
                      </div>
                    </div>

                    {/* Message Body */}
                    <div className="p-8 relative">
                      <MessageSquare className="absolute top-4 right-4 w-12 h-12 text-primary/5 -z-0" />
                      <div className="relative z-10">
                        <p className="text-sm leading-relaxed text-foreground/80 first-letter:text-3xl first-letter:font-heading first-letter:text-primary first-letter:mr-1 first-letter:float-left first-letter:mt-1 italic font-light tracking-wide">
                          {item.message}
                        </p>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="p-4 md:border-l border-border/50 flex md:flex-col justify-center gap-2">
                       <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive hover:bg-destructive/10 hover:text-destructive h-12 w-12 rounded-full"
                        onClick={() => handleDelete(item.id)}
                        title="Archive Enquiry"
                      >
                        <Trash2 className="w-5 h-5" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>

        {enquiries.length === 0 && (
          <div className="py-20 flex flex-col items-center justify-center border-2 border-dashed border-border/50 rounded-2xl bg-secondary/5 text-muted-foreground text-center">
            <div className="w-16 h-16 rounded-full bg-primary/5 flex items-center justify-center mb-6">
              <Mail className="w-8 h-8 text-primary/20" />
            </div>
            <h3 className="font-heading text-xl mb-2 italic">The Inbox is Quiet</h3>
            <p className="max-w-xs text-sm font-light tracking-wide uppercase opacity-60">
              No direct enquiries have been received yet. <br /> Your next big event is just a click away!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
