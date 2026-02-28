import { motion } from "framer-motion";
import { Eye, Ear, Mic, Brain, Hand } from "lucide-react";

const icons = [
  { Icon: Eye, label: "Visual", delay: 0 },
  { Icon: Ear, label: "Auditory", delay: 0.5 },
  { Icon: Mic, label: "Voice", delay: 1 },
  { Icon: Brain, label: "Cognitive", delay: 1.5 },
  { Icon: Hand, label: "Motor", delay: 2 },
];

const FloatingIcons = () => {
  return (
    <div className="flex gap-6">
      {icons.map(({ Icon, label, delay }) => (
        <motion.div
          key={label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 + delay * 0.15, duration: 0.5 }}
          className="flex flex-col items-center gap-2"
        >
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{
              duration: 3,
              repeat: Infinity,
              delay: delay * 0.3,
              ease: "easeInOut",
            }}
            className="w-14 h-14 rounded-2xl glass-card flex items-center justify-center glow-border"
          >
            <Icon className="w-6 h-6 text-primary" />
          </motion.div>
          <span className="text-xs text-muted-foreground">{label}</span>
        </motion.div>
      ))}
    </div>
  );
};

export default FloatingIcons;
