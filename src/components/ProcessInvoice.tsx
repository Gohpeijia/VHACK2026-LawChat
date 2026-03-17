import React, { useState } from 'react';
import { 
  Camera, 
  Upload, 
  MessageSquare, 
  Mic, 
  Languages, 
  FileText, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle,
  Loader2,
  Search,
  Info,
  ChevronRight,
  HelpCircle,
  RefreshCw,
  Trash2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const LHDN_FIELDS = [
  { id: 'supplier_name', label: 'Supplier Name', required: true, tooltip: 'Legal name of the supplier as per SSM/LHDN records.' },
  { id: 'supplier_tin', label: 'Supplier TIN', required: true, tooltip: 'Tax Identification Number of the supplier.' },
  { id: 'buyer_name', label: 'Buyer Name', required: true, tooltip: 'Legal name of the buyer.' },
  { id: 'buyer_tin', label: 'Buyer TIN', required: true, tooltip: 'Tax Identification Number of the buyer.' },
  { id: 'invoice_date', label: 'Invoice Date', required: true, tooltip: 'Date when the invoice was issued.' },
  { id: 'invoice_number', label: 'Invoice Number', required: true, tooltip: 'Unique reference number for this invoice.' },
  { id: 'total_amount', label: 'Total Amount', required: true, tooltip: 'Total amount including tax.' },
  { id: 'tax_amount', label: 'Tax Amount', required: true, tooltip: 'Total SST/GST amount.' },
  { id: 'currency', label: 'Currency', required: true, tooltip: 'Transaction currency (e.g., MYR, USD).' },
  { id: 'invoice_type', label: 'Invoice Type', required: true, tooltip: 'B2B, B2C, B2G, or Self-billed.' },
];

export const ProcessInvoice: React.FC = () => {
  const [step, setStep] = useState<'input' | 'processing' | 'review' | 'submitted' | 'rejected'>('input');
  const [inputMode, setInputMode] = useState<'camera' | 'file' | 'whatsapp' | 'voice'>('file');
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [language, setLanguage] = useState('EN');
  const [showChecker, setShowChecker] = useState(false);

  const handleProcess = async () => {
    setStep('processing');
    // Simulate AI extraction
    setTimeout(() => {
      setFormData({
        supplier_name: 'Tech Solutions Sdn Bhd',
        supplier_tin: 'C21098765432',
        buyer_name: 'Global Corp Ltd',
        buyer_tin: 'C12345678901',
        invoice_date: '2024-03-15',
        invoice_number: 'INV-2024-001',
        total_amount: '1,250.00',
        tax_amount: '75.00',
        currency: 'MYR',
        invoice_type: 'Standard Invoice'
      });
      setStep('review');
    }, 2000);
  };

  const handleSubmit = async () => {
    // Simulate random rejection for demo purposes
    if (Math.random() > 0.7) {
      setStep('rejected');
    } else {
      setStep('submitted');
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tighter dark:text-white">Process Invoice</h1>
          <p className="text-sm text-slate-500">Capture and validate your invoices for LHDN MyInvois compliance.</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setShowChecker(true)}
            className="flex items-center gap-2 px-4 py-2 bg-brand-indigo/10 text-brand-indigo rounded-xl text-sm font-bold hover:bg-brand-indigo/20 transition-all"
          >
            <HelpCircle size={18} />
            Do I need to submit?
          </button>
          <div className="flex bg-white dark:bg-dark-surface rounded-xl p-1 border border-slate-200 dark:border-dark-border shadow-sm">
            {['BM', 'EN', 'CN', 'TA'].map(lang => (
              <button
                key={lang}
                onClick={() => setLanguage(lang)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  language === lang 
                    ? 'bg-brand-indigo text-white shadow-md' 
                    : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-dark-bg'
                }`}
              >
                {lang}
              </button>
            ))}
          </div>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {step === 'input' && (
          <motion.div
            key="input"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <InputCard 
                active={inputMode === 'camera'} 
                onClick={() => setInputMode('camera')}
                icon={<Camera className="w-6 h-6" />}
                title="Camera Snap"
                desc="Mobile capture"
              />
              <InputCard 
                active={inputMode === 'file'} 
                onClick={() => setInputMode('file')}
                icon={<Upload className="w-6 h-6" />}
                title="File Upload"
                desc="PDF, JPG, PNG"
              />
              <InputCard 
                active={inputMode === 'whatsapp'} 
                onClick={() => setInputMode('whatsapp')}
                icon={<MessageSquare className="w-6 h-6" />}
                title="WhatsApp"
                desc="Paste text content"
              />
              <InputCard 
                active={inputMode === 'voice'} 
                onClick={() => setInputMode('voice')}
                icon={<Mic className="w-6 h-6" />}
                title="Voice Input"
                desc="Dictate details"
              />
            </div>

            <div className="bg-white dark:bg-dark-surface border-2 border-dashed border-slate-200 dark:border-dark-border rounded-2xl p-8 md:p-16 flex flex-col items-center justify-center text-center space-y-6 transition-all hover:border-brand-indigo/50 group">
              {inputMode === 'file' && (
                <>
                  <div className="w-20 h-20 bg-brand-indigo/10 rounded-full flex items-center justify-center text-brand-indigo group-hover:scale-110 transition-transform">
                    <Upload className="w-10 h-10" />
                  </div>
                  <div className="space-y-2">
                    <p className="text-xl font-black dark:text-white">Drag and drop your invoice</p>
                    <p className="text-slate-500 max-w-sm mx-auto">Upload PDF, image, or Excel file. Our AI will automatically extract all 55 mandatory fields.</p>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3 w-full max-w-md">
                    <button 
                      onClick={handleProcess}
                      className="flex-1 bg-brand-indigo text-white px-8 py-4 rounded-xl font-bold hover:bg-brand-indigo/90 transition-all shadow-xl shadow-brand-indigo/20 flex items-center justify-center gap-2"
                    >
                      Process with AI
                      <ArrowRight size={18} />
                    </button>
                    <button className="flex-1 bg-slate-100 dark:bg-dark-bg dark:text-white px-8 py-4 rounded-xl font-bold hover:bg-slate-200 dark:hover:bg-slate-800 transition-all">
                      Select File
                    </button>
                  </div>
                </>
              )}
              {inputMode === 'whatsapp' && (
                <div className="w-full max-w-2xl space-y-4">
                  <div className="text-left space-y-2">
                    <p className="font-bold dark:text-white">WhatsApp Text Paste</p>
                    <p className="text-sm text-slate-500">Paste or forward WhatsApp order text directly. Claude transcribes unstructured text into LHDN fields.</p>
                  </div>
                  <textarea 
                    placeholder="Example: Order for Global Corp, 10x Laptops @ RM3000 each, SST 6%..."
                    className="w-full h-48 p-4 bg-slate-50 dark:bg-dark-bg border border-slate-200 dark:border-dark-border rounded-2xl outline-none focus:ring-2 focus:ring-brand-indigo/50 transition-all dark:text-white"
                  />
                  <button 
                    onClick={handleProcess}
                    className="w-full bg-brand-indigo text-white py-4 rounded-xl font-bold shadow-xl shadow-brand-indigo/20"
                  >
                    Extract Data
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {step === 'processing' && (
          <motion.div
            key="processing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center py-32 space-y-8"
          >
            <div className="relative">
              <Loader2 className="w-20 h-20 text-brand-indigo animate-spin" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-10 h-10 bg-brand-indigo/20 rounded-full animate-ping" />
              </div>
            </div>
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-black dark:text-white">AI Guardian is Processing</h2>
              <p className="text-slate-500">Smart field extraction (NLP) mapping to 55 LHDN mandatory fields...</p>
              <div className="flex items-center justify-center gap-2 mt-4">
                <span className="w-2 h-2 bg-brand-indigo rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                <span className="w-2 h-2 bg-brand-indigo rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                <span className="w-2 h-2 bg-brand-indigo rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
              </div>
            </div>
          </motion.div>
        )}

        {step === 'review' && (
          <motion.div
            key="review"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-6"
          >
            {/* Left: Original Input */}
            <div className="bg-slate-100 dark:bg-dark-surface rounded-2xl p-6 min-h-[600px] flex flex-col border border-slate-200 dark:border-dark-border relative overflow-hidden shadow-inner">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-white/80 dark:bg-dark-bg/80 backdrop-blur px-3 py-1 rounded-full text-[10px] font-black tracking-widest border border-slate-200 dark:border-dark-border uppercase dark:text-white">
                  Original Input
                </div>
                <button className="p-2 hover:bg-white dark:hover:bg-dark-bg rounded-lg transition-colors text-slate-500">
                  <RefreshCw size={16} />
                </button>
              </div>
              <div className="flex-1 flex items-center justify-center">
                <div className="text-slate-400 text-center space-y-4">
                  <div className="w-24 h-32 border-2 border-dashed border-slate-300 dark:border-dark-border rounded-lg mx-auto flex items-center justify-center">
                    <FileText className="w-12 h-12 opacity-20" />
                  </div>
                  <p className="text-sm font-medium">Invoice Preview (Mockup)</p>
                </div>
              </div>
            </div>

            {/* Right: Auto-filled Form */}
            <div className="bg-white dark:bg-dark-surface rounded-2xl border border-slate-200 dark:border-dark-border flex flex-col shadow-2xl overflow-hidden">
              <div className="p-5 border-b border-slate-100 dark:border-dark-border flex items-center justify-between bg-slate-50/50 dark:bg-dark-bg/50">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-emerald-500/10 rounded-lg flex items-center justify-center text-emerald-500">
                    <CheckCircle2 size={20} />
                  </div>
                  <div>
                    <h3 className="font-black text-sm dark:text-white">AI Extraction Review</h3>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">98% Confidence Score</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-black text-emerald-600 bg-emerald-500/10 px-2 py-1 rounded-full">VALIDATED</span>
                </div>
              </div>
              
              <div className="flex-1 overflow-y-auto p-6 space-y-5 max-h-[500px] scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-dark-border">
                {LHDN_FIELDS.map(field => (
                  <div key={field.id} className="space-y-1.5 group">
                    <div className="flex items-center justify-between">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1">
                        {field.label}
                        {field.required && <span className="text-brand-rose">*</span>}
                      </label>
                      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button title={field.tooltip} className="text-slate-300 hover:text-brand-indigo">
                          <Info size={14} />
                        </button>
                      </div>
                    </div>
                    <div className="relative">
                      <input 
                        type="text"
                        value={formData[field.id] || ''}
                        onChange={(e) => setFormData(prev => ({ ...prev, [field.id]: e.target.value }))}
                        className="w-full bg-slate-50 dark:bg-dark-bg border border-slate-200 dark:border-dark-border rounded-xl px-4 py-2.5 text-sm font-medium focus:ring-2 focus:ring-brand-indigo/50 outline-none transition-all dark:text-white"
                      />
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-5 border-t border-slate-100 dark:border-dark-border bg-slate-50/50 dark:bg-dark-bg/50 flex gap-3">
                <button 
                  onClick={() => setStep('input')}
                  className="flex-1 py-3.5 rounded-xl font-bold border border-slate-200 dark:border-dark-border hover:bg-white dark:hover:bg-dark-surface transition-all dark:text-white flex items-center justify-center gap-2"
                >
                  <Trash2 size={18} />
                  Discard
                </button>
                <button 
                  onClick={handleSubmit}
                  className="flex-[2] py-3.5 bg-brand-indigo text-white rounded-xl font-bold hover:bg-brand-indigo/90 transition-all shadow-xl shadow-brand-indigo/20 flex items-center justify-center gap-2"
                >
                  Submit to MyInvois
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {step === 'submitted' && (
          <motion.div
            key="submitted"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-md mx-auto bg-white dark:bg-dark-surface rounded-2xl border border-slate-200 dark:border-dark-border p-8 text-center space-y-8 shadow-2xl"
          >
            <div className="w-24 h-24 bg-emerald-500/10 rounded-full flex items-center justify-center text-emerald-500 mx-auto">
              <CheckCircle2 className="w-12 h-12" />
            </div>
            <div className="space-y-2">
              <h2 className="text-3xl font-black dark:text-white tracking-tighter">Submission Successful</h2>
              <p className="text-slate-500">Your invoice has been validated and accepted by LHDN MyInvois portal.</p>
            </div>
            
            <div className="bg-slate-50 dark:bg-dark-bg p-6 rounded-2xl space-y-4 border border-slate-100 dark:border-dark-border">
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Internal Ref No (IRN)</span>
                <span className="font-mono font-bold dark:text-white">8823-XJ22-991A-0021</span>
              </div>
              <div className="w-40 h-40 bg-white p-3 mx-auto rounded-xl border border-slate-200 shadow-sm">
                <div className="w-full h-full bg-slate-900 rounded-lg flex items-center justify-center text-white text-[10px] text-center font-bold">
                  QR CODE<br/>VALIDATED BY LHDN
                </div>
              </div>
            </div>

            <button 
              onClick={() => setStep('input')}
              className="w-full py-4 bg-slate-900 dark:bg-white dark:text-slate-900 text-white rounded-xl font-black shadow-xl transition-transform hover:scale-[1.02]"
            >
              Done
            </button>
          </motion.div>
        )}

        {step === 'rejected' && (
          <motion.div
            key="rejected"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-2xl mx-auto space-y-6"
          >
            <div className="bg-white dark:bg-dark-surface rounded-2xl border border-brand-rose/20 p-8 text-center space-y-6 shadow-2xl">
              <div className="w-20 h-20 bg-brand-rose/10 rounded-full flex items-center justify-center text-brand-rose mx-auto">
                <AlertCircle className="w-10 h-10" />
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl font-black dark:text-white tracking-tighter">Submission Rejected</h2>
                <p className="text-slate-500">LHDN MyInvois returned a validation error. See details below.</p>
              </div>

              <div className="bg-brand-rose/5 border border-brand-rose/10 p-6 rounded-2xl text-left space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-brand-rose rounded-full flex items-center justify-center text-white shrink-0 mt-1">
                    <Info size={16} />
                  </div>
                  <div className="space-y-1">
                    <p className="font-bold text-brand-rose">Error Code: VAL-0055</p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">The Supplier TIN (C21098765432) does not match the registered business name in the MyTax database.</p>
                  </div>
                </div>
                <div className="h-px bg-brand-rose/10"></div>
                <div className="flex items-center justify-between">
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Rejection Explainer</p>
                  <button className="text-xs font-bold text-brand-indigo hover:underline">One-click rejection fix</button>
                </div>
                <p className="text-sm italic text-slate-500">"This usually happens when there's a typo in the TIN or if the business name has recently changed. Try verifying the TIN via the MyTax portal link provided."</p>
              </div>

              <div className="flex gap-3">
                <button 
                  onClick={() => setStep('review')}
                  className="flex-1 py-4 bg-slate-100 dark:bg-dark-bg dark:text-white rounded-xl font-bold hover:bg-slate-200 dark:hover:bg-slate-800 transition-all"
                >
                  Edit & Retry
                </button>
                <button 
                  onClick={() => setStep('input')}
                  className="flex-1 py-4 bg-brand-rose text-white rounded-xl font-bold hover:bg-brand-rose/90 transition-all shadow-xl shadow-brand-rose/20"
                >
                  Discard Invoice
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* "Do I need to submit?" Modal */}
      <AnimatePresence>
        {showChecker && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowChecker(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-lg bg-white dark:bg-dark-surface rounded-3xl shadow-2xl overflow-hidden"
            >
              <div className="p-8 space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-black dark:text-white tracking-tighter">Submission Checker</h3>
                  <button onClick={() => setShowChecker(false)} className="p-2 hover:bg-slate-100 dark:hover:bg-dark-bg rounded-full transition-colors">
                    <X size={20} className="text-slate-400" />
                  </button>
                </div>
                <p className="text-slate-500">Answer a few questions to determine if this transaction requires LHDN submission.</p>
                
                <div className="space-y-4">
                  <CheckerItem label="Is the transaction amount > RM 0.00?" />
                  <CheckerItem label="Is the buyer a registered business (B2B)?" />
                  <CheckerItem label="Is this a cross-border transaction?" />
                  <CheckerItem label="Is this a self-billed invoice scenario?" />
                </div>

                <div className="bg-brand-indigo/5 border border-brand-indigo/10 p-4 rounded-2xl">
                  <p className="text-sm font-bold text-brand-indigo flex items-center gap-2">
                    <Info size={16} />
                    Recommendation
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Based on current LHDN guidelines, this invoice **MUST** be submitted within 72 hours of the transaction.</p>
                </div>

                <button 
                  onClick={() => setShowChecker(false)}
                  className="w-full py-4 bg-brand-indigo text-white rounded-xl font-black shadow-xl"
                >
                  Got it
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

function InputCard({ active, onClick, icon, title, desc }: any) {
  return (
    <button
      onClick={onClick}
      className={`p-4 rounded-2xl border-2 transition-all text-left space-y-3 group ${
        active 
          ? 'bg-brand-indigo/5 border-brand-indigo ring-4 ring-brand-indigo/10' 
          : 'bg-white dark:bg-dark-surface border-slate-100 dark:border-dark-border hover:border-slate-300 dark:hover:border-slate-700 shadow-sm'
      }`}
    >
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${active ? 'bg-brand-indigo text-white' : 'bg-slate-100 dark:bg-dark-bg text-slate-400 group-hover:text-slate-600'}`}>
        {icon}
      </div>
      <div>
        <p className="font-black text-sm dark:text-white">{title}</p>
        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">{desc}</p>
      </div>
    </button>
  );
}

function CheckerItem({ label }: { label: string }) {
  const [checked, setChecked] = useState(false);
  return (
    <button 
      onClick={() => setChecked(!checked)}
      className="w-full flex items-center justify-between p-4 bg-slate-50 dark:bg-dark-bg rounded-2xl border border-slate-100 dark:border-dark-border transition-all hover:border-brand-indigo/30"
    >
      <span className="text-sm font-bold text-slate-700 dark:text-slate-300">{label}</span>
      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${checked ? 'bg-brand-indigo border-brand-indigo' : 'border-slate-300 dark:border-dark-border'}`}>
        {checked && <CheckCircle2 size={14} className="text-white" />}
      </div>
    </button>
  );
}

function X({ size, className }: { size: number, className?: string }) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2.5" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  );
}

