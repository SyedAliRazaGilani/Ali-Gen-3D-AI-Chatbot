import { exec } from "child_process";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import { promises as fs } from "fs";
import Groq from "groq-sdk";
import { PollyClient, SynthesizeSpeechCommand } from "@aws-sdk/client-polly"; // AWS SDK v3 imports
dotenv.config();

// Site/API markdown (projects, blogs, work — full detail, URLs, images)
let portfolioSiteMd = "";
// Slim markdown injected into chat prompts only
let portfolioLlmContext = "";

const PORTFOLIO_SITE_PATH = "context/portfolio.md";
const PORTFOLIO_LLM_PATH = "context/portfolio-llm.md";

try {
  portfolioSiteMd = await fs.readFile(PORTFOLIO_SITE_PATH, "utf8");
  console.log(`Loaded portfolio site data: ${PORTFOLIO_SITE_PATH}`);
} catch (err) {
  console.warn(
    `Could not read ${PORTFOLIO_SITE_PATH}. /projects, /blogs, /work will be empty until it exists.`,
    err?.message || err
  );
}

try {
  portfolioLlmContext = await fs.readFile(PORTFOLIO_LLM_PATH, "utf8");
  console.log(`Loaded portfolio LLM context: ${PORTFOLIO_LLM_PATH}`);
} catch (err) {
  console.warn(
    `Could not read ${PORTFOLIO_LLM_PATH}. LLM text chat will use empty context (no fallback to portfolio.md — keeps token cost low).`,
    err?.message || err
  );
  portfolioLlmContext = "";
}

function extractProjectsFromContext(md) {
  if (!md) return [];
  const lines = md.split(/\r?\n/);
  const isProjectsHeader = (l) => /^##\s+Projects\b/i.test(l.trim());
  let inProjects = false;
  const projects = [];
  let current = null;

  for (const raw of lines) {
    const line = raw.trim();
    if (!inProjects) {
      if (isProjectsHeader(line)) inProjects = true;
      continue;
    }

    // Stop when next section starts
    if (/^##\s+/.test(line) && !isProjectsHeader(line)) break;

    // New bullet item: "- Title — summary" OR "- Title : summary" OR "- Title"
    const bullet = line.match(/^-\s+(.+?)\s*$/);
    if (bullet) {
      const rest = bullet[1].trim();
      let title = rest;
      let summary = "";

      // Prefer em-dash separator first, then colon.
      const dashSplit = rest.split(/\s+—\s+/);
      if (dashSplit.length >= 2) {
        title = dashSplit[0].trim();
        summary = dashSplit.slice(1).join(" — ").trim();
      } else {
        const colonSplit = rest.split(/\s*:\s*/);
        if (colonSplit.length >= 2) {
          title = colonSplit[0].trim();
          summary = colonSplit.slice(1).join(": ").trim();
        }
      }

      current = { title, summary };
      projects.push(current);
      continue;
    }

    // Continuation lines: attach to last project's summary (supports multi-line descriptions)
    if (current && line) {
      current.summary = current.summary ? `${current.summary} ${line}` : line;
    }
  }

  return projects;
}

function extractWorkExperienceFromContext(md) {
  if (!md) return [];
  const lines = md.split(/\r?\n/);
  const isWorkHeader = (l) => /^##\s+Work Experience\b/i.test(l.trim());
  let inWork = false;
  const items = [];
  let current = null;

  for (const raw of lines) {
    const line = raw.trim();
    if (!inWork) {
      if (isWorkHeader(line)) inWork = true;
      continue;
    }

    if (/^##\s+/.test(line) && !isWorkHeader(line)) break;

    const bullet = line.match(/^-\s+(.+?)\s*$/);
    if (bullet) {
      const rest = bullet[1].trim();
      let title = rest;
      let summary = "";

      const dashSplit = rest.split(/\s+—\s+/);
      if (dashSplit.length >= 2) {
        title = dashSplit[0].trim();
        summary = dashSplit.slice(1).join(" — ").trim();
      } else {
        const colonSplit = rest.split(/\s*:\s*/);
        if (colonSplit.length >= 2) {
          title = colonSplit[0].trim();
          summary = colonSplit.slice(1).join(": ").trim();
        }
      }

      current = { title, summary };
      items.push(current);
      continue;
    }

    if (current && line) {
      current.summary = current.summary ? `${current.summary} ${line}` : line;
    }
  }

  return items;
}

/** Strip trailing `(link: …)` / `(image: …)` from blog summary (any order). */
function parseBlogMeta(text) {
  let s = (text || "").trim();
  let url = "";
  let imageUrl = "";
  const linkRe = /\s*\(link:\s*(https?:\/\/[^)]+)\)\s*$/i;
  const imgRe = /\s*\(image:\s*(https?:\/\/[^)]+)\)\s*$/i;
  let m;
  for (;;) {
    if ((m = s.match(imgRe))) {
      imageUrl = m[1].trim();
      s = s.slice(0, m.index).trim();
      continue;
    }
    if ((m = s.match(linkRe))) {
      url = m[1].trim();
      s = s.slice(0, m.index).trim();
      continue;
    }
    break;
  }
  return { summary: s, url, imageUrl };
}

