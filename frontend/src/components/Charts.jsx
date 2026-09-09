import { Area, AreaChart, Bar, BarChart, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
const tooltipStyle = { borderRadius: "12px", border: "1px solid #e0e5ed", boxShadow: "0 12px 30px rgba(26,40,70,0.12)", fontSize: "11px", color: "#1b2947" };
const revenueData = [
  { day: "01", revenue: 48, collections: 33 },
  { day: "05", revenue: 61, collections: 43 },
  { day: "09", revenue: 52, collections: 46 },
  { day: "13", revenue: 74, collections: 57 },
  { day: "17", revenue: 69, collections: 59 },
  { day: "21", revenue: 82, collections: 68 },
  { day: "25", revenue: 76, collections: 70 },
  { day: "29", revenue: 96, collections: 79 }
];
const utilizationData = [
  { time: "00", usage: 44 },
  { time: "04", usage: 37 },
  { time: "08", usage: 61 },
  { time: "12", usage: 73 },
  { time: "16", usage: 82 },
  { time: "20", usage: 68 },
  { time: "24", usage: 48 }
];
const paymentData = [{ name: "Captured", value: 71, color: "#1758e8" }, { name: "Pending", value: 17, color: "#f1b64e" }, { name: "Exceptions", value: 12, color: "#e66759" }];
export function RevenueChart() {
  return <div className="h-[240px] w-full"><ResponsiveContainer width="100%" height="100%"><AreaChart data={revenueData} margin={{ left: -18, right: 3, top: 12, bottom: 0 }}><defs><linearGradient id="revenueGlow" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#1758e8" stopOpacity={0.22} /><stop offset="100%" stopColor="#1758e8" stopOpacity={0} /></linearGradient></defs><XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: "#94a0b4", fontSize: 10 }} dy={7} /><YAxis axisLine={false} tickLine={false} tick={{ fill: "#94a0b4", fontSize: 10 }} tickFormatter={(value) => `$${value}k`} /><Tooltip contentStyle={tooltipStyle} formatter={(value) => [`$${value}k`, ""]} labelFormatter={(label) => `August ${label}`} /><Area type="monotone" dataKey="revenue" stroke="#1758e8" strokeWidth={2.5} fill="url(#revenueGlow)" /><Area type="monotone" dataKey="collections" stroke="#6ee7c8" strokeWidth={1.8} strokeDasharray="4 4" fill="transparent" /></AreaChart></ResponsiveContainer></div>;
}
export function UtilizationChart() {
  return <div className="h-[205px] w-full"><ResponsiveContainer width="100%" height="100%"><AreaChart data={utilizationData} margin={{ left: -24, right: 2, top: 10, bottom: 0 }}><defs><linearGradient id="utilGlow" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#6ee7c8" stopOpacity={0.38} /><stop offset="100%" stopColor="#6ee7c8" stopOpacity={0} /></linearGradient></defs><XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fill: "#94a0b4", fontSize: 10 }} dy={7} /><YAxis domain={[0, 100]} axisLine={false} tickLine={false} tick={{ fill: "#94a0b4", fontSize: 10 }} tickFormatter={(value) => `${value}%`} /><Tooltip contentStyle={tooltipStyle} formatter={(value) => [`${value}%`, "Utilization"]} /><Area type="monotone" dataKey="usage" stroke="#22a982" strokeWidth={2.5} fill="url(#utilGlow)" /></AreaChart></ResponsiveContainer></div>;
}
export function PaymentDonut() {
  return <div className="relative h-[208px]"><ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={paymentData} dataKey="value" innerRadius={58} outerRadius={80} paddingAngle={4} stroke="none">{paymentData.map((entry) => <Cell key={entry.name} fill={entry.color} />)}</Pie><Tooltip contentStyle={tooltipStyle} formatter={(value) => [`${value}%`, ""]} /></PieChart></ResponsiveContainer><div className="pointer-events-none absolute inset-0 grid place-items-center"><div className="text-center"><p className="text-2xl font-bold tracking-[-0.06em] text-[#182542]">$88.4k</p><p className="mt-1 text-[10px] font-bold uppercase tracking-[0.14em] text-[#7c879b]">In motion</p></div></div></div>;
}
export function TicketsBarChart() {
  const data = [{ day: "Mon", volume: 28 }, { day: "Tue", volume: 34 }, { day: "Wed", volume: 25 }, { day: "Thu", volume: 47 }, { day: "Fri", volume: 38 }, { day: "Sat", volume: 18 }, { day: "Sun", volume: 22 }];
  return <div className="h-[205px] w-full"><ResponsiveContainer width="100%" height="100%"><BarChart data={data} margin={{ top: 12, left: -25, right: 0, bottom: 0 }}><XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: "#94a0b4", fontSize: 10 }} dy={6} /><YAxis axisLine={false} tickLine={false} tick={{ fill: "#94a0b4", fontSize: 10 }} /><Tooltip contentStyle={tooltipStyle} cursor={{ fill: "#f1f4f8" }} /><Bar dataKey="volume" fill="#1758e8" radius={[6, 6, 0, 0]} maxBarSize={26} /></BarChart></ResponsiveContainer></div>;
}
