const fs = require('fs');

const file = 'src/components/CustomAudioPlayer.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  'const audioRef = useRef<HTMLAudioElement>(null);',
  `const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const handleGlobalPlay = (e: Event) => {
      const target = e.target as HTMLAudioElement;
      if (audioRef.current && target !== audioRef.current) {
        audioRef.current.pause();
        setIsPlaying(false);
      }
    };

    window.addEventListener('play', handleGlobalPlay, true);
    return () => {
      window.removeEventListener('play', handleGlobalPlay, true);
    };
  }, []);`
);

fs.writeFileSync(file, content);
console.log('patched');