function extractBlogsFromContext(md) {
  if (!md) return [];
  const lines = md.split(/\r?\n/);
  const isBlogsHeader = (l) => /^##\s+Blogs\b/i.test(l.trim());
  let inBlogs = false;
  const rawItems = [];
  let current = null;

  for (const raw of lines) {
    const line = raw.trim();
    if (!inBlogs) {
      if (isBlogsHeader(line)) inBlogs = true;
      continue;
    }

    if (/^##\s+/.test(line) && !isBlogsHeader(line)) break;

    const bullet = line.match(/^-\s+(.+?)\s*$/);
    if (bullet) {
      const rest = bullet[1].trim();
      let title = rest;
      let summary = "";

      const dashSplit = rest.split(/\s+—\s+/);
      if (dashSplit.length >= 2) {
        title = dashSplit[0].trim();
        summary = dashSplit.slice(1).join(" — ").trim();
      } else {
        const colonSplit = rest.split(/\s*:\s*/);
        if (colonSplit.length >= 2) {
          title = colonSplit[0].trim();
          summary = colonSplit.slice(1).join(": ").trim();
        }
      }

      current = { title, summary };
      rawItems.push(current);
      continue;
    }

    if (current && line) {
      current.summary = current.summary ? `${current.summary} ${line}` : line;
    }
  }

  return rawItems.map((b) => {
    const { summary, url, imageUrl } = parseBlogMeta(b.summary || "");
    return { title: b.title, summary, url, imageUrl };
  });
}

// Initialize Groq
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY || "-",
});

// Initialize AWS Polly (v3)
const pollyClient = new PollyClient({
  region: process.env.AWS_REGION || "us-east-1", // Ensure the region is set
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const app = express();
app.use(express.json());
// Railway and most PaaS set PORT; default for local dev.
const port = process.env.PORT || 3000;

// app.use(cors());

app.use(cors({
  origin: process.env.FRONTEND_URL || "*",  // Allow requests from your frontend URL (or all origins)
  methods: ["GET", "POST", "OPTIONS"],     // Allow the necessary HTTP methods
  allowedHeaders: ["Content-Type", "Authorization"],  // Allow specific headers
  credentials: true,  // If you are using cookies or sessions
  preflightContinue: false,  // If you want to handle preflight requests manually (optional)
  optionsSuccessStatus: 204  // Some legacy browsers (like IE) may require this
}));

// Function to remove audio files
const removeAudioFiles = async (userId, messageIndex) => {
  try {
    const mp3File = `audios/${userId}_message_${messageIndex}.mp3`;
    const wavFile = `audios/${userId}_message_${messageIndex}.wav`;
    const jsonFile = `audios/${userId}_message_${messageIndex}.json`;

    // Remove the files
    await fs.unlink(mp3File);
    await fs.unlink(wavFile);
    await fs.unlink(jsonFile);

    console.log(`Deleted audio files for message ${messageIndex}`);
  } catch (err) {
    console.error('Error deleting audio files:', err);
  }
};


// In-memory storage for each user's session
const userSessions = {}; // This will store chat history and session locks per user

// Helper function to get or initialize chat history for a user
const getUserChatHistory = (userId) => {
  if (!userSessions[userId]) {
    userSessions[userId] = {
      chatHistory: [],
    };
  }
  return userSessions[userId];
};

// Helper function to add a message to user chat history
const addToUserChatHistory = (userId, role, message) => {
  const userSession = getUserChatHistory(userId);
  userSession.chatHistory.push({ role, message });
  // Limit chat history to the last 5 messages (adjust as needed)
  if (userSession.chatHistory.length > 5) {
    userSession.chatHistory.shift();
  }
};


app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/projects", (req, res) => {
  res.json({ projects: extractProjectsFromContext(portfolioSiteMd) });
});

app.get("/blogs", (req, res) => {
  res.json({ blogs: extractBlogsFromContext(portfolioSiteMd) });
});

app.get("/work", (req, res) => {
  res.json({ work: extractWorkExperienceFromContext(portfolioSiteMd) });
});

