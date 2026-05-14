const fs = require('fs');

let content = fs.readFileSync('src/pages/Podcasts.tsx', 'utf8');

// Need to import ChevronDown and ChevronUp from lucide-react
content = content.replace(
  'import { Headphones, Loader2, PlayCircle, Clock, Calendar } from "lucide-react";',
  'import { Headphones, Loader2, PlayCircle, Clock, Calendar, ChevronDown, ChevronUp } from "lucide-react";'
);

// We should use an accordion-style collapsible lyrics section per podcast.
// Since `podcasts.map` creates multiple cards, we could either keep state for expanded items,
// or extract the card into a separate component.
// Creating a separate component is cleaner for state management.

const componentCode = `
function PodcastCard({ podcast, handleLike }: { podcast: Podcast, handleLike: (id: string, currentLikes: number) => void }) {
  const [showLyrics, setShowLyrics] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-white rounded-3xl overflow-hidden shadow-xl shadow-primary/5 border border-primary/10 group hover:-translate-y-2 transition-transform duration-300"
    >
      <div className="aspect-[4/3] relative overflow-hidden bg-soft-cream">
        {podcast.cover_image_url ? (
          <img
            src={podcast.cover_image_url}
            alt={podcast.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex justify-center items-center bg-primary/5">
             <Headphones size={48} className="text-primary/30" />
          </div>
        )}
        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors flex items-center justify-center">
          <div className="w-16 h-16 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity transform scale-75 group-hover:scale-100 shadow-xl shadow-black/20">
            <PlayCircle className="text-primary" size={32} />
          </div>
        </div>
      </div>

      <div className="p-8">
        <div className="flex items-center space-x-4 text-taupe text-xs font-bold uppercase tracking-widest mb-3">
          <div className="flex items-center space-x-1"><Calendar size={14} /> <span>{new Date(podcast.published_at).toLocaleDateString()}</span></div>
          {podcast.duration && <div className="flex items-center space-x-1"><Clock size={14} /> <span>{podcast.duration}</span></div>}
        </div>

        <h3 className="text-xl font-serif font-bold text-deep-brown mb-3 group-hover:text-primary transition-colors">
          {podcast.title}
        </h3>

        <p className="text-deep-brown/70 line-clamp-2 mb-6 text-sm">
          {podcast.description}
        </p>


        <CustomAudioPlayer src={podcast.audio_url} />

        {podcast.lyrics && (
          <div className="mt-4 border border-primary/10 rounded-xl overflow-hidden bg-soft-cream/10">
            <button
              onClick={() => setShowLyrics(!showLyrics)}
              className="w-full px-4 py-3 flex items-center justify-between text-sm font-bold text-deep-brown hover:bg-primary/5 transition-colors"
            >
              <span>Lyrics</span>
              {showLyrics ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>
            {showLyrics && (
              <div className="px-4 py-4 text-sm text-deep-brown/80 whitespace-pre-wrap border-t border-primary/10 bg-white max-h-64 overflow-y-auto">
                {podcast.lyrics}
              </div>
            )}
          </div>
        )}

        <div className="mt-6 flex items-center justify-between border-t border-primary/10 pt-4">
          <button
            onClick={() => handleLike(podcast.id, podcast.likes || 0)}
            className="flex items-center space-x-2 text-taupe hover:text-red-500 transition-colors"
          >
            <Heart size={20} className={podcast.likes ? "fill-red-500 text-red-500" : ""} />
            <span className="font-bold">{podcast.likes || 0}</span>
          </button>
        </div>

        <MediaComments mediaId={podcast.id} tableName="podcast_comments" parentIdField="podcast_id" />
      </div>
    </motion.div>
  );
}

export default function Podcasts() {`;

content = content.replace(/export default function Podcasts\(\) \{/, componentCode);

// Then replace the inner loop
const oldLoopRegex = /<motion\.div[\s\S]*?(?=<MediaComments)/;
const loopReplacement = `<PodcastCard key={podcast.id} podcast={podcast} handleLike={handleLike} />`;

// Wait, standard replacement might be hard with regex for JSX. Let's do string splitting.
const parts = content.split('<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">');
if (parts.length > 1) {
  const innerParts = parts[1].split('</div>\n        )}');
  if (innerParts.length > 0) {
    const originalMapping = innerParts[0];
    const newMapping = `
            {podcasts.map((podcast) => (
              <PodcastCard key={podcast.id} podcast={podcast} handleLike={handleLike} />
            ))}
          `;
    content = parts[0] + '<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">' + newMapping + '\n        </div>\n        )}' + innerParts.slice(1).join('</div>\n        )}');
  }
}

fs.writeFileSync('src/pages/Podcasts.tsx', content);
