import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "motion/react";
import { X, Database, UserRoundPlus, GraduationCap } from "lucide-react";
import aliImg from "../assets/ali-img.jpeg";
import technologiesFaceCard from "../assets/technologies-face-card.png";

const CARD_SURFACE =
  "rounded-2xl border border-white/14 bg-gradient-to-br from-white/[0.14] via-white/[0.07] to-white/[0.03] shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] backdrop-blur-sm";

const STORIES = {
  face: {
    title: "My Face",
    glow: "shadow-[0_0_80px_rgba(139,92,246,0.22)]",
    photo: aliImg,
    photoAlt: "Ali Gilani",
    hidePhoto: false,
    /** split hero + copy (not generic boxed/cover) */
    layout: "split-profile",
    lines: [
      "Hi, I'm Ali 👋 — this is my face.",
      "I came up with the idea of making a 3D online AI assistant that looks just like me and answers people's questions about me.",
      "It can be extended further into an engaging AI assistant that answers queries for businesses and more.",
    ],
  },
  technologies: {
    title: "Technologies",
    glow: "shadow-[0_0_60px_rgba(59,130,246,0.28)]",
    photo: technologiesFaceCard,
    photoAlt: "Ali — 3D AI assistant avatar",
    hidePhoto: false,
    /** full-width cover strip at top of card */
    photoStyle: "cover",
    techIntro: "AliGen combines a 3D avatar experience with conversational AI. This project uses:",
    techItems: [
      "React 18",
      "Vite",
      "Three.js",
      "React Three Fiber",
      "Drei",
      "Tailwind CSS",
      "Motion",
      "Avaturn SDK",
      "Amazon Polly",
      "Google Gemini",
      "Rhubarb",
      "ffmpeg",
      "Lucide React",
    ],
  },
  usecases: {
    title: "Use Cases",
    glow: "shadow-[0_0_60px_rgba(34,211,238,0.25)]",
    hidePhoto: true,
    sectionLabel: "Can be used as",
    useCaseCards: [
      {
        title: "RAG for your business",
        desc: "Answer questions with context from your docs, policies, and knowledge base — accurate, grounded, and always on-brand.",
        icon: Database,
        iconWrap: "bg-violet-500/25 text-violet-100 border border-violet-400/25",
      },
      {
        title: "Onboarding assistants",
        desc: "Walk new hires and customers through setup, tooling, and first wins with a patient, conversational copilot.",
        icon: UserRoundPlus,
        iconWrap: "bg-cyan-500/20 text-cyan-100 border border-cyan-400/25",
      },
      {
        title: "E-learning assistant",
        desc: "Tutoring, quizzes, and explanations that adapt to each learner — like a study partner that never clocks out.",
        icon: GraduationCap,
        iconWrap: "bg-amber-500/20 text-amber-100 border border-amber-400/25",
      },
    ],
  },
};

/**
 * Portaled modal: optional photo + copy, technologies chips, or use-case cards.
 */
