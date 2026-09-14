import { ArrowRight, Eye, EyeOff, LockKeyhole, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const copy = {
  login: {
    eyebrow: "Operator access",
    title: "Return to the signal field.",
    detail:
      "Use your operator credentials to open the ISP Dashboard command center.",
    action: "Open command center",
    sideTitle: "Every route starts with a clear signal.",
    sideDetail:
      "A focused, high-trust access point for teams operating subscriber and network services.",
  },
};

function AuthFrame() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    username: "",
    password: "",
  });

  const set = (field) => (event) => {
    setForm((previous) => ({
      ...previous,
      [field]: event.target.value,
    }));
  };

  const inputStyle =
    "mt-2 h-12 w-full rounded-xl border border-[#dce3ed] bg-white px-3.5 text-sm text-[#182542] outline-none transition placeholder:text-[#a0a9b9] focus:border-[#1758e8] focus:ring-4 focus:ring-[#1758e8]/10";

  async function handleSubmit(event) {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      await login(form.username, form.password);

      toast.success("Access granted.", {
        description: "Opening the command overview.",
      });

      navigate("/dashboard");
    } catch (err) {
      setError(
        err.response?.data?.detail ||
          "Invalid credentials. Please check your username and password."
      );
    } finally {
      setLoading(false);
    }
  }

  const text = copy.login;
  const image = "/operator-login-field.png";

  return (
    <div className="min-h-screen bg-[#f5f6f8] p-3 sm:p-5 lg:p-7">
      <div className="grid min-h-[calc(100vh-24px)] overflow-hidden rounded-[28px] border border-[#dfe5ee] bg-white shadow-[0_24px_75px_rgba(25,40,70,0.10)] lg:min-h-[calc(100vh-56px)] lg:grid-cols-[1.02fr_0.98fr]">

        {/* Image side */}
        <div className="relative min-h-[290px] overflow-hidden p-7 sm:p-10 lg:order-2 lg:min-h-full lg:p-12">
          <img
            src={image}
            alt="Abstract signal field"
            className="absolute inset-0 h-full w-full object-cover"
          />

          <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(14,28,56,0.88),rgba(14,28,56,0.32))]" />

          <div className="relative flex h-full flex-col justify-between">
            <div className="mt-20 max-w-sm lg:mt-0">
              <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#9db8ff]">
                ISP Dashboard / access route
              </p>

              <h2 className="mt-4 text-4xl font-bold leading-[0.98] tracking-[-0.065em] text-white sm:text-5xl">
                {text.sideTitle}
              </h2>

              <p className="mt-5 max-w-xs text-sm leading-6 text-white/70">
                {text.sideDetail}
              </p>
            </div>

            <div className="mt-10 flex items-center gap-2 text-[11px] font-semibold text-white/65">
              <ShieldCheck className="h-4 w-4 text-[#6ee7c8]" />
              Secure route · audit-ready session
            </div>
          </div>
        </div>

        {/* Form side */}
        <div className="flex items-center px-6 py-10 sm:px-12 lg:order-1 lg:px-16 xl:px-20">
          <div className="mx-auto w-full max-w-[430px]">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#1758e8]">
              <span className="mr-2 inline-block h-4 w-[3px] bg-[#1758e8] align-middle" />
              {text.eyebrow}
            </p>

            <h1 className="mt-4 text-4xl font-bold leading-[0.98] tracking-[-0.065em] text-[#172441]">
              {text.title}
            </h1>

            <p className="mt-5 max-w-md text-sm leading-6 text-[#6b7790]">
              {text.detail}
            </p>

            {/* Error message */}
            {error && (
              <div className="mt-5 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-xs font-medium text-rose-700">
                {error}
              </div>
            )}

            <form className="mt-9 space-y-5" onSubmit={handleSubmit}>
              {/* Username */}
              <label className="block text-xs font-bold text-[#35425b]">
                Username

                <input
                  required
                  type="text"
                  value={form.username}
                  onChange={set("username")}
                  placeholder="e.g. eunicenyaboke"
                  className={inputStyle}
                />
              </label>

              {/* Password */}
              <label className="block text-xs font-bold text-[#35425b]">
                Password

                <div className="relative">
                  <LockKeyhole className="pointer-events-none absolute left-3.5 top-[27px] h-4 w-4 -translate-y-1/2 text-[#8c97aa]" />

                  <input
                    required
                    type={showPassword ? "text" : "password"}
                    value={form.password}
                    onChange={set("password")}
                    placeholder="••••••••••••"
                    className={`${inputStyle} pl-10 pr-11`}
                  />

                  <button
                    type="button"
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-[27px] -translate-y-1/2 text-[#7e8ba0] hover:text-[#1758e8]"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </label>

              {/* Remember me */}
              <div className="flex items-center justify-between text-xs">
                <label className="flex items-center gap-2 text-[#6c7890]">
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-[#cbd4e3] accent-[#1758e8]"
                  />
                  Keep this route open
                </label>

                <button
                  type="button"
                  onClick={() =>
                    toast.info(
                      "Contact your system administrator to reset your password."
                    )
                  }
                  className="font-bold text-[#1758e8]"
                >
                  Forgot password?
                </button>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="group flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#1758e8] text-sm font-bold text-white shadow-[0_10px_24px_rgba(23,88,232,0.22)] transition hover:-translate-y-0.5 hover:bg-[#124cd2] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Opening command center…" : text.action}

                {!loading && (
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                )}
              </button>
            </form>

            <p className="mt-8 text-center text-xs text-[#6b7790]">
              ISP Dashboard · Admin portal · Authorized staff only
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export function LoginPage() {
  return <AuthFrame />;
}