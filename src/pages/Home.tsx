import { motion } from "motion/react";
import { ArrowRight, BookOpen, Star, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useFeaturedBooks } from "../hooks/useBooks";
import { useBlogPosts } from "../hooks/useBlogPosts";
import { useMediaHome } from "../hooks/useMediaHome";
import { PlayCircle, Clock, Calendar, Headphones, Video as VideoIcon } from "lucide-react";
import { useSiteSettings } from "../hooks/useSiteSettings";
import CustomAudioPlayer from "../components/CustomAudioPlayer";
import Newsletter from "../components/Newsletter";
import WhatsAppForm from "../components/WhatsAppForm";

export default function Home() {
  const { books: featuredBooks, loading: booksLoading } = useFeaturedBooks();
  const { posts: latestPosts, loading: postsLoading } = useBlogPosts();
  const { settings } = useSiteSettings();
  const { podcasts: latestPodcasts, videos: latestVideos, loading: mediaLoading } = useMediaHome();

  const authorName = settings?.author_name || "Author";
  const authorBio = settings?.author_bio || "A brief bio about the author.";
  const authorImage = settings?.author_profile_image_url || "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=2070";
  const tagline = settings?.tagline || "Stories That Breathe Life";

  const getEmbedUrl = (url: string) => {
    if (!url) return null;
    let embedUrl = null;

    const ytMatch = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})/);
    if (ytMatch && ytMatch[1]) {
      embedUrl = `https://www.youtube.com/embed/${ytMatch[1]}`;
    }

    const vimeoMatch = url.match(/vimeo\.com\/(?:video\/)?([0-9]+)/);
    if (vimeoMatch && vimeoMatch[1]) {
      embedUrl = `https://player.vimeo.com/video/${vimeoMatch[1]}`;
    }

    return embedUrl;
  };


  return (
    <div className="space-y-20 pb-20">
      {/* Hero Section */}
      <section className="relative h-[80vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1495446815901-a7297e633e8d?auto=format&fit=crop&q=80&w=2070" 
            alt="Library" 
            className="w-full h-full object-cover opacity-20"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-soft-cream via-soft-cream/80 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-b from-soft-cream/0 via-soft-cream/50 to-soft-cream opacity-80" />
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-2xl"
          >
            <span className="inline-block px-3 py-1 bg-accent/10 text-accent rounded-full text-sm font-semibold mb-4 tracking-wide uppercase">
              Welcome to the Library
            </span>
            <h1 className="text-5xl md:text-8xl font-serif font-bold text-transparent bg-clip-text bg-gradient-to-br from-deep-brown via-primary to-accent leading-tight mb-6 drop-shadow-sm">
              {tagline.split(' ').map((word, i) => (
                <span key={i}>
                  {word === 'Breathe' ? <span className="text-accent italic drop-shadow-md">{word}</span> : word}{' '}
                </span>
              ))}
            </h1>
            <p className="text-xl text-deep-brown/80 mb-8 leading-relaxed">
              Explore the worlds crafted by {authorName}. From epic fantasies to intimate memoirs, discover your next favorite read.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/books" className="px-8 py-4 bg-primary text-soft-cream rounded-full font-bold flex items-center space-x-2 hover:bg-primary/90 transition-all shadow-lg hover:shadow-primary/20">
                <span>Browse Catalog</span>
                <BookOpen size={20} />
              </Link>
              <Link to="/blog" className="px-8 py-4 bg-white border-2 border-primary/20 text-primary rounded-full font-bold flex items-center space-x-2 hover:bg-primary/5 transition-all">
                <span>Read the Blog</span>
                <ArrowRight size={20} />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Featured Books */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-deep-brown mb-2">Featured Works</h2>
            <p className="text-taupe font-medium">Hand-picked selections from the library</p>
          </div>
          <Link to="/books" className="text-primary font-bold flex items-center space-x-1 hover:underline">
            <span>View All</span>
            <ArrowRight size={16} />
          </Link>
        </div>

        {booksLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="animate-spin text-primary" size={40} />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredBooks.map((book, i) => (
              <motion.div 
                key={book.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -10 }}
                className="bg-white rounded-2xl overflow-hidden shadow-sm border border-primary/5 group"
              >
                <Link to={`/books/${book.slug}`}>
                  <div className="aspect-[2/3] overflow-hidden relative">
                    <img 
                      src={book.cover_image_url || `https://picsum.photos/seed/${book.id}/600/900`} 
                      alt={book.title} 
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm p-2 rounded-full text-accent shadow-sm">
                      <Star size={18} fill="currentColor" />
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center space-x-2 text-xs font-bold text-taupe uppercase tracking-widest mb-2">
                      <span>{book.genre}</span>
                      <span className="w-1 h-1 bg-taupe rounded-full" />
                      <span>{new Date(book.release_date).getFullYear()}</span>
                    </div>
                    <h3 className="text-xl font-serif font-bold text-deep-brown mb-2 group-hover:text-primary transition-colors">
                      {book.title}
                    </h3>
                    <p className="text-deep-brown/60 text-sm line-clamp-2 mb-4">
                      {book.description}
                    </p>
                    <div className="text-primary font-bold text-sm flex items-center space-x-1">
                      <span>Explore Details</span>
                      <ArrowRight size={14} />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
            {featuredBooks.length === 0 && (
              <div className="col-span-3 text-center py-20 bg-white rounded-3xl border border-dashed border-primary/20">
                <p className="text-taupe font-medium italic">No featured books yet. Check back soon!</p>
              </div>
            )}
          </div>
        )}
      </section>


      {/* Featured Blog Posts */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-deep-brown mb-2">From the Blog</h2>
            <p className="text-taupe font-medium">Latest thoughts and reflections</p>
          </div>
          <Link to="/blog" className="text-primary font-bold flex items-center space-x-1 hover:underline">
            <span>View All</span>
            <ArrowRight size={16} />
          </Link>
        </div>

        {postsLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="animate-spin text-primary" size={40} />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {latestPosts.slice(0, 3).map((post, i) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -10 }}
                className="bg-white rounded-2xl overflow-hidden shadow-sm border border-primary/5 group"
              >
                <Link to={`/blog/${post.slug}`}>
                  <div className="aspect-video overflow-hidden relative">
                    <img
                      src={post.featured_image_url || `https://picsum.photos/seed/${post.id}/800/450`}
                      alt={post.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="p-6">
                    <div className="flex items-center space-x-2 text-xs font-bold text-taupe uppercase tracking-widest mb-2">
                      <span>{post.genre || "Uncategorized"}</span>
                      <span className="w-1 h-1 bg-taupe rounded-full" />
                      <span>{new Date(post.published_at).toLocaleDateString()}</span>
                    </div>
                    <h3 className="text-xl font-serif font-bold text-deep-brown mb-2 group-hover:text-primary transition-colors line-clamp-2">
                      {post.title}
                    </h3>
                    <p className="text-deep-brown/60 text-sm line-clamp-2 mb-4">
                      {post.excerpt}
                    </p>
                    <div className="text-primary font-bold text-sm flex items-center space-x-1">
                      <span>Read More</span>
                      <ArrowRight size={14} />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
            {latestPosts.length === 0 && (
              <div className="col-span-3 text-center py-20 bg-white rounded-3xl border border-dashed border-primary/20">
                <p className="text-taupe font-medium italic">No blog posts yet. Check back soon!</p>
              </div>
            )}
          </div>
        )}
      </section>



      {/* Latest Podcasts */}
      {(latestPodcasts.length > 0 || mediaLoading) && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-deep-brown mb-2">Latest Podcasts</h2>
              <p className="text-taupe font-medium">Conversations about writing and life</p>
            </div>
            <Link to="/podcasts" className="text-primary font-bold flex items-center space-x-1 hover:underline">
              <span>Listen All</span>
              <ArrowRight size={16} />
            </Link>
          </div>

          {mediaLoading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="animate-spin text-primary" size={40} />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {latestPodcasts.map((podcast, i) => (
                <motion.div
                  key={podcast.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  whileHover={{ y: -5 }}
                  className="bg-white rounded-3xl overflow-hidden shadow-sm border border-primary/5 flex flex-col sm:flex-row group"
                >
                  <Link to="/podcasts" className="sm:w-2/5 aspect-square sm:aspect-auto relative overflow-hidden bg-soft-cream block">
                    {podcast.cover_image_url ? (
                      <img
                        src={podcast.cover_image_url}
                        alt={podcast.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full flex justify-center items-center bg-primary/5">
                         <Headphones size={32} className="text-primary/30" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                      <div className="w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity transform scale-75 group-hover:scale-100">
                        <PlayCircle className="text-primary" size={24} />
                      </div>
                    </div>
                  </Link>

                  <div className="p-6 sm:w-3/5 flex flex-col justify-center">
                    <div className="flex items-center space-x-3 text-taupe text-xs font-bold uppercase tracking-widest mb-2">
                      <div className="flex items-center space-x-1"><Calendar size={12} /> <span>{new Date(podcast.published_at).toLocaleDateString()}</span></div>
                      {podcast.duration && <div className="flex items-center space-x-1"><Clock size={12} /> <span>{podcast.duration}</span></div>}
                    </div>

                    <h3 className="text-xl font-serif font-bold text-deep-brown mb-2 group-hover:text-primary transition-colors">
                      <Link to="/podcasts">{podcast.title}</Link>
                    </h3>

                    <p className="text-deep-brown/60 text-sm line-clamp-2 mb-4">
                      {podcast.description}
                    </p>


                    <div className="mt-auto pt-4">
                      <CustomAudioPlayer src={podcast.audio_url} />
                    </div>

                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </section>
      )}

      {/* Latest Videos */}
      {(latestVideos.length > 0 || mediaLoading) && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-deep-brown mb-2">Latest Videos</h2>
              <p className="text-taupe font-medium">Watch and learn</p>
            </div>
            <Link to="/videos" className="text-primary font-bold flex items-center space-x-1 hover:underline">
              <span>Watch All</span>
              <ArrowRight size={16} />
            </Link>
          </div>

          {mediaLoading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="animate-spin text-primary" size={40} />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {latestVideos.map((video, i) => (
                <motion.div
                  key={video.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-white rounded-3xl overflow-hidden shadow-sm border border-primary/5 group"
                >
                  <div className="aspect-video relative overflow-hidden bg-black flex items-center justify-center rounded-t-3xl border-b border-primary/10">
                     {getEmbedUrl(video.video_url) ? (
                       <iframe
                         src={getEmbedUrl(video.video_url)!}
                         className="w-full h-full"
                         allowFullScreen
                         title={video.title}
                         allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                       ></iframe>
                     ) : (
                       <video controls className="w-full h-full object-contain" poster={video.thumbnail_url}>
                         <source src={video.video_url} />
                         Your browser does not support the video tag.
                       </video>
                     )}
                  </div>

                  <div className="p-6">
                    <div className="flex items-center space-x-3 text-taupe text-xs font-bold uppercase tracking-widest mb-2">
                      <div className="flex items-center space-x-1"><Calendar size={12} /> <span>{new Date(video.published_at).toLocaleDateString()}</span></div>
                      {video.duration && <div className="flex items-center space-x-1"><Clock size={12} /> <span>{video.duration}</span></div>}
                    </div>

                    <h3 className="text-xl font-serif font-bold text-deep-brown mb-2">
                      <Link to="/videos" className="hover:text-primary transition-colors">{video.title}</Link>
                    </h3>

                    <p className="text-deep-brown/60 text-sm line-clamp-2">
                      {video.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </section>
      )}

      {/* Author Bio Snippet */}
      <section className="bg-secondary/30 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="relative">
              <div className="aspect-square rounded-2xl overflow-hidden shadow-2xl rotate-3">
                <img 
                  src={authorImage} 
                  alt={authorName} 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>
            <div className="space-y-6">
              <h2 className="text-4xl font-serif font-bold text-deep-brown">Meet {authorName}</h2>
              <div className="text-lg text-deep-brown/80 leading-relaxed space-y-4">
                {authorBio.split('\n').map((para, i) => (
                  <p key={i}>{para}</p>
                ))}
              </div>
              <Link to="/books" className="inline-block px-8 py-3 bg-deep-brown text-soft-cream rounded-full font-bold hover:bg-primary transition-colors">
                Explore My Works
              </Link>
            </div>
          </div>
        </div>
      </section>


      {/* Coaching / WhatsApp Form */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row gap-12 items-center">
            <div className="w-full md:w-1/2 space-y-6">
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-deep-brown">
                Looking for Guidance?
              </h2>
              <p className="text-lg text-deep-brown/80 leading-relaxed">
                Whether you want to learn how to write books, design them, or create engaging social media content, I'm here to help. Reach out directly via WhatsApp to discuss coaching opportunities.
              </p>
            </div>
            <div className="w-full md:w-1/2">
              <WhatsAppForm />
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter / CTA */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-primary rounded-3xl p-12 text-center text-soft-cream shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
            <div className="absolute top-0 left-0 w-64 h-64 bg-white rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl" />
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-accent rounded-full translate-x-1/2 translate-y-1/2 blur-3xl" />
          </div>
          
          <div className="relative z-10">
            <div className="max-w-md mx-auto">
              <Newsletter />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
