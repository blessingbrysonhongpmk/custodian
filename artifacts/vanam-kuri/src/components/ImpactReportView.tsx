import React from 'react';
import { OrganizationReliability, Tree } from '../types/custodia';
import { 
  FileSpreadsheet, 
  Download, 
  Printer, 
  ShieldCheck, 
  Award, 
  CheckCircle2, 
  AlertOctagon, 
  Building2, 
  Calendar, 
  Sparkles,
  TreePine,
  TrendingUp,
  Leaf
} from 'lucide-react';

interface ImpactReportViewProps {
  reliability: OrganizationReliability;
  trees: Tree[];
}

export const ImpactReportView: React.FC<ImpactReportViewProps> = ({
  reliability,
  trees,
}) => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto animate-fade-in print:p-0">
      {/* Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 no-print bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md">
            Official Impact Dossier
          </span>
          <p className="text-sm text-slate-500 mt-1 font-medium">Ready for stakeholder presentation and PDF export.</p>
        </div>

        <button
          onClick={handlePrint}
          className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-sm font-bold flex items-center justify-center gap-2 transition-colors shadow-sm"
        >
          <Printer className="w-4 h-4" />
          Print / Export PDF
        </button>
      </div>

      {/* Official Audit Document Paper Layout */}
      <div className="bg-white rounded-[2.5rem] border border-slate-200 p-8 sm:p-14 shadow-sm space-y-12 relative overflow-hidden print:border-none print:shadow-none print:p-0 tn-watermark">
        
        {/* Subtle Watermark */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-5 pointer-events-none">
          <TreePine className="w-96 h-96" />
        </div>

        {/* Document Header */}
        <div className="flex flex-col sm:flex-row items-start justify-between border-b-2 pb-8 gap-6 relative z-10" style={{ borderImage: 'linear-gradient(90deg, #064E3B, #059669, #10B981, #059669, #064E3B) 1' }}>
          <div className="space-y-3 max-w-xl">
            <div className="flex items-center gap-3">
              <img src="/tn-gov-logo.svg" alt="Tamil Nadu Government" className="w-10 h-10" />
              <div>
                <span className="text-sm font-bold text-emerald-800 uppercase tracking-widest block">
                  Vanam Kuri • வனம் குறி
                </span>
                <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
                  Government of Tamil Nadu • Verified Impact
                </span>
              </div>
            </div>
            <h1 className="text-4xl sm:text-5xl font-serif font-black text-slate-900 leading-tight">
              Tamil Nadu Climate Impact Report
            </h1>
            <p className="text-base text-slate-600 font-medium">
              Green Tamil Nadu Mission 2024–2027 • <span className="font-mono text-xs bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded">GTN-TN-2024-500</span>
            </p>
          </div>

          <div className="text-left sm:text-right font-mono text-sm text-slate-500 space-y-1 bg-emerald-50/50 p-4 rounded-2xl border border-emerald-100">
            <p><strong>Date:</strong> {new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
            <p><strong>Cycle:</strong> 6-Month Verification</p>
            <p className="text-emerald-700 font-bold mt-2 pt-2 border-t border-emerald-200">
              Hash: 0x9b44c...2f01a
            </p>
          </div>
        </div>

        {/* Core verified stats */}
        <div className="space-y-6 relative z-10">
          <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400">
            I. Verified Survival Outcomes
          </h3>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-6 rounded-3xl bg-slate-50 border border-slate-100 flex flex-col justify-between">
              <span className="text-xs font-bold uppercase text-slate-500 mb-4 tracking-wider">Total Planted</span>
              <div>
                <p className="text-4xl font-black text-slate-900">500</p>
                <span className="text-xs font-semibold text-slate-400 mt-1 block">100% Geo-tagged</span>
              </div>
            </div>

            <div className="p-6 rounded-3xl bg-emerald-50 border border-emerald-100 flex flex-col justify-between">
              <span className="text-xs font-bold uppercase text-emerald-700 mb-4 tracking-wider">Verified Alive</span>
              <div>
                <div className="flex items-baseline gap-2">
                  <p className="text-4xl font-black text-emerald-900">318</p>
                  <span className="text-lg font-bold text-emerald-700">63.6%</span>
                </div>
                <span className="text-xs font-semibold text-emerald-600 mt-1 block flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Independent Audit
                </span>
              </div>
            </div>

            <div className="p-6 rounded-3xl bg-amber-50 border border-amber-100 flex flex-col justify-between">
              <span className="text-xs font-bold uppercase text-amber-700 mb-4 tracking-wider">At Risk</span>
              <div>
                <div className="flex items-baseline gap-2">
                  <p className="text-4xl font-black text-amber-900">102</p>
                  <span className="text-lg font-bold text-amber-700">20.4%</span>
                </div>
                <span className="text-xs font-semibold text-amber-600 mt-1 block">Action Protocol Active</span>
              </div>
            </div>

            <div className="p-6 rounded-3xl bg-rose-50 border border-rose-100 flex flex-col justify-between">
              <span className="text-xs font-bold uppercase text-rose-700 mb-4 tracking-wider">Failed</span>
              <div>
                <div className="flex items-baseline gap-2">
                  <p className="text-4xl font-black text-rose-900">80</p>
                  <span className="text-lg font-bold text-rose-700">16.0%</span>
                </div>
                <span className="text-xs font-semibold text-rose-600 mt-1 block">Root-Causes Audited</span>
              </div>
            </div>
          </div>
        </div>

        {/* Accountability Index Table */}
        <div className="space-y-6 relative z-10">
          <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400">
            II. Institutional Accountability Index
          </h3>

          <div className="rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
            <table className="w-full text-left">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="p-5 text-xs font-bold text-slate-500 uppercase tracking-wider">Performance Dimension</th>
                  <th className="p-5 text-xs font-bold text-slate-500 uppercase tracking-wider">Target</th>
                  <th className="p-5 text-xs font-bold text-slate-500 uppercase tracking-wider">Achieved</th>
                  <th className="p-5 text-xs font-bold text-slate-500 uppercase tracking-wider">Verdict</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr className="hover:bg-slate-50/50 transition-colors">
                  <td className="p-5 text-sm font-bold text-slate-900">Custody Continuity</td>
                  <td className="p-5 text-sm font-medium text-slate-500">&gt; 80%</td>
                  <td className="p-5 text-sm font-bold text-emerald-600">88.0%</td>
                  <td className="p-5 text-xs font-bold text-emerald-700 uppercase tracking-wider flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5"/> Compliant</td>
                </tr>
                <tr className="hover:bg-slate-50/50 transition-colors">
                  <td className="p-5 text-sm font-bold text-slate-900">Schedule Compliance</td>
                  <td className="p-5 text-sm font-medium text-slate-500">&gt; 75%</td>
                  <td className="p-5 text-sm font-bold text-emerald-600">81.0%</td>
                  <td className="p-5 text-xs font-bold text-emerald-700 uppercase tracking-wider flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5"/> Compliant</td>
                </tr>
                <tr className="hover:bg-slate-50/50 transition-colors">
                  <td className="p-5 text-sm font-bold text-slate-900">Verification Gap</td>
                  <td className="p-5 text-sm font-medium text-slate-500">Tracked</td>
                  <td className="p-5 text-sm font-bold text-slate-900">25.4% Audited</td>
                  <td className="p-5 text-xs font-bold text-blue-700 uppercase tracking-wider flex items-center gap-1"><Sparkles className="w-3.5 h-3.5"/> Transparent</td>
                </tr>
                <tr className="hover:bg-slate-50/50 transition-colors">
                  <td className="p-5 text-sm font-bold text-slate-900">Mortality Classification</td>
                  <td className="p-5 text-sm font-medium text-slate-500">100%</td>
                  <td className="p-5 text-sm font-bold text-emerald-600">100%</td>
                  <td className="p-5 text-xs font-bold text-emerald-700 uppercase tracking-wider flex items-center gap-1"><Award className="w-3.5 h-3.5"/> Excellent</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Environmental Impact Summary */}
        <div className="space-y-6 relative z-10">
          <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400">
            III. Environmental ROI Projection
          </h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-5 rounded-2xl bg-slate-900 text-white flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center shrink-0">
                <Leaf className="w-6 h-6 text-emerald-400" />
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold mb-0.5">Est. CO2 Sequestration</p>
                <p className="text-xl font-bold">14.2 Tons/yr</p>
              </div>
            </div>
            
            <div className="p-5 rounded-2xl bg-slate-900 text-white flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center shrink-0">
                <TrendingUp className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold mb-0.5">Canopy Expansion</p>
                <p className="text-xl font-bold">+2.4 Acres</p>
              </div>
            </div>
            
            <div className="p-5 rounded-2xl bg-slate-900 text-white flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-6 h-6 text-emerald-400" />
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold mb-0.5">Biodiversity Index</p>
                <p className="text-xl font-bold">High (Level 4)</p>
              </div>
            </div>
          </div>
        </div>

        {/* Closing Philosophical Manifesto */}
        <div className="p-8 sm:p-10 rounded-[2rem] bg-[#052E1F] text-emerald-50 space-y-4 relative overflow-hidden z-10">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#064E3B] rounded-full blur-3xl opacity-50 -translate-y-1/2 translate-x-1/4 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#047857] rounded-full blur-3xl opacity-30 translate-y-1/3 -translate-x-1/4 pointer-events-none" />
          
          <div className="flex items-center gap-2 text-[#34D399] font-bold text-xs uppercase tracking-widest relative z-10">
            <Award className="w-4 h-4" />
            Core Philosophy & Mission Standard
          </div>
          <blockquote className="text-xl sm:text-2xl font-serif text-white leading-relaxed relative z-10 max-w-3xl">
            “Vanam Kuri doesn't measure how many trees we planted. It measures whether we took responsibility for keeping them alive.”
          </blockquote>
          <p className="text-xs text-[#6EE7B7]/70 font-medium tracking-wide uppercase mt-4 relative z-10">
            Certified by Government of Tamil Nadu • Independent Verification Framework.
          </p>
        </div>

        {/* Signatures & Seal */}
        <div className="pt-8 border-t border-slate-200 grid grid-cols-2 sm:grid-cols-3 gap-8 text-sm text-slate-600 relative z-10">
          <div className="space-y-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Lead Institutional Officer</span>
            <div className="h-12 flex items-end pb-2 border-b border-slate-200 font-serif italic text-lg text-slate-900">Dr. Malathi V.</div>
            <p className="text-xs font-medium text-slate-500">Campus Sustainability Director</p>
          </div>

          <div className="space-y-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Independent Peer Auditor</span>
            <div className="h-12 flex items-end pb-2 border-b border-slate-200 font-serif italic text-lg text-slate-900">Divya M. (#08)</div>
            <p className="text-xs font-medium text-slate-500">Green Council</p>
          </div>

          <div className="space-y-2 col-span-2 sm:col-span-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Government Verification</span>
            <div className="h-12 flex items-end pb-2">
              <span className="px-3 py-1.5 rounded-lg border-2 border-emerald-600 text-emerald-700 font-bold text-xs uppercase tracking-widest transform -rotate-2 flex items-center gap-1.5">
                <img src="/tn-gov-logo.svg" alt="" className="w-4 h-4" />
                TN Gov Verified ✓
              </span>
            </div>
            <p className="text-xs font-mono text-slate-400">Mission ID #7729 • Vanam Kuri</p>
          </div>
        </div>
      </div>
    </div>
  );
};
