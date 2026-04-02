import { useRef, useState, useEffect } from "react"; // Import useEffect
import { useChat } from "../hooks/useChat";
import ChessProfileCard from "./ChessProfileCard";
import SpotifyCard from "./SpotifyCard";
import GamingProfileCard from "./GamingProfileCard";
import SoftwareSolutionsCard from "./SoftwareSolutionsCard";
import ProjectDetailCard from "./ProjectDetailCard";
import BlogDetailCard from "./BlogDetailCard";
import WorkDetailCard from "./WorkDetailCard";
import AliGenNavbar from "./AliGenNavbar";
import { workRoleWithoutDates } from "../utils/workText";
import mainLogo from "../assets/main-logo.png";
import projNlp from "../assets/proj-nlp.png";
import projRagNasa from "../assets/proj-rag-nasa.png";
import projVoiceLlm from "../assets/proj-voice-llm.png";
import projComputerVision from "../assets/proj-computer-vision.png";

function WorkListItem({ w, onDetails, className = "" }) {
  const company = w?.title?.trim() || "Untitled";
  const roleLine = w?.summary?.trim() || "";
  const roleNoDates = workRoleWithoutDates(roleLine);

  return (
    <div
      className={`rounded-xl border border-white/20 bg-black/40 backdrop-blur-xl p-2.5 sm:p-3 lg:rounded-2xl lg:p-2.5 text-white flex flex-col gap-1.5 max-lg:gap-2 lg:gap-1.5 h-full min-h-[6rem] lg:min-h-[6.25rem] ${className}`}
    >
      <div className="flex items-start justify-between gap-1.5 w-full min-w-0 lg:gap-2">
        <div className="min-w-0 flex-1 text-left">
          <div className="flex lg:hidden flex-col gap-1">
            <span className="font-bold text-xs leading-snug sm:text-sm line-clamp-2">
              {company}
            </span>
            {roleNoDates ? (
              <span className="text-white/75 text-[11px] leading-snug sm:text-xs line-clamp-2">
                {roleNoDates}
              </span>
            ) : null}
          </div>
          <div className="hidden lg:block font-bold text-sm line-clamp-2">{company}</div>
        </div>
        <button
          type="button"
          onClick={() => {
            if (!w?.title) return;
            onDetails();
          }}
          className="shrink-0 rounded-full bg-white/15 hover:bg-white/25 px-2 py-0.5 sm:px-2.5 sm:py-1 lg:px-2.5 text-white font-medium border border-white/20 transition-colors text-[11px] sm:text-xs lg:text-xs self-start"
        >
          Details
        </button>
      </div>
      {roleNoDates ? (
        <div className="hidden lg:block text-white/75 text-[11px] leading-snug line-clamp-2 w-full text-left">
          {roleNoDates}
        </div>
      ) : null}
    </div>
  );
}

