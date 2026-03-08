import { Link } from "react-router-dom";
import { Book, PenTool, Home, User } from "lucide-react";
import { useSiteSettings } from "../hooks/useSiteSettings";

export default function Navbar() {
  const { settings } = useSiteSettings();
  const siteName = settings?.site_name || "Lumina";
  const siteLogo = settings?.site_logo_url;

  return (
    <nav className="bg-soft-cream/80 backdrop-blur-md sticky top-0 z-50 border-b border-primary/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2 text-2xl font-serif font-bold text-primary tracking-tight">
              {siteLogo ? (
                <img src={siteLogo} alt={siteName} className="h-8 w-auto object-contain" referrerPolicy="no-referrer" />
              ) : (
                <span>{siteName}</span>
              )}
            </Link>
          </div>
          <div className="hidden sm:flex space-x-8">
            <Link to="/" className="flex items-center space-x-1 text-deep-brown hover:text-primary transition-colors font-medium">
              <Home size={18} />
              <span>Home</span>
            </Link>
            <Link to="/books" className="flex items-center space-x-1 text-deep-brown hover:text-primary transition-colors font-medium">
              <Book size={18} />
              <span>Books</span>
            </Link>
            <Link to="/blog" className="flex items-center space-x-1 text-deep-brown hover:text-primary transition-colors font-medium">
              <PenTool size={18} />
              <span>Blog</span>
            </Link>
            <Link to="/admin" className="flex items-center space-x-1 text-deep-brown hover:text-primary transition-colors font-medium">
              <User size={18} />
              <span>Admin</span>
            </Link>
          </div>
          {/* Mobile menu button would go here */}
        </div>
      </div>
    </nav>
  );
}
