import { ArrowRight, Check, Eye, EyeOff, LockKeyhole, Mail, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Link, useNavigate} from "react-router-dom";
import { BrandMark } from "@/components/AppShell";
const copy = {
  login: { eyebrow: "Operator access", title: "Return to the signal field.", detail: "Use your operator credentials to open the Northline command center.", action: "Open command center", sideTitle: "Every route starts with a clear signal.", sideDetail: "A focused, high-trust access point for teams operating subscriber and network services." },
  register: { eyebrow: "Create operator space", title: "Set the operating boundary.", detail: "Start a workspace for the people, signals, and service zones you need to coordinate.", action: "Create workspace", sideTitle: "A field for every service decision.", sideDetail: "Map the work before connecting production systems and invited operators." }
};
function AuthFrame({ mode }) {
  const [, navigate] = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const text = copy[mode];
  const isLogin = mode === "login";
  const image = isLogin ? "/manus-storage/operator-login-field_c3b0c7ea.png" : "/manus-storage/registration-service-map_ca12b29d.png";
  const inputStyle = "mt-2 h-12 w-full rounded-xl border border-[#dce3ed] bg-white px-3.5 text-sm text-[#182542] outline-none transition placeholder:text-[#a0a9b9] focus:border-[#1758e8] focus:ring-4 focus:ring-[#1758e8]/10";
  function handleSubmit(event) {
    event.preventDefault();
    toast.success(isLogin ? "Wireframe access granted." : "Workspace scaffold created.", { description: "Opening the command overview with illustrative data." });
    navigate("/dashboard");
  }
  return <div className="min-h-screen bg-[#f5f6f8] p-3 sm:p-5 lg:p-7"><div className={`grid min-h-[calc(100vh-24px)] overflow-hidden rounded-[28px] border border-[#dfe5ee] bg-white shadow-[0_24px_75px_rgba(25,40,70,0.10)] lg:min-h-[calc(100vh-56px)] ${isLogin ? "lg:grid-cols-[1.02fr_0.98fr]" : "lg:grid-cols-[0.98fr_1.02fr]"}`}>
    <div className={`relative min-h-[290px] overflow-hidden p-7 sm:p-10 lg:min-h-full lg:p-12 ${isLogin ? "lg:order-2" : ""}`}>
      <img src={image} alt="Abstract signal field" className="absolute inset-0 h-full w-full object-cover" />
      <div className={`absolute inset-0 ${isLogin ? "bg-[linear-gradient(135deg,rgba(14,28,56,0.88),rgba(14,28,56,0.32))]" : "bg-[linear-gradient(135deg,rgba(247,249,252,0.90),rgba(247,249,252,0.18))]"}`} />
      <div className="relative flex h-full flex-col justify-between"><Link href="/" className="w-fit"><BrandMark inverse={isLogin} /></Link><div className="mt-20 max-w-sm lg:mt-0"><p className={`text-[10px] font-bold uppercase tracking-[0.22em] ${isLogin ? "text-[#9db8ff]" : "text-[#1758e8]"}`}>Northline / access route</p><h2 className={`mt-4 text-4xl font-bold leading-[0.98] tracking-[-0.065em] sm:text-5xl ${isLogin ? "text-white" : "text-[#14213d]"}`}>{text.sideTitle}</h2><p className={`mt-5 max-w-xs text-sm leading-6 ${isLogin ? "text-white/70" : "text-[#526079]"}`}>{text.sideDetail}</p></div><div className={`mt-10 flex items-center gap-2 text-[11px] font-semibold ${isLogin ? "text-white/65" : "text-[#6a7690]"}`}><ShieldCheck className={`h-4 w-4 ${isLogin ? "text-[#6ee7c8]" : "text-[#168263]"}`} /> Secure route · audit-ready session</div></div>
    </div>
    <div className={`flex items-center px-6 py-10 sm:px-12 lg:px-16 xl:px-20 ${isLogin ? "lg:order-1" : ""}`}><div className="mx-auto w-full max-w-[430px]"><p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#1758e8]"><span className="mr-2 inline-block h-4 w-[3px] bg-[#1758e8] align-middle" />{text.eyebrow}</p><h1 className="mt-4 text-4xl font-bold leading-[0.98] tracking-[-0.065em] text-[#172441]">{text.title}</h1><p className="mt-5 max-w-md text-sm leading-6 text-[#6b7790]">{text.detail}</p>
      <form className="mt-9 space-y-5" onSubmit={handleSubmit}>{!isLogin && <label className="block text-xs font-bold text-[#35425b]">Workspace name<input required placeholder="Example: Northline East" className={inputStyle} /></label>}<label className="block text-xs font-bold text-[#35425b]">Work email<div className="relative"><Mail className="pointer-events-none absolute left-3.5 top-[27px] h-4 w-4 -translate-y-1/2 text-[#8c97aa]" /><input required type="email" placeholder="name@company.com" className={`${inputStyle} pl-10`} /></div></label><label className="block text-xs font-bold text-[#35425b]">Password<div className="relative"><LockKeyhole className="pointer-events-none absolute left-3.5 top-[27px] h-4 w-4 -translate-y-1/2 text-[#8c97aa]" /><input required type={showPassword ? "text" : "password"} placeholder="••••••••••••" className={`${inputStyle} pl-10 pr-11`} /><button type="button" aria-label={showPassword ? "Hide password" : "Show password"} onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-[27px] -translate-y-1/2 text-[#7e8ba0] hover:text-[#1758e8]">{showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</button></div></label>{isLogin ? <div className="flex items-center justify-between text-xs"><label className="flex items-center gap-2 text-[#6c7890]"><input type="checkbox" className="h-4 w-4 rounded border-[#cbd4e3] accent-[#1758e8]" />Keep this route open</label><button type="button" onClick={() => toast.info("Password recovery is a wireframe placeholder.")} className="font-bold text-[#1758e8]">Forgot password?</button></div> : <label className="flex gap-2.5 text-xs leading-5 text-[#6a7690]"><input required type="checkbox" className="mt-0.5 h-4 w-4 shrink-0 rounded border-[#cbd4e3] accent-[#1758e8]" />I confirm this workspace will begin with illustrative wireframe data.</label>}<button type="submit" className="group flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#1758e8] text-sm font-bold text-white shadow-[0_10px_24px_rgba(23,88,232,0.22)] transition hover:-translate-y-0.5 hover:bg-[#124cd2] active:scale-[0.98]">{text.action}<ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" /></button></form>
      {!isLogin && <div className="mt-7 grid grid-cols-2 gap-3 border-t border-[#e6eaf0] pt-6">{["Invite operators later", "Connect data sources later"].map((item) => <p key={item} className="flex gap-2 text-[11px] leading-5 text-[#6c7890]"><span className="mt-0.5 grid h-4 w-4 shrink-0 place-items-center rounded-full bg-[#e5f7f1] text-[#168263]"><Check className="h-2.5 w-2.5" /></span>{item}</p>)}</div>}<p className="mt-8 text-center text-xs text-[#6b7790]">{isLogin ? <>New to Northline? <Link href="/register" className="font-bold text-[#1758e8]">Create a workspace</Link></> : <>Already have an operator space? <Link href="/login" className="font-bold text-[#1758e8]">Sign in</Link></>}</p></div></div>
  </div></div>;
}
export function LoginPage() {
  return <AuthFrame mode="login" />;
}
export function RegisterPage() {
  return <AuthFrame mode="register" />;
}
