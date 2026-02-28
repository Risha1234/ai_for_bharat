import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeOff, Mail, Lock, User } from "lucide-react";

interface SignupFormProps {
  onSubmit: (email: string, password: string, fullName: string) => Promise<void>;
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

const getPasswordStrength = (pw: string): { label: string; percent: number; color: string } => {
  if (!pw) return { label: "", percent: 0, color: "" };
  let score = 0;
  if (pw.length >= 8) score++;
  if (pw.length >= 12) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  if (score <= 1) return { label: "Weak", percent: 20, color: "bg-destructive" };
  if (score <= 2) return { label: "Fair", percent: 40, color: "bg-orange-500" };
  if (score <= 3) return { label: "Good", percent: 65, color: "bg-yellow-500" };
  if (score <= 4) return { label: "Strong", percent: 85, color: "bg-emerald-400" };
  return { label: "Excellent", percent: 100, color: "bg-emerald-500" };
};

const SignupForm = ({ onSubmit, isLoading }: SignupFormProps) => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const errors = useMemo(() => {
    const e: Record<string, string> = {};
    if (touched.fullName && !fullName.trim()) e.fullName = "Full name is required";
    if (touched.email && !email.trim()) e.email = "Email is required";
    else if (touched.email && !/\S+@\S+\.\S+/.test(email)) e.email = "Enter a valid email";
    if (touched.password && !password) e.password = "Password is required";
    else if (touched.password && password.length < 8) e.password = "Must be at least 8 characters";
    if (touched.confirmPassword && password !== confirmPassword) e.confirmPassword = "Passwords don't match";
    return e;
  }, [fullName, email, password, confirmPassword, touched]);

  const isValid =
    fullName.trim().length > 0 &&
    /\S+@\S+\.\S+/.test(email) &&
    password.length >= 8 &&
    password === confirmPassword &&
    confirmPassword.length > 0;

  const strength = getPasswordStrength(password);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({ fullName: true, email: true, password: true, confirmPassword: true });
    if (!isValid) return;
    await onSubmit(email, password, fullName);
  };

  const blur = (field: string) => setTouched((p) => ({ ...p, [field]: true }));

  const inputClass = (field: string) =>
    `w-full pl-10 pr-${field === "fullName" || field === "email" ? "4" : "12"} py-3 rounded-xl bg-secondary/50 border text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 transition-all duration-300 ${
      errors[field]
        ? "border-destructive/60 focus:border-destructive/80 focus:ring-destructive/30"
        : "border-border/50 focus:border-primary/50 focus:ring-primary/30"
    }`;

  return (
    <motion.form
      key="signup-form"
      variants={stagger}
      initial="hidden"
      animate="visible"
      exit={{ opacity: 0, x: 30, transition: { duration: 0.2 } }}
      onSubmit={handleSubmit}
      className="space-y-4"
    >
      {/* Full Name */}
      <motion.div variants={fieldVariant}>
        <div className="relative">
          <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input type="text" placeholder="Full Name" value={fullName}
            onChange={(e) => setFullName(e.target.value)} onBlur={() => blur("fullName")}
            aria-label="Full Name" aria-invalid={!!errors.fullName}
            className={inputClass("fullName")} />
        </div>
        <AnimatePresence>
          {errors.fullName && <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} className="text-xs text-destructive mt-1 ml-1">{errors.fullName}</motion.p>}
        </AnimatePresence>
      </motion.div>

      {/* Email */}
      <motion.div variants={fieldVariant}>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input type="email" placeholder="Email address" value={email}
            onChange={(e) => setEmail(e.target.value)} onBlur={() => blur("email")}
            aria-label="Email address" aria-invalid={!!errors.email}
            className={inputClass("email")} />
        </div>
        <AnimatePresence>
          {errors.email && <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} className="text-xs text-destructive mt-1 ml-1">{errors.email}</motion.p>}
        </AnimatePresence>
      </motion.div>

      {/* Password */}
      <motion.div variants={fieldVariant}>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input type={showPassword ? "text" : "password"} placeholder="Password (min 8 chars)" value={password}
            onChange={(e) => setPassword(e.target.value)} onBlur={() => blur("password")}
            aria-label="Password" aria-invalid={!!errors.password}
            className="w-full pl-10 pr-12 py-3 rounded-xl bg-secondary/50 border border-border/50 text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-all duration-300" />
          <button type="button" onClick={() => setShowPassword(!showPassword)}
            aria-label={showPassword ? "Hide password" : "Show password"}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
        {/* Strength indicator */}
        {password.length > 0 && (
          <div className="mt-2 flex items-center gap-2">
            <div className="flex-1 h-1.5 rounded-full bg-secondary/80 overflow-hidden">
              <motion.div
                className={`h-full rounded-full ${strength.color}`}
                initial={{ width: 0 }}
                animate={{ width: `${strength.percent}%` }}
                transition={{ duration: 0.4, ease: "easeOut" as const }}
              />
            </div>
            <span className="text-xs text-muted-foreground min-w-[60px]">{strength.label}</span>
          </div>
        )}
        <AnimatePresence>
          {errors.password && <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} className="text-xs text-destructive mt-1 ml-1">{errors.password}</motion.p>}
        </AnimatePresence>
      </motion.div>

      {/* Confirm Password */}
      <motion.div variants={fieldVariant}>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input type={showConfirmPassword ? "text" : "password"} placeholder="Confirm Password" value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)} onBlur={() => blur("confirmPassword")}
            aria-label="Confirm Password" aria-invalid={!!errors.confirmPassword}
            className="w-full pl-10 pr-12 py-3 rounded-xl bg-secondary/50 border border-border/50 text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-all duration-300" />
          <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            aria-label={showConfirmPassword ? "Hide password" : "Show password"}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
            {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
        <AnimatePresence>
          {errors.confirmPassword && <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} className="text-xs text-destructive mt-1 ml-1">{errors.confirmPassword}</motion.p>}
        </AnimatePresence>
      </motion.div>

      {/* Submit */}
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
              <span>Creating account...</span>
            </div>
          ) : (
            "Create Account →"
          )}
        </button>
      </motion.div>
    </motion.form>
  );
};

export default SignupForm;
