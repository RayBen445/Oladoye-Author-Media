const fs = require('fs');
let text = fs.readFileSync('src/pages/BlogPostDetail.tsx', 'utf8');

const regex = /\{post \&\& \n          \{post\.additional_images && post\.additional_images\.length > 0 && \([\s\S]*?\}\)\n          <Comments postId=\{post\.id\} \/>\}/;

const replacement = `
        {post && post.additional_images && post.additional_images.length > 0 && (
          <div className="mt-12 mb-8 space-y-4">
            <h3 className="text-xl font-serif font-bold text-deep-brown">Additional Images</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {post.additional_images.map((url, i) => (
                <div key={i} className="aspect-video rounded-xl overflow-hidden shadow-sm border border-primary/5">
                  <img src={url} alt={\`Additional image \${i + 1}\`} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          </div>
        )}

        {post && <Comments postId={post.id} />}`;

text = text.replace(regex, replacement);

// Wait, the original unpatched file from the trace didn't have "{post && " before additional images.
// Let's just do a clean targeted replace based on line numbers or string indexOf since we know the exact original structure.
