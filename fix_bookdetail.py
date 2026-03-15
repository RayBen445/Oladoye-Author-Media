import re

with open('src/pages/BookDetail.tsx', 'r') as f:
    content = f.read()

# Add imports
content = content.replace("import rehypeRaw from 'rehype-raw';", "import rehypeRaw from 'rehype-raw';\nimport rehypeSanitize from 'rehype-sanitize';")

# Update ReactMarkdown to use rehypeSanitize
content = content.replace("<ReactMarkdown rehypePlugins={[rehypeRaw]}>{book.long_description || ''}</ReactMarkdown>", "<ReactMarkdown rehypePlugins={[rehypeRaw, rehypeSanitize]}>{book.long_description || ''}</ReactMarkdown>")

with open('src/pages/BookDetail.tsx', 'w') as f:
    f.write(content)
