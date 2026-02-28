import { useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { useMemo, useState } from "react";
import { Mic, Sparkles } from "lucide-react";

/* ---------------- QUESTIONS ---------------- */

const questions = [
  {
    id: 1,
    question: "Which data structure uses FIFO (First In First Out)?",
    options: ["Stack", "Queue", "Tree", "Graph"],
  },
  {
    id: 2,
    question: "Which data structure uses LIFO (Last In First Out)?",
    options: ["Stack", "Queue", "Array", "Heap"],
  },
  {
    id: 3,
    question: "What is the time complexity of Binary Search?",
    options: ["O(n)", "O(log n)", "O(n²)", "O(1)"],
  },
  {
    id: 4,
    question: "What will be the output of 2 + 3 * 4?",
    options: ["20", "14", "24", "10"],
  },
  {
    id: 5,
    question: "What does AI stand for?",
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
  const { toggles = {} } = location.state || {};

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const currentQuestion = questions[currentIndex];

  /* ---------------- MODES ---------------- */

  const signMode =
    toggles["sign-video"] || toggles["dual-language"];

  const highContrast = toggles["high-contrast"];
  const largeText = toggles["extra-large-text"];
  const voiceMode = toggles["voice-answers"];

  const themeClasses = highContrast
    ? "bg-black text-white"
    : "bg-background text-foreground";

  const textSize = largeText ? "text-3xl" : "text-xl";
  const optionSize = largeText ? "text-xl py-5" : "text-base py-3";

  /* ---------------- WEBCAM ---------------- */

  const startWebcam = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
      });

      const videoElement = document.getElementById(
        "webcam-preview"
      ) as HTMLVideoElement;

      if (videoElement) {
        videoElement.srcObject = stream;
      }
    } catch (error) {
      alert("Unable to access webcam.");
      console.error(error);
    }
  };

  /* ---------------- NAVIGATION ---------------- */

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
      setSelectedOption(null);
    }
  };

  /* ---------------- LAYOUTS ---------------- */

  const StandardLayout = () => (
    <div className="max-w-4xl mx-auto mt-10 space-y-8">
      <QuestionBlock />
      <OptionsBlock />
      <Navigation />
    </div>
  );

  const SplitLayout = () => (
    <div className="max-w-6xl mx-auto mt-10 grid md:grid-cols-2 gap-8">

      {/* LEFT SIDE */}
      <div className="space-y-8">
        <QuestionBlock />
        <OptionsBlock />
        <Navigation />
      </div>

      {/* RIGHT SIDE */}
      <motion.div
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        className="glass-card rounded-2xl p-6 space-y-6"
      >
        <h3 className="text-xl font-semibold">
          🤟 Sign Language Mode
        </h3>

        {/* SIGN VIDEO (placeholder for now) */}
        <div className="rounded-xl overflow-hidden border border-border bg-black">
          <video
            src={`/sign-videos/q${currentQuestion.id}.mp4`}
            controls
            autoPlay
            className="w-full h-64 object-cover"
          />
        </div>

        <p className="text-sm opacity-70">
          Answer using sign language via webcam OR select an option.
        </p>

        {/* WEBCAM */}
        <div className="rounded-xl overflow-hidden border border-border bg-black">
          <video
            id="webcam-preview"
            autoPlay
            muted
            playsInline
            className="w-full h-56 object-cover"
          />
        </div>

        <button
          onClick={startWebcam}
          className="gradient-button w-full py-3 rounded-xl"
        >
          Start Webcam Answer
        </button>
      </motion.div>
    </div>
  );

  /* ---------------- QUESTION ---------------- */

  const QuestionBlock = () => (
    <motion.div
      key={currentQuestion.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`font-semibold ${textSize}`}
    >
      {currentQuestion.question}
    </motion.div>
  );

  /* ---------------- OPTIONS ---------------- */

  const OptionsBlock = () => (
    <div className="space-y-4">
      {currentQuestion.options.map((opt, i) => (
        <button
          key={i}
          onClick={() => setSelectedOption(opt)}
          className={`w-full rounded-xl px-6 ${optionSize} transition-all duration-300 ${
            selectedOption === opt
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
        onClick={handlePrev}
        disabled={currentIndex === 0}
        className="gradient-button px-6 py-3 rounded-xl disabled:opacity-40"
      >
        Previous
      </button>

      <button
        onClick={handleNext}
        disabled={currentIndex === questions.length - 1}
        className="gradient-button px-6 py-3 rounded-xl disabled:opacity-40"
      >
        Next
      </button>
    </div>
  );

  /* ---------------- MAIN ---------------- */

  return (
    <div className={`min-h-screen ${themeClasses} px-6 py-12`}>

      {signMode ? <SplitLayout /> : <StandardLayout />}

      {voiceMode && (
        <motion.button
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          whileHover={{ scale: 1.1 }}
          className="fixed bottom-8 right-8 w-16 h-16 rounded-full bg-primary flex items-center justify-center shadow-[var(--glow-primary)]"
        >
          <Mic className="text-white" />
        </motion.button>
      )}
    </div>
  );
};

export default ExamPage;