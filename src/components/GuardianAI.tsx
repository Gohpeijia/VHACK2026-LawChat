import React from 'react';
import { 
  ShieldCheck, 
  AlertTriangle, 
  HeartPulse, 
  Activity, 
  TrendingUp, 
  MessageCircle,
  ArrowUpRight,
  Zap,
  Info,
  ChevronRight
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip 
} from 'recharts';

const REJECTION_LOGS = [
  { code: 'E001', msg: 'Invalid TIN Format', ai: 'The buyer TIN must be 12 characters starting with C or I. Our NLP detected a potential typo in the 4th digit.' },
  { code: 'E042', msg: 'Missing Item Classification', ai: 'LHDN requires a specific category code for this service type. Based on the description, "Consultancy" should map to code 012.' },
];

const RISK_DATA = [
  { name: 'Safe', value: 85 },
  { name: 'Risk', value: 15 },
];

const REVENUE_DATA = [
  { name: 'Jan', val: 4000 },
  { name: 'Feb', val: 3000 },
  { name: 'Mar', val: 5000 },
  { name: 'Apr', val: 4500 },
  { name: 'May', val: 6000 },
  { name: 'Jun', val: 5500 },
];

export const GuardianAI: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tighter dark:text-white">Guardian AI Dashboard</h1>
          <p className="text-sm text-slate-500">AI-driven insights and tax compliance monitoring.</p>
        </div>
        <div className="flex items-center gap-2 text-emerald-500 bg-emerald-500/10 px-4 py-2 rounded-xl text-xs font-black tracking-widest uppercase border border-emerald-500/20">
          <ShieldCheck className="w-4 h-4" />
          System Secure
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Audit Risk Score */}
        <div className="bg-white dark:bg-dark-surface rounded-2xl border border-slate-200 dark:border-dark-border p-6 shadow-sm relative overflow-hidden group">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Audit Risk Score</p>
              <h3 className="text-3xl font-black mt-1 dark:text-white tracking-tighter">15<span className="text-sm text-slate-400 font-medium">/100</span></h3>
            </div>
            <div className="p-2 bg-emerald-100 dark:bg-emerald-500/10 text-emerald-600 rounded-xl">
              <Zap className="w-5 h-5" />
            </div>
          </div>
          <div className="h-32 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={RISK_DATA}
                  cx="50%"
                  cy="100%"
                  startAngle={180}
                  endAngle={0}
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={0}
                  dataKey="value"
                >
                  <Cell fill="#10b981" />
                  <Cell fill="#f1f5f9" className="dark:fill-dark-bg" />
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex items-center justify-center gap-2 -mt-4">
            <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Low Audit Probability</p>
          </div>
        </div>

        {/* Tax Health Check */}
        <div className="bg-white dark:bg-dark-surface rounded-2xl border border-slate-200 dark:border-dark-border p-6 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Tax Health Check</p>
              <h3 className="text-3xl font-black mt-1 text-silver-glowing tracking-tighter">Excellent</h3>
            </div>
            <div className="p-2 bg-silver-glowing/10 text-silver-glowing rounded-xl">
              <HeartPulse className="w-5 h-5" />
            </div>
          </div>
          <div className="space-y-4 mt-6">
            <HealthItem label="Compliance Rate" val="99.8%" color="text-emerald-500" />
            <HealthItem label="Anomaly Detection" val="0 Found" color="text-slate-400" />
            <HealthItem label="Deduction Optimization" val="+RM 2.4k" color="text-brand-indigo" />
          </div>
        </div>

        {/* Revenue Summary */}
        <div className="bg-white dark:bg-dark-surface rounded-2xl border border-slate-200 dark:border-dark-border p-6 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Revenue Trend</p>
              <h3 className="text-3xl font-black mt-1 dark:text-white tracking-tighter">RM 28.4k</h3>
            </div>
            <div className="p-2 bg-brand-rose/10 text-brand-rose rounded-xl">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="h-24 w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={REVENUE_DATA}>
                <defs>
                  <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#e11d48" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#e11d48" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <Area type="monotone" dataKey="val" stroke="#e11d48" strokeWidth={3} fillOpacity={1} fill="url(#colorVal)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Rejection Explainer */}
        <div className="bg-white dark:bg-dark-surface rounded-2xl border border-slate-200 dark:border-dark-border overflow-hidden shadow-sm flex flex-col">
          <div className="p-5 border-b border-slate-100 dark:border-dark-border flex items-center justify-between bg-slate-50/50 dark:bg-dark-bg/50">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-brand-indigo/10 rounded-lg flex items-center justify-center text-brand-indigo">
                <MessageCircle size={20} />
              </div>
              <h3 className="font-black text-sm dark:text-white">AI Rejection Explainer</h3>
            </div>
            <button className="text-[10px] font-black text-brand-indigo uppercase tracking-widest hover:underline">View All Logs</button>
          </div>
          <div className="p-6 space-y-6 flex-1">
            {REJECTION_LOGS.map((log, i) => (
              <div key={i} className="flex gap-4 group">
                <div className="w-10 h-10 rounded-xl bg-brand-rose/10 flex items-center justify-center text-brand-rose shrink-0 group-hover:scale-110 transition-transform">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div className="space-y-3 flex-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-black bg-slate-100 dark:bg-dark-bg px-2 py-1 rounded-md dark:text-white border border-slate-200 dark:border-dark-border">{log.code}</span>
                      <span className="text-sm font-bold dark:text-white">{log.msg}</span>
                    </div>
                    <span className="text-[10px] text-slate-400 font-medium">2h ago</span>
                  </div>
                  <div className="bg-slate-50 dark:bg-dark-bg p-4 rounded-2xl text-sm italic text-slate-600 dark:text-slate-400 border-l-4 border-brand-indigo relative">
                    <div className="absolute -left-1 top-4 w-2 h-2 bg-brand-indigo rounded-full"></div>
                    "{log.ai}"
                  </div>
                  <button className="flex items-center gap-1 text-[10px] font-black text-brand-indigo uppercase tracking-widest hover:gap-2 transition-all">
                    Apply AI Suggested Fix
                    <ChevronRight size={12} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Anomaly Alerts */}
        <div className="bg-white dark:bg-dark-surface rounded-2xl border border-slate-200 dark:border-dark-border overflow-hidden shadow-sm flex flex-col">
          <div className="p-5 border-b border-slate-100 dark:border-dark-border flex items-center justify-between bg-slate-50/50 dark:bg-dark-bg/50">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-brand-rose/10 rounded-lg flex items-center justify-center text-brand-rose">
                <Activity size={20} />
              </div>
              <h3 className="font-black text-sm dark:text-white">Anomaly Alerts</h3>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
              <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Live Monitoring</span>
            </div>
          </div>
          <div className="p-6 flex-1 flex flex-col items-center justify-center">
            <div className="flex flex-col items-center justify-center py-12 text-center space-y-4 max-w-xs">
              <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center text-emerald-500 shadow-inner">
                <ShieldCheck className="w-10 h-10" />
              </div>
              <div className="space-y-1">
                <p className="font-black dark:text-white">No anomalies detected</p>
                <p className="text-xs text-slate-500 leading-relaxed">Guardian AI is monitoring all submissions in real-time. We'll alert you if we spot unusual patterns.</p>
              </div>
              <button className="px-6 py-2 bg-slate-100 dark:bg-dark-bg rounded-xl text-[10px] font-black uppercase tracking-widest dark:text-white hover:bg-slate-200 dark:hover:bg-slate-800 transition-all">
                Run Manual Scan
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

function HealthItem({ label, val, color }: any) {
  return (
    <div className="flex justify-between items-center text-sm">
      <span className="text-slate-500 font-medium">{label}</span>
      <div className="flex items-center gap-2">
        <span className={`font-black ${color}`}>{val}</span>
        <div className="w-12 h-1.5 bg-slate-100 dark:bg-dark-bg rounded-full overflow-hidden">
          <div className={`h-full bg-current ${color}`} style={{ width: '80%' }}></div>
        </div>
      </div>
    </div>
  );
}

