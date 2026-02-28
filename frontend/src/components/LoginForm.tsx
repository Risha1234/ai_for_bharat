import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";

interface LoginFormProps {
  onSubmit: (email: string, password: string) => Promise<void>;
  isLoading: boolean;
}

const stagger = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const fieldVariant = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" as const } },
};

const LoginForm = ({ onSubmit, isLoading }: LoginFormProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const errors = useMemo(() => {
    const e: Record<string, string> = {};
    if (touched.email && !email.trim()) e.email = "Email is required";
    else if (touched.email && !/\S+@\S+\.\S+/.test(email)) e.email = "Enter a valid email";
    if (touched.password && !password) e.password = "Password is required";
    else if (touched.password && password.length < 6) e.password = "Must be at least 6 characters";
    return e;
  }, [email, password, touched]);

  const isValid = /\S+@\S+\.\S+/.test(email) && password.length >= 6;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({ email: true, password: true });
    if (!isValid) return;
    await onSubmit(email, password);
  };

  const blur = (field: string) => setTouched((p) => ({ ...p, [field]: true }));

  return (
    <motion.form
      key="login-form"
      variants={stagger}
      initial="hidden"
      animate="visible"
      exit={{ opacity: 0, x: -30, transition: { duration: 0.2 } }}
      onSubmit={handleSubmit}
      className="space-y-4"
    >
      <motion.div variants={fieldVariant}>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onBlur={() => blur("email")}
            aria-label="Email address"
            aria-invalid={!!errors.email}
            className={`w-full pl-10 pr-4 py-3 rounded-xl bg-secondary/50 border text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 transition-all duration-300 ${
              errors.email
                ? "border-destructive/60 focus:border-destructive/80 focus:ring-destructive/30"
                : "border-border/50 focus:border-primary/50 focus:ring-primary/30"
            }`}
          />
        </div>
        <AnimatePresence>
          {errors.email && (
            <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} className="text-xs text-destructive mt-1 ml-1">
              {errors.email}
            </motion.p>
          )}
        </AnimatePresence>
      </motion.div>

      <motion.div variants={fieldVariant}>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onBlur={() => blur("password")}
            aria-label="Password"
            aria-invalid={!!errors.password}
            className={`w-full pl-10 pr-12 py-3 rounded-xl bg-secondary/50 border text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 transition-all duration-300 ${
              errors.password
                ? "border-destructive/60 focus:border-destructive/80 focus:ring-destructive/30"
                : "border-border/50 focus:border-primary/50 focus:ring-primary/30"
            }`}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            aria-label={showPassword ? "Hide password" : "Show password"}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
        <AnimatePresence>
          {errors.password && (
            <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} className="text-xs text-destructive mt-1 ml-1">
              {errors.password}
            </motion.p>
          )}
        </AnimatePresence>
      </motion.div>

      <motion.div variants={fieldVariant} className="flex items-center justify-between text-sm">
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" className="rounded border-border bg-secondary accent-primary" />
          <span className="text-muted-foreground">Remember me</span>
        </label>
        <a href="#" className="text-primary hover:text-primary/80 transition-colors">
          Forgot password?
        </a>
      </motion.div>

      <motion.div variants={fieldVariant}>
        <button
          type="submit"
          disabled={isLoading || !isValid}
          className={`w-full py-3.5 rounded-xl font-semibold text-sm tracking-wide transition-all duration-300 ${
            isValid && !isLoading
              ? "gradient-button cursor-pointer hover:shadow-[0_0_24px_hsl(var(--primary)/0.4)] active:scale-[0.98]"
              : "gradient-button opacity-40 cursor-not-allowed"
          }`}
        >
          {isLoading ? (
            <div className="flex items-center justify-center gap-2">
              <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
              <span>Signing in...</span>
            </div>
          ) : (
            "Continue to Accessibility Setup →"
          )}
        </button>
      </motion.div>
    </motion.form>
  );
};

export default LoginForm;
