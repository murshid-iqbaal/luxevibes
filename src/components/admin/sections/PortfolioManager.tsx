import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  addPortfolioItem, deletePortfolioItem, getPortfolioItems,
  updatePortfolioItem, PortfolioItem, uploadPortfolioImage
} from "@/lib/supabase";
import { AnimatePresence, motion } from "framer-motion";
import { Camera, Layers, Loader2, Pencil, Plus, Save, Trash2, X, Sparkles } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

const CATEGORIES = ["Weddings", "Corporate", "Private", "Destination"];

// The 4 fallback items visible on the live site
const DEFAULT_ITEMS = [
  { title: "Royal Garden Wedding",  category: "Weddings",    description: "A breathtaking garden ceremony in Kothamangalam with ocean views.",  image_url: "" },
  { title: "Emerald Gala Night",    category: "Corporate",   description: "Sophisticated corporate gala in Ernakulam with teal uplighting.",      image_url: "" },
  { title: "Intimate Anniversary",  category: "Private",     description: "A warm, candlelit anniversary celebration in Kerala.",                  image_url: "" },
  { title: "Classic White Wedding", category: "Weddings",    description: "Timeless elegance with white florals in Kothamangalam.",               image_url: "" },
];

type EditForm = {
  title: string;
  category: string;
  description: string;
  image_url: string;
  imageFile: File | null;
};

const emptyForm = (): EditForm => ({ title: "", category: "Weddings", description: "", image_url: "", imageFile: null });

