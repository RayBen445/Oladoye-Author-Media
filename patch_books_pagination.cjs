const fs = require('fs');
let content = fs.readFileSync('src/pages/Books.tsx', 'utf8');

const useMemoRegex = /const \[selectedGenre, setSelectedGenre\] = useState\("All"\);/;
const paginationState = `const [selectedGenre, setSelectedGenre] = useState("All");
  const [visibleCount, setVisibleCount] = useState(6);

  const loadMore = () => {
    setVisibleCount(prev => prev + 6);
  };`;

content = content.replace(useMemoRegex, paginationState);

const renderBooks = `const visibleBooks = filteredBooks.slice(0, visibleCount);
  const hasMore = filteredBooks.length > visibleCount;

  return (`;

content = content.replace(/return \(/, renderBooks);

content = content.replace(/\{filteredBooks\.length === 0 \? \(/, `{filteredBooks.length === 0 ? (`);

content = content.replace(/\{filteredBooks\.map\(\(book, i\) => \(/, `{visibleBooks.map((book, i) => (`);

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

const endMap = /<\/div>\n              <\/Link>\n            <\/motion\.div>\n          \)\)}\n        <\/div>\n      \)\}\n    <\/div>\n  \);\n\}/;

content = content.replace(endMap, `</div>\n              </Link>\n            </motion.div>\n          ))}\n          ${loadMoreBtn}\n        </div>\n      )}\n    </div>\n  );\n}`);

fs.writeFileSync('src/pages/Books.tsx', content);
