import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import AdminLayout from '../../components/AdminLayout';
import { Mail, Trash2, Loader2, Search, Download, Send, X, Sparkles } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import { useSiteSettings } from '../../hooks/useSiteSettings';

interface Subscriber {
  id: string;
  email: string;
  created_at: string;
}

export default function AdminSubscribers() {
  const { settings } = useSiteSettings();
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [subject, setSubject] = useState('');
  const [content, setContent] = useState('');
  const [sending, setSending] = useState(false);
  const [generating, setGenerating] = useState(false);

  const fetchSubscribers = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('subscribers')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setSubscribers(data || []);
    } catch (error: any) {
      console.error('Error fetching subscribers:', error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscribers();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to remove this subscriber?')) return;

    try {
      const { error } = await supabase
        .from('subscribers')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setSubscribers(subscribers.filter(s => s.id !== id));
    } catch (error: any) {
      alert('Error deleting subscriber: ' + error.message);
    }
  };

  const filteredSubscribers = subscribers.filter(s => 
    s.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const exportCSV = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + "Email,Joined Date\n"
      + subscribers.map(s => `${s.email},${new Date(s.created_at).toLocaleDateString()}`).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "subscribers.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSendNewsletter = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject || !content) return;
    if (subscribers.length === 0) {
      alert("You have no subscribers to send to.");
      return;
    }

    try {
      setSending(true);
      const response = await fetch('/api/send-newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject,
          content,
          subscribers: subscribers.map(s => s.email),
          siteName: settings?.site_name || 'Oladoye Author Media',
          authorName: settings?.author_name || 'The Author',
        })
      });

      const data = await response.json();
      if (data.success) {
        if (data.simulated) {
          alert("Newsletter simulation complete! Note: Actual emails were NOT sent because SMTP credentials are not configured in the environment variables. Please check .env.example for required variables.");
        } else {
          alert(data.message);
        }
        setIsModalOpen(false);
        setSubject('');
        setContent('');
      } else {
        throw new Error(data.error || "Failed to send newsletter");
      }
    } catch (error: any) {
      alert("Error: " + error.message);
    } finally {
      setSending(false);
    }
  };

  const handleGenerateDraft = async () => {
    try {
      setGenerating(true);
      
      // Fetch recent content to provide context to Gemini
      const { data: recentPosts } = await supabase
        .from('blog_posts')
        .select('title, excerpt')
        .order('published_at', { ascending: false })
        .limit(3);

      const { data: recentBooks } = await supabase
        .from('books')
        .select('title, description')
        .order('created_at', { ascending: false })
        .limit(2);

      const ai = new GoogleGenAI({ apiKey: (process.env.GEMINI_API_KEY as string) });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `You are a professional newsletter writer for an author. 
        Create a compelling newsletter draft based on the following recent content:
        Blog Posts: ${JSON.stringify(recentPosts)}
        Books: ${JSON.stringify(recentBooks)}
        
        The newsletter should be engaging, personal, and encourage readers to check out the new content.
        Provide the output in JSON format with "subject" and "content" (markdown) fields.`,
        config: {
          responseMimeType: "application/json"
        }
      });

      const result = JSON.parse(response.text || '{}');
      if (result.subject) setSubject(result.subject);
      if (result.content) setContent(result.content);
    } catch (error: any) {
      console.error("Error generating draft:", error);
      alert("Failed to generate draft. Please try again.");
    } finally {
      setGenerating(false);
    }
  };

  return (
    <AdminLayout>
      <main className="p-8">
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-serif font-bold text-deep-brown">Subscribers</h1>
              <p className="text-taupe font-medium">Manage your mailing list and reader engagement.</p>
            </div>
            <div className="flex space-x-4">
              <button 
                onClick={() => setIsModalOpen(true)}
                className="px-6 py-3 bg-primary text-white rounded-xl font-bold flex items-center space-x-2 hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
              >
                <Send size={20} />
                <span>Send Newsletter</span>
              </button>
              <button 
                onClick={exportCSV}
                className="px-6 py-3 bg-white border border-primary/10 text-primary rounded-xl font-bold flex items-center space-x-2 hover:bg-primary/5 transition-all"
              >
                <Download size={20} />
                <span>Export CSV</span>
              </button>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-primary/5 overflow-hidden">
            <div className="p-6 border-b border-primary/5 flex items-center space-x-4">
              <div className="relative flex-grow">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-taupe" size={20} />
                <input 
                  type="text" 
                  placeholder="Search by email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-soft-cream/30 border-none rounded-xl focus:ring-2 focus:ring-primary/20 transition-all"
                />
              </div>
              <div className="text-sm font-bold text-taupe uppercase tracking-widest">
                {filteredSubscribers.length} Total
              </div>
            </div>

            <div className="overflow-x-auto">
              {loading ? (
                <div className="p-20 flex justify-center">
                  <Loader2 className="w-8 h-8 text-primary animate-spin" />
                </div>
              ) : filteredSubscribers.length === 0 ? (
                <div className="p-20 text-center">
                  <Mail className="w-12 h-12 text-taupe/30 mx-auto mb-4" />
                  <p className="text-taupe font-medium">No subscribers found.</p>
                </div>
              ) : (
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-soft-cream/30 text-taupe text-xs font-bold uppercase tracking-widest">
                      <th className="px-6 py-4">Email Address</th>
                      <th className="px-6 py-4">Joined Date</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-primary/5">
                    {filteredSubscribers.map((subscriber) => (
                      <tr key={subscriber.id} className="hover:bg-soft-cream/20 transition-colors">
                        <td className="px-6 py-4 font-bold text-deep-brown">
                          {subscriber.email}
                        </td>
                        <td className="px-6 py-4 text-taupe font-medium">
                          {new Date(subscriber.created_at).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button 
                            onClick={() => handleDelete(subscriber.id)}
                            className="p-2 text-accent hover:bg-accent/5 rounded-lg transition-colors"
                            title="Remove Subscriber"
                          >
                            <Trash2 size={18} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Newsletter Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-deep-brown/40 backdrop-blur-sm">
          <div className="bg-white rounded-3xl w-full max-w-3xl shadow-2xl overflow-hidden border border-primary/10">
            <div className="p-6 border-b border-primary/5 flex justify-between items-center bg-soft-cream/30">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-primary/10 rounded-lg text-primary">
                  <Mail size={24} />
                </div>
                <div>
                  <h2 className="text-xl font-serif font-bold text-deep-brown">Send Newsletter</h2>
                  <p className="text-xs text-taupe font-medium">Sending to {subscribers.length} subscribers</p>
                </div>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-2 hover:bg-accent/5 text-taupe hover:text-accent rounded-full transition-all"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSendNewsletter} className="p-8 space-y-6">
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleGenerateDraft}
                  disabled={generating}
                  className="text-sm font-bold text-primary flex items-center space-x-2 hover:text-primary/80 transition-colors disabled:opacity-50"
                >
                  {generating ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <Sparkles size={16} />
                  )}
                  <span>{generating ? 'Generating Draft...' : 'Generate AI Draft'}</span>
                </button>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-taupe uppercase tracking-widest">Subject Line</label>
                <input 
                  type="text"
                  required
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="e.g. New Book Release: The Whispering Woods"
                  className="w-full px-4 py-3 bg-soft-cream/30 border-none rounded-xl focus:ring-2 focus:ring-primary/20 transition-all font-medium"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-taupe uppercase tracking-widest">Email Content (Markdown Supported)</label>
                <textarea 
                  required
                  rows={12}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Write your update here..."
                  className="w-full px-4 py-3 bg-soft-cream/30 border-none rounded-xl focus:ring-2 focus:ring-primary/20 transition-all font-medium resize-none"
                />
              </div>

              <div className="pt-4 flex justify-end space-x-4">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-8 py-3 text-taupe font-bold hover:text-deep-brown transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={sending || !subject || !content}
                  className="px-10 py-3 bg-primary text-white rounded-xl font-bold flex items-center space-x-2 hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {sending ? (
                    <Loader2 size={20} className="animate-spin" />
                  ) : (
                    <Send size={20} />
                  )}
                  <span>{sending ? 'Sending...' : 'Send to All Subscribers'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
