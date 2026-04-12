import { useState, useEffect } from "react";
import { getTeamMembers, addTeamMember, updateTeamMember, deleteTeamMember, uploadMedia } from "@/lib/supabase";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Edit2, Loader2, Plus, Trash2, Users, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const DEFAULT_TEAM = [
  {
    name: "Sreejith",
    role: "Founder",
    bio: "As the founder of Luxe Vibe, Sreejith brings over a decade of luxury event management experience. His visionary approach to cinematic weddings ensures every celebration remains timeless.",
    image_url: "",
    social_links: "[]"
  }
];

export default function TeamManager() {
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [members, setMembers] = useState<any[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    name: "",
    role: "",
    bio: "",
    imageFile: null as File | null,
    image_url: ""
  });

  useEffect(() => {
    fetchTeam(true); // Enable autoseeding on mount
  }, []);

  const fetchTeam = async (autoSeed = false) => {
    try {
      setLoading(true);
      const data = await getTeamMembers();
      
      // Auto Seed If Empty
      if (data.length === 0 && autoSeed) {
        for (const t of DEFAULT_TEAM) {
          await addTeamMember(t);
        }
        const seeded = await getTeamMembers();
        setMembers(seeded);
      } else {
        setMembers(data);
      }
    } catch (error) {
      console.log("No team collection found");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveMember = async () => {
    if (!formData.name || !formData.role) {
        toast.error("Please provide Name and Role");
        return;
    }
    
    setUploading(true);
    try {
      let imageUrl = formData.image_url;
      if (formData.imageFile) {
        imageUrl = await uploadMedia(formData.imageFile);
      }
      
      const payload = { 
        name: formData.name,
        role: formData.role,
        bio: formData.bio,
        image_url: imageUrl,
        social_links: '[]'
      };

      if (editingId) {
        await updateTeamMember(editingId, payload);
        toast.success("Team member updated!");
      } else {
        await addTeamMember(payload);
        toast.success("Team member added!");
      }

      setIsAdding(false);
      setEditingId(null);
      setFormData({ name: "", role: "", bio: "", imageFile: null, image_url: "" });
      fetchTeam();
    } catch (error: any) {
      toast.error(error.message || "Failed to save member");
    } finally {
      setUploading(false);
    }
  };

  const startEdit = (member: any) => {
    setFormData({
      name: member.name,
      role: member.role,
      bio: member.bio,
      image_url: member.image_url,
      imageFile: null
    });
    setEditingId(member.$id || member.id);
    setIsAdding(true);
  };

  const cancelForm = () => {
    setIsAdding(false);
    setEditingId(null);
    setFormData({ name: "", role: "", bio: "", imageFile: null, image_url: "" });
  };

  const handleDelete = async (docId: string) => {
    if (!window.confirm("Remove this team member?")) return;
    try {
      await deleteTeamMember(docId);
      toast.success("Member removed");
      fetchTeam();
    } catch (error: any) {
      toast.error(error.message || "Failed to delete");
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 text-primary animate-spin mb-4" />
        <p className="text-sm font-medium text-muted-foreground">Loading Team...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-end border-b border-border/50 pb-4">
        <section className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight text-foreground font-heading">Our Team</h1>
          <p className="text-muted-foreground">Manage the creative professionals.</p>
        </section>
        
        <Button 
            onClick={() => setIsAdding(true)} 
            className="gap-2 font-bold uppercase tracking-widest text-[10px] h-12"
        >
            <Plus className="w-4 h-4" />
            Add Member
        </Button>
      </div>

      <AnimatePresence>
        {isAdding && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mb-8"
          >
            <Card className="glass border-primary/20 bg-secondary/5">
              <CardHeader className="flex flex-row items-center justify-between border-b border-border/50 pb-4">
                <CardTitle className="font-heading">{editingId ? "Edit Team Member" : "Add Team Member"}</CardTitle>
                <Button variant="ghost" size="icon" onClick={cancelForm}>
                    <X className="w-4 h-4" />
                </Button>
              </CardHeader>
              <CardContent className="space-y-6 pt-6">
                <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Full Name</label>
                            <Input 
                                placeholder="E.g. Rahul Sharma" 
                                value={formData.name}
                                onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Role</label>
                            <Input 
                                placeholder="E.g. Creative Director" 
                                value={formData.role}
                                onChange={e => setFormData(prev => ({ ...prev, role: e.target.value }))}
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Bio</label>
                        <Textarea 
                            placeholder="Briefly describe their expertise..." 
                            className="h-[105px] resize-none"
                            value={formData.bio}
                            onChange={e => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                        />
                    </div>
                </div>

                <div className="space-y-2 border-t border-border/50 pt-4 mt-6">
                    <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground block mb-2">
                        {editingId ? "Update Photo (Leave blank to keep current)" : "Profile Photo (Optional)"}
                    </label>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                        <Input 
                            type="file" 
                            accept="image/*" 
                            onChange={e => setFormData(prev => ({ ...prev, imageFile: e.target.files?.[0] || null }))}
                            className="flex-1 cursor-pointer"
                        />
                        <Button 
                            onClick={handleSaveMember} 
                            disabled={uploading}
                            className="min-w-[140px] gap-2 w-full sm:w-auto"
                        >
                            {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : (editingId ? "Update Member" : "Save Member")}
                        </Button>
                    </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <AnimatePresence>
          {members.map((member) => (
            <motion.div
              key={member.$id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="group relative glass border border-border/50 bg-secondary/5 rounded-xl p-6 hover:shadow-[0_0_20px_rgba(0,229,255,0.1)] hover:border-primary/30 transition-all flex flex-col items-center text-center"
            >
              <div className="w-32 h-32 rounded-full overflow-hidden mb-6 ring-2 ring-primary/20 group-hover:ring-primary/50 transition-all relative">
                {member.image_url ? (
                    <img src={member.image_url} alt={member.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-muted-foreground/50 bg-background/50">
                        <Users className="w-10 h-10 mb-2" />
                        <span className="text-[10px] tracking-widest uppercase">No Photo</span>
                    </div>
                )}
              </div>
              <h4 className="font-heading text-xl font-bold text-foreground mb-1">{member.name}</h4>
              <p className="text-primary text-[10px] uppercase font-bold tracking-[0.2em] mb-4">{member.role}</p>
              <p className="text-muted-foreground text-xs leading-relaxed mb-6 px-2">{member.bio}</p>
              
              <div className="flex gap-2 w-full mt-auto">
                <Button 
                    variant="ghost" 
                    size="sm" 
                    className="flex-1 text-primary hover:text-primary hover:bg-primary/10 gap-2 opacity-60 group-hover:opacity-100 transition-opacity"
                    onClick={() => startEdit(member)}
                >
                    <Edit2 className="w-4 h-4" />
                    Edit
                </Button>
                <Button 
                    variant="ghost" 
                    size="sm" 
                    className="flex-1 text-destructive hover:text-destructive hover:bg-destructive/10 gap-2 opacity-60 group-hover:opacity-100 transition-opacity"
                    onClick={() => handleDelete(member.$id || member.id)}
                >
                    <Trash2 className="w-4 h-4" />
                    Delete
                </Button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        
        {members.length === 0 && (
          <div className="col-span-full py-20 flex flex-col items-center justify-center border-2 border-dashed border-border/50 rounded-xl glass text-muted-foreground/50">
            <Users className="w-12 h-12 mb-4 opacity-30" />
            <p className="font-medium text-foreground">No team members available.</p>
            <p className="text-sm mt-1">Add your first member to populate the Team Section.</p>
          </div>
        )}
      </div>
    </div>
  );
}
