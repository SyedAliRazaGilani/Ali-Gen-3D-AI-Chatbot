import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  ChevronDown,
  ExternalLink,
  Github,
  Mail,
  Briefcase,
  BookOpen,
  Globe,
  Sparkles,
  FileText,
  User,
} from "lucide-react";
import { DarkModeSwitch } from "react-toggle-dark-mode";
import NavStoryPopup from "./NavStoryPopup.jsx";

const SITE = "https://aligilani.com";

const MORE_LINKS = [
  {
    title: "Portfolio",
    desc: "aligilani.com",
    href: SITE,
    icon: Globe,
  },
  {
    title: "Work",
    desc: "Experience & roles",
    href: `${SITE}/Work`,
    icon: Briefcase,
  },
  {
    title: "Blog",
    desc: "Articles & guides",
    href: `${SITE}/Blog`,
    icon: BookOpen,
  },
  {
    title: "GitHub",
    desc: "Open source",
    href: "https://github.com/SyedAliRazaGilani",
    icon: Github,
  },
];

/**
 * Mobile center pill + sheet; desktop centered links, More dropdown, Book a Call, theme switch (lg+).
 */
export default function AliGenNavbar({ navLogo, isDarkMode, setIsDarkMode }) {
  const [showNavbar, setShowNavbar] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const [storyOpen, setStoryOpen] = useState(null);
  const dropdownRef = useRef(null);

  const openStory = (key) => {
    setMoreOpen(false);
    setMobileOpen(false);
    setStoryOpen(key);
  };

  useEffect(() => {
    const t = setTimeout(() => setShowNavbar(true), 380);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!moreOpen) return;
    const handle = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setMoreOpen(false);
    };
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, [moreOpen]);

  useEffect(() => {
    if (mobileOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <>
      {/* Mobile / tablet: below black bar — larger pill + theme switch (aligned, same style as desktop) */}
      <div className="lg:hidden fixed left-0 right-0 top-[3.35rem] sm:top-[3.5rem] z-50 flex justify-center px-3 pointer-events-none">
        <AnimatePresence mode="wait">
          {showNavbar ? (
            <motion.div
              key="mobile-nav-row"
              initial={{ opacity: 0, y: -12, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.98 }}
              transition={{ duration: 0.36, ease: "easeOut" }}
              className="pointer-events-auto flex items-center gap-2.5"
            >
              <motion.button
                type="button"
                onClick={() => setMobileOpen((v) => !v)}
                className="h-11 min-w-[200px] sm:h-12 sm:min-w-[228px] px-4 sm:px-5 rounded-full border border-white/14 bg-[rgba(24,24,30,0.34)] backdrop-blur-2xl inline-flex items-center justify-between gap-3 shadow-[0_10px_35px_rgba(0,0,0,0.22)]"
              >
                <img src={navLogo} alt="" className="w-7 h-7 sm:w-8 sm:h-8 object-contain shrink-0" />
                <span className="text-[19px] sm:text-[1.35rem] font-light tracking-[0.04em] text-white/90 lowercase leading-none pr-0.5">
                  ali
                </span>
              </motion.button>
              <motion.button
                type="button"
                initial={{ opacity: 0, scale: 0.94 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, ease: "easeOut", delay: 0.05 }}
                aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
                aria-pressed={Boolean(isDarkMode)}
                className="h-9 w-9 shrink-0 flex cursor-pointer items-center justify-center rounded-full border border-white/14 bg-[rgba(24,24,30,0.34)] backdrop-blur-2xl shadow-[0_10px_35px_rgba(0,0,0,0.22)] pointer-events-auto"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setIsDarkMode((prev) => !prev);
                }}
              >
                <span className="pointer-events-none flex select-none items-center justify-center [&_svg]:block">
                  <DarkModeSwitch
                    checked={Boolean(isDarkMode)}
                    onChange={() => {}}
                    size={26}
                    sunColor="#fbbf24"
                    moonColor="#e2e8f0"
                  />
                </span>
              </motion.button>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>

      {/* Desktop: centered nav */}
      <nav
        className="hidden lg:flex fixed left-1/2 -translate-x-1/2 z-[55] w-max max-w-[calc(100vw-2rem)] items-center gap-1 lg:gap-1.5 xl:gap-2 pointer-events-auto overflow-visible rounded-full border border-white/12 bg-[rgba(18,18,22,0.45)] backdrop-blur-2xl py-1.5 px-2 lg:py-2 lg:px-2.5 xl:py-2.5 xl:px-3 shadow-[0_10px_40px_rgba(0,0,0,0.25)] lg:top-[3.35rem] xl:top-[3.5rem]"
        aria-label="Main"
      >
        <button
          type="button"
          onClick={() => openStory("face")}
          className="flex items-center gap-1.5 rounded-full px-3 py-1.5 lg:px-3.5 lg:py-2 xl:px-4 text-sm xl:text-[15px] font-medium text-white/70 hover:text-white hover:bg-white/8 transition-all duration-200"
        >
          <User className="w-3.5 h-3.5 lg:w-4 lg:h-4 opacity-80 shrink-0" />
          My Face
        </button>
        <button
          type="button"
          onClick={() => openStory("technologies")}
          className="rounded-full px-3.5 py-1.5 lg:px-4 lg:py-2 xl:px-5 text-sm xl:text-[15px] font-medium text-white/70 hover:text-white hover:bg-white/8 transition-all duration-200"
        >
          Technologies
        </button>
        <button
          type="button"
          onClick={() => openStory("usecases")}
          className="rounded-full px-3.5 py-1.5 lg:px-4 lg:py-2 xl:px-5 text-sm xl:text-[15px] font-medium text-white/70 hover:text-white hover:bg-white/8 transition-all duration-200"
        >
          Use Cases
        </button>

        <div
          ref={dropdownRef}
          className="relative z-[60]"
          onMouseLeave={() => setMoreOpen(false)}
        >
          <button
            type="button"
            onMouseEnter={() => setMoreOpen(true)}
            onClick={() => setMoreOpen((v) => !v)}
            className={`flex items-center gap-1 px-3.5 lg:px-4 xl:px-5 py-1.5 lg:py-2 rounded-full text-sm xl:text-[15px] whitespace-nowrap font-medium transition-all duration-200 ${
              moreOpen ? "text-white bg-white/8" : "text-white/60 hover:text-white"
            }`}
          >
            More
            <motion.span animate={{ rotate: moreOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
              <ChevronDown className="w-3 h-3" />
            </motion.span>
          </button>
          <AnimatePresence>
            {moreOpen ? (
              <motion.div
                initial={{ opacity: 0, y: 4, scale: 0.99 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 4, scale: 0.99 }}
                transition={{ duration: 0.14, ease: "easeOut" }}
                className="absolute left-1/2 top-full z-[70] w-[min(420px,calc(100vw-2rem))] -translate-x-1/2 pt-1"
              >
                <div className="rounded-2xl border border-white/10 bg-[rgba(18,18,18,0.97)] p-3 shadow-2xl backdrop-blur-2xl">
                <p className="px-1 pb-2 text-[11px] font-medium uppercase tracking-wider text-white/40">
                  Explore
                </p>
                <div className="grid gap-2 sm:grid-cols-2">
                  {MORE_LINKS.map(({ title, desc, href, icon: Icon }) => (
                    <a
                      key={href}
                      href={href}
                      target="_blank"
                      rel="noreferrer"
                      className="group flex flex-col gap-1 rounded-xl border border-white/8 bg-white/[0.04] p-3 hover:border-white/18 hover:bg-white/[0.07] transition-colors"
                    >
                      <Icon className="w-4 h-4 text-violet-300/90" />
                      <span className="text-sm font-medium text-white">{title}</span>
                      <span className="text-[11px] leading-snug text-white/45">{desc}</span>
                    </a>
                  ))}
                </div>
                <div className="mt-3 border-t border-white/10 pt-3">
                  <a
                    href="mailto:contact@aligilani.com"
                    className="flex items-center gap-2 rounded-lg px-2 py-2 text-sm text-white/75 hover:bg-white/8 hover:text-white"
                  >
                    <Mail className="w-4 h-4 text-white/50" />
                    contact@aligilani.com
                  </a>
                </div>
                </div>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>

        <a
          href="mailto:contact@aligilani.com"
          className="shrink-0 rounded-full border border-black/15 bg-white px-3 py-1.5 lg:px-3.5 lg:py-2 xl:px-4 text-sm xl:text-[15px] font-semibold text-black hover:bg-neutral-100 transition-colors"
        >
          Book a Call
        </a>
      </nav>

      {/* Desktop: same footprint as former command button (h-10 w-10) */}
      <motion.button
        type="button"
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
        aria-pressed={Boolean(isDarkMode)}
        className="hidden lg:flex fixed lg:top-[3.35rem] xl:top-[3.5rem] right-8 xl:right-14 z-[60] h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-white/14 bg-[rgba(24,24,30,0.34)] backdrop-blur-2xl shadow-[0_10px_35px_rgba(0,0,0,0.22)] pointer-events-auto"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setIsDarkMode((prev) => !prev);
        }}
      >
        <span className="pointer-events-none flex select-none items-center justify-center [&_svg]:block">
          <DarkModeSwitch
            checked={Boolean(isDarkMode)}
            onChange={() => {}}
            size={32}
            sunColor="#fbbf24"
            moonColor="#e2e8f0"
          />
        </span>
      </motion.button>

      {/* Mobile full-screen sheet */}
      <AnimatePresence>
        {mobileOpen ? (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            onClick={() => setMobileOpen(false)}
            className="fixed inset-0 z-[70] bg-black/45 backdrop-blur-[2px] p-4 sm:p-6 lg:hidden flex items-start justify-center"
          >
            <motion.div
              initial={{ opacity: 0, y: -14, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -12, scale: 0.98 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              onClick={(e) => e.stopPropagation()}
              className="relative mt-[4.5rem] sm:mt-[4.75rem] w-[88vw] sm:w-[78vw] md:w-[56vw] max-w-[560px] max-h-[70vh] overflow-y-auto rounded-2xl border border-white/12 bg-[rgba(10,10,12,0.86)] backdrop-blur-xl p-4 sm:p-5 shadow-[0_20px_60px_rgba(0,0,0,0.5),0_0_28px_rgba(168,85,247,0.2)]"
            >
              <div className="mb-4 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <img src={navLogo} alt="" className="h-9 w-9 object-contain rounded-full" />
                  <div>
                    <p className="text-sm font-medium text-white">Menu</p>
                    <p className="text-xs text-white/50">Ali Gilani · AliGen</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setMobileOpen(false)}
                  className="rounded-full px-3 py-1.5 text-xs font-medium text-white/70 hover:bg-white/10"
                >
                  Close
                </button>
              </div>

              <section className="mb-5">
                <h3 className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-white/40">
                  Discover
                </h3>
                <ul className="flex flex-col gap-1">
                  {[
                    { label: "My Face", key: "face", showUser: true },
                    { label: "Technologies", key: "technologies", showUser: false },
                    { label: "Use Cases", key: "usecases", showUser: false },
                  ].map(({ label, key, showUser }) => (
                    <li key={key}>
                      <button
                        type="button"
                        onClick={() => openStory(key)}
                        className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm text-white/90 hover:bg-white/8"
                      >
                        {showUser ? (
                          <User className="w-4 h-4 shrink-0 text-white/55" />
                        ) : (
                          <span className="w-4 shrink-0" aria-hidden />
                        )}
                        <span className="flex-1">{label}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              </section>

              <section className="mb-5">
                <h3 className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-white/40">
                  Creative
                </h3>
                <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3">
                  <div className="flex gap-2">
                    <Sparkles className="w-4 h-4 shrink-0 text-violet-300/90 mt-0.5" />
                    <p className="text-sm leading-relaxed text-white/75">
                      You can talk to AliGen below about Ali&apos;s work, projects, and background — or open the site
                      for the full portfolio.
                    </p>
                  </div>
                  <a
                    href={SITE}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg border border-white/12 bg-white/[0.06] px-3 py-2.5 text-sm font-medium text-white/85 hover:bg-white/10 transition-colors"
                  >
                    Discover full website
                    <ExternalLink className="h-3.5 w-3.5 shrink-0 text-white/45" />
                  </a>
                </div>
              </section>

              <section className="mb-5">
                <h3 className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-white/40">
                  Connect
                </h3>
                <ul className="flex flex-col gap-1">
                  <li>
                    <a
                      href="https://github.com/SyedAliRazaGilani"
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-white/90 hover:bg-white/8"
                    >
                      <Github className="w-4 h-4 text-white/55" />
                      GitHub
                      <ExternalLink className="ml-auto w-3.5 h-3.5 text-white/35" />
                    </a>
                  </li>
                  <li>
                    <a
                      href="mailto:contact@aligilani.com"
                      className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-white/90 hover:bg-white/8"
                    >
                      <Mail className="w-4 h-4 text-white/55" />
                      contact@aligilani.com
                    </a>
                  </li>
                </ul>
              </section>

              <section>
                <h3 className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-white/40">
                  Legal
                </h3>
                <a
                  href={SITE}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-white/70 hover:bg-white/8"
                >
                  <FileText className="w-4 h-4 text-white/45" />
                  © {new Date().getFullYear()} Ali Gilani · aligilani.com
                </a>
              </section>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <NavStoryPopup open={Boolean(storyOpen)} variant={storyOpen} onClose={() => setStoryOpen(null)} />
    </>
  );
}
