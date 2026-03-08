import { Link, useLocation, useNavigate } from "react-router-dom";
import { LayoutDashboard, Book, PenTool, Settings, LogOut, ExternalLink, Users } from "lucide-react";
import { supabase } from "../lib/supabase";

export default function AdminSidebar() {
  const location = useLocation();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Error signing out:", error.message);
    } else {
      navigate("/login");
    }
  };

  const navItems = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/admin" },
    { icon: Book, label: "Manage Books", path: "/admin/books" },
    { icon: PenTool, label: "Manage Blog", path: "/admin/blog" },
    { icon: Users, label: "Subscribers", path: "/admin/subscribers" },
    { icon: Settings, label: "Site Settings", path: "/admin/settings" },
  ];

  return (
    <aside className="w-64 bg-white border-r border-primary/10 h-[calc(100vh-64px)] sticky top-16 flex flex-col">
      <div className="p-6">
        <h2 className="text-xs font-bold text-taupe uppercase tracking-widest mb-6">Admin Console</h2>
        <nav className="space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-3 px-4 py-3 rounded-xl font-bold transition-all ${
                  isActive 
                  ? "bg-primary text-soft-cream shadow-md" 
                  : "text-deep-brown/60 hover:bg-primary/5 hover:text-primary"
                }`}
              >
                <Icon size={20} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
      
      <div className="mt-auto p-6 border-t border-primary/10 space-y-4">
        <Link to="/" className="flex items-center space-x-3 px-4 py-3 text-taupe hover:text-primary font-bold transition-colors">
          <ExternalLink size={20} />
          <span>View Live Site</span>
        </Link>
        <button 
          onClick={handleSignOut}
          className="w-full flex items-center space-x-3 px-4 py-3 text-accent hover:bg-accent/5 rounded-xl font-bold transition-colors"
        >
          <LogOut size={20} />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
