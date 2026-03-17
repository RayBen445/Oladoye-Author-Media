const fs = require('fs');
let content = fs.readFileSync('src/pages/Blog.tsx', 'utf8');

// I'll add a load more button for pagination
const useMemoRegex = /const \[selectedGenre, setSelectedGenre\] = useState\("All"\);/;
const paginationState = `const [selectedGenre, setSelectedGenre] = useState("All");
  const [visibleCount, setVisibleCount] = useState(6);

  const loadMore = () => {
    setVisibleCount(prev => prev + 6);
  };`;

content = content.replace(useMemoRegex, paginationState);

const regularPostsRegex = /const regularPosts = filteredPosts\.slice\(1\);/;
const newRegularPosts = `const regularPosts = filteredPosts.slice(1, visibleCount);
  const hasMore = filteredPosts.length > visibleCount;`;

content = content.replace(regularPostsRegex, newRegularPosts);

const loadMoreBtn = `{hasMore && (
            <div className="col-span-full flex justify-center mt-8">
              <button
                onClick={loadMore}
                className="px-8 py-3 bg-primary text-soft-cream rounded-full font-bold shadow-lg hover:shadow-xl hover:scale-105 transition-all"
              >
                Load More
              </button>
            </div>
          )}`;

const mapEndRegex = /<\/div>\n              <\/Link>\n            <\/motion.div>\n          \)\)}\n        <\/div>\n      \)\}\n    <\/motion.div>\n  \);\n}/;
content = content.replace(mapEndRegex, `</div>\n              </Link>\n            </motion.div>\n          ))}\n          ${loadMoreBtn}\n        </div>\n      )}\n    </motion.div>\n  );\n}`);

fs.writeFileSync('src/pages/Blog.tsx', content);
