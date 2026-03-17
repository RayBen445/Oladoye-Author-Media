import { useState, useEffect } from 'react';
import { Loader2, MessageCircle, Send } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useToast } from './Toast';

export type Comment = {
  id: string;
  post_id: string;
  author_name: string;
  content: string;
  created_at: string;
};

type CommentsProps = {
  postId: string;
};

export default function Comments({ postId }: CommentsProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [authorName, setAuthorName] = useState('');
  const { showToast } = useToast();

  useEffect(() => {
    fetchComments();

    // Subscribe to new comments
    const channel = supabase
      .channel('public:comments')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'comments',
        filter: \`post_id=eq.\${postId}\`
      }, payload => {
        setComments(current => [payload.new as Comment, ...current]);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [postId]);

  async function fetchComments() {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('comments')
        .select('*')
        .eq('post_id', postId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setComments(data || []);
    } catch (error) {
      console.error('Error fetching comments:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!newComment.trim() || !authorName.trim()) {
      showToast('Please provide both your name and a comment.', 'error');
      return;
    }

    setSubmitting(true);
    try {
      const { error } = await supabase
        .from('comments')
        .insert([
          {
            post_id: postId,
            author_name: authorName.trim(),
            content: newComment.trim(),
          }
        ]);

      if (error) throw error;

      setNewComment('');
      showToast('Comment posted successfully!', 'success');
    } catch (error: any) {
      console.error('Error posting comment:', error);
      showToast(error.message || 'Failed to post comment', 'error');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div id="comments" className="mt-16 pt-12 border-t border-primary/10">
      <div className="flex items-center space-x-3 mb-8">
        <MessageCircle className="text-primary" size={24} />
        <h3 className="text-2xl font-serif font-bold text-deep-brown">Comments ({comments.length})</h3>
      </div>

      <form onSubmit={handleSubmit} className="mb-12 bg-soft-cream/30 p-6 rounded-2xl border border-primary/5">
        <div className="space-y-4">
          <div>
            <label htmlFor="authorName" className="block text-xs font-bold text-taupe uppercase tracking-widest mb-2">
              Your Name
            </label>
            <input
              id="authorName"
              type="text"
              required
              value={authorName}
              onChange={(e) => setAuthorName(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-white border-none focus:ring-2 focus:ring-primary/20"
              placeholder="John Doe"
            />
          </div>
          <div>
            <label htmlFor="comment" className="block text-xs font-bold text-taupe uppercase tracking-widest mb-2">
              Your Comment
            </label>
            <textarea
              id="comment"
              required
              rows={4}
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-white border-none focus:ring-2 focus:ring-primary/20 resize-none"
              placeholder="Share your thoughts..."
            />
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-3 bg-primary text-soft-cream rounded-xl font-bold flex items-center space-x-2 shadow-lg hover:bg-primary/90 transition-all disabled:opacity-50"
            >
              {submitting ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                <Send size={20} />
              )}
              <span>Post Comment</span>
            </button>
          </div>
        </div>
      </form>

      <div className="space-y-6">
        {loading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="animate-spin text-primary" size={32} />
          </div>
        ) : comments.length > 0 ? (
          comments.map((comment) => (
            <div key={comment.id} className="bg-white p-6 rounded-2xl shadow-sm border border-primary/5">
              <div className="flex items-center justify-between mb-3">
                <span className="font-bold text-deep-brown">{comment.author_name}</span>
                <span className="text-xs text-taupe font-medium">
                  {new Date(comment.created_at).toLocaleDateString()} at {new Date(comment.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                </span>
              </div>
              <p className="text-deep-brown/80 leading-relaxed whitespace-pre-wrap">
                {comment.content}
              </p>
            </div>
          ))
        ) : (
          <div className="text-center py-8 text-taupe italic">
            No comments yet. Be the first to share your thoughts!
          </div>
        )}
      </div>
    </div>
  );
}
