const fs = require('fs');
let content = fs.readFileSync('README.md', 'utf8');

const newFeatures = `
- **Analytics Integration:** Add a dashboard widget to track page views, book clicks, and newsletter signup conversion rates.
- **Enhanced Media Library:** A dedicated media manager in the admin dashboard to reuse uploaded images across multiple blog posts or books.
- **Comment Moderation Tools:** Improved UI for bulk-approving or rejecting user comments and book reviews.
- **Automated Social Sharing:** Integration to automatically post new blog articles or "Coming Soon" book announcements to social media platforms.
- **Text Correction Suggestions:** Implement a tool to provide AI-powered text correction and grammar suggestions while writing blog posts or book descriptions.
- **Multi-Author Support:** Allow multiple authors to manage their profiles and posts independently.
- **Podcast Integration:** Showcase podcast episodes alongside book releases and blog posts.
`;

// Replace current feature list
content = content.replace(/## 🔮 Suggested Features \/ Future Roadmap[\s\S]*?---/, `## 🔮 Suggested Features / Future Roadmap\n${newFeatures}\n---`);

// Add new implemented features to '✨ Features' list
content = content.replace(/- \*\*Smooth Animations\*\* — Page transitions and hover effects with Motion \(Framer Motion\)/, `- **Smooth Animations** — Page transitions and hover effects with Motion (Framer Motion)\n- **Rich Text Editor (WYSIWYG)** — Full rich-text editor implemented using TipTap.\n- **Pagination** — "Load More" functionality for browsing large lists of blog posts or books.`);

fs.writeFileSync('README.md', content);
