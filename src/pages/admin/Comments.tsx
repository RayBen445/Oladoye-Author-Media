import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabase";
import { Loader2, Trash2, MessageCircle, CheckCircle, XCircle } from "lucide-react";
import { useToast } from "../../components/Toast";

type Comment = {
  id: string;
  post_id: string;
  author_name: string;
  content: string;
  created_at: string;
  approved: boolean;
  blog_posts: {
    title: string;
  };
};

import AdminLayout from "../../components/AdminLayout";

export default function AdminComments() {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [processingBulk, setProcessingBulk] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    fetchComments();
  }, []);

  async function fetchComments() {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("comments")
        .select(`
          id,
          post_id,
          author_name,
          content,
          approved,
          created_at,
          blog_posts ( title )
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setComments(data as unknown as Comment[]);
    } catch (error: any) {
      console.error("Error fetching comments:", error);
      showToast(error.message || "Failed to fetch comments", "error");
    } finally {
      setLoading(false);
    }
  }


  const toggleSelection = (id: string) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedIds(newSelected);
  };

  const toggleAll = () => {
    if (selectedIds.size === comments.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(comments.map(c => c.id)));
    }
  };

  const handleBulkAction = async (action: 'approve' | 'reject' | 'delete') => {
    if (selectedIds.size === 0) return;

    if (action === 'delete' && !window.confirm(`Are you sure you want to delete ${selectedIds.size} comments?`)) {
      return;
    }

    setProcessingBulk(true);
    try {
      const idsArray = Array.from(selectedIds);

      if (action === 'delete') {
        const { error } = await supabase.from('comments').delete().in('id', idsArray);
        if (error) throw error;
        setComments(current => current.filter(c => !selectedIds.has(c.id)));
        showToast(`${idsArray.length} comments deleted`, 'success');
      } else {
        const isApproved = action === 'approve';
        const { error } = await supabase.from('comments').update({ approved: isApproved }).in('id', idsArray);
        if (error) throw error;
        setComments(current => current.map(c => selectedIds.has(c.id) ? { ...c, approved: isApproved } : c));
        showToast(`${idsArray.length} comments ${action}d`, 'success');
      }
      setSelectedIds(new Set());
    } catch (err: any) {
      console.error('Bulk action failed:', err);
      showToast(err.message || 'Action failed', 'error');
    } finally {
      setProcessingBulk(false);
    }
  };

  const toggleApproval = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase.from('comments').update({ approved: !currentStatus }).eq('id', id);
      if (error) throw error;
      setComments(current => current.map(c => c.id === id ? { ...c, approved: !currentStatus } : c));
      showToast(`Comment ${!currentStatus ? 'approved' : 'hidden'}`, 'success');
    } catch (err: any) {
      showToast(err.message, 'error');
    }
  };

  async function handleDelete(id: string) {
    if (!window.confirm("Are you sure you want to delete this comment?")) return;

    setDeleting(id);
    try {
      const { error } = await supabase.from("comments").delete().eq("id", id);
      if (error) throw error;

      setComments((current) => current.filter((c) => c.id !== id));
      showToast("Comment deleted successfully", "success");
    } catch (error: any) {
      console.error("Error deleting comment:", error);
      showToast(error.message || "Failed to delete comment", "error");
    } finally {
      setDeleting(null);
    }
  }

  if (loading) {
    return (
    <AdminLayout>
      <div className="flex justify-center items-center h-64">
        <Loader2 className="animate-spin text-primary" size={32} />
      </div>
    </AdminLayout>
    );
  }

  return (
    <AdminLayout>
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-serif font-bold text-deep-brown">Comments</h1>
          <p className="text-taupe mt-2">Manage reader comments on your blog posts.</p>
        </div>
      </div>


      {comments.length > 0 && (
        <div className="flex items-center justify-between bg-white p-4 rounded-2xl shadow-sm border border-primary/10 mb-4">
          <div className="flex items-center space-x-4">
            <input
              type="checkbox"
              checked={selectedIds.size === comments.length && comments.length > 0}
              onChange={toggleAll}
              className="w-5 h-5 rounded border-primary/20 text-primary focus:ring-primary"
            />
            <span className="text-sm font-bold text-taupe uppercase tracking-widest">{selectedIds.size} Selected</span>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => handleBulkAction('approve')}
              disabled={selectedIds.size === 0 || processingBulk}
              className="px-4 py-2 bg-emerald-100 text-emerald-700 hover:bg-emerald-200 rounded-xl font-bold text-sm transition-colors disabled:opacity-50"
            >
              Approve
            </button>
            <button
              onClick={() => handleBulkAction('reject')}
              disabled={selectedIds.size === 0 || processingBulk}
              className="px-4 py-2 bg-amber-100 text-amber-700 hover:bg-amber-200 rounded-xl font-bold text-sm transition-colors disabled:opacity-50"
            >
              Reject
            </button>
            <button
              onClick={() => handleBulkAction('delete')}
              disabled={selectedIds.size === 0 || processingBulk}
              className="px-4 py-2 bg-red-100 text-red-700 hover:bg-red-200 rounded-xl font-bold text-sm transition-colors disabled:opacity-50"
            >
              Delete
            </button>
          </div>
        </div>
      )}

      <div className="bg-white rounded-3xl p-8 shadow-sm border border-primary/10">
        {comments.length === 0 ? (
          <div className="text-center py-12 text-taupe">
            <MessageCircle className="mx-auto h-12 w-12 text-primary/20 mb-4" />
            <p>No comments found.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {comments.map((comment) => (

              <div key={comment.id} className="flex flex-col md:flex-row justify-between items-start gap-6 p-6 bg-soft-cream/30 rounded-2xl border border-primary/5 hover:border-primary/20 transition-colors">
                <div className="flex items-start space-x-4 flex-1">
                  <input
                    type="checkbox"
                    checked={selectedIds.has(comment.id)}
                    onChange={() => toggleSelection(comment.id)}
                    className="mt-1.5 w-5 h-5 rounded border-primary/20 text-primary focus:ring-primary"
                  />
                  <div className="space-y-3 flex-1">
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="font-bold text-deep-brown">{comment.author_name}</span>
                      <span className="text-xs text-taupe bg-white px-2 py-1 rounded-md border border-primary/10">
                        on: {comment.blog_posts?.title || "Unknown Post"}
                      </span>
                      <span className="text-xs text-taupe/60">
                        {new Date(comment.created_at).toLocaleString()}
                      </span>
                      {!comment.approved && (
                        <span className="text-[10px] uppercase tracking-widest font-bold bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">
                          Pending
                        </span>
                      )}
                    </div>
                    <p className="text-deep-brown/80 leading-relaxed whitespace-pre-wrap">
                      {comment.content}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-2 shrink-0">
                  <button
                    onClick={() => toggleApproval(comment.id, comment.approved)}
                    className={`p-2 rounded-xl transition-colors ${comment.approved ? 'text-amber-600 hover:bg-amber-50' : 'text-emerald-600 hover:bg-emerald-50'}`}
                    title={comment.approved ? "Hide Comment" : "Approve Comment"}
                  >
                    {comment.approved ? <XCircle size={20} /> : <CheckCircle size={20} />}
                  </button>
                  <button
                    onClick={() => handleDelete(comment.id)}
                    disabled={deleting === comment.id}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                    title="Delete Comment"
                  >
                    {deleting === comment.id ? <Loader2 className="animate-spin" size={20} /> : <Trash2 size={20} />}
                  </button>
                </div>
              </div>

            ))}
          </div>
        )}
      </div>
    </div>
    </AdminLayout>
  );
}
