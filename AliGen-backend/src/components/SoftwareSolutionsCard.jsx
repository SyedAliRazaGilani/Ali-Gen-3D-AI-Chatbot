import { useState } from "react";
import jewelleryCover from "../assets/jewellery-3d.png";

export default function SoftwareSolutionsCard() {
  const liveUrl = (import.meta.env.VITE_SOFTWARE_SOLUTIONS_LIVE_URL || "").trim();

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
          src={jewelleryCover}
          alt="Software Solutions cover"
          className="h-36 w-full object-cover opacity-90"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        <div className="absolute bottom-3 left-4">
          <div className="font-bold leading-tight">Software Solutions</div>
          <div className="text-white/80 text-sm">
            Small apps, tools, and automation that save time
          </div>
        </div>
      </div>

      <div className="p-4">
        <div className="flex items-center justify-between gap-3">
          <div className="text-white/80 text-sm">Demo</div>
          {liveUrl ? (
            <a
              href={liveUrl}
              target="_blank"
              rel="noreferrer"
              className="rounded-full bg-white text-black px-4 py-2 text-sm font-medium hover:bg-white/90 transition-colors"
            >
              View live
            </a>
          ) : null}
        </div>

        {!liveUrl ? (
          <div className="mt-3 text-sm text-white/70">
            Set{" "}
            <span className="font-mono">VITE_SOFTWARE_SOLUTIONS_LIVE_URL</span>{" "}
            in <span className="font-mono">AliGen-backend/.env</span> to enable
            the “View live” button.
          </div>
        ) : null}
      </div>
    </div>
  );
}

