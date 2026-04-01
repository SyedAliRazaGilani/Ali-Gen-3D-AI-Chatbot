/** Same handle as Chess.com profile in ChessProfileCard.jsx */
const STEAM_USERNAME = "SlaYeReoN";

export default function GamingProfileCard() {
  const envUrl = (import.meta.env.VITE_CSGO_PROFILE_URL || "").trim();
  const profileUrl =
    envUrl || `https://steamcommunity.com/id/${STEAM_USERNAME}`;
  const cover =
    "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1200&h=600&fit=crop";

  return (
    <div
      className="rounded-3xl border border-white/20 bg-black/35 backdrop-blur-xl overflow-hidden text-white"
    >
      <div className="relative h-36">
        <img
          src={cover}
          alt="Gaming cover"
          className="h-36 w-full object-cover opacity-80"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        <div className="absolute bottom-3 left-4">
          <div className="font-bold leading-tight">CS:GO / CS2</div>
          <div className="text-white/80 text-sm">
            Add me on Steam / see my profile
          </div>
        </div>
      </div>

      <div className="p-4 flex justify-center">
        <a
          href={profileUrl}
          target="_blank"
          rel="noreferrer"
          className="rounded-full bg-white text-black px-4 py-2 text-sm font-medium hover:bg-white/90 transition-colors"
        >
          Open Steam profile
        </a>
      </div>
    </div>
  );
}
