const fs = require('fs');
let content = fs.readFileSync('src/components/admin/BlogForm.tsx', 'utf8');

// I'll use a better approach by fully replacing the handleSubmit method
const replacement = `  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setFormError(null);

    try {
      if (formData.id) {
        const { error } = await supabase
          .from('blog_posts')
          .update(formData)
          .eq('id', formData.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('blog_posts')
          .insert([formData]);
        if (error) throw error;
      }
      onSuccess();
      onClose();
    } catch (err: any) {`;

content = content.replace(/  const handleSubmit = async \(e: React.FormEvent\) => \{[\s\S]*?\} catch \(err: any\) \{/, replacement);
fs.writeFileSync('src/components/admin/BlogForm.tsx', content);
