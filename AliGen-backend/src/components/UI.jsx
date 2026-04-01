import { useRef, useState, useEffect } from "react"; // Import useEffect
import { useChat } from "../hooks/useChat";
import ChessProfileCard from "./ChessProfileCard";
import SpotifyCard from "./SpotifyCard";
import GamingProfileCard from "./GamingProfileCard";
import SoftwareSolutionsCard from "./SoftwareSolutionsCard";

export const UI = ({ hidden,  ...props }) => {
  const input = useRef();
  const { chat, loading, setLoading, message, error, userId } = useChat();
  const [isErrorVisible, setIsErrorVisible] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isChatVisible, setIsChatVisible] = useState(false);
  const [showProjects, setShowProjects] = useState(false);
  const [showHobbies, setShowHobbies] = useState(false);
  const [showChessCard, setShowChessCard] = useState(false);
  const [showPodcastCard, setShowPodcastCard] = useState(false);
  const [showGamingCard, setShowGamingCard] = useState(false);
  const [showSoftwareCard, setShowSoftwareCard] = useState(false);
  const [projects, setProjects] = useState([]);
  const [projectsLoading, setProjectsLoading] = useState(false);
  const [projectsError, setProjectsError] = useState(null);

  const backendUrl = import.meta.env.VITE_API_URL;
  const workUrl = "https://aligilani.com/Work";
  const projectGithubLinks = [
    "https://github.com/SyedAliRazaGilani/NLP-and-ML-Sentiment-Analysis-Prediction",
    "https://github.com/SyedAliRazaGilani/RAG-Pipeline",
    "https://github.com/SyedAliRazaGilani/Voice-to-Voice-LLM",
    "https://github.com/SyedAliRazaGilani/Train-and-Deploy-YOLO-Models",
  ];

  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  };

  useEffect(() => {
    if (error[userId]) {  // Error visibility per user
      setIsErrorVisible(true);
      const timer = setTimeout(() => {
        setIsErrorVisible(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, userId]);

  const sendMessage = () => {
    const text = input.current.value;
    if (!loading[userId] && !message) {
      setLoading((prevState) => ({ ...prevState, [userId]: true }));
        // ✅ Set localStorage when user interacts
      chat(text);  // Send message without passing userId, as it's handled in useChat
      input.current.value = "";
      localStorage.setItem("audioUnlocked", "true");
      window.dispatchEvent(new Event("storage")); 
      console.log("localstorage set to true on button click")
    }
  };

  const templateMessages = [
    { text: "About Me", type: "about" },
    { text: "Work", type: "work" },
    { text: "Hobbies", type: "hobbies" },
    { text: "Projects", type: "projects" },
  ];

  const handleTemplateClick = (messageType) => {
    if (!loading[userId] && !message) {
      setLoading((prevState) => ({ ...prevState, [userId]: true }));
      if (messageType === "projects") {
        setShowProjects(true);
        setShowHobbies(false);
        setProjectsError(null);
        setProjectsLoading(true);
        fetch(`${backendUrl}/projects`)
          .then((r) => r.json())
          .then((data) => setProjects(Array.isArray(data?.projects) ? data.projects : []))
          .catch((e) => setProjectsError(e?.message || "Failed to load projects"))
          .finally(() => setProjectsLoading(false));
      }
      if (messageType === "hobbies") {
        setShowHobbies(true);
        setShowProjects(false);
      }
      chat("", messageType);  // Send template message type (also speaks a general response)
      setIsChatVisible(true);
      localStorage.setItem("audioUnlocked", "true");
      window.dispatchEvent(new Event("storage")); 
      console.log("localstorage set to true on button click")
    }
  };

  return (
  <>
    <header className={`backdrop-blur-3xl z-20 transition-all duration-300`}
  >
    {/* Announcement Bar */}
    <div className="flex justify-center items-center py-3 bg-black text-white text-sm gap-3">
     <p>&copy; 2025 AliGen. All Rights Reserved.</p>
      <div className="inline-flex gap-1 items-center">
        <p className="text-white/60 hidden md:block">Gemini Flash 1.5 x Amazon Polly</p>
        {/* <ArrowRight className="h-4 w-4 inline-flex justify-center items-center" /> */}
      </div>
    </div>
    </header>

    <div className="fixed z-50 inset-0 flex justify-between ">
    {/* Responsive Logo */}
     <div className=" absolute top-4 py-10 lg:py-1 md:top-5 lg:mt-6 xl:mt-9 ml-6 lg:ml-16 flex items-center">
      <img
        src="/logosaas.png"
        alt="SaaS Logo"
        className="w-12 h-12  xl:w-20 xl:h-20 shadow-md transition-all duration-300 
                   hover:scale-110 hover:shadow-lg rounded-full"
      />
      <span className="md:ml-5  mt-1 ml-3 font-sans font-extrabold text-white text-2xl md:text-3xl ">
        AliGen
      </span>
     </div>
  

      {/* Question mark button */}
      <div
      className="absolute mt-2 z-50 top-10 right-10 md:right-20 md:top-14  lg:top-10 lg:right-24 xl:top-14 xl:right-28 cursor-pointer rounded-full"
      style={{ backgroundColor: "#1a1a1a", pointerEvents: "auto" }}
      >

      {/* Button */}
      <button
        className="relative hidden md:block overflow-hidden rounded-full p-[1px] focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50"
        onClick={toggleVisibility}
      >
        <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
        <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-slate-950 text-white backdrop-blur-3xl text-xl font-bold md:px-4 md:py-2 xl:px-6 xl:py-4 md:text-2xl lg:text-2xl xl:text-xl">
          ?
        </span>
      </button>

      {/* Pop-up Box (Visible on Click) */}
      {isVisible && (
        <div
          className="absolute top-16 text-sm md:text-lg lg:text-lg right-2 w-64 p-4 bg-gray-600 text-white rounded-md shadow-lg"
          style={{
            transition: "opacity 0.3s ease-in-out",
            backgroundColor: "#1a1a1a",
          }}
        >
          <p>You can talk to AliGen about anything, she gives the best advice!</p>
        </div>
      )}
    </div>

    <div className="container ">
    {isErrorVisible && (
        <div className="error-box">
          <p>{error[userId]}</p>
        </div>
      )}
    </div>


      {/* Template Message Buttons */}
  {!showProjects && !showHobbies ? (
    <div
      style={{
        position: "absolute",
        bottom: "6.5rem",
        left: "50%",
        transform: "translateX(-50%)",
        display: "flex",
        flexWrap: "wrap",
        gap: "1rem",
        width: "100%",
        justifyContent: "center",
        alignItems: "center",
        pointerEvents: "auto",
      }}
    >
      {templateMessages.map((msg, index) => (
        <button
          key={index}
          onClick={() => handleTemplateClick(msg.type)}
          className="lg:mb-4 xl:mb-0 -mb-2  relative inline-flex h-18 overflow-hidden rounded-full p-[2px] focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50"
        >
          <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
          <span className="mb-1  inline-flex font-sans font-medium h-full w-full cursor-pointer items-center justify-center rounded-full bg-gray-300 px-5 py-2 md:px-10 md:py-4 lg:px-8 lg:py-5 md:text-xl xl:px-7 xl:py-3  text-black backdrop-blur-3xl">
            {msg.text}
          </span>
        </button>
      ))}
    </div>
  ) : showProjects ? (
    <div
      style={{
        position: "absolute",
        bottom: "6.5rem",
        left: "50%",
        transform: "translateX(-50%)",
        width: "min(1000px, 92vw)",
        pointerEvents: "auto",
      }}
    >
      <div className="flex items-center justify-between mb-3 px-1">
        <div className="text-white font-bold text-xl">Projects</div>
        <div className="flex items-center gap-2">
          <a
            href={workUrl}
            target="_blank"
            rel="noreferrer"
            className="rounded-full bg-white/15 hover:bg-white/25 px-4 py-2 text-white font-medium border border-white/20 transition-colors"
          >
            View more
          </a>
          <button
            onClick={() => setShowProjects(false)}
            className="rounded-full bg-gray-200 px-4 py-2 text-black font-medium"
          >
            Back
          </button>
        </div>
      </div>

      {projectsLoading ? (
        <div className="text-white/80 px-1">Loading projects…</div>
      ) : projectsError ? (
        <div className="text-red-200 px-1">{projectsError}</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {projects.map((p, idx) => (
            <div
              key={`${p?.title || "project"}-${idx}`}
              role="button"
              tabIndex={0}
              onClick={() => {
                if (!p?.title) return;
                if (!loading[userId] && !message) {
                  setLoading((prevState) => ({ ...prevState, [userId]: true }));
                  chat(
                    `Tell me more about the project "${p.title}". What is it, what did Ali build, what tech stack was used, and what impact/metrics does it have?`
                  );
                  setIsChatVisible(true);
                  localStorage.setItem("audioUnlocked", "true");
                  window.dispatchEvent(new Event("storage"));
                }
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  e.currentTarget.click();
                }
              }}
              className="rounded-2xl border border-white/20 bg-black/40 backdrop-blur-xl p-4 text-white cursor-pointer hover:bg-black/55 transition-colors"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="font-bold text-base leading-tight">{p?.title || "Untitled"}</div>
                {projectGithubLinks[idx] ? (
                  <a
                    href={projectGithubLinks[idx]}
                    target="_blank"
                    rel="noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="relative shrink-0 overflow-hidden rounded-full p-[1px] focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50"
                    title="Open GitHub repo"
                  >
                    <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#6D28D9_45%,#393BB2_55%,#E2CBFF_100%)]" />
                    <span className="relative z-10 inline-flex items-center justify-center rounded-full bg-white px-3 py-1 text-sm text-black">
                    GitHub
                    </span>
                  </a>
                ) : null}
              </div>
              {p?.summary ? (
                <div
                  className="text-white/80 mt-1 text-sm"
                  style={{
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                  }}
                >
                  {p.summary}
                </div>
              ) : null}
              <div className="mt-4 flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (!p?.title) return;
                    if (!loading[userId] && !message) {
                      setLoading((prevState) => ({ ...prevState, [userId]: true }));
                      chat(
                        `Tell me more about the project "${p.title}". What is it, what did Ali build, what tech stack was used, and what impact/metrics does it have?`
                      );
                      setIsChatVisible(true);
                      localStorage.setItem("audioUnlocked", "true");
                      window.dispatchEvent(new Event("storage"));
                    }
                  }}
                  className="rounded-full bg-white/15 hover:bg-white/25 px-4 py-2 text-white font-medium border border-white/20 transition-colors text-sm"
                >
                  Ask more
                </button>
              </div>
            </div>
          ))}
          {projects.length === 0 ? (
            <div className="text-white/80">
              No projects found yet. Add them under the “## Projects” section in `AliGen-frontend/context/portfolio.md`.
            </div>
          ) : null}
        </div>
      )}
    </div>
  ) : showChessCard ? (
    <div
      style={{
        position: "absolute",
        bottom: "6.5rem",
        left: "50%",
        transform: "translateX(-50%)",
        width: "min(900px, 92vw)",
        pointerEvents: "auto",
      }}
    >
      <div className="flex items-center justify-between mb-3 px-1">
        <div className="text-white font-bold text-xl">Chess</div>
        <button
          onClick={() => setShowChessCard(false)}
          className="rounded-full bg-black px-4 py-2 text-white font-medium border border-white/15 hover:bg-black/80 transition-colors"
        >
          ← Back
        </button>
      </div>
      <ChessProfileCard />
    </div>
  ) : showGamingCard ? (
    <div
      style={{
        position: "absolute",
        bottom: "6.5rem",
        left: "50%",
        transform: "translateX(-50%)",
        width: "min(900px, 92vw)",
        pointerEvents: "auto",
      }}
    >
      <div className="flex items-center justify-between mb-3 px-1">
        <div className="text-white font-bold text-xl">Gaming</div>
        <button
          onClick={() => setShowGamingCard(false)}
          className="rounded-full bg-black px-4 py-2 text-white font-medium border border-white/15 hover:bg-black/80 transition-colors"
        >
          ← Back
        </button>
      </div>
      <GamingProfileCard />
    </div>
  ) : showSoftwareCard ? (
    <div
      style={{
        position: "absolute",
        bottom: "6.5rem",
        left: "50%",
        transform: "translateX(-50%)",
        width: "min(900px, 92vw)",
        pointerEvents: "auto",
      }}
    >
      <div className="flex items-center justify-between mb-3 px-1">
        <div className="text-white font-bold text-xl">Software Solutions</div>
        <button
          onClick={() => setShowSoftwareCard(false)}
          className="rounded-full bg-black px-4 py-2 text-white font-medium border border-white/15 hover:bg-black/80 transition-colors"
        >
          ← Back
        </button>
      </div>
      <SoftwareSolutionsCard />
    </div>
  ) : showPodcastCard ? (
    <div
      style={{
        position: "absolute",
        bottom: "6.5rem",
        left: "50%",
        transform: "translateX(-50%)",
        width: "min(900px, 92vw)",
        pointerEvents: "auto",
      }}
    >
      <div className="flex items-center justify-between mb-3 px-1">
        <div className="text-white font-bold text-xl">Podcast</div>
        <button
          onClick={() => setShowPodcastCard(false)}
          className="rounded-full bg-black px-4 py-2 text-white font-medium border border-white/15 hover:bg-black/80 transition-colors"
        >
          ← Back
        </button>
      </div>
      <SpotifyCard />
    </div>
  ) : (
    <div
      style={{
        position: "absolute",
        bottom: "6.5rem",
        left: "50%",
        transform: "translateX(-50%)",
        width: "min(900px, 92vw)",
        pointerEvents: "auto",
      }}
    >
      <div className="flex items-center justify-between mb-3 px-1">
        <div className="text-white font-bold text-xl">Hobbies</div>
        <button
          onClick={() => setShowHobbies(false)}
          className="rounded-full bg-black px-4 py-2 text-white font-medium border border-white/15 hover:bg-black/80 transition-colors"
        >
          ← Back
        </button>
      </div>

      <div className="flex flex-wrap gap-3">
        {[
          { label: "Gaming", type: "hobbies_gaming", openGamingCard: true },
          { label: "Chess", type: "hobbies_chess", openChessCard: true },
          { label: "Software Solutions", type: "hobbies_software_solutions", openSoftwareCard: true },
          { label: "Podcast", type: "hobbies_podcast", openPodcastCard: true },
        ].map((b) => (
          <button
            key={b.type}
            onClick={() => {
              if (b.openGamingCard) {
                setShowGamingCard(true);
              }
              if (b.openChessCard) {
                setShowChessCard(true);
              }
              if (b.openPodcastCard) {
                setShowPodcastCard(true);
              }
              if (b.openSoftwareCard) {
                setShowSoftwareCard(true);
              }
              if (!loading[userId] && !message) {
                setLoading((prevState) => ({ ...prevState, [userId]: true }));
                chat("", b.type);
                setIsChatVisible(true);
                localStorage.setItem("audioUnlocked", "true");
                window.dispatchEvent(new Event("storage"));
              }
            }}
            className="relative inline-flex overflow-hidden rounded-full p-[2px] focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50"
          >
            <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
            <span className="relative inline-flex cursor-pointer items-center justify-center rounded-full bg-gray-200 px-6 py-3 text-black font-sans font-medium backdrop-blur-3xl">
              {b.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  )}

{/* {isChatVisible && ( */}
    <div className="mb-2 md:mb-0 absolute bottom-2 left-1/2 transform -translate-x-1/2 flex items-center gap-2  p-1   bg-[#1a1a1a] rounded-full shadow-lg border border-[#333] pointer-events-auto w-[90%] max-w-[800px]">

  {/* Input Field */}
  <input
    className="flex-1 bg-transparent border-none text-white text-base sm:text-md md:text-xl pl-7 outline-none"
    placeholder="Hey, what's up..."
    ref={input}
    onKeyDown={(e) => {
      if (e.key === "Enter") sendMessage();
    }}
  />

  {/* Button */}
  <button
    disabled={loading[userId] || message}
    onClick={sendMessage}
    className="relative md:h-16 lg:h-20 xl:h-16 h-16 w-[30%] sm:w-[40%] md:w-[25%] max-w-[180px] 
    overflow-hidden rounded-full p-[1px] focus:outline-none focus:ring-2 focus:ring-slate-400 
    focus:ring-offset-2 focus:ring-offset-slate-50"
  >
    <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] 
    bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />

    <span className="inline-flex h-full w-full cursor-pointer items-center justify-center 
    rounded-full bg-slate-950 px-4 py-2 text-sm  md:text-lg lg:text-xl  md:font-medium text-white backdrop-blur-3xl">
      {loading[userId] || message ? "Sending" : "Send"}
    </span>
  </button>
</div>
{/* )} */}
    </div>

    </>
  );
};
