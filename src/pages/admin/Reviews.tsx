import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabase";
import { Loader2, Trash2, CheckCircle, XCircle, Star } from "lucide-react";
import { useToast } from "../../components/Toast";

type Review = {
  id: string;
  book_id: string;
  author_name: string;
  rating: number;
  content: string;
  approved: boolean;
  created_at: string;
  books: {
    title: string;
  };
};

export default function AdminReviews() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState<string | null>(null);
  const { showToast } = useToast();

  useEffect(() => {
    fetchReviews();
  }, []);

  async function fetchReviews() {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("reviews")
        .select(\`
          id,
          book_id,
          author_name,
          rating,
          content,
          approved,
          created_at,
          books ( title )
        \`)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setReviews(data as unknown as Review[]);
    } catch (error: any) {
      console.error("Error fetching reviews:", error);
      showToast(error.message || "Failed to fetch reviews", "error");
    } finally {
      setLoading(false);
    }
  }

  async function toggleApproval(id: string, currentStatus: boolean) {
    setProcessing(id);
    try {
      const { error } = await supabase
        .from("reviews")
        .update({ approved: !currentStatus })
        .eq("id", id);

      if (error) throw error;

      setReviews(current =>
        current.map(r => r.id === id ? { ...r, approved: !currentStatus } : r)
      );
      showToast(\`Review \${!currentStatus ? 'approved' : 'hidden'} successfully\`, "success");
    } catch (error: any) {
      console.error("Error toggling review approval:", error);
      showToast(error.message || "Failed to update review", "error");
    } finally {
      setProcessing(null);
    }
  }

  async function handleDelete(id: string) {
    if (!window.confirm("Are you sure you want to delete this review?")) return;

    setProcessing(id);
    try {
      const { error } = await supabase.from("reviews").delete().eq("id", id);
      if (error) throw error;

      setReviews((current) => current.filter((r) => r.id !== id));
      showToast("Review deleted successfully", "success");
    } catch (error: any) {
      console.error("Error deleting review:", error);
      showToast(error.message || "Failed to delete review", "error");
    } finally {
      setProcessing(null);
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
          <h1 className="text-3xl font-serif font-bold text-deep-brown">Book Reviews</h1>
          <p className="text-taupe mt-2">Manage reader reviews for your books.</p>
        </div>
      </div>

      <div className="bg-white rounded-3xl p-8 shadow-sm border border-primary/10">
        {reviews.length === 0 ? (
          <div className="text-center py-12 text-taupe">
            <Star className="mx-auto h-12 w-12 text-primary/20 mb-4" />
            <p>No reviews found.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {reviews.map((review) => (
              <div key={review.id} className="flex flex-col md:flex-row justify-between items-start gap-6 p-6 bg-soft-cream/30 rounded-2xl border border-primary/5 hover:border-primary/20 transition-colors">
                <div className="space-y-3 flex-1">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="font-bold text-deep-brown">{review.author_name}</span>
                    <div className="flex items-center text-accent">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={14} className={i < review.rating ? "fill-current" : "text-taupe/30"} />
                      ))}
                    </div>
                    <span className="text-xs text-taupe bg-white px-2 py-1 rounded-md border border-primary/10">
                      for: {review.books?.title || "Unknown Book"}
                    </span>
                    <span className="text-xs text-taupe/60">
                      {new Date(review.created_at).toLocaleString()}
                    </span>
                    {!review.approved && (
                      <span className="text-[10px] uppercase tracking-widest font-bold bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">
                        Pending
                      </span>
                    )}
                  </div>
                  <p className="text-deep-brown/80 leading-relaxed whitespace-pre-wrap">
                    {review.content}
                  </p>
                </div>

                <div className="flex items-center space-x-2 shrink-0">
                  <button
                    onClick={() => toggleApproval(review.id, review.approved)}
                    disabled={processing === review.id}
                    className={\`p-2 rounded-xl transition-colors \${review.approved ? 'text-amber-600 hover:bg-amber-50' : 'text-emerald-600 hover:bg-emerald-50'}\`}
                    title={review.approved ? "Hide Review" : "Approve Review"}
                  >
                    {processing === review.id ? (
                      <Loader2 className="animate-spin" size={20} />
                    ) : review.approved ? (
                      <XCircle size={20} />
                    ) : (
                      <CheckCircle size={20} />
                    )}
                  </button>
                  <button
                    onClick={() => handleDelete(review.id)}
                    disabled={processing === review.id}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                    title="Delete Review"
                  >
                    {processing === review.id ? <Loader2 className="animate-spin" size={20} /> : <Trash2 size={20} />}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
