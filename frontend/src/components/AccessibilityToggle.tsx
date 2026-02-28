import { motion, AnimatePresence } from "framer-motion";

interface AccessibilityToggleProps {
  enabled: boolean;
  onToggle: () => void;
  icon: React.ElementType;
  label: string;
  description: string;
}

const AccessibilityToggle = ({ enabled, onToggle, icon: Icon, label, description }: AccessibilityToggleProps) => (
  <div className="flex items-center justify-between gap-4 py-3 px-4 rounded-xl hover:bg-secondary/20 transition-colors duration-200 group">
    <div className="flex items-center gap-3 min-w-0">
      <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 transition-all duration-300 ${
        enabled ? "bg-primary/20 shadow-[var(--glow-primary)]" : "bg-secondary/50"
      }`}>
        <Icon className={`w-4 h-4 transition-colors duration-300 ${enabled ? "text-primary" : "text-muted-foreground"}`} />
      </div>
      <div className="min-w-0">
        <p className="text-sm font-medium text-foreground truncate">{label}</p>
        <p className="text-xs text-muted-foreground truncate">{description}</p>
      </div>
    </div>
    <button
      onClick={onToggle}
      className={`relative w-12 h-6 rounded-full shrink-0 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2 focus:ring-offset-background ${
        enabled ? "bg-primary shadow-[var(--glow-primary)]" : "bg-secondary"
      }`}
      role="switch"
      aria-checked={enabled}
      aria-label={label}
    >
      <motion.div
        className="absolute top-0.5 w-5 h-5 rounded-full bg-foreground"
        animate={{ left: enabled ? "26px" : "2px" }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
      />
    </button>
  </div>
);

export default AccessibilityToggle;