export default function PortfolioManager() {
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<EditForm>(emptyForm());
  const [imagePreview, setImagePreview] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => { fetchItems(true); }, []);

  const fetchItems = async (autoSeed = false) => {
    setLoading(true);
    const data = await getPortfolioItems();
    if (data.length === 0 && autoSeed) {
      try {
        for (const d of DEFAULT_ITEMS) {
          await addPortfolioItem(d);
        }
        const seeded = await getPortfolioItems();
        setItems(seeded);
      } catch {
        setItems([]);
      }
    } else {
      setItems(data);
    }
    setLoading(false);
  };

  const openAdd = () => {
    setEditingId(null);
    setForm(emptyForm());
    setImagePreview("");
    setShowForm(true);
  };

  const openEdit = (item: PortfolioItem) => {
    setEditingId(item.id);
    setForm({ title: item.title, category: item.category, description: item.description, image_url: item.image_url, imageFile: null });
    setImagePreview(item.image_url || "");
    setShowForm(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setForm(prev => ({ ...prev, imageFile: file }));
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSave = async () => {
    if (!form.title.trim()) { toast.error("Title is required"); return; }
    if (!editingId && !form.imageFile) { toast.error("Please select an image"); return; }
    setSaving(true);
    try {
      let finalUrl = form.image_url;
      if (form.imageFile) {
        finalUrl = await uploadPortfolioImage(form.imageFile);
      }
      const payload = { title: form.title, category: form.category, description: form.description, image_url: finalUrl };
      if (editingId) {
        await updatePortfolioItem(editingId, payload);
        toast.success("Masterpiece updated!");
      } else {
        await addPortfolioItem(payload);
        toast.success("Masterpiece added to portfolio!");
      }
      setShowForm(false);
      fetchItems();
    } catch (err: any) {
      toast.error(err.message || "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!window.confirm(`Permanently archive "${title}"?`)) return;
    try {
      await deletePortfolioItem(id);
      toast.success("Masterpiece archived");
      fetchItems();
    } catch (err: any) {
      toast.error(err.message || "Archive failed");
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 text-primary animate-spin mb-4" />
        <p className="text-sm font-medium tracking-[0.2em] uppercase opacity-50 italic">Accessing Archives...</p>
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="space-y-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-heading font-bold tracking-tight">Portfolio Archive</h1>
          <p className="text-muted-foreground text-sm mt-1 italic">
            Curate the "Curated Excellence" section — define your brand's legacy.
          </p>
        </div>
        <Button onClick={openAdd} className="h-12 gap-3 text-[10px] uppercase tracking-[0.3em] font-bold shadow-[0_0_20px_rgba(var(--primary),0.2)]">
          <Plus className="w-4 h-4" /> Add Masterpiece
        </Button>
      </div>

      {/* Add / Edit slide-in form */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Card className="border-primary/20 bg-[#0A0A0A] shadow-2xl overflow-hidden glass">
              <CardHeader className="flex flex-row items-center justify-between border-b border-white/5 pb-6">
                <div className="flex items-center gap-3">
                  <Sparkles className="w-5 h-5 text-primary" />
                  <CardTitle className="text-xl font-heading italic">
                    {editingId ? "Refine Masterpiece" : "Record New Work"}
                  </CardTitle>
                </div>
                <Button variant="ghost" size="icon" onClick={() => setShowForm(false)} className="hover:bg-white/5">
                  <X className="w-4 h-4" />
                </Button>
              </CardHeader>
              <CardContent className="p-8 space-y-8">
                <div className="grid lg:grid-cols-2 gap-10">
                  {/* Left — fields */}
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary/60">Entry Title</label>
                      <Input
                        placeholder="e.g. Royal Vibe Celebration"
                        value={form.title}
                        onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
                        className="bg-black/20 border-white/10 focus:border-primary/50 h-12 text-sm"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary/60">Signature Category</label>
                      <select
                        className="w-full h-12 px-4 rounded-md bg-black/20 border border-white/10 text-sm focus:ring-1 focus:ring-primary/50 outline-none appearance-none cursor-pointer"
                        value={form.category}
                        onChange={e => setForm(p => ({ ...p, category: e.target.value }))}
                      >
                        {CATEGORIES.map(c => <option key={c} value={c} className="bg-black">{c}</option>)}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary/60">Cinematic Description</label>
                      <Textarea
                        rows={5}
                        className="bg-black/20 border-white/10 focus:border-primary/50 resize-none text-sm leading-relaxed"
                        placeholder="Detail the atmosphere and bespoke elements..."
                        value={form.description}
                        onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
                      />
                    </div>
                  </div>

                  {/* Right — image */}
                  <div className="space-y-6">
                    <label className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary/60">Artistic Visual</label>
                    <div
                      className="group relative aspect-[4/3] rounded-xl overflow-hidden bg-black/40 border border-white/5 flex items-center justify-center cursor-pointer"
                      onClick={() => fileRef.current?.click()}
                    >
                      {imagePreview ? (
                        <>
                          <img src={imagePreview} alt="preview" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <Camera className="w-8 h-8 text-primary animate-pulse" />
                          </div>
                        </>
                      ) : (
                        <div className="flex flex-col items-center gap-4 text-white/20 group-hover:text-primary transition-colors duration-500">
                          <Camera className="w-12 h-12 stroke-[1px]" />
                          <div className="text-center">
                            <p className="text-[10px] uppercase tracking-[0.2em] font-bold">Select high-res visual</p>
                            <p className="text-[8px] mt-1 opacity-50 italic">Landscape recommended for masonry flow</p>
                          </div>
                        </div>
                      )}
                    </div>
                    <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                    <div className="p-4 rounded-lg bg-primary/5 border border-primary/10">
                        <p className="text-[9px] text-muted-foreground leading-relaxed uppercase tracking-widest text-center">
                            Visuals are archived in the <code className="text-primary font-bold">portfolio-images</code> bucket.
                        </p>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-4 pt-6 border-t border-white/5">
                  <Button variant="ghost" onClick={() => setShowForm(false)} className="h-12 px-8 text-[10px] uppercase tracking-widest hover:bg-white/5">Discard</Button>
                  <Button onClick={handleSave} disabled={saving} className="h-12 px-10 gap-3 text-[10px] uppercase tracking-[0.2em] font-bold shadow-[0_0_20px_rgba(var(--primary),0.2)]">
                    {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    {editingId ? "Refine Mastery" : "Publish Archive"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Project Grid */}
      <div>
        <div className="flex items-center gap-3 mb-8 px-1">
          <Layers className="w-5 h-5 text-primary opacity-50" />
          <h3 className="font-heading text-lg italic tracking-wide">Archived Collections ({items.length})</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <AnimatePresence mode="popLayout">
            {items.map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.5 }}
                className="group relative glass border border-white/5 rounded-2xl overflow-hidden h-[340px] flex flex-col"
              >
                {/* Image */}
                <div className="relative h-48 overflow-hidden bg-black/40">
                  {item.image_url ? (
                    <img
                      src={item.image_url}
                      alt={item.title}
                      className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-110"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-white/20 gap-3">
                      <Camera className="w-10 h-10 stroke-[1px]" />
                      <span className="text-[8px] uppercase tracking-widest">Awaiting Visual</span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60" />
                  <span className="absolute top-4 left-4 text-[8px] text-primary uppercase tracking-[0.2em] font-bold bg-black/60 backdrop-blur-md border border-white/5 px-2 py-1 rounded">
                    {item.category}
                  </span>
                </div>

                {/* Info + actions */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div className="min-w-0">
                    <h4 className="font-heading text-base italic truncate group-hover:text-primary transition-colors">{item.title}</h4>
                    {item.description && (
                      <p className="text-[10px] text-muted-foreground mt-2 line-clamp-2 font-light leading-relaxed uppercase tracking-wider">{item.description}</p>
                    )}
                  </div>
                  <div className="flex gap-2 justify-end opacity-40 group-hover:opacity-100 transition-opacity pt-4">
                    <Button
                      variant="ghost" size="icon"
                      className="h-8 w-8 rounded-full border border-white/5 hover:border-primary/30 hover:text-primary transition-all"
                      onClick={() => openEdit(item)}
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </Button>
                    <Button
                      variant="ghost" size="icon"
                      className="h-8 w-8 rounded-full border border-white/5 hover:border-destructive/30 hover:text-destructive transition-all"
                      onClick={() => handleDelete(item.id, item.title)}
                    >
                      <Trash2 className="w-3.5 h-3.5" strokeWidth={1.5} />
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {items.length === 0 && (
            <div className="col-span-full py-24 flex flex-col items-center justify-center border-2 border-dashed border-white/5 rounded-3xl text-white/10">
              <Camera className="w-16 h-16 mb-4 opacity-5 stroke-[1px]" />
              <p className="text-[10px] uppercase tracking-[0.2em] font-bold">The Archive is Empty</p>
              <p className="text-[8px] mt-2 italic">Add a new masterpiece to begin your legacy.</p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

