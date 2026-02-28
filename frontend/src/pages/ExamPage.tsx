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

  const currentQuestion = questions[currentIndex];
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);
  
  /* ---------------- MODES ---------------- */

  const signMode =
    toggles["sign-video"] || toggles["dual-language"];

  const highContrast = toggles["high-contrast"];
  const largeText = toggles["extra-large-text"];
  const voiceMode = toggles["voice-answers"];

  // 🔊 LISTENING MODE (based on preference selection)
  const listeningMode = preferences.includes("listening");

  const themeClasses = highContrast
    ? "bg-black text-white"
    : "bg-background text-foreground";

  const textSize = largeText ? "text-3xl" : "text-xl";
  const optionSize = largeText ? "text-xl py-5" : "text-base py-3";

  /* ---------------- TEXT TO SPEECH ---------------- */

  const speakText = (text: string) => {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9;
    utterance.pitch = 1;
    utterance.lang = "en-US";
    window.speechSynthesis.speak(utterance);
  };

  // Auto speak on question change
  useEffect(() => {
    if (listeningMode) {
      speakText(currentQuestion.question);
    }

    return () => {
      window.speechSynthesis.cancel();
    };
  }, [currentIndex]);

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

      {/* 🔊 Replay Button (Only if listening mode enabled) */}
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

      {/* LEFT SIDE */}
      <div className="space-y-8">
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

      {/* RIGHT SIDE */}
      <motion.div
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        className="glass-card rounded-2xl p-6 space-y-6"
      >
        <h3 className="text-xl font-semibold">
          🤟 Sign Language Mode
        </h3>

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

  const startListening = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Speech Recognition not supported in this browser");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript
        .toLowerCase()
        .trim();

      console.log("Heard:", transcript);

      // Match spoken text to options
      currentQuestion.options.forEach((option, index) => {
        const letter = String.fromCharCode(97 + index); // a,b,c,d

        if (
          transcript.includes(option.toLowerCase()) ||
          transcript.includes(`option ${letter}`) ||
          transcript === letter
        ) {
          setSelectedOption(option);
        }
      });
    };

    recognitionRef.current = recognition;
    recognition.start();
  };

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
          onClick={startListening}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className={`fixed bottom-10 left-1/2 -translate-x-1/2 
                w-28 h-28 rounded-full 
                flex items-center justify-center 
                z-50 transition-all duration-300
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