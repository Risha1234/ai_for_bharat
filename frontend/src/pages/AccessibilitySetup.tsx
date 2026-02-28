import { useState } from "react";
import { motion } from "framer-motion";
import {
  BookOpen,
  Volume2,
  Mic,
  Brain,
  HandMetal,
  Check,
  ChevronDown,
  Sparkles,
} from "lucide-react";
import ParticleBackground from "@/components/ParticleBackground";
import AccessibilityToggle from "@/components/AccessibilityToggle";
import { supportSections } from "@/data/accessibilityOptions";
import { useNavigate } from "react-router-dom";

interface PreferenceCard {
  id: string;
  icon: React.ElementType;
  emoji: string;
  title: string;
  description: string;
}

const preferences: PreferenceCard[] = [
  { id: "reading", icon: BookOpen, emoji: "📖", title: "I Prefer Reading", description: "Text-based content with adjustable fonts and contrast" },
  { id: "listening", icon: Volume2, emoji: "🔊", title: "I Prefer Listening", description: "Audio narration with speed controls" },
  { id: "speaking", icon: Mic, emoji: "🎤", title: "I Prefer Speaking", description: "Voice-based answers and navigation" },
  { id: "simplified", icon: Brain, emoji: "🧠", title: "I Prefer Simplified Content", description: "Clear language with aids" },
  { id: "sign", icon: HandMetal, emoji: "🤟", title: "I Prefer Sign Language", description: "Sign language video interpretation" },
];

const preferenceAutoMap: Record<string, string[]> = {
  reading: [
    "increase-font",
    "line-spacing",
    "bold-text",
    "highlight-keywords",
  ],
  listening: [
    "captions",
    "realtime-captions",
    "speech-speed",
  ],
  speaking: [
    "voice-answers",
    "voice-nav",
  ],
  simplified: [
    "simplify-language",
    "bullet-questions",
    "remove-distractions",
  ],
  sign: [
    "sign-video",
    "dual-language",
  ],
};

const AccessibilitySetup = () => {
  const [selectedPrefs, setSelectedPrefs] = useState<string[]>([]);
  const [expandedSections, setExpandedSections] = useState<string[]>([]);
  const [toggleStates, setToggleStates] = useState<Record<string, boolean>>({});
  const navigate = useNavigate();

  const togglePref = (id: string) => {
    const isSelected = selectedPrefs.includes(id);

    if (isSelected) {
      setSelectedPrefs(prev => prev.filter(p => p !== id));
    } else {
      setSelectedPrefs(prev => [...prev, id]);

      const mappedToggles = preferenceAutoMap[id] || [];

      setToggleStates(prev => {
        const updated = { ...prev };
        mappedToggles.forEach(tid => {
          updated[tid] = true;
        });
        return updated;
      });
    }
  };

  const toggleSwitch = (id: string) => {
    setToggleStates(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleSection = (id: string) => {
    setExpandedSections(prev =>
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    );
  };

  return (
    <div className="relative min-h-screen">
      <ParticleBackground />

      <div className="relative z-10 max-w-5xl mx-auto px-6 py-16 pb-32">

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-bold font-display mb-4">
            Customize Your <span className="gradient-text">Exam Experience</span>
          </h1>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
          {preferences.map((pref) => {
            const isSelected = selectedPrefs.includes(pref.id);
            return (
              <motion.button
                key={pref.id}
                onClick={() => togglePref(pref.id)}
                className={`relative p-6 rounded-2xl text-left transition-all duration-300 glow-border ${
                  isSelected
                    ? "glass-card shadow-[var(--glow-primary)]"
                    : "glass-card hover:shadow-lg"
                }`}
              >
                {isSelected && (
                  <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                    <Check className="w-3.5 h-3.5 text-white" />
                  </div>
                )}
                <span className="text-3xl mb-3 block">{pref.emoji}</span>
                <h3 className="text-lg font-semibold">{pref.title}</h3>
                <p className="text-sm text-muted-foreground">{pref.description}</p>
              </motion.button>
            );
          })}
        </div>

        <div className="space-y-4">
          {supportSections.map((section) => {
            const Icon = section.icon;
            const isExpanded = expandedSections.includes(section.id);

            return (
              <div key={section.id} className="glass-card rounded-2xl glow-border overflow-hidden">
                <div
                  onClick={() => toggleSection(section.id)}
                  className="w-full flex items-center justify-between p-5 cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-5 h-5 text-primary" />
                    <span className="font-semibold">{section.title}</span>
                  </div>
                  <ChevronDown className={`transition-transform ${isExpanded ? "rotate-180" : ""}`} />
                </div>

                {isExpanded && (
                  <div className="px-5 pb-5 border-t border-border/20">
                    <div className="grid md:grid-cols-2 gap-3 pt-4">
                      {section.toggles.map((toggle) => (
                        <AccessibilityToggle
                          key={toggle.id}
                          enabled={!!toggleStates[toggle.id]}
                          onToggle={() => toggleSwitch(toggle.id)}
                          icon={toggle.icon}
                          label={toggle.label}
                          description={toggle.description}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="fixed bottom-8 left-1/2 -translate-x-1/2">
          <button
            onClick={() =>
              navigate("/exam", {
                state: { toggles: toggleStates },
              })
            }
            className="gradient-button px-8 py-4 rounded-xl"
          >
            Start Exam
          </button>
        </div>
      </div>
    </div>
  );
};

export default AccessibilitySetup;