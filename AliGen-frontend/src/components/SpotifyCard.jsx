import { useEffect, useMemo, useState } from "react";
import { ArrowUpRight } from "lucide-react";

// Real Spotify show link
const SPOTIFY_TRACK =
  "https://open.spotify.com/show/1n590CGmBuXUkhR3lBkdRY?si=8hkeEKIORJ2GFmVVGy9arw&nd=1&dlsi=432afef3d5cb4642";

export default function SpotifyCard() {
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(38);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    if (!isPlaying) return;
    const t = setInterval(() => {
      setProgress((p) => (p >= 100 ? 0 : p + 0.3));
      setTick((x) => x + 1);
    }, 150);
    return () => clearInterval(t);
  }, [isPlaying]);

  const bars = useMemo(() => [4, 7, 5, 9, 6, 8, 5, 7, 4, 6, 8, 5, 9, 6, 7], []);

  return (
    <div className="rounded-3xl border border-white/20 bg-black/35 backdrop-blur-xl p-5 text-white">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-6 h-6 rounded-full bg-[#1DB954] flex items-center justify-center flex-shrink-0 shadow-lg shadow-green-500/30">
          <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-black">
            <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
          </svg>
        </div>
        <div>
          <p className="text-[10px] text-white/70 font-light uppercase tracking-wider">
            Now Playing
          </p>
        </div>
        <a
          href={SPOTIFY_TRACK}
          target="_blank"
          rel="noopener noreferrer"
          className="ml-auto"
          title="Open on Spotify"
        >
          <ArrowUpRight className="w-3.5 h-3.5 text-white/60 hover:text-[#1DB954] transition-colors" />
        </a>
      </div>

      <div className="flex items-start gap-3 mb-4">
        <a
          href={SPOTIFY_TRACK}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-shrink-0"
          style={{ transform: "translateZ(0)" }}
        >
          <div
            className="w-14 h-14 rounded-xl overflow-hidden shadow-lg shadow-green-500/20 border border-white/10"
            style={{
              background: "linear-gradient(135deg, #1a1a2e, #3d2b5e, #6d28d9)",
            }}
          >
            <img
              src="https://image-cdn-fa.spotifycdn.com/image/ab6766630000db5b2adf471beaea8c57bf2b14fc"
              alt="Mindset - Updated Edition cover"
              className="w-full h-full object-cover opacity-90"
            />
          </div>
        </a>
        <div className="flex-1 min-w-0">
          <a
            href={SPOTIFY_TRACK}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-normal text-white/90 hover:text-[#1DB954] transition-colors truncate block"
          >
            Mindset - Updated Edition
          </a>
          <p className="text-xs font-light text-white/70 truncate">
            Podcast on Spotify
          </p>
        </div>
      </div>

      <div className="flex items-end gap-[2px] h-8 mb-3">
        {bars.map((h, i) => {
          const wobble = isPlaying ? ((tick + i * 7) % 9) / 9 : 0;
          const height = isPlaying ? (h + wobble * 4) * 2 : 4;
          return (
            <div
              key={i}
              className="flex-1 rounded-sm transition-all"
              style={{
                background: isPlaying ? "#1DB954" : "#374151",
                height: `${height}px`,
                opacity: isPlaying ? 0.9 : 0.7,
                transitionDuration: "240ms",
              }}
            />
          );
        })}
      </div>

      <div className="space-y-1">
        <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full"
            style={{ width: `${progress}%`, background: "#1DB954" }}
          />
        </div>
        <div className="flex justify-between text-[9px] font-light text-white/60">
          <span>
            1:{Math.floor(progress * 0.028 * 60).toString().padStart(2, "0")}
          </span>
          <span>3:24</span>
        </div>
      </div>

      <div className="flex items-center justify-center gap-4 mt-4">
        <button
          type="button"
          className="text-white/60 hover:text-white transition-colors"
          aria-label="Previous (visual only)"
        >
          <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
            <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z" />
          </svg>
        </button>
        <button
          type="button"
          onClick={() => setIsPlaying(!isPlaying)}
          className="w-9 h-9 rounded-full bg-white flex items-center justify-center shadow-lg shadow-white/20"
          aria-label={isPlaying ? "Pause" : "Play"}
        >
          {isPlaying ? (
            <svg viewBox="0 0 24 24" className="w-4 h-4 fill-black">
              <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" className="w-4 h-4 fill-black">
              <path d="M8 5v14l11-7z" />
            </svg>
          )}
        </button>
        <button
          type="button"
          className="text-white/60 hover:text-white transition-colors"
          aria-label="Next (visual only)"
        >
          <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
            <path d="M6 18l8.5-6L6 6v12zm2-8.14l4.97 2.14L8 14.14V9.86z" />
          </svg>
        </button>
      </div>
    </div>
  );
}

