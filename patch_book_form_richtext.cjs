const fs = require('fs');
let content = fs.readFileSync('src/components/admin/BookForm.tsx', 'utf8');

content = content.replace("import ImageUpload from './ImageUpload';", "import ImageUpload from './ImageUpload';\nimport RichTextEditor from './RichTextEditor';");

const oldDescriptionUsage = `<div className="space-y-2">
            <label className="text-xs font-bold text-taupe uppercase tracking-widest">Standard Description</label>
            <textarea
              rows={4}
              value={formData.long_description}
              onChange={(e) => setFormData({ ...formData, long_description: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-soft-cream/30 border-none focus:ring-2 focus:ring-primary/20 resize-none"
            />
          </div>`;

const newDescriptionUsage = `<div className="space-y-2">
            <label className="text-xs font-bold text-taupe uppercase tracking-widest">Standard Description</label>
            <RichTextEditor
              value={formData.long_description || ''}
              onChange={(v) => setFormData({ ...formData, long_description: v })}
            />
          </div>`;

content = content.replace(oldDescriptionUsage, newDescriptionUsage);

fs.writeFileSync('src/components/admin/BookForm.tsx', content);
