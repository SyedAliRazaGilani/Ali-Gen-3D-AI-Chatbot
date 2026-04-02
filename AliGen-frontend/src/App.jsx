import React, { useState, useEffect, useRef } from "react";
import { Loader } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Leva } from "leva";
import { Experience } from "./components/Experience";
import { UI } from "./components/UI";
import ButtonMain from "./components/ButtonMain";
import Preloader from "./components/Preloader";
import { BackgroundGradientAnimation } from "./components/BackgroundGradientAnimation";
import { WavyBackground } from "./components/WavyBackground";
import { useChat } from "./hooks/useChat";

const App = () => {
  const [showPreloader, setShowPreloader] = useState(true);
  const [showPopup, setShowPopup] = useState(false);
  const [isGradientBg, setIsGradientBg] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const audioRef = useRef(null);
  const audioContextRef = useRef(null);

  const [dotColor, setDotColor]= useState("black");

  useEffect(() => {
    // Disable scroll on mount
    const disableScroll = () => {
      document.body.style.overflow = "hidden";
    };
    
    disableScroll(); // Disable scroll when the app loads

    return () => {
      document.body.style.overflow = ""; // Cleanup when component is unmounted
    };
  }, []);

  useEffect(() => {
    if (isDarkMode) {
      document.body.style.backgroundImage = "none";
      document.body.style.backgroundColor = "#06060a";
      return;
    }
    if (isGradientBg) {
      document.body.style.backgroundImage = "linear-gradient(0deg, #aaa7a7 40%, #463889 90%)";
      document.body.style.backgroundColor = "";
    } else {
      document.body.style.backgroundImage = "none";
      document.body.style.backgroundColor = "black";
    }
  }, [isGradientBg, isDarkMode]);

  useEffect(() => {
    document.documentElement.dataset.theme = isDarkMode ? "dark" : "light";
    document.documentElement.style.colorScheme = isDarkMode ? "dark" : "light";
  }, [isDarkMode]);

  useEffect(() => {
    const mql = window.matchMedia("(max-width: 640px)");
    const apply = () => setIsSmallScreen(Boolean(mql.matches));
    apply();
    if (typeof mql.addEventListener === "function") {
      mql.addEventListener("change", apply);
      return () => mql.removeEventListener("change", apply);
    }
    // Safari fallback
    mql.addListener(apply);
    return () => mql.removeListener(apply);
  }, []);
  

  useEffect(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
    }
    const unlockAudio = () => {
      console.log("👂 Unlocking audio...");
      const audio = audioRef.current;
      if (!audio) return;

      // Replace silence with actual unmuted audio
      audio.src = "button_push.mp3"; // Replace with a real audio file
      audio.volume = 1; // Unmute and set volume to max
      audio.play()
        .then(() => {
          console.log("✅ Audio unlocked!");
          localStorage.setItem("audioUnlocked", "true");
        })
        .catch(err => console.error("⚠️ Playback error:", err));

      // Remove listeners after unlocking audio
      window.removeEventListener("click", unlockAudio);
      window.removeEventListener("keydown", unlockAudio);
      window.removeEventListener("touchstart", unlockAudio);
    };

    if (!localStorage.getItem("audioUnlocked")) {
      console.log("🔒 Waiting for user interaction to unlock audio...");
      window.addEventListener("click", unlockAudio, { once: true });
      window.addEventListener("keydown", unlockAudio, { once: true });
      window.addEventListener("touchstart", unlockAudio, { once: true });
    } else {
      console.log("🔓 Audio already unlocked.");
    }
  }, []);


  useEffect(() => {
    const keepAlive = () => {
      if (audioContextRef.current?.state === "suspended") {
        audioContextRef.current.resume().then(() => {
          console.log("🔊 Audio context resumed (keep alive)");
        });
      }
    };
    const interval = setInterval(keepAlive, 1000);
    return () => clearInterval(interval);
  }, []);


  useEffect(() => {
    setTimeout(() => {
      setShowPreloader(false);
      console.log(" Showing popup for audio permission");
      setShowPopup(true);
    }, 5000);
  }, []);


  const toggleBackground = () => {
    setIsGradientBg(!isGradientBg);
    setDotColor(isGradientBg ? "black" : "white");
  };

  const handlePopupClose = () => {
    const audio = audioRef.current;
    if (!audio) return;

    // Play audio only on user interaction
    audio.src = "/button-push.mp3"; // Replace with a real audio file
    audio.volume = 1; // Unmute and set volume to max

    audio.play()
      .then(() => {
        console.log("✅ Audio unlocked via popup");
        localStorage.setItem("audioUnlocked", "true");
        setShowPopup(false);
      })
      .catch(err => console.error("⚠️ Playback error:", err));
  };

  return (
    <div
      className="overflow-hidden h-full max-w-full bg-cover bg-center font-sans antialiased"
      style={{ position: "relative", height: "100vh", width: "100%", maxWidth: "100%" }}
    >
      {/* Preloader */}
      {showPreloader && (
        <div style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", zIndex: 10000000000 }}>
          <Preloader />
        </div>
      )}

      {/* UI Components */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          maxWidth: "100%",
          height: "100%",
          zIndex: 50,
        }}
      >
      <Leva hidden />
      <UI
        isDarkMode={isDarkMode}
        setIsDarkMode={setIsDarkMode}
        onToggleBackground={toggleBackground}
      />
      <div className="hidden" aria-hidden>
        <ButtonMain
          isDarkMode={isDarkMode}
          setIsDarkMode={setIsDarkMode}
          onToggleBackground={toggleBackground}
        />
      </div>
      </div>

      {/* Background */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          maxWidth: "100%",
          height: "100vh",
          zIndex: 20,
          overflow: "hidden",
        }}
        className="overflow-hidden h-full bg-cover bg-center">
       
        {isGradientBg ? (
          <BackgroundGradientAnimation isDarkMode={isDarkMode} />
        ) : (
          <WavyBackground isDarkMode={isDarkMode} />
        )}
      </div>

      {/* Canvas */}
      <Canvas
        shadows
        camera={{ position: [0, 0, 1], fov: 30 }}
        style={{
          position: "absolute",
          // On small screens, push avatar down so the mobile navbar doesn't cover the hair/head.
          top: isSmallScreen ? "56%" : "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          overflow: "hidden",
          zIndex: 30,
        }}
      >
        <Experience
          dotColor={isDarkMode ? "white" : isGradientBg ? "black" : "white"}
          audioRef= {audioRef}
          shadows
          style={{
            overflow: "hidden",
          }} />
      </Canvas>

      {/* Audio Unlock Popup */}
      {showPopup && (
        <>
          {/* Semi-transparent overlay */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              zIndex: 1000,
              pointerEvents: "auto",
            }}
          />
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              backgroundColor: "white",
              padding: "20px",
              borderRadius: "8px",
              boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
              zIndex: 1001,
              pointerEvents: "auto",
              display: "flex",               // Add flexbox to center content
              flexDirection: "column",       // Stack items vertically
              justifyContent: "center",     // Vertically center content
              alignItems: "center",         // Horizontally center content
              textAlign: "center",  
            }}
          >
            <p className="items-center justify-center mb-4">Click To Allow Audio</p>
            <button onClick={handlePopupClose} 
            className="rounded-lg bg-black text-white items-center justify-center"
            style=
            {{ padding: "10px 20px", 
            fontSize: "16px",
            cursor: "pointer" 
            }}>
              OK
            </button>
          </div>
        </>
      )}

      {/* Hidden Audio Element */}
      <audio ref={audioRef} />
    </div>
  );
};

export default App;
