import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import type { NewsletterCampaign } from '../../lib/supabase';
import AdminLayout from '../../components/AdminLayout';
import {
  Mail, Loader2, Search, Eye, X, CheckCircle2, AlertCircle,
  Calendar, Users, ChevronRight, ChevronLeft, Send,
} from 'lucide-react';

export default function AdminNewsletterHistory() {
  const [campaigns, setCampaigns] = useState<NewsletterCampaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [preview, setPreview] = useState<NewsletterCampaign | null>(null);

  // ── Pagination ────────────────────────────────────────────────────────────
  const PAGE_SIZE = 10;
  const [page, setPage] = useState(1);

  // ── Fetch ─────────────────────────────────────────────────────────────────
  const fetchCampaigns = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('newsletter_campaigns')
        .select('*')
        .order('sent_at', { ascending: false });
      if (error) throw error;
      setCampaigns(data || []);
    } catch (err: any) {
      console.error('Error fetching newsletter campaigns:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCampaigns(); }, []);

  // ── Derived ───────────────────────────────────────────────────────────────
  const filtered = campaigns.filter(c =>
    c.subject.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const totalDelivered = campaigns.reduce((s, c) => s + c.delivered, 0);
  const totalRecipients = campaigns.reduce((s, c) => s + c.recipient_count, 0);

  // reset to page 1 when search changes
  useEffect(() => { setPage(1); }, [searchTerm]);

  // ── Preview helpers ───────────────────────────────────────────────────────
  const renderPreviewBody = (c: NewsletterCampaign) => {
    if (c.content_type === 'html') {
      // Render raw HTML inside a sandboxed iframe via a blob URL
      return (
        <iframe
          title="Newsletter preview"
          srcDoc={c.content}
          sandbox="allow-same-origin"
          className="w-full flex-grow border-0 rounded-b-2xl"
          style={{ minHeight: 480 }}
        />
      );
    }
    // For Markdown, show plain text with whitespace preserved
    return (
      <pre className="flex-grow overflow-y-auto p-6 text-sm text-deep-brown/80 whitespace-pre-wrap font-sans leading-relaxed">
        {c.content}
      </pre>
    );
  };

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <AdminLayout>
      <main className="p-8">
        <div className="max-w-6xl mx-auto space-y-8">

          {/* ── Page header ── */}
          <div className="flex flex-wrap justify-between items-center gap-4">
            <div>
              <h1 className="text-3xl font-serif font-bold text-deep-brown">Newsletter History</h1>
              <p className="text-taupe font-medium">Browse every newsletter you've sent to your subscribers.</p>
            </div>
          </div>

          {/* ── Summary cards ── */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              {
                label: 'Total Campaigns',
                value: campaigns.length,
                icon: Send,
                color: 'bg-primary/10 text-primary',
              },
              {
                label: 'Total Recipients',
                value: totalRecipients,
                icon: Users,
                color: 'bg-purple-100 text-purple-600',
              },
              {
                label: 'Emails Delivered',
                value: totalDelivered,
                icon: CheckCircle2,
                color: 'bg-emerald-100 text-emerald-600',
              },
            ].map(card => {
              const Icon = card.icon;
              return (
                <div key={card.label} className="bg-white rounded-2xl shadow-sm border border-primary/5 p-5 flex items-center space-x-4">
                  <div className={`p-3 rounded-xl shrink-0 ${card.color}`}>
                    <Icon size={22} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-taupe uppercase tracking-widest">{card.label}</p>
                    <p className="text-2xl font-bold text-deep-brown">{card.value}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* ── Search ── */}
          <div className="bg-white rounded-2xl shadow-sm border border-primary/5 overflow-hidden">
            <div className="p-5 border-b border-primary/5 flex items-center space-x-4">
              <div className="relative flex-grow">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-taupe" size={18} />
                <input
                  type="text"
                  placeholder="Search by subject…"
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="w-full pl-11 pr-4 py-2.5 bg-soft-cream/30 border-none rounded-xl focus:ring-2 focus:ring-primary/20 text-sm"
                />
              </div>
              <p className="text-xs font-bold text-taupe shrink-0">
                {filtered.length} campaign{filtered.length !== 1 ? 's' : ''}
              </p>
            </div>

            {/* ── Campaign list ── */}
            {loading ? (
              <div className="p-20 flex justify-center">
                <Loader2 className="w-8 h-8 text-primary animate-spin" />
              </div>
            ) : paginated.length === 0 ? (
              <div className="p-20 text-center">
                <Mail className="w-12 h-12 text-taupe/30 mx-auto mb-4" />
                <p className="text-taupe font-medium">
                  {searchTerm ? 'No campaigns match your search.' : 'No newsletters sent yet.'}
                </p>
              </div>
            ) : (
              <div className="divide-y divide-primary/5">
                {paginated.map(campaign => (
                  <div
                    key={campaign.id}
                    className="flex items-center gap-4 px-6 py-4 hover:bg-soft-cream/20 transition-colors group"
                  >
                    {/* Icon */}
                    <div className="shrink-0 p-2.5 bg-primary/8 rounded-xl text-primary">
                      <Mail size={18} />
                    </div>

                    {/* Main info */}
                    <div className="flex-grow min-w-0">
                      <p className="font-bold text-deep-brown truncate group-hover:text-primary transition-colors">
                        {campaign.subject}
                      </p>
                      <div className="flex flex-wrap items-center gap-3 mt-1">
                        <span className="flex items-center gap-1 text-xs text-taupe font-medium">
                          <Calendar size={12} />
                          {new Date(campaign.sent_at).toLocaleDateString('en-US', {
                            year: 'numeric', month: 'short', day: 'numeric',
                            hour: '2-digit', minute: '2-digit',
                          })}
                        </span>
                        <span className="flex items-center gap-1 text-xs text-taupe font-medium">
                          <Users size={12} />
                          {campaign.recipient_count} recipient{campaign.recipient_count !== 1 ? 's' : ''}
                        </span>
                        <span className="flex items-center gap-1 text-xs font-medium text-emerald-600">
                          <CheckCircle2 size={12} />
                          {campaign.delivered} delivered
                        </span>
                        {campaign.failed > 0 && (
                          <span className="flex items-center gap-1 text-xs font-medium text-red-500">
                            <AlertCircle size={12} />
                            {campaign.failed} failed
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Badges */}
                    <div className="flex items-center gap-2 shrink-0">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                        campaign.content_type === 'html'
                          ? 'bg-blue-100 text-blue-600'
                          : 'bg-amber-100 text-amber-700'
                      }`}>
                        {campaign.content_type}
                      </span>
                      {campaign.simulated && (
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest bg-gray-100 text-gray-500">
                          Simulated
                        </span>
                      )}
                    </div>

                    {/* Preview button */}
                    <button
                      onClick={() => setPreview(campaign)}
                      className="shrink-0 flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-primary border border-primary/20 rounded-lg hover:bg-primary/5 transition-colors"
                    >
                      <Eye size={14} />
                      <span>View</span>
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* ── Pagination ── */}
            {totalPages > 1 && (
              <div className="px-6 py-4 border-t border-primary/5 flex items-center justify-between">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-taupe border border-primary/10 rounded-lg hover:bg-primary/5 disabled:opacity-40 transition-colors"
                >
                  <ChevronLeft size={14} /> Prev
                </button>
                <span className="text-xs font-medium text-taupe">
                  Page {page} of {totalPages}
                </span>
                <button
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-taupe border border-primary/10 rounded-lg hover:bg-primary/5 disabled:opacity-40 transition-colors"
                >
                  Next <ChevronRight size={14} />
                </button>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* ══════════════════════════════════════════════════════════════════════
          Newsletter Preview Modal
      ══════════════════════════════════════════════════════════════════════ */}
      {preview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-deep-brown/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl border border-primary/10 overflow-hidden">

            {/* Modal header */}
            <div className="px-6 py-5 border-b border-primary/5 flex items-start gap-4 bg-soft-cream/30 shrink-0">
              <div className="p-2 bg-primary/10 rounded-lg text-primary shrink-0 mt-0.5">
                <Mail size={20} />
              </div>
              <div className="flex-grow min-w-0">
                <h2 className="text-lg font-serif font-bold text-deep-brown leading-tight truncate">
                  {preview.subject}
                </h2>
                <div className="flex flex-wrap items-center gap-3 mt-1.5">
                  <span className="flex items-center gap-1 text-xs text-taupe font-medium">
                    <Calendar size={12} />
                    {new Date(preview.sent_at).toLocaleDateString('en-US', {
                      year: 'numeric', month: 'long', day: 'numeric',
                      hour: '2-digit', minute: '2-digit',
                    })}
                  </span>
                  <span className="flex items-center gap-1 text-xs text-taupe font-medium">
                    <Users size={12} />
                    {preview.recipient_count} recipients
                  </span>
                  <span className="flex items-center gap-1 text-xs font-medium text-emerald-600">
                    <CheckCircle2 size={12} />
                    {preview.delivered} delivered
                  </span>
                  {preview.failed > 0 && (
                    <span className="flex items-center gap-1 text-xs font-medium text-red-500">
                      <AlertCircle size={12} />
                      {preview.failed} failed
                    </span>
                  )}
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                    preview.content_type === 'html'
                      ? 'bg-blue-100 text-blue-600'
                      : 'bg-amber-100 text-amber-700'
                  }`}>
                    {preview.content_type}
                  </span>
                  {preview.simulated && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-gray-100 text-gray-500">
                      Simulated
                    </span>
                  )}
                </div>
              </div>
              <button
                onClick={() => setPreview(null)}
                className="p-2 hover:bg-accent/5 text-taupe hover:text-accent rounded-full transition-all shrink-0"
              >
                <X size={22} />
              </button>
            </div>

            {/* Content */}
            <div className="flex-grow overflow-hidden flex flex-col">
              {renderPreviewBody(preview)}
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
