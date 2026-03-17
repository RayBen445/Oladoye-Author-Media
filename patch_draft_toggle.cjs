const fs = require('fs');
let content = fs.readFileSync('src/components/admin/BlogForm.tsx', 'utf8');

// I want to ensure that if "Save as Draft" is checked, "Published" is unchecked, and vice-versa
// But actually, just setting the value directly should be fine if we override onChange for both

const draftCheckbox = `<input
                type="checkbox"
                checked={formData.is_draft || false}
                onChange={(e) => setFormData({ ...formData, is_draft: e.target.checked, published: !e.target.checked })}
                className="w-5 h-5 rounded border-primary/20 text-primary focus:ring-primary/20"
              />`;

const publishCheckbox = `<input
                type="checkbox"
                checked={formData.published}
                onChange={(e) => setFormData({ ...formData, published: e.target.checked, is_draft: !e.target.checked })}
                className="w-5 h-5 rounded border-primary/20 text-primary focus:ring-primary/20"
              />`;

content = content.replace(/<input\s+type="checkbox"\s+checked=\{formData\.is_draft \|\| false\}\s+onChange=\{\(e\) => setFormData\(\{ \.\.\.formData, is_draft: e\.target\.checked \}\)\}\s+className="w-5 h-5 rounded border-primary\/20 text-primary focus:ring-primary\/20"\s+\/>/m, draftCheckbox);

content = content.replace(/<input\s+type="checkbox"\s+checked=\{formData\.published\}\s+onChange=\{\(e\) => setFormData\(\{ \.\.\.formData, published: e\.target\.checked \}\)\}\s+className="w-5 h-5 rounded border-primary\/20 text-primary focus:ring-primary\/20"\s+\/>/m, publishCheckbox);

fs.writeFileSync('src/components/admin/BlogForm.tsx', content);
