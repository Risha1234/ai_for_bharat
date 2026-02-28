import { useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { Mic, Volume2 } from "lucide-react";

/* ---------------- QUESTIONS ---------------- */

const questions = [
  {
    id: 1,
    question:
      "In computer science, which linear data structure strictly follows the FIFO (First In First Out) principle, meaning the first element inserted is the first one to be removed?",
    options: ["Stack", "Queue", "Binary Tree", "Graph"],
  },
  {
    id: 2,
    question:
      "Which data structure operates using the LIFO (Last In First Out) mechanism, where the most recently added element is processed or removed before older elements?",
    options: ["Stack", "Queue", "Array", "Heap"],
  },
  {
    id: 3,
    question:
      "When performing a binary search on a sorted list of n elements, what is the average and worst-case time complexity of the algorithm?",
    options: ["O(n)", "O(log n)", "O(n²)", "O(1)"],
  },
  {
    id: 4,
    question:
      "Considering operator precedence rules in most programming languages, what will be the output of the arithmetic expression 2 + 3 * 4?",
    options: ["20", "14", "24", "10"],
  },
  {
    id: 5,
    question:
      "Artificial Intelligence (AI) is a rapidly growing field in computer science. What does the abbreviation 'AI' officially stand for?",
    options: [
      "Artificial Intelligence",
      "Automated Interface",
      "Advanced Input",
      "Algorithmic Interaction",
    ],
  },
];

const ExamPage = () => {
  const location = useLocation();
  const { toggles = {}, preferences = [] } = location.state || {};

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isListening, setIsListening] = useState(false);
  const [simplifiedText, setSimplifiedText] = useState<string | null>(null);

  const recognitionRef = useRef<any>(null);
  const currentQuestion = questions[currentIndex];

  /* ---------------- MODES ---------------- */

  const readingMode = preferences.includes("reading");
  const listeningMode = preferences.includes("listening");
  const simplifiedMode =
    toggles["simplify-language"] || preferences.includes("simplified");

  const signMode =
    toggles["sign-video"] || toggles["dual-language"];

  const highContrast = toggles["high-contrast"];
  const largeText = toggles["extra-large-text"];
  const voiceMode = toggles["voice-answers"];

  /* ---------------- READING CONTROLS ---------------- */

  const [fontSize, setFontSize] = useState(18);
  const [lineSpacing, setLineSpacing] = useState(1.6);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [dyslexiaFont, setDyslexiaFont] = useState(false);

  const themeClasses = readingMode
    ? isDarkMode
      ? "bg-black text-white"
      : "bg-white text-black"
    : highContrast
      ? "bg-black text-white"
      : "bg-background text-foreground";

  const textSize = largeText ? "text-3xl" : "text-xl";
  const optionSize = largeText ? "text-xl py-5" : "text-base py-3";

  /* ---------------- TEXT TO SPEECH ---------------- */

  const speakText = (text: string) => {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9;
    utterance.lang = "en-US";
    window.speechSynthesis.speak(utterance);
  };

  useEffect(() => {
    if (listeningMode) {
      speakText(currentQuestion.question);
    }
    return () => window.speechSynthesis.cancel();
  }, [currentIndex]);

  /* ---------------- SIMPLIFY ---------------- */

  const handleSimplify = () => {
    setSimplifiedText(
      "Simplified: " +
      currentQuestion.question
        .replace("In computer science,", "")
        .replace("strictly follows", "uses")
        .replace(
          "meaning the first element inserted is the first one to be removed",
          "first added, first removed"
        )
    );
  };

  /* ---------------- WEBCAM ---------------- */

  const startWebcam = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
      });
      const videoElement = document.getElementById(
        "webcam-preview"
      ) as HTMLVideoElement;
      if (videoElement) videoElement.srcObject = stream;
    } catch (error) {
      alert("Unable to access webcam.");
    }
  };

  /* ---------------- SPEECH RECOGNITION ---------------- */

  const startListening = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Speech Recognition not supported");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript.toLowerCase();

      currentQuestion.options.forEach((option, index) => {
        const letter = String.fromCharCode(97 + index);

        if (
          transcript.includes(option.toLowerCase()) ||
          transcript.includes(`option ${letter}`) ||
          transcript === letter
        ) {
          setSelectedOption(option);
        }
      });
    };

    recognition.start();
  };

  /* ---------------- QUESTION BLOCK ---------------- */

  const QuestionBlock = () => (
    <motion.div
      key={currentQuestion.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      style={
        readingMode
          ? {
            fontSize: `${fontSize}px`,
            lineHeight: lineSpacing,
            fontFamily: dyslexiaFont
              ? "OpenDyslexic, sans-serif"
              : "inherit",
          }
          : {}
      }
      className={`font-semibold space-y-4 ${!readingMode ? textSize : ""
        }`}
    >
      <div>{simplifiedText || currentQuestion.question}</div>

      {simplifiedMode && (
        <button
          onClick={handleSimplify}
          className="px-4 py-2 rounded-xl bg-accent text-black text-sm"
        >
          Simplify Question
        </button>
      )}
    </motion.div>
  );

  /* ---------------- OPTIONS ---------------- */

  const OptionsBlock = () => (
    <div className="space-y-4">
      {currentQuestion.options.map((opt, i) => (
        <button
          key={i}
          onClick={() => setSelectedOption(opt)}
          style={
            readingMode
              ? {
                fontSize: `${fontSize - 2}px`,
                lineHeight: lineSpacing,
                fontFamily: dyslexiaFont
                  ? "OpenDyslexic, sans-serif"
                  : "inherit",
              }
              : {}
          }
          className={`w-full rounded-xl px-6 ${optionSize} transition-all duration-300 ${selectedOption === opt
              ? "bg-primary text-white shadow-[var(--glow-primary)]"
              : "glass-card"
            }`}
        >
          {opt}
        </button>
      ))}
    </div>
  );

  /* ---------------- NAVIGATION ---------------- */

  const Navigation = () => (
    <div className="flex justify-between">
      <button
        disabled={currentIndex === 0}
        onClick={() => {
          if (currentIndex > 0) {
            setCurrentIndex((prev) => prev - 1);
            setSelectedOption(null);
            setSimplifiedText(null);
          }
        }}
        className="gradient-button px-6 py-3 rounded-xl disabled:opacity-40"
      >
        Previous
      </button>

      <button
        disabled={currentIndex === questions.length - 1}
        onClick={() => {
          if (currentIndex < questions.length - 1) {
            setCurrentIndex((prev) => prev + 1);
            setSelectedOption(null);
            setSimplifiedText(null);
          }
        }}
        className="gradient-button px-6 py-3 rounded-xl disabled:opacity-40"
      >
        Next
      </button>
    </div>
  );

  /* ---------------- LAYOUTS ---------------- */

  const StandardLayout = () => (
    <div className="max-w-4xl mx-auto mt-10 space-y-8">
      <QuestionBlock />

      {listeningMode && (
        <button
          onClick={() => speakText(currentQuestion.question)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-accent text-black font-medium"
        >
          <Volume2 size={18} />
          Replay Audio
        </button>
      )}

      <OptionsBlock />
      <Navigation />
    </div>
  );

  const SplitLayout = () => (
    <div className="max-w-6xl mx-auto mt-10 grid md:grid-cols-2 gap-8">
      <div className="space-y-8">
        <QuestionBlock />
        <OptionsBlock />
        <Navigation />
      </div>

      <motion.div
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        className="glass-card rounded-2xl p-6 space-y-6"
      >
        <h3 className="text-xl font-semibold">
          🤟 Sign Language Mode
        </h3>

        <video
          src={`/sign-videos/q${currentQuestion.id}.mp4`}
          controls
          autoPlay
          className="w-full h-64 object-cover"
        />

        <video
          id="webcam-preview"
          autoPlay
          muted
          playsInline
          className="w-full h-56 object-cover"
        />

        <button
          onClick={startWebcam}
          className="gradient-button w-full py-3 rounded-xl"
        >
          Start Webcam Answer
        </button>
      </motion.div>
    </div>
  );

  /* ---------------- MAIN ---------------- */

  return (
    <div className={`min-h-screen ${themeClasses} px-6 py-12`}>
      {readingMode && (
        <div className="max-w-4xl mx-auto mb-8 p-6 rounded-2xl glass-card space-y-8">

          <h3 className="text-xl font-semibold">Reading Accessibility Controls</h3>

          {/* 1️⃣ TEXT SIZE */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Text Size</span>
              <span>{fontSize}px</span>
            </div>

            <input
              type="range"
              min="14"
              max="34"
              value={fontSize}
              onChange={(e) => setFontSize(Number(e.target.value))}
              className="w-full accent-primary"
            />
          </div>

          {/* 2️⃣ LINE SPACING */}
          <div className="space-y-2">
            <span className="text-sm">Line Spacing</span>

            <div className="flex gap-3">
              <button
                onClick={() => setLineSpacing(1.4)}
                className={`px-4 py-2 rounded-xl ${lineSpacing === 1.4 ? "bg-primary text-white" : "bg-secondary"
                  }`}
              >
                Normal
              </button>

              <button
                onClick={() => setLineSpacing(1.8)}
                className={`px-4 py-2 rounded-xl ${lineSpacing === 1.8 ? "bg-primary text-white" : "bg-secondary"
                  }`}
              >
                1.5x
              </button>

              <button
                onClick={() => setLineSpacing(2.2)}
                className={`px-4 py-2 rounded-xl ${lineSpacing === 2.2 ? "bg-primary text-white" : "bg-secondary"
                  }`}
              >
                2x
              </button>
            </div>
          </div>

          {/* 3️⃣ LIGHT / DARK MODE */}
          <div className="flex items-center justify-between">
            <span className="text-sm">Theme Mode</span>

            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="px-4 py-2 rounded-xl bg-primary text-white"
            >
              {isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
            </button>
          </div>

          {/* 4️⃣ DYSLEXIA FONT */}
          <div className="flex items-center justify-between">
            <span className="text-sm">Dyslexia-Friendly Font</span>

            <button
              onClick={() => setDyslexiaFont(!dyslexiaFont)}
              className="px-4 py-2 rounded-xl bg-primary text-white"
            >
              {dyslexiaFont ? "Disable" : "Enable"}
            </button>
          </div>

        </div>
      )}

      {signMode ? <SplitLayout /> : <StandardLayout />}

      {voiceMode && (
        <motion.button
          onClick={startListening}
          className={`fixed bottom-10 left-1/2 -translate-x-1/2 
                w-28 h-28 rounded-full 
                flex items-center justify-center 
                z-50
                ${isListening
              ? "bg-red-500 animate-pulse"
              : "bg-primary shadow-[var(--glow-primary)]"
            }`}
        >
          <Mic className="text-white w-12 h-12" />
        </motion.button>
      )}
    </div>
  );
};

export default ExamPage;