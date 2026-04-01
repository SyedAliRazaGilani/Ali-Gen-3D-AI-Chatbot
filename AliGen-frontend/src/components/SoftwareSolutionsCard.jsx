import { useState } from "react";
import jewelleryCover from "../assets/jewellery-3d.png";

export default function SoftwareSolutionsCard() {
  const liveUrl = "https://jewellery-software-3-d-experience-6.vercel.app/";

  return (
    <div
      className="rounded-3xl border border-white/20 bg-black/35 backdrop-blur-xl overflow-hidden text-white"
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

        {null}
      </div>
    </div>
  );
}