export const UI = ({ hidden, isDarkMode, setIsDarkMode, onToggleBackground, ...props }) => {
  const input = useRef();
  const { chat, loading, setLoading, message, error, userId } = useChat();
  const [isErrorVisible, setIsErrorVisible] = useState(false);
  const [isChatVisible, setIsChatVisible] = useState(false);
  const [showProjects, setShowProjects] = useState(false);
  const [showBlogs, setShowBlogs] = useState(false);
  const [showWork, setShowWork] = useState(false);
  const [showHobbies, setShowHobbies] = useState(false);
  const [showChessCard, setShowChessCard] = useState(false);
  const [showPodcastCard, setShowPodcastCard] = useState(false);
  const [showGamingCard, setShowGamingCard] = useState(false);
  const [showSoftwareCard, setShowSoftwareCard] = useState(false);
  const [projects, setProjects] = useState([]);
  const [projectsLoading, setProjectsLoading] = useState(false);
  const [projectsError, setProjectsError] = useState(null);
  const [blogs, setBlogs] = useState([]);
  const [blogsLoading, setBlogsLoading] = useState(false);
  const [blogsError, setBlogsError] = useState(null);
  /** { title, summary, githubUrl, imageUrl } — set when opening a project detail; no LLM / chat. */
  const [projectDetail, setProjectDetail] = useState(null);
  /** { title, summary, postUrl } — blog detail panel; no LLM / chat. */
  const [blogDetail, setBlogDetail] = useState(null);
  const [workItems, setWorkItems] = useState([]);
  const [workLoading, setWorkLoading] = useState(false);
  const [workError, setWorkError] = useState(null);
  /** { title, summary } — work detail panel; no LLM / chat. */
  const [workDetail, setWorkDetail] = useState(null);

  const backendUrl = import.meta.env.VITE_API_URL;
  const workUrl = "https://aligilani.com/Work";
  const blogListUrl = "https://aligilani.com/Blog";
  const projectGithubLinks = [
    "https://github.com/SyedAliRazaGilani/NLP-and-ML-Sentiment-Analysis-Prediction",
    "https://github.com/SyedAliRazaGilani/RAG-Pipeline",
    "https://github.com/SyedAliRazaGilani/Voice-to-Voice-LLM",
    "https://github.com/SyedAliRazaGilani/Train-and-Deploy-YOLO-Models",
  ];
  /** Same order as API / portfolio: NLP, RAG, Voice-to-Voice, YOLO */
  const projectCoverImages = [projNlp, projRagNasa, projVoiceLlm, projComputerVision];

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
    { text: "Blogs", type: "blogs" },
  ];

  const handleTemplateClick = (messageType) => {
    if (!loading[userId] && !message) {
      setLoading((prevState) => ({ ...prevState, [userId]: true }));
      if (messageType === "about") {
        setShowProjects(false);
        setShowBlogs(false);
        setShowWork(false);
        setShowHobbies(false);
        setProjectDetail(null);
        setBlogDetail(null);
        setWorkDetail(null);
      }
      if (messageType === "projects") {
        setShowProjects(true);
        setShowBlogs(false);
        setShowHobbies(false);
        setShowWork(false);
        setWorkDetail(null);
        setBlogDetail(null);
        setProjectsError(null);
        setProjectsLoading(true);
        fetch(`${backendUrl}/projects`)
          .then((r) => r.json())
          .then((data) => setProjects(Array.isArray(data?.projects) ? data.projects : []))
          .catch((e) => setProjectsError(e?.message || "Failed to load projects"))
          .finally(() => setProjectsLoading(false));
      }
      if (messageType === "blogs") {
        setShowBlogs(true);
        setShowProjects(false);
        setShowHobbies(false);
        setShowWork(false);
        setProjectDetail(null);
        setWorkDetail(null);
        setBlogDetail(null);
        setBlogsError(null);
        setBlogsLoading(true);
        fetch(`${backendUrl}/blogs`)
          .then((r) => r.json())
          .then((data) => setBlogs(Array.isArray(data?.blogs) ? data.blogs : []))
          .catch((e) => setBlogsError(e?.message || "Failed to load blogs"))
          .finally(() => setBlogsLoading(false));
      }
      if (messageType === "work") {
        setShowWork(true);
        setShowProjects(false);
        setShowBlogs(false);
        setShowHobbies(false);
        setProjectDetail(null);
        setBlogDetail(null);
        setWorkDetail(null);
        setWorkError(null);
        setWorkLoading(true);
        fetch(`${backendUrl}/work`)
          .then((r) => r.json())
          .then((data) => setWorkItems(Array.isArray(data?.work) ? data.work : []))
          .catch((e) => setWorkError(e?.message || "Failed to load work experience"))
          .finally(() => setWorkLoading(false));
      }
      if (messageType === "hobbies") {
        setShowHobbies(true);
        setShowProjects(false);
        setShowBlogs(false);
        setShowWork(false);
        setWorkDetail(null);
        setBlogDetail(null);
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
    <header className="backdrop-blur-3xl z-20 w-full max-w-full overflow-x-hidden font-sans">
    {/* Announcement Bar */}
    <div
      className={`flex w-full max-w-full min-w-0 flex-nowrap justify-center items-center py-3 px-2 text-white text-sm gap-3 font-sans font-medium transition-colors duration-300 ${
        isDarkMode ? "bg-neutral-950" : "bg-black"
      }`}
    >
     <p>&copy; 2025 AliGen. All Rights Reserved.</p>
      <div className="inline-flex gap-1 items-center">
        <p className="text-white/60 hidden md:block">Gemini Flash 1.5 x Amazon Polly</p>
        {/* <ArrowRight className="h-4 w-4 inline-flex justify-center items-center" /> */}
      </div>
    </div>
    </header>

    <div className="fixed z-50 inset-0 flex justify-between pointer-events-none">
    {/* Logo: desktop only — mobile uses center menu pill */}
     <div className="hidden lg:flex absolute top-4 py-10 md:top-5 lg:top-[3.35rem] xl:top-[3.5rem] lg:py-0 lg:mt-0 xl:mt-0 ml-6 lg:ml-16 items-center font-sans pointer-events-auto">
      <img
        src={mainLogo}
        alt="AliGen"
        className="shrink-0 object-contain transition-opacity duration-300 hover:opacity-90
          w-12 h-12 md:w-14 md:h-14 rounded-full shadow-md hover:shadow-lg
          lg:h-12 lg:w-12 lg:rounded-none lg:shadow-none lg:hover:shadow-none"
      />
      <span className="mt-1 ml-3 font-medium text-white text-2xl md:text-3xl md:ml-5">
        AliGen
      </span>
     </div>

      <AliGenNavbar
        navLogo={mainLogo}
        isDarkMode={isDarkMode}
        setIsDarkMode={setIsDarkMode}
        onToggleBackground={onToggleBackground}
      />
    </div>

    <div className="container ">
    {isErrorVisible && (
        <div className="error-box">
          <p>{error[userId]}</p>
        </div>
      )}
    </div>


      {/* Template Message Buttons */}
  {!showProjects && !showBlogs && !showHobbies && !showWork ? (
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
          <span className="mb-1 inline-flex font-sans font-medium h-full w-full cursor-pointer items-center justify-center rounded-full bg-gray-300 px-5 py-2 md:px-10 md:py-4 lg:px-8 lg:py-5 md:text-xl xl:px-6 xl:py-2.5 xl:text-lg 2xl:px-5 2xl:py-2 2xl:text-base text-black backdrop-blur-3xl">
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
        width: "min(800px, 92vw)",
        pointerEvents: "auto",
      }}
    >
      {projectDetail ? (
        <>
          <div className="flex items-center justify-between mb-3 px-1">
            <div className="text-white font-bold text-lg md:text-xl">Project</div>
            <button
              type="button"
              onClick={() => setProjectDetail(null)}
              className="rounded-full bg-black px-4 py-2 text-white font-medium border border-white/15 hover:bg-black/80 transition-colors"
            >
              ← Back
            </button>
          </div>
          <ProjectDetailCard
            title={projectDetail.title}
            summary={projectDetail.summary}
            githubUrl={projectDetail.githubUrl}
            imageUrl={projectDetail.imageUrl}
          />
        </>
      ) : (
        <>
          <div className="flex items-center justify-between mb-3 px-1">
            <div className="text-white font-bold text-lg md:text-xl">Projects</div>
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
                type="button"
                onClick={() => {
                  setShowProjects(false);
                  setProjectDetail(null);
                }}
                className="rounded-full bg-black px-4 py-2 text-white font-medium border border-white/15 hover:bg-black/80 transition-colors"
              >
                ← Back
              </button>
            </div>
          </div>

          {projectsLoading ? (
            <div className="text-white/80 px-1">Loading projects…</div>
          ) : projectsError ? (
            <div className="text-red-200 px-1">{projectsError}</div>
          ) : projects.length === 0 ? (
            <div className="text-white/80 text-sm px-1">
              No projects found yet. Add them under the “## Projects” section in{" "}
              <code className="text-white/90">AliGen-backend/context/portfolio.md</code>.
            </div>
          ) : (
            <div className="w-full max-w-[42rem] mx-auto flex flex-col items-center gap-3">
              <div className="grid grid-cols-2 gap-3 w-full">
                {projects.slice(0, 4).map((p, idx) => (
                  <div
                    key={`${p?.title || "project"}-${idx}`}
                    className="rounded-xl border border-white/20 bg-black/40 backdrop-blur-xl p-2.5 sm:p-3 lg:rounded-2xl lg:p-2.5 text-white flex flex-col items-center text-center gap-2 sm:gap-2 min-h-[6rem] sm:min-h-[6.25rem] lg:min-h-[6.25rem]"
                  >
                    <div className="font-bold text-xs leading-snug sm:text-sm lg:text-sm line-clamp-2 w-full shrink-0">
                      {p?.title || "Untitled"}
                    </div>
                    <div className="flex w-full justify-center sm:flex-1 sm:items-center sm:min-h-0">
                      <button
                        type="button"
                        onClick={() => {
                          if (!p?.title) return;
                          setProjectDetail({
                            title: p.title,
                            summary: p.summary || "",
                            githubUrl: projectGithubLinks[idx] || "",
                            imageUrl: projectCoverImages[idx] || "",
                          });
                        }}
                        className="rounded-full bg-white/15 hover:bg-white/25 px-2 py-0.5 sm:px-2.5 sm:py-1 lg:px-2.5 text-white font-medium border border-white/20 transition-colors text-[11px] sm:text-xs lg:text-xs"
                      >
                        Details
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              {projects.length > 4 ? (
                <div className="flex flex-col items-center gap-3 w-full mt-1">
                  {projects.slice(4).map((p, idx) => (
                    <div
                      key={`${p?.title || "project"}-rest-${idx}`}
                      className="rounded-xl border border-white/20 bg-black/40 backdrop-blur-xl p-2.5 sm:p-3 lg:rounded-2xl lg:p-2.5 text-white w-full max-w-[21rem] flex flex-col items-center text-center gap-2 sm:gap-2 min-h-[6rem] sm:min-h-[6.25rem] lg:min-h-[6.25rem]"
                    >
                      <div className="font-bold text-xs leading-snug sm:text-sm lg:text-sm line-clamp-2 w-full shrink-0">
                        {p?.title || "Untitled"}
                      </div>
                      <div className="flex w-full justify-center sm:flex-1 sm:items-center sm:min-h-0">
                        <button
                          type="button"
                          onClick={() => {
                            if (!p?.title) return;
                            setProjectDetail({
                              title: p.title,
                              summary: p.summary || "",
                              githubUrl: projectGithubLinks[idx + 4] || "",
                              imageUrl: projectCoverImages[idx + 4] || "",
                            });
                          }}
                          className="rounded-full bg-white/15 hover:bg-white/25 px-2 py-0.5 sm:px-2.5 sm:py-1 lg:px-2.5 text-white font-medium border border-white/20 transition-colors text-[11px] sm:text-xs lg:text-xs"
                        >
                          Details
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : null}
            </div>
          )}
        </>
      )}
    </div>
  ) : showWork ? (
    <div
      style={{
        position: "absolute",
        bottom: "6.5rem",
        left: "50%",
        transform: "translateX(-50%)",
        width: "min(680px, 92vw)",
        pointerEvents: "auto",
      }}
      className="max-h-[calc(100vh-7rem)] flex flex-col min-h-0 overflow-hidden"
    >
      {workDetail ? (
        <>
          <div className="flex items-center justify-between mb-3 px-1 shrink-0">
            <div className="text-white font-bold text-lg md:text-xl">Experience</div>
            <button
              type="button"
              onClick={() => setWorkDetail(null)}
              className="rounded-full bg-black px-4 py-2 text-white font-medium border border-white/15 hover:bg-black/80 transition-colors"
            >
              ← Back
            </button>
          </div>
          <div className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden pr-0.5 pb-1">
            <WorkDetailCard title={workDetail.title} summary={workDetail.summary} />
          </div>
        </>
      ) : (
        <>
          <div className="flex items-center justify-between mb-3 px-1 shrink-0 gap-2">
            <div className="text-white font-bold text-lg md:text-xl">Work</div>
            <button
              type="button"
              onClick={() => {
                setShowWork(false);
                setWorkDetail(null);
              }}
              className="rounded-full bg-black px-4 py-2 text-white font-medium border border-white/15 hover:bg-black/80 transition-colors shrink-0"
            >
              ← Back
            </button>
          </div>

          {workLoading ? (
            <div className="text-white/80 px-1">Loading experience…</div>
          ) : workError ? (
            <div className="text-red-200 px-1">{workError}</div>
          ) : workItems.length === 0 ? (
            <div className="text-white/80 text-sm px-1">
              No roles found yet. Add them under the “## Work Experience” section in{" "}
              <code className="text-white/90">AliGen-backend/context/portfolio.md</code>.
            </div>
          ) : (
            <div className="w-full max-w-[44rem] mx-auto min-h-0 flex-1 overflow-y-auto overflow-x-hidden pr-0.5 pb-1">
              {/* Below lg: 2 columns; last row centers a single card when count is odd */}
              <div className="grid grid-cols-2 gap-2 sm:gap-2.5 w-full lg:hidden">
                {workItems.map((w, idx) => {
                  const isLastOdd =
                    workItems.length % 2 === 1 && idx === workItems.length - 1;
                  if (isLastOdd) {
                    return (
                      <div
                        key={`${w?.title || "work"}-${idx}`}
                        className="col-span-2 flex justify-center"
                      >
                        <WorkListItem
                          w={w}
                          className="w-full max-w-[calc((100%-0.5rem)/2)] sm:max-w-[calc((100%-0.625rem)/2)]"
                          onDetails={() =>
                            setWorkDetail({
                              title: w.title,
                              summary: w.summary || "",
                            })
                          }
                        />
                      </div>
                    );
                  }
                  return (
                    <WorkListItem
                      key={`${w?.title || "work"}-${idx}`}
                      w={w}
                      onDetails={() =>
                        setWorkDetail({
                          title: w.title,
                          summary: w.summary || "",
                        })
                      }
                    />
                  );
                })}
              </div>

              {/* lg+: 2 centered on top, then 3-column grid for the rest; shorter cards */}
              <div className="hidden lg:flex flex-col gap-2.5 w-full">
                {workItems.length > 0 ? (
                  <div className="flex w-full justify-center gap-2.5">
                    {workItems.slice(0, 2).map((w, idx) => (
                      <WorkListItem
                        key={`${w?.title || "work"}-lg-top-${idx}`}
                        w={w}
                        className="h-full w-[calc((100%-1.25rem)/3)] max-w-[calc((100%-1.25rem)/3)] shrink-0"
                        onDetails={() =>
                          setWorkDetail({
                            title: w.title,
                            summary: w.summary || "",
                          })
                        }
                      />
                    ))}
                  </div>
                ) : null}
                {workItems.length > 2 ? (
                  <div className="grid grid-cols-3 gap-2.5 w-full items-stretch">
                    {workItems.slice(2).map((w, idx) => (
                      <WorkListItem
                        key={`${w?.title || "work"}-lg-grid-${idx + 2}`}
                        w={w}
                        onDetails={() =>
                          setWorkDetail({
                            title: w.title,
                            summary: w.summary || "",
                          })
                        }
                      />
                    ))}
                  </div>
                ) : null}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  ) : showBlogs ? (
    <div
      style={{
        position: "absolute",
        bottom: "6.5rem",
        left: "50%",
        transform: "translateX(-50%)",
        width: "min(800px, 92vw)",
        pointerEvents: "auto",
      }}
    >
      {blogDetail ? (
        <>
          <div className="flex items-center justify-between mb-3 px-1">
            <div className="text-white font-bold text-lg md:text-xl">Blog</div>
            <button
              type="button"
              onClick={() => setBlogDetail(null)}
              className="rounded-full bg-black px-4 py-2 text-white font-medium border border-white/15 hover:bg-black/80 transition-colors"
            >
              ← Back
            </button>
          </div>
          <BlogDetailCard
            title={blogDetail.title}
            summary={blogDetail.summary}
            postUrl={blogDetail.postUrl}
            imageUrl={blogDetail.imageUrl}
          />
        </>
      ) : (
        <>
          <div className="flex items-center justify-between mb-3 px-1">
            <div className="text-white font-bold text-lg md:text-xl">Blogs</div>
            <div className="flex items-center gap-2">
              <a
                href={blogListUrl}
                target="_blank"
                rel="noreferrer"
                className="rounded-full bg-white/15 hover:bg-white/25 px-4 py-2 text-white font-medium border border-white/20 transition-colors"
              >
                View more
              </a>
              <button
                type="button"
                onClick={() => {
                  setShowBlogs(false);
                  setBlogDetail(null);
                }}
                className="rounded-full bg-black px-4 py-2 text-white font-medium border border-white/15 hover:bg-black/80 transition-colors"
              >
                ← Back
              </button>
            </div>
          </div>

          {blogsLoading ? (
            <div className="text-white/80 px-1">Loading blogs…</div>
          ) : blogsError ? (
            <div className="text-red-200 px-1">{blogsError}</div>
          ) : blogs.length === 0 ? (
            <div className="text-white/80 text-sm px-1">
              No blog posts found yet. Add them under the “## Blogs” section in{" "}
              <code className="text-white/90">AliGen-backend/context/portfolio.md</code>.
            </div>
          ) : (
            <div className="w-full max-w-[42rem] mx-auto flex flex-col items-center gap-3">
              <div className="grid grid-cols-2 gap-3 w-full">
                {blogs.slice(0, 4).map((b, idx) => (
                  <div
                    key={`${b?.title || "blog"}-${idx}`}
                    className="rounded-xl border border-white/20 bg-black/40 backdrop-blur-xl p-2.5 sm:p-3 lg:rounded-2xl lg:p-2.5 text-white flex flex-col items-center text-center gap-2 sm:gap-2 min-h-[6rem] sm:min-h-[6.25rem] lg:min-h-[6.25rem]"
                  >
                    <div className="font-bold text-xs leading-snug sm:text-sm lg:text-sm line-clamp-2 w-full shrink-0">
                      {b?.title || "Untitled"}
                    </div>
                    <div className="flex w-full justify-center sm:flex-1 sm:items-center sm:min-h-0">
                      <button
                        type="button"
                        onClick={() => {
                          if (!b?.title) return;
                          setBlogDetail({
                            title: b.title,
                            summary: b.summary || "",
                            postUrl: b.url || "",
                            imageUrl: b.imageUrl || "",
                          });
                        }}
                        className="rounded-full bg-white/15 hover:bg-white/25 px-2 py-0.5 sm:px-2.5 sm:py-1 lg:px-2.5 text-white font-medium border border-white/20 transition-colors text-[11px] sm:text-xs lg:text-xs"
                      >
                        Details
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              {blogs.length > 4 ? (
                <div className="flex flex-col items-center gap-3 w-full mt-1">
                  {blogs.slice(4).map((b, idx) => (
                    <div
                      key={`${b?.title || "blog"}-rest-${idx}`}
                      className="rounded-xl border border-white/20 bg-black/40 backdrop-blur-xl p-2.5 sm:p-3 lg:rounded-2xl lg:p-2.5 text-white w-full max-w-[21rem] flex flex-col items-center text-center gap-2 sm:gap-2 min-h-[6rem] sm:min-h-[6.25rem] lg:min-h-[6.25rem]"
                    >
                      <div className="font-bold text-xs leading-snug sm:text-sm lg:text-sm line-clamp-2 w-full shrink-0">
                        {b?.title || "Untitled"}
                      </div>
                      <div className="flex w-full justify-center sm:flex-1 sm:items-center sm:min-h-0">
                        <button
                          type="button"
                          onClick={() => {
                            if (!b?.title) return;
                            setBlogDetail({
                              title: b.title,
                              summary: b.summary || "",
                              postUrl: b.url || "",
                              imageUrl: b.imageUrl || "",
                            });
                          }}
                          className="rounded-full bg-white/15 hover:bg-white/25 px-2 py-0.5 sm:px-2.5 sm:py-1 lg:px-2.5 text-white font-medium border border-white/20 transition-colors text-[11px] sm:text-xs lg:text-xs"
                        >
                          Details
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : null}
            </div>
          )}
        </>
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
        width: "min(800px, 92vw)",
        pointerEvents: "auto",
      }}
    >
      <div className="flex items-center justify-between mb-3 px-1">
        <div className="text-white font-bold text-lg md:text-xl">Hobbies</div>
        <button
          type="button"
          onClick={() => setShowHobbies(false)}
          className="rounded-full bg-black px-4 py-2 text-white font-medium border border-white/15 hover:bg-black/80 transition-colors"
        >
          ← Back
        </button>
      </div>

      <div className="w-full max-w-[42rem] mx-auto flex flex-col items-center gap-3">
        <div className="grid grid-cols-2 gap-3 w-full">
          {[
            {
              label: "Gaming",
              type: "hobbies_gaming",
              open: () => setShowGamingCard(true),
            },
            {
              label: "Chess",
              type: "hobbies_chess",
              open: () => setShowChessCard(true),
            },
            {
              label: "Software Solutions",
              type: "hobbies_software_solutions",
              open: () => setShowSoftwareCard(true),
            },
            {
              label: "Podcast",
              type: "hobbies_podcast",
              open: () => setShowPodcastCard(true),
            },
          ].map((b) => (
            <div
              key={b.type}
              className="rounded-xl border border-white/20 bg-black/40 backdrop-blur-xl p-2.5 sm:p-3 lg:rounded-2xl lg:p-2.5 text-white flex flex-col items-center text-center gap-2 sm:gap-2 min-h-[6rem] sm:min-h-[6.25rem] lg:min-h-[6.25rem]"
            >
              <div className="font-bold text-xs leading-snug sm:text-sm lg:text-sm line-clamp-2 w-full shrink-0">
                {b.label}
              </div>
              <div className="flex w-full justify-center sm:flex-1 sm:items-center sm:min-h-0">
                <button
                  type="button"
                  onClick={() => {
                    // Hobbies voice line plays once from the main "Hobbies" chip (messageType "hobbies").
                    // Sub-cards only open detail panels — no second /chat call.
                    b.open();
                    setIsChatVisible(true);
                    localStorage.setItem("audioUnlocked", "true");
                    window.dispatchEvent(new Event("storage"));
                  }}
                  className="rounded-full bg-white/15 hover:bg-white/25 px-2 py-0.5 sm:px-2.5 sm:py-1 lg:px-2.5 text-white font-medium border border-white/20 transition-colors text-[11px] sm:text-xs lg:text-xs"
                >
                  Details
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )}

{/* {isChatVisible && ( */}
    <div className="mb-2 md:mb-0 absolute bottom-2 left-1/2 transform -translate-x-1/2 flex items-center gap-2 p-1 bg-[#1a1a1a] rounded-full shadow-lg border border-[#333] pointer-events-auto w-[90%] max-w-[800px] font-sans xl:max-w-[720px] 2xl:max-w-[660px]">

  {/* Input Field */}
  <input
    className="flex-1 bg-transparent border-none text-white text-base sm:text-md md:text-xl xl:text-lg 2xl:text-base pl-7 xl:pl-6 2xl:pl-5 outline-none font-sans font-medium placeholder:text-white/45"
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
    className="relative md:h-16 lg:h-20 xl:h-14 2xl:h-12 h-16 w-[30%] sm:w-[40%] md:w-[25%] max-w-[180px] xl:max-w-[160px] 2xl:max-w-[140px]
    overflow-hidden rounded-full p-[1px] focus:outline-none focus:ring-2 focus:ring-slate-400 
    focus:ring-offset-2 focus:ring-offset-slate-50"
  >
    <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] 
    bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />

    <span className="inline-flex h-full w-full cursor-pointer items-center justify-center 
    rounded-full bg-slate-950 px-4 py-2 text-sm md:text-lg lg:text-xl xl:text-base 2xl:text-sm font-sans font-medium text-white backdrop-blur-3xl">
      {loading[userId] || message ? "Sending" : "Send"}
    </span>
  </button>
</div>
{/* )} */}

    </>
  );
};
