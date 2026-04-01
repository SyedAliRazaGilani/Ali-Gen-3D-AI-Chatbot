import { useState } from "react";

export default function GamingProfileCard() {
  const profileUrl = (import.meta.env.VITE_CSGO_PROFILE_URL || "").trim();
  const displayUrl =
    profileUrl || "https://steamcommunity.com (set VITE_CSGO_PROFILE_URL)";
  const cover =
    "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1200&h=600&fit=crop";

  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [isHover, setIsHover] = useState(false);

  const onMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    const y = (px - 0.5) * 14;
    const x = (0.5 - py) * 14;
    setTilt({ x, y });
  };

  return (
    <div
      className="rounded-3xl border border-white/20 bg-black/35 backdrop-blur-xl overflow-hidden text-white"
      onMouseMove={onMove}
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => {
        setIsHover(false);
        setTilt({ x: 0, y: 0 });
      }}
      style={{
        transform: isHover
          ? `perspective(900px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`
          : "perspective(900px) rotateX(0deg) rotateY(0deg)",
        transition: "transform 150ms ease",
      }}
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

      <div className="p-4">
        <div className="flex items-center justify-between gap-3">
          <div className="text-white/80 text-sm">Profile</div>
          {profileUrl ? (
            <a
              href={profileUrl}
              target="_blank"
              rel="noreferrer"
              className="rounded-full bg-white text-black px-4 py-2 text-sm font-medium hover:bg-white/90 transition-colors"
            >
              Open CS:GO profile
            </a>
          ) : null}
        </div>
        <div className="mt-3 rounded-2xl border border-white/15 bg-black/35 px-3 py-3 text-sm text-white/80 break-all">
          {displayUrl}
        </div>
        {!profileUrl ? (
          <div className="mt-3 text-xs text-white/60">
            Set <span className="font-mono">VITE_CSGO_PROFILE_URL</span> in
            <span className="font-mono"> AliGen-backend/.env</span>.
          </div>
        ) : null}
      </div>
    </div>
  );
}