export default function NavStoryPopup({ open, variant, onClose }) {
  const snapshotRef = useRef(null);
  const openRef = useRef(open);
  openRef.current = open;
  if (variant) {
    snapshotRef.current = STORIES[variant];
  }
  const story = snapshotRef.current;

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  if (!story) return null;

  const hasCards = Array.isArray(story.useCaseCards) && story.useCaseCards.length > 0;
  const hasTech = Array.isArray(story.techItems) && story.techItems.length > 0;
  const isSplitFace = story.layout === "split-profile";
  const showPhoto = story.photo && story.hidePhoto !== true && !isSplitFace;

  const modal = (
    <AnimatePresence
      onExitComplete={() => {
        if (!openRef.current) snapshotRef.current = null;
      }}
    >
      {open ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[10050] flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-md pointer-events-auto"
          style={{ isolation: "isolate" }}
          onClick={() => onClose()}
          role="presentation"
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="nav-story-title"
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            transition={{ duration: 0.28, ease: "easeOut" }}
            onClick={(e) => e.stopPropagation()}
            onPointerDown={(e) => e.stopPropagation()}
            className={`relative w-full max-h-[min(92vh,860px)] flex flex-col overflow-hidden rounded-2xl sm:rounded-3xl border border-white/12 pointer-events-auto ${
              isSplitFace
                ? "max-w-[min(92vw,640px)] md:max-w-[720px] bg-[#09090d] " + story.glow
                : "max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl xl:max-w-3xl bg-[#0c0c10] " + story.glow
            }`}
          >
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onClose();
              }}
              onPointerDown={(e) => e.stopPropagation()}
              aria-label="Close"
              className={`absolute top-3 right-3 z-[60] rounded-full p-2.5 text-white backdrop-blur-md transition-colors pointer-events-auto cursor-pointer border ${
                isSplitFace
                  ? "bg-white/10 border-white/20 hover:bg-white/15"
                  : "bg-black/50 border-white/15 hover:bg-black/65"
              }`}
            >
              <X className="w-5 h-5" strokeWidth={2.25} />
            </button>

            {isSplitFace ? (
              <div className="flex min-h-0 flex-1 flex-col overflow-y-auto overscroll-contain md:grid md:grid-cols-[0.95fr_1.1fr] md:items-stretch">
                <div className="relative flex flex-col items-center justify-center px-8 pb-8 pt-16 md:px-10 md:py-12 md:pt-12 border-b border-white/[0.08] md:border-b-0 md:border-r">
                  <div
                    className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_20%,rgba(139,92,246,0.22),transparent_65%),radial-gradient(ellipse_60%_50%_at_80%_80%,rgba(6,182,212,0.08),transparent_55%)]"
                    aria-hidden
                  />
                  <motion.div
                    initial={{ opacity: 0, scale: 0.92, y: 12 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                    className="relative z-[1]"
                  >
                    <div className="rounded-[1.35rem] bg-gradient-to-br from-violet-400/90 via-fuchsia-500/75 to-cyan-400/50 p-[2px] shadow-[0_20px_60px_-15px_rgba(139,92,246,0.55)]">
                      <div className="overflow-hidden rounded-[1.28rem] bg-[#0a0a0f]">
                        <img
                          src={story.photo}
                          alt={story.photoAlt || ""}
                          className="aspect-square h-[min(52vw,220px)] w-[min(52vw,220px)] sm:h-56 sm:w-56 md:h-64 md:w-64 object-cover object-[center_15%]"
                        />
                      </div>
                    </div>
                  </motion.div>
                  <p className="relative z-[1] mt-5 text-[11px] font-semibold uppercase tracking-[0.2em] text-white">
                    Ali Gilani
                  </p>
                </div>

                <div className="flex flex-col justify-center gap-5 px-6 py-8 sm:px-8 sm:py-10 md:py-12">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-white">
                      Portfolio avatar
                    </p>
                    <h2
                      id="nav-story-title"
                      className="mt-2 text-2xl font-semibold tracking-tight text-white sm:text-[1.65rem]"
                    >
                      {story.title}
                    </h2>
                  </div>
                  <div className="flex flex-col gap-4">
                    {story.lines.map((line, i) => (
                      <motion.p
                        key={i}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.08 + i * 0.06, duration: 0.25, ease: "easeOut" }}
                        className={
                          i === 0
                            ? "text-[17px] font-medium leading-snug text-white sm:text-lg"
                            : "text-[15px] leading-relaxed text-white sm:text-[15px]"
                        }
                      >
                        {line}
                      </motion.p>
                    ))}
                  </div>
                </div>
              </div>
            ) : null}

            {showPhoto && story.photoStyle === "cover" ? (
              <div className="relative w-full shrink-0 h-[min(38vh,260px)] sm:h-[min(42vh,300px)] md:h-[min(44vh,320px)] overflow-hidden">
                <img
                  src={story.photo}
                  alt={story.photoAlt || ""}
                  className="absolute inset-0 h-full w-full origin-top object-cover object-[center_20%] sm:object-[center_18%] scale-[1.08] translate-y-[7%]"
                />
                <div
                  className="absolute inset-0 bg-gradient-to-t from-[#0c0c10] via-[#0c0c10]/35 to-black/25 pointer-events-none"
                  aria-hidden
                />
              </div>
            ) : null}

            {showPhoto && story.photoStyle !== "cover" ? (
              <div className="w-full shrink-0 flex justify-center px-4 pt-14 pb-3 sm:px-6 sm:pt-16 sm:pb-4">
                <div
                  className={`rounded-2xl border border-white/18 bg-zinc-950/90 p-3 sm:p-4 flex items-center justify-center min-h-[160px] max-w-[240px] sm:max-w-[260px] shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]`}
                >
                  <img
                    src={story.photo}
                    alt={story.photoAlt || ""}
                    className="block max-h-[min(40vh,320px)] max-w-full w-auto h-auto object-contain object-center"
                  />
                </div>
              </div>
            ) : null}

            {!isSplitFace ? (
            <div
              className={`flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto overscroll-contain px-5 pb-6 sm:px-7 sm:pb-7 md:px-8 pointer-events-auto ${
                showPhoto && story.photoStyle === "cover"
                  ? "pt-4 sm:pt-5"
                  : showPhoto
                    ? "pt-1"
                    : "pt-14 sm:pt-16"
              }`}
            >
              <h2
                id="nav-story-title"
                className="text-lg sm:text-xl font-semibold text-white tracking-tight"
              >
                {story.title}
              </h2>

              {hasTech ? (
                <div className="flex flex-col gap-3.5">
                  {story.techIntro ? (
                    <p className="text-sm sm:text-[15px] leading-relaxed text-white">{story.techIntro}</p>
                  ) : null}
                  <ul className="flex flex-wrap gap-2">
                    {story.techItems.map((name, i) => (
                      <motion.li
                        key={name}
                        initial={{ opacity: 0, scale: 0.94 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.02 * i, duration: 0.18, ease: "easeOut" }}
                        className="rounded-full border border-white/18 bg-gradient-to-br from-white/[0.12] to-white/[0.04] px-3.5 py-2 text-sm font-medium text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] backdrop-blur-sm"
                      >
                        {name}
                      </motion.li>
                    ))}
                  </ul>
                </div>
              ) : null}

              {hasCards ? (
                <div className="flex flex-col gap-3.5">
                  <p className="text-[11px] sm:text-xs font-semibold uppercase tracking-[0.14em] text-white/50">
                    {story.sectionLabel}
                  </p>
                  <ul className="flex flex-col gap-3">
                    {story.useCaseCards.map(({ title, desc, icon: Icon, iconWrap }, i) => (
                      <motion.li
                        key={title}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.05 * i, duration: 0.22, ease: "easeOut" }}
                        className={`flex gap-3.5 p-3.5 sm:p-4 ${CARD_SURFACE}`}
                      >
                        <span
                          className={`mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${iconWrap}`}
                        >
                          <Icon className="w-[18px] h-[18px]" strokeWidth={2} />
                        </span>
                        <div className="min-w-0 flex-1">
                          <h3 className="text-[15px] sm:text-base font-semibold text-white leading-snug">
                            {title}
                          </h3>
                          <p className="mt-1.5 text-sm leading-relaxed text-white/80">{desc}</p>
                        </div>
                      </motion.li>
                    ))}
                  </ul>
                </div>
              ) : null}

              {!hasTech && !hasCards && story.lines ? (
                <div className="flex flex-col gap-2.5 sm:gap-3 text-sm sm:text-[15px] leading-relaxed text-white">
                  {story.lines.map((line, i) => (
                    <p key={i}>{line}</p>
                  ))}
                </div>
              ) : null}
            </div>
            ) : null}
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );

  return createPortal(modal, document.body);
}