const execCommand = (command) => {
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) reject(error);
      resolve(stdout);
    });
  });
};

// Lip-sync tools (optional in production; required only if you want mouthCues for Polly-generated replies).
// On Railway, install ffmpeg via Nixpacks packages and install Rhubarb into ./bin via init.sh.
const ffmpegPath = (process.env.FFMPEG_PATH || "ffmpeg").trim();
const rhubarbPath =
  (process.env.RHUBARB_PATH || "./bin/Rhubarb-Lip-Sync-1.13.0-Linux/rhubarb").trim();

const logToolStatus = async (label, p) => {
  if (!p) return;
  // If a bare command is provided (e.g. "ffmpeg"), don't pre-check with fs.access.
  if (!p.includes("/") && !p.includes("\\") && !p.includes(".")) {
    console.log(`index.js: ${label} set to command: ${p}`);
    return;
  }
  try {
    await fs.access(p, fs.constants.F_OK);
    console.log(`index.js: Using ${label} at: ${p}`);
  } catch {
    console.warn(`index.js: ${label} not found at: ${p}`);
  }
};

await logToolStatus("FFmpeg", ffmpegPath);
await logToolStatus("Rhubarb", rhubarbPath);


const lipSyncMessage = async (userId, messageIndex) => { 
  const time = new Date().getTime();
  console.log(`Starting conversion for message ${messageIndex} of user ${userId}`);
  
  if (!ffmpegPath || !rhubarbPath) {
    throw new Error("FFmpeg/Rhubarb paths not configured");
  }

  // Convert mp3 to wav using ffmpeg
  await execCommand(`"${ffmpegPath}" -y -i "audios/${userId}_message_${messageIndex}.mp3" "audios/${userId}_message_${messageIndex}.wav"`);
  
  console.log(`Conversion done in ${new Date().getTime() - time}ms`);

  // Perform lip sync using Rhubarb
  await execCommand(`"${rhubarbPath}" -f json -o "audios/${userId}_message_${messageIndex}.json" "audios/${userId}_message_${messageIndex}.wav" -r phonetic`);

  console.log(`Lip sync done in ${new Date().getTime() - time}ms`);
};

// Extract JSON from Gemini response (handles Markdown code blocks)
const extractJsonFromResponse = (response) => {
  try {
    // Remove Markdown code block syntax (```json and ```)
    const cleanedResponse = response.replace(/```json|```/g, "").trim();
    return JSON.parse(cleanedResponse);
  } catch (error) {
    console.error("Failed to extract JSON from response:", error);
    return null;
  }
};

// Function to generate speech using Amazon Polly (v3)
const textToSpeechPolly = async (text, fileName) => {
  const params = {
    Text: text,
    OutputFormat: "mp3",
    VoiceId: "Matthew",
  };

  const command = new SynthesizeSpeechCommand(params);

  try {
    const data = await pollyClient.send(command); // Using `send` method for v3
    await fs.writeFile(fileName, data.AudioStream, "binary");
  } catch (err) {
    console.error("Error synthesizing speech with Polly:", err);
    throw err; // Reject if error occurs
  }
};

