import { useState, useRef } from 'react';
import { Upload, X, Loader2, Image as ImageIcon } from 'lucide-react';
import { uploadImage } from '../../lib/supabase';
import { useToast } from '../Toast';

type ImageUploadProps = {
  value: string;
  onChange: (url: string) => void;
  label: string;
  bucket?: string;
};

export default function ImageUpload({ value, onChange, label, bucket = 'images' }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { showToast } = useToast();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const url = await uploadImage(file, bucket);
      onChange(url);
    } catch (error: any) {
      showToast('Error uploading image: ' + error.message, 'error');
    } finally {
      setUploading(false);
    }
  };

  const removeImage = () => {
    onChange('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-2">
      <label className="text-xs font-bold text-taupe uppercase tracking-widest">{label}</label>
      
      <div className="relative group">
        {value ? (
          <div className="relative rounded-2xl overflow-hidden aspect-video bg-soft-cream/30 border-2 border-dashed border-primary/10">
            <img 
              src={value} 
              alt="Preview" 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="p-2 bg-white text-primary rounded-full hover:scale-110 transition-transform"
                title="Change Image"
              >
                <Upload size={20} />
              </button>
              <button
                type="button"
                onClick={removeImage}
                className="p-2 bg-white text-accent rounded-full hover:scale-110 transition-transform"
                title="Remove Image"
              >
                <X size={20} />
              </button>
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="w-full aspect-video rounded-2xl border-2 border-dashed border-primary/20 bg-soft-cream/30 hover:bg-soft-cream/50 transition-colors flex flex-col items-center justify-center space-y-2 text-taupe group"
          >
            {uploading ? (
              <Loader2 className="animate-spin text-primary" size={32} />
            ) : (
              <>
                <div className="p-3 bg-white rounded-full shadow-sm group-hover:scale-110 transition-transform">
                  <Upload size={24} className="text-primary" />
                </div>
                <span className="text-sm font-medium">Click to upload image</span>
              </>
            )}
          </button>
        )}
        
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          className="hidden"
        />
      </div>

      <div className="flex items-center space-x-2">
        <div className="flex-grow h-px bg-primary/5"></div>
        <span className="text-[10px] font-bold text-taupe/40 uppercase tracking-widest">or use URL</span>
        <div className="flex-grow h-px bg-primary/5"></div>
      </div>

      <div className="relative">
        <ImageIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-taupe/40" size={16} />
        <input 
          type="url" 
          value={value}
          placeholder="https://example.com/image.jpg"
          onChange={(e) => onChange(e.target.value)}
          className="w-full pl-10 pr-4 py-2 text-sm rounded-xl bg-soft-cream/30 border-none focus:ring-2 focus:ring-primary/20"
        />
      </div>
    </div>
  );
}
