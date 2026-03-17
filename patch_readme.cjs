const fs = require('fs');
let content = fs.readFileSync('README.md', 'utf8');

const newFeatures = `
- **Rich Text Editor (WYSIWYG):** Upgrade the blog and book description textareas to a full rich-text editor (e.g., TipTap or Quill) for easier content formatting.
- **Pagination & Infinite Scroll:** Implement pagination for the blog and book catalog to handle large amounts of content gracefully and improve load times.
- **Analytics Integration:** Add a dashboard widget to track page views, book clicks, and newsletter signup conversion rates.
- **Enhanced Media Library:** A dedicated media manager in the admin dashboard to reuse uploaded images across multiple blog posts or books.
- **Comment Moderation Tools:** Improved UI for bulk-approving or rejecting user comments and book reviews.
- **Automated Social Sharing:** Integration to automatically post new blog articles or "Coming Soon" book announcements to social media platforms.
- **Text Correction Suggestions:** Implement a tool to provide AI-powered text correction and grammar suggestions while writing blog posts or book descriptions.
`;

content = content.replace(/## 🔮 Suggested Features \/ Future Roadmap[\s\S]*?---/, `## 🔮 Suggested Features / Future Roadmap\n${newFeatures}\n---`);
fs.writeFileSync('README.md', content);
