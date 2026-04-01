export default function BlogDetailCard({ title, summary, postUrl, imageUrl }) {
  return (
    <div className="rounded-3xl border border-white/20 bg-black/35 backdrop-blur-xl overflow-hidden text-white">
      <div className="relative h-40 sm:h-44 bg-gradient-to-br from-slate-700/90 via-violet-900/60 to-black">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt=""
            className="absolute inset-0 h-full w-full object-cover"
            loading="lazy"
            decoding="async"
          />
        ) : null}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/30" />
        <div className="absolute bottom-3 left-4 right-4">
          <div className="font-bold text-base sm:text-lg leading-tight drop-shadow-sm">{title}</div>
          <div className="text-white/80 text-xs sm:text-sm mt-1 drop-shadow-sm">Blog post</div>
        </div>
      </div>

      <div className="p-4">
        <div className="text-white/90 text-sm leading-relaxed whitespace-pre-wrap">
          {summary?.trim() ? summary : "No summary available."}
        </div>
        {postUrl ? (
          <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
            <span className="text-white/60 text-sm">Full article</span>
            <a
              href={postUrl}
              target="_blank"
              rel="noreferrer"
              className="rounded-full bg-white text-black px-4 py-2 text-sm font-medium hover:bg-white/90 transition-colors"
            >
              Read post
            </a>
          </div>
        ) : null}
      </div>
    </div>
  );
}
