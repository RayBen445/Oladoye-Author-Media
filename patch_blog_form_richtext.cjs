const fs = require('fs');
let content = fs.readFileSync('src/components/admin/BlogForm.tsx', 'utf8');

content = content.replace("import ImageUpload from './ImageUpload';", "import ImageUpload from './ImageUpload';\nimport RichTextEditor from './RichTextEditor';");

const oldContentFieldUsage = `<ContentField
            label="Standard Content (Markdown)"
            value={formData.content}
            onChange={(v) => setFormData({ ...formData, content: v })}
            required
            rows={10}
            mono
          />`;

const newContentFieldUsage = `<div className="space-y-2">
            <label className="text-xs font-bold text-taupe uppercase tracking-widest">Standard Content</label>
            <RichTextEditor
              value={formData.content || ''}
              onChange={(v) => setFormData({ ...formData, content: v })}
            />
          </div>`;

content = content.replace(oldContentFieldUsage, newContentFieldUsage);

fs.writeFileSync('src/components/admin/BlogForm.tsx', content);
