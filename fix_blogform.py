import re

with open('src/components/admin/BlogForm.tsx', 'r') as f:
    content = f.read()

# Replace the onChange handlers for the title in BlogForm.tsx
old_onchange = r"""onChange=\{\(e\) => {
                  const newTitle = e.target.value;
                  if \(!slugManuallyEdited\) {
                    setFormData\(\{ ...formData, title: newTitle, slug: generateSlug\(newTitle\) \}\);
                  } else {
                    setFormData\(\{ ...formData, title: newTitle \}\);
                  }
                \}\}"""

new_onchange = r"""onChange={(e) => {
                  const newTitle = e.target.value;
                  setFormData({
                    ...formData,
                    title: newTitle,
                    ...(!slugManuallyEdited && { slug: generateSlug(newTitle) }),
                  });
                }}"""

content = re.sub(old_onchange, new_onchange, content)

with open('src/components/admin/BlogForm.tsx', 'w') as f:
    f.write(content)
