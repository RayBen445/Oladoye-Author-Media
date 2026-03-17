import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Books from "./pages/Books";
import BookDetail from "./pages/BookDetail";
import Blog from "./pages/Blog";
import BlogPostDetail from "./pages/BlogPostDetail";
import AdminDashboard from "./pages/admin/Dashboard";
import AdminBooks from "./pages/admin/Books";
import AdminBlog from "./pages/admin/Blog";
import AdminSettings from "./pages/admin/Settings";
import AdminMediaLibrary from "./pages/admin/MediaLibrary";
import AdminSubscribers from "./pages/admin/Subscribers";
import AdminNewsletterHistory from "./pages/admin/NewsletterHistory";
import AdminComments from "./pages/admin/Comments";
import AdminReviews from "./pages/admin/Reviews";
import Login from "./pages/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import DatabaseSetup from "./components/DatabaseSetup";
import { useSiteSettings } from "./hooks/useSiteSettings";
import { Loader2 } from "lucide-react";
import { useAnalytics } from "./hooks/useAnalytics";
import { ToastProvider } from "./components/Toast";


function AnalyticsTracker() {
  useAnalytics();
  return null;
}

export default function App() {
    const { settings, error, loading } = useSiteSettings();

  // Check if the error is "relation does not exist" (Postgres code 42P01)
  // Supabase error messages often contain the table name
  const isMissingTable = error?.includes('relation') || error?.includes('cache');

  useEffect(() => {
    if (settings?.favicon_url) {
      let link = document.querySelector<HTMLLinkElement>("link[rel~='icon']");
      if (!link) {
        link = document.createElement('link') as HTMLLinkElement;
        link.rel = 'icon';
        document.head.appendChild(link);
      }
      link.href = settings.favicon_url;
    }
  }, [settings?.favicon_url]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-50">
        <Loader2 className="w-8 h-8 animate-spin text-stone-400" />
      </div>
    );
  }

  if (isMissingTable) {
    return <DatabaseSetup />;
  }

  return (
    <ToastProvider>
      <Router>
        <AnalyticsTracker />
        <div className="min-h-screen flex flex-col">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/books" element={<Books />} />
              <Route path="/books/:slug" element={<BookDetail />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/blog/:slug" element={<BlogPostDetail />} />
              <Route path="/login" element={<Login />} />
              
              {/* Protected Admin Routes */}
              <Route element={<ProtectedRoute />}>
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/admin/books" element={<AdminBooks />} />
                <Route path="/admin/blog" element={<AdminBlog />} />
                <Route path="/admin/comments" element={<AdminComments />} />
                <Route path="/admin/reviews" element={<AdminReviews />} />
                <Route path="/admin/subscribers" element={<AdminSubscribers />} />
                <Route path="/admin/newsletters" element={<AdminNewsletterHistory />} />
                <Route path="/admin/settings" element={<AdminSettings />} />
                <Route path="/admin/media" element={<AdminMediaLibrary />} />
              </Route>
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </ToastProvider>
  );
}