app.post("/chat", async (req, res) => {
  console.log("Received chat request:", req.body); // Log incoming request
  const userMessage = req.body.message;
  const messageType = req.body.messageType;
  const userId = req.body.userId || "default"; // Use userId to track chat history

  console.log(userMessage);
  console.log(messageType);

  
  
    if (!userMessage && !messageType) {
      console.log("No message or message type provided, sending default response");
      res.send({
        messages: [
          {
            text: "Hi, you have to type something in the chatbox",
            audio: await audioFileToBase64("audios/no-msg-sent.wav"),
            lipsync: await readJsonTranscript("audios/no-msg-sent.json"),
            facialExpression: "default",
            animation: "Stretching",
          },
        ],
      });
      return;
    }

    if (!process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY || process.env.GROQ_API_KEY === "-") {
      console.log("Missing API keys, sending error response");
      res.send({
        messages: [
          {
            text: "Hey fellow developer, props to you for building the project. You have to get your own API keys now.",
            audio: await audioFileToBase64("audios/no-api-keys.wav"),
            lipsync: await readJsonTranscript("audios/no-api-keys.json"),
            facialExpression: "angry",
            animation: "Angry",
          },
        ],
      });
      return;
    }

    // Nav template clicks (about, work, hobbies, …): pre-built WAV + lipsync JSON only — no Groq, no Polly on these paths.
    if (messageType === "about") {
      console.log("Template msg: about");
      res.send({
        messages: [
          {
            text: "Hi I am Ali, an AI Software Engineer and Data Scientist who has been building production-ready software, data pipelines, and AI systems across leading UK and US corporations for the past 5 years. I build engaging systems that deliver value and have a Master’s in Data Science and a strong full-stack background.",
            audio: await audioFileToBase64("audios/about-me.wav"),
            lipsync: await readJsonTranscript("audios/about-me.json"),
            facialExpression: "smile",
            animation: "Idle",
          },
        ],
      });
      return;
    }

    if (messageType === "work") {
      console.log("Template msg: work");
      res.send({
        messages: [
          {
            text: "I have built and delivered software and data-driven solutions across multiple organisations, working as a Software Engineer at SochTekkkk technologies, Ragzon Solutions, and then i2c Inc., followed by machine learning research at Brunel University. I now work at SAP Faioneer as Technology Consultant, delivering enterprise-scale solutions in partnership with Nationwide Building Society in the UK.",
            audio: await audioFileToBase64("audios/work.wav"),
            lipsync: await readJsonTranscript("audios/work.json"),
            facialExpression: "default",
            animation: "Idle",
          },
        ],
      });
      return;
    }

    if (messageType === "hobbies") {
      console.log("Template msg: hobbies");
      res.send({
        messages: [
          {
            text: "I enjoy building end-to-end software solutions that are engaging and create real value for businesses. Outside of work, I’m an active chess player and was the Chess Captain at my university. I also enjoy playing Counter-Strike and listening to podcasts that broaden my perspective.",
            audio: await audioFileToBase64("audios/hobbies.wav"),
            lipsync: await readJsonTranscript("audios/hobbies.json"),
            facialExpression: "smile",
            animation: "Stretching",
          },
        ],
      });
      return;
    }

    if (messageType === "projects") {
      console.log("Template msg: projects");
      res.send({
        messages: [
          {
            text: "I have worked on a range of end-to-end projects including Natural Language Processing & Machine Learning Sentiment Analysis, a Retrieval-Augmented Generation rag pipeline, Voice-to-Voice LLM assistant enabling real-time speech interaction, and a YOLO-based object detection system that identifies items and estimates nutritional values in real time. I have also built full stack software solutions with engaging User Interfaces. To view them visit my portfolio to understand how I can add value through my skills.",
            audio: await audioFileToBase64("audios/projects.wav"),
            lipsync: await readJsonTranscript("audios/projects.json"),
            facialExpression: "smile",
            animation: "Thinking",
          },
        ],
      });
      return;
    }

    if (messageType === "blogs") {
      console.log("Template msg: blogs");
      res.send({
        messages: [
          {
            text: "I write about practical AI and ML applications, covering topics such as RAG vs Fine-Tuning for Enterprise Assistants, Building ML Pipelines on Azure, Evaluating ML Models Beyond Accuracy, and Model Drift Detection and Retraining, sharing insights on deployment, robustness, and production-ready AI practices. To view them, visit my portfolio to read my views.",
            audio: await audioFileToBase64("audios/blogs.wav"),
            lipsync: await readJsonTranscript("audios/blogs.json"),
            facialExpression: "smile",
            animation: "Thinking",
          },
        ],
      });
      return;
    }

    // Hobby sub-panels (chess, gaming, …) no longer send audio; UI should not call /chat for them.
    // If something still posts these, avoid LLM + empty history rows.
    if (messageType && String(messageType).startsWith("hobbies_") && !userMessage) {
      res.send({ messages: [] });
      return;
    }

    const trimmedUserMessage = String(userMessage || "").trim();
    // Typed chat only: no empty messages to Groq (templates already returned above).
    if (!trimmedUserMessage) {
      res.send({ messages: [] });
      return;
    }

    console.log("Adding user message to chat history:", trimmedUserMessage);
    addToUserChatHistory(userId, "user", trimmedUserMessage);

    console.log("Getting user chat history for user:", userId);
    const userChatHistory = getUserChatHistory(userId).chatHistory;

    const chatHistoryText = userChatHistory
      .map((entry) => `${entry.role}: ${entry.message}`)
      .join("\n");

    try {
          // portfolioLlmContext = portfolio-llm.md ONLY (never portfolio.md). Template buttons never reach here.
          const prompt = `PORTFOLIO CONTEXT (from ${PORTFOLIO_LLM_PATH} only — not the full site markdown):
${portfolioLlmContext || "[No portfolio-llm.md loaded — Only say you don't have that detail and offer contact@aligilani.com]"}

Recent chat (newest last, capped server-side):
${chatHistoryText || "(none)"}

You are AliGen, a portfolio assistant for Ali Gilani. Answer ONLY from PORTFOLIO CONTEXT. If missing, say so and offer contact@aligilani.com.
Reply with ONE JSON object in an array (max 1 message) with keys: text, facialExpression, animation.
facialExpression: smile | sad | angry | default
animation: Angry | Idle | Laughing | Sad | Salute | Stretching | Thinking
Answer in a friendly and engaging tone. No need to laugh at everything and do not overuse Thinking animation. No asterisks or backticks in text. Max 2–3 short sentences. Vary openings; don't echo chat redundantly.

User: ${trimmedUserMessage}`;
  
      console.log("Groq prompt size (chars):", prompt.length);
      const completion = await groq.chat.completions.create({
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
        model:  "llama-3.1-8b-instant",
      });
      const responseText = completion.choices[0]?.message?.content || "";
      console.log("Received response from Groq API:", responseText);

      let messages = extractJsonFromResponse(responseText);
      if (!messages) {
        console.error("Invalid response from Groq API:", responseText);
        res.status(400).send({
          messages: [{
            text: "wow there Slow down, you just hit the APIs limit, even APIs need a coffee break. Try again in some time",
            audio: await audioFileToBase64("audios/api-limit-error.wav"),
            lipsync: await readJsonTranscript("audios/api-limit-error.json"),
            facialExpression: "Laughing",
            animation: "Idle",
          }],
        });
        return;
      }

      if (messages.messages) {
        messages = messages.messages;
      }

      // Ensure animation name is one of the supported clips.
      const allowedAnimations = new Set([
        "Angry",
        "Idle",
        "Laughing",
        "Sad",
        "Salute",
        "Stretching",
        "Thinking",
      ]);
      messages = messages.map((m) => ({
        ...m,
        animation: allowedAnimations.has(m.animation) ? m.animation : "Idle",
      }));

      console.log("Adding bot response to chat history");
      messages.forEach((message) => {
        addToUserChatHistory(userId, "bot", message.text);
      });

      // for (let i = 0; i < messages.length; i++) {
      //   const message = messages[i];
      //   const fileName = `audios/${userId}_message_${i}.mp3`;
      //   console.log(`Converting text to speech for message ${i}: ${message.text}`);
      //   await textToSpeechPolly(message.text, fileName);
      //   await lipSyncMessage(userId, i);
      //   message.audio = await audioFileToBase64(fileName);
      //   message.lipsync = await readJsonTranscript(`audios/${userId}_message_${i}.json`);

      //    // Remove audio files after use
      //     await removeAudioFiles(userId, i);
      // }
      for (let i = 0; i < messages.length; i++) {
        const message = messages[i];
        const fileName = `audios/${userId}_message_${i}.mp3`;
        console.log(`Converting text to speech for message ${i}: ${message.text}`);
      
        try {
          // Convert text to speech using Polly
          await textToSpeechPolly(message.text, fileName);
        } catch (error) {
          console.log(`Error converting text to speech for message ${i}:`, error);
          return res.status(500).send({ error: `Failed to convert text to speech for message ${i}.` });
        }

        // Always return audio if Polly succeeded.
        try {
          message.audio = await audioFileToBase64(fileName);
        } catch (error) {
          console.log(`Error converting audio to Base64 for message ${i}:`, error);
          return res.status(500).send({ error: `Failed to convert audio to Base64 for message ${i}.` });
        }

        // Lip-sync is best-effort (FFmpeg/Rhubarb may be missing on Windows).
        try {
          await lipSyncMessage(userId, i);
          message.lipsync = await readJsonTranscript(`audios/${userId}_message_${i}.json`);
        } catch (error) {
          console.log(`Lip-sync unavailable for message ${i} (continuing without it):`, error?.message || error);
          message.lipsync = null;
        }

        // Cleanup is also best-effort.
        try {
          await removeAudioFiles(userId, i);
        } catch (error) {
          console.log(`Error removing audio files for message ${i} (ignored):`, error?.message || error);
        }
      }
      

      
  console.log("Final messages being returned to user:", JSON.stringify(messages, null, 2));
  res.send({ messages });

} catch (error) {
  console.error("Error generating response with API:", error);
  console.error("Error stack:", error.stack);
  console.error("Error message:", error.message);

  res.status(500).send({
    error: `General error: ${error.message || "Unknown error occurred"}`
  });
}
});



const readJsonTranscript = async (file) => {
  const data = await fs.readFile(file, "utf8");
  return JSON.parse(data);
};

const audioFileToBase64 = async (file) => {
  const data = await fs.readFile(file);
  return data.toString("base64");
};

app.listen(port, () => {
  console.log(`BFF listening on port ${port}`);
});