const fs = require('fs');

let content = fs.readFileSync('src/components/admin/PodcastForm.tsx', 'utf8');

// Ensure lyrics is in the default form data
content = content.replace(
  "published_at: new Date().toISOString(),",
  "published_at: new Date().toISOString(),\n      lyrics: '',"
);

// Add the lyrics textarea field below description
const newField = `
            <div className="space-y-2">
              <label className="text-xs font-bold text-taupe uppercase tracking-widest">Lyrics (Optional)</label>
              <textarea
                rows={5}
                value={formData.lyrics || ''}
                onChange={(e) => setFormData({ ...formData, lyrics: e.target.value })}
                placeholder="Enter lyrics here..."
                className="w-full px-4 py-3 rounded-xl bg-soft-cream/30 border-none focus:ring-2 focus:ring-primary/20 resize-y"
              />
            </div>

            <div className="space-y-2">
              <MediaUpload`;

content = content.replace(
  '<div className="space-y-2">\n              <MediaUpload',
  newField
);

fs.writeFileSync('src/components/admin/PodcastForm.tsx', content);
