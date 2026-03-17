import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabase";
import { Loader2, Trash2, MessageCircle } from "lucide-react";
import { useToast } from "../../components/Toast";

type Comment = {
  id: string;
  post_id: string;
  author_name: string;
  content: string;
  created_at: string;
  blog_posts: {
    title: string;
  };
};

export default function AdminComments() {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);
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
      <div className="flex justify-center items-center h-64">
        <Loader2 className="animate-spin text-primary" size={32} />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-serif font-bold text-deep-brown">Comments</h1>
          <p className="text-taupe mt-2">Manage reader comments on your blog posts.</p>
        </div>
      </div>

      <div className="bg-white rounded-3xl p-8 shadow-sm border border-primary/10">
        {comments.length === 0 ? (
          <div className="text-center py-12 text-taupe">
            <MessageCircle className="mx-auto h-12 w-12 text-primary/20 mb-4" />
            <p>No comments found.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {comments.map((comment) => (
              <div key={comment.id} className="flex justify-between items-start p-6 bg-soft-cream/30 rounded-2xl border border-primary/5 hover:border-primary/20 transition-colors">
                <div className="space-y-2 flex-1 pr-6">
                  <div className="flex items-center space-x-3">
                    <span className="font-bold text-deep-brown">{comment.author_name}</span>
                    <span className="text-xs text-taupe bg-white px-2 py-1 rounded-md border border-primary/10">
                      on: {comment.blog_posts?.title || "Unknown Post"}
                    </span>
                    <span className="text-xs text-taupe/60">
                      {new Date(comment.created_at).toLocaleString()}
                    </span>
                  </div>
                  <p className="text-deep-brown/80 leading-relaxed whitespace-pre-wrap">
                    {comment.content}
                  </p>
                </div>
                <button
                  onClick={() => handleDelete(comment.id)}
                  disabled={deleting === comment.id}
                  className="p-2 text-red-500 hover:bg-red-50 rounded-xl transition-colors shrink-0"
                  title="Delete Comment"
                >
                  {deleting === comment.id ? <Loader2 className="animate-spin" size={20} /> : <Trash2 size={20} />}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
