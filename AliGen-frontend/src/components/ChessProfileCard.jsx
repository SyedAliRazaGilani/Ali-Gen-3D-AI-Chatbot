import { useEffect, useState } from "react";

export default function ChessProfileCard() {
  const username = "SlaYeReoN";
  const chessCover =
    "https://images.unsplash.com/photo-1528819622765-d6bcf132f793?w=900&h=1200&fit=crop";
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [profile, setProfile] = useState(null);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    let mounted = true;

    async function loadChess() {
      if (!username) {
        setError("Chess username is missing");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");
        const [profileRes, statsRes] = await Promise.all([
          fetch(`https://api.chess.com/pub/player/${username}`),
          fetch(`https://api.chess.com/pub/player/${username}/stats`),
        ]);

        if (!profileRes.ok || !statsRes.ok) {
          throw new Error("Could not load Chess.com profile");
        }

        const [profileData, statsData] = await Promise.all([
          profileRes.json(),
          statsRes.json(),
        ]);

        if (!mounted) return;
        setProfile(profileData);
        setStats(statsData);
      } catch (e) {
        if (!mounted) return;
        setError(e?.message || "Failed to load Chess.com profile");
      } finally {
        if (mounted) setLoading(false);
      }
    }

    loadChess();
    return () => {
      mounted = false;
    };
  }, [username]);

  const rapid = stats?.chess_rapid?.last?.rating ?? "--";
  const blitz = stats?.chess_blitz?.last?.rating ?? "--";
  const bullet = stats?.chess_bullet?.last?.rating ?? "--";

  const avatarFallback =
    "https://images.unsplash.com/photo-1511367461989-f85a21fda167?w=120&h=120&fit=crop";

  const profileUrl = username ? `https://www.chess.com/member/${username}` : "https://www.chess.com";

  return (
    <div
      className="rounded-3xl border border-white/20 bg-black/35 backdrop-blur-xl overflow-hidden text-white"
    >
      <div className="relative h-36">
        <img
          src={chessCover}
          alt="Chess cover"
          className="h-36 w-full object-cover opacity-80"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        <div className="absolute bottom-3 left-4 flex items-center gap-3">
          <img
            src={profile?.avatar || avatarFallback}
            alt="Chess avatar"
            className="h-12 w-12 rounded-full border border-white/30 object-cover"
          />
          <div>
            <div className="font-bold leading-tight">
              {profile?.name || "Chess.com"}
            </div>
            <div className="text-white/80 text-sm">
              @{username || "unknown"}
            </div>
          </div>
        </div>
      </div>

      <div className="p-4">
        <div className="flex items-center justify-between gap-3">
          <div className="text-white/80 text-sm">Ratings</div>
          <a
            href={profileUrl}
            target="_blank"
            rel="noreferrer"
            className="rounded-full bg-white text-black px-4 py-2 text-sm font-medium hover:bg-white/90 transition-colors"
          >
            Add me on Chess.com
          </a>
        </div>

        {loading ? (
          <div className="mt-3 text-white/80 text-sm">Loading profile…</div>
        ) : error ? (
          <div className="mt-3 text-red-200 text-sm">{error}</div>
        ) : (
          <div className="mt-3 grid grid-cols-3 gap-2">
            <Stat label="Rapid" value={rapid} />
            <Stat label="Blitz" value={blitz} />
            <Stat label="Bullet" value={bullet} />
          </div>
        )}
      </div>
    </div>
  );
}

function Stat({ label, value }) {
  return (
    <div className="rounded-2xl border border-white/15 bg-black/35 px-3 py-2">
      <div className="text-white/70 text-xs">{label}</div>
      <div className="font-bold">{value}</div>
    </div>
  );
}

