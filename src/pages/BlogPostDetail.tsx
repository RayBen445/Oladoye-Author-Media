import { motion } from "motion/react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Calendar, User, Share2, MessageCircle, Clock, Loader2 } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { usePost } from "../hooks/useBlogPosts";
import { useSiteSettings } from "../hooks/useSiteSettings";

export default function BlogPostDetail() {
  const { slug } = useParams();
  const { post, loading } = usePost(slug || "");
  const { settings } = useSiteSettings();

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="animate-spin text-primary" size={40} />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <h2 className="text-3xl font-serif font-bold text-deep-brown mb-4">
          Post Not Found
        </h2>
        <p className="text-taupe mb-8">
          The blog post you're looking for doesn't exist or has been moved.
        </p>
        <Link to="/blog" className="px-8 py-3 bg-primary text-soft-cream rounded-full font-bold">
          Back to Blog
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
        <Link to="/blog" className="inline-flex items-center space-x-2 text-taupe hover:text-primary transition-colors font-bold group">
          <ArrowLeft size={20} className="transition-transform group-hover:-translate-x-1" />
          <span>Back to Blog</span>
        </Link>
      </div>

      <motion.article 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-8"
      >
        <div className="space-y-6 text-center">
          <div className="flex items-center justify-center space-x-4 text-taupe text-sm font-bold uppercase tracking-widest">
            <span className="text-accent">{post.genre || "Uncategorized"}</span>
            <span className="w-1 h-1 bg-taupe rounded-full" />
            <div className="flex items-center space-x-1">
              <Clock size={14} />
              <span>{Math.ceil(post.content?.split(" ").length / 200) || 5} min read</span>
            </div>
          </div>
          <h1 className="text-4xl md:text-6xl font-serif font-bold text-deep-brown leading-tight">
            {post.title}
          </h1>
          <div className="flex items-center justify-center space-x-6 text-taupe font-medium">
            <div className="flex items-center space-x-2">
              <Calendar size={18} />
              <span>{new Date(post.published_at).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center space-x-2">
              <User size={18} />
              <span>{post.author_name}</span>
            </div>
          </div>
        </div>

        <div className="aspect-video rounded-3xl overflow-hidden shadow-2xl">
          <img 
            src={post.featured_image_url || "https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&q=80&w=1973"} 
            alt={post.title} 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>

        <div className="flex justify-center space-x-4 py-4 border-y border-primary/10">
          <button className="flex items-center space-x-2 px-4 py-2 hover:text-primary transition-colors font-bold text-taupe">
            <Share2 size={18} />
            <span>Share</span>
          </button>
          <button className="flex items-center space-x-2 px-4 py-2 hover:text-primary transition-colors font-bold text-taupe">
            <MessageCircle size={18} />
            <span>Comment</span>
          </button>
        </div>

        <div className="markdown-body prose prose-lg prose-primary max-w-none text-deep-brown/80 leading-relaxed">
          <ReactMarkdown
            components={{
              img({ src, alt }) {
                return (
                  <figure className="my-8">
                    <img
                      src={src}
                      alt={alt || ''}
                      className="w-full rounded-2xl shadow-lg object-cover"
                      referrerPolicy="no-referrer"
                    />
                    {alt && (
                      <figcaption className="mt-3 text-center text-sm text-taupe italic">
                        {alt}
                      </figcaption>
                    )}
                  </figure>
                );
              },
            }}
          >
            {post.content}
          </ReactMarkdown>
        </div>

        <div className="mt-16 pt-12 border-t border-primary/10">
          <div className="bg-secondary/20 p-8 rounded-3xl flex flex-col md:flex-row items-center gap-8">
            <div className="w-24 h-24 rounded-full overflow-hidden shadow-lg shrink-0">
              <img 
                src={settings?.author_profile_image_url || "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=2070"}
                alt="Author" 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="space-y-3 text-center md:text-left">
              <h3 className="text-xl font-serif font-bold text-deep-brown">About {settings?.author_name || post?.author_name}</h3>
              <p className="text-deep-brown/70 leading-relaxed">
                {settings?.author_bio || "Author bio goes here."}
              </p>
              <Link to="/admin/settings" className="text-primary font-bold hover:underline">View Profile</Link>
            </div>
          </div>
        </div>
      </motion.article>
    </div>
  );
}
