import { useState } from 'react';
import { X, Save, Loader2 } from 'lucide-react';
import { supabase, type Book } from '../../lib/supabase';
import ImageUpload from './ImageUpload';

type BookFormProps = {
  book?: Book | null;
  onClose: () => void;
  onSuccess: () => void;
};

export default function BookForm({ book, onClose, onSuccess }: BookFormProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<Partial<Book>>(
    book || {
      title: '',
      author_name: 'Lumina',
      slug: '',
      description: '',
      long_description: '',
      cover_image_url: '',
      release_date: new Date().toISOString().split('T')[0],
      genre: 'Fantasy',
      gumroad_link: '',
      advanced_gumroad_link: '',
      premium_gumroad_link: '',
      featured: false,
      order: 0,
    }
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (book?.id) {
        const { error } = await supabase
          .from('books')
          .update(formData)
          .eq('id', book.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('books')
          .insert([formData]);
        if (error) throw error;
      }
      onSuccess();
      onClose();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="p-6 border-b border-primary/10 flex justify-between items-center sticky top-0 bg-white z-10">
          <h2 className="text-2xl font-serif font-bold text-deep-brown">
            {book ? 'Edit Book' : 'Add New Book'}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-soft-cream rounded-full transition-colors">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-taupe uppercase tracking-widest">Title</label>
              <input 
                type="text" 
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-soft-cream/30 border-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-taupe uppercase tracking-widest">Slug</label>
              <input 
                type="text" 
                required
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-soft-cream/30 border-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-taupe uppercase tracking-widest">Genre</label>
              <input 
                type="text" 
                value={formData.genre}
                onChange={(e) => setFormData({ ...formData, genre: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-soft-cream/30 border-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-taupe uppercase tracking-widest">Release Date</label>
              <input 
                type="date" 
                value={formData.release_date?.split('T')[0]}
                onChange={(e) => setFormData({ ...formData, release_date: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-soft-cream/30 border-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-taupe uppercase tracking-widest">Short Description</label>
            <textarea 
              rows={2}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-soft-cream/30 border-none focus:ring-2 focus:ring-primary/20 resize-none"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-taupe uppercase tracking-widest">Standard Description</label>
            <textarea 
              rows={4}
              value={formData.long_description}
              onChange={(e) => setFormData({ ...formData, long_description: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-soft-cream/30 border-none focus:ring-2 focus:ring-primary/20 resize-none"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6 bg-stone-50 rounded-3xl border border-stone-200">
            <div className="space-y-6">
              <h3 className="font-serif font-bold text-deep-brown border-b border-stone-200 pb-2">Advanced Tier</h3>
              <div className="space-y-2">
                <label className="text-xs font-bold text-taupe uppercase tracking-widest">Advanced Description</label>
                <textarea 
                  rows={4}
                  value={formData.advanced_description}
                  onChange={(e) => setFormData({ ...formData, advanced_description: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-white border-none focus:ring-2 focus:ring-primary/20 resize-none"
                  placeholder="Leave empty to use standard description"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-taupe uppercase tracking-widest">Advanced Gumroad Link</label>
                <input 
                  type="url" 
                  value={formData.advanced_gumroad_link}
                  onChange={(e) => setFormData({ ...formData, advanced_gumroad_link: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-white border-none focus:ring-2 focus:ring-primary/20"
                  placeholder="Leave empty to use standard link"
                />
              </div>
            </div>

            <div className="space-y-6">
              <h3 className="font-serif font-bold text-deep-brown border-b border-stone-200 pb-2">Premium Tier</h3>
              <div className="space-y-2">
                <label className="text-xs font-bold text-taupe uppercase tracking-widest">Premium Description</label>
                <textarea 
                  rows={4}
                  value={formData.premium_description}
                  onChange={(e) => setFormData({ ...formData, premium_description: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-white border-none focus:ring-2 focus:ring-primary/20 resize-none"
                  placeholder="Leave empty to use standard description"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-taupe uppercase tracking-widest">Premium Gumroad Link</label>
                <input 
                  type="url" 
                  value={formData.premium_gumroad_link}
                  onChange={(e) => setFormData({ ...formData, premium_gumroad_link: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-white border-none focus:ring-2 focus:ring-primary/20"
                  placeholder="Leave empty to use standard link"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ImageUpload 
              label="Cover Image"
              value={formData.cover_image_url || ''}
              onChange={(url) => setFormData({ ...formData, cover_image_url: url })}
            />
            <div className="space-y-2">
              <label className="text-xs font-bold text-taupe uppercase tracking-widest">Standard Gumroad Link</label>
              <input 
                type="url" 
                value={formData.gumroad_link}
                onChange={(e) => setFormData({ ...formData, gumroad_link: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-soft-cream/30 border-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </div>

          <div className="flex items-center space-x-6">
            <label className="flex items-center space-x-3 cursor-pointer">
              <input 
                type="checkbox" 
                checked={formData.featured}
                onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                className="w-5 h-5 rounded border-primary/20 text-primary focus:ring-primary/20"
              />
              <span className="text-sm font-bold text-deep-brown">Featured on Homepage</span>
            </label>
            <div className="flex items-center space-x-3">
              <label className="text-xs font-bold text-taupe uppercase tracking-widest">Display Order</label>
              <input 
                type="number" 
                value={formData.order}
                onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })}
                className="w-20 px-4 py-2 rounded-xl bg-soft-cream/30 border-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </div>

          <div className="pt-6 border-t border-primary/10 flex justify-end space-x-4">
            <button 
              type="button"
              onClick={onClose}
              className="px-6 py-3 text-taupe font-bold hover:bg-soft-cream rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit"
              disabled={loading}
              className="px-8 py-3 bg-primary text-soft-cream rounded-xl font-bold flex items-center space-x-2 shadow-lg hover:bg-primary/90 transition-all disabled:opacity-50"
            >
              {loading ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
              <span>{book ? 'Update Book' : 'Save Book'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
