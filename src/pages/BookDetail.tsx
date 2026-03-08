import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, ShoppingCart, Star, Calendar, BookOpen, Share2, Loader2 } from "lucide-react";
import { supabase, type Book } from "../lib/supabase";

export default function BookDetail() {
  const { slug } = useParams();
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBook = async () => {
      if (!slug) return;
      setLoading(true);
      const { data, error } = await supabase
        .from('books')
        .select('*')
        .eq('slug', slug)
        .single();
      
      if (!error) setBook(data);
      setLoading(false);
    };
    fetchBook();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="animate-spin text-primary" size={40} />
      </div>
    );
  }

  if (!book) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h2 className="text-3xl font-serif font-bold text-deep-brown mb-4">
          Book Not Found
        </h2>
        <p className="text-taupe mb-8">
          The book you're looking for doesn't exist or has been moved.
        </p>
        <Link to="/books" className="px-8 py-3 bg-primary text-soft-cream rounded-full font-bold">
          Back to Library
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
        <Link to="/books" className="inline-flex items-center space-x-2 text-taupe hover:text-primary transition-colors font-bold group">
          <ArrowLeft size={20} className="transition-transform group-hover:-translate-x-1" />
          <span>Back to Library</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
        {/* Book Cover */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="relative"
        >
          <div className="aspect-[2/3] rounded-3xl overflow-hidden shadow-2xl relative z-10 group">
            <img 
              src={book.cover_image_url || `https://picsum.photos/seed/${book.id}/800/1200`} 
              alt={book.title} 
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          <div className="absolute -inset-4 bg-primary/10 rounded-3xl blur-2xl -z-10" />
          
          <div className="mt-8 flex justify-center space-x-4">
            <button className="p-3 bg-white rounded-full shadow-md hover:text-primary transition-colors">
              <Share2 size={20} />
            </button>
            <button className="p-3 bg-white rounded-full shadow-md hover:text-accent transition-colors">
              <Star size={20} />
            </button>
          </div>
        </motion.div>

        {/* Book Info */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-8"
        >
          <div>
            <div className="flex items-center space-x-3 mb-4">
              {book.featured && (
                <span className="px-3 py-1 bg-accent/10 text-accent rounded-full text-xs font-bold uppercase tracking-widest">
                  Featured
                </span>
              )}
              <span className="text-taupe font-medium text-sm">{book.genre}</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-serif font-bold text-deep-brown leading-tight mb-4">
              {book.title}
            </h1>
            <div className="flex items-center space-x-4 text-taupe font-medium">
              <div className="flex items-center space-x-1">
                <Calendar size={18} />
                <span>Published: {new Date(book.release_date).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })}</span>
              </div>
              <div className="flex items-center space-x-1">
                <BookOpen size={18} />
                <span>{book.author_name}</span>
              </div>
            </div>
          </div>

          <div className="prose prose-lg text-deep-brown/80 max-w-none">
            <p className="text-xl font-medium text-deep-brown mb-4 leading-relaxed italic">
              {book.description}
            </p>
            <div className="leading-relaxed whitespace-pre-wrap">
              {book.long_description}
            </div>
          </div>

          <div className="bg-secondary/20 p-8 rounded-3xl border border-primary/5">
            <div className="flex items-center justify-between mb-6">
              <div>
                <span className="text-taupe text-sm font-bold uppercase tracking-widest mb-1 block">Available Now</span>
                <span className="text-3xl font-bold text-deep-brown">Standard Edition</span>
              </div>
              <div className="flex items-center space-x-1 text-accent">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star key={i} size={16} fill="currentColor" />
                ))}
              </div>
            </div>
            
            {book.gumroad_link ? (
              <a 
                href={book.gumroad_link} 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-full py-4 bg-primary text-soft-cream rounded-full font-bold flex items-center justify-center space-x-2 hover:bg-primary/90 transition-all shadow-lg hover:shadow-primary/20"
              >
                <ShoppingCart size={20} />
                <span>Purchase on Gumroad</span>
              </a>
            ) : (
              <button disabled className="w-full py-4 bg-taupe/20 text-taupe rounded-full font-bold cursor-not-allowed">
                Coming Soon
              </button>
            )}
            <p className="text-center text-xs text-taupe mt-4 font-medium">
              Secure checkout powered by Gumroad. Instant digital delivery.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
