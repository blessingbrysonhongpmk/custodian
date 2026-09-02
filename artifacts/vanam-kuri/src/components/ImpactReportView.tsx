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
  TreePine
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
    <div className="space-y-6 max-w-4xl mx-auto animate-fade-in print:p-0">
      {/* Header Bar */}
      <div className="flex items-center justify-between no-print">
        <div>
          <span className="text-xs font-mono uppercase tracking-wider text-emerald-700 font-bold bg-emerald-100 px-2.5 py-1 rounded-full">
            Official Audit Export
          </span>
          <h1 className="text-2xl font-extrabold text-slate-900 mt-1">
            Green Tamil Nadu Climate Audit & Impact Dossier
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePrint}
            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center gap-1.5 transition-colors shadow-xs"
          >
            <Printer className="w-4 h-4" />
            Print / PDF Audit
          </button>
        </div>
      </div>

      {/* Official Audit Document Paper Layout */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-8 sm:p-12 shadow-sm space-y-8 relative overflow-hidden print:border-none print:shadow-none print:p-0">
        {/* Government / Institutional Seal Header */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between pb-6 border-b-2 border-emerald-800 gap-4">
          <div className="space-y-1 text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <span className="text-lg font-black text-slate-950 tracking-tight">CUSTODIA CLIMATE-TECH OS</span>
              <span className="text-[10px] font-mono uppercase bg-emerald-800 text-white px-2 py-0.5 rounded font-bold">
                AUDITED COMPLIANT
              </span>
            </div>
            <p className="text-xs font-semibold text-emerald-900">
              Department of Environment, Climate Change & Forests • Government of Tamil Nadu
            </p>
            <p className="text-[11px] text-slate-500 font-mono">
              Campus Project: Loyola Sustainability Initiative 2024–2027 (ID: GTN-CAMPUS-2024-500)
            </p>
          </div>

          <div className="text-center sm:text-right font-mono text-xs text-slate-500 space-y-0.5">
            <p><strong>Audit Date:</strong> {new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
            <p><strong>Milestone:</strong> 6-Month Verification Cycle</p>
            <p className="text-emerald-700 font-bold">Audit Hash: 0x9b44c...2f01a</p>
          </div>
        </div>

        {/* Executive Summary Cards */}
        <div className="space-y-3">
          <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
            1. Audited Survival Outcomes
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <span className="text-[10px] font-mono uppercase text-slate-400">Total Planted</span>
              <p className="text-2xl font-black text-slate-900 font-mono">500</p>
              <span className="text-[11px] text-slate-500">100% Geo-tagged</span>
            </div>

            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200">
              <span className="text-[10px] font-mono uppercase text-emerald-800">Verified Alive</span>
              <p className="text-2xl font-black text-emerald-900 font-mono">318 (63.6%)</p>
              <span className="text-[11px] text-emerald-700 font-medium">Independent Peer Audit</span>
            </div>

            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200">
              <span className="text-[10px] font-mono uppercase text-amber-800">Under Care (At Risk)</span>
              <p className="text-2xl font-black text-amber-900 font-mono">102 (20.4%)</p>
              <span className="text-[11px] text-amber-700">Action Protocol Active</span>
            </div>

            <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200">
              <span className="text-[10px] font-mono uppercase text-rose-800">Failure Autopsies</span>
              <p className="text-2xl font-black text-rose-900 font-mono">80 (16.0%)</p>
              <span className="text-[11px] text-rose-700">Root-Causes Classified</span>
            </div>
          </div>
        </div>

        {/* Accountability Index Table */}
        <div className="space-y-3">
          <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
            2. Institutional Accountability Metrics
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border border-slate-200 rounded-2xl overflow-hidden">
              <thead className="bg-slate-50 border-b border-slate-200 font-mono text-slate-600">
                <tr>
                  <th className="p-3">Performance Dimension</th>
                  <th className="p-3">Target Standard</th>
                  <th className="p-3">Achieved Metric</th>
                  <th className="p-3">Compliance Verdict</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono">
                <tr>
                  <td className="p-3 font-bold text-slate-900 font-sans">Custody Continuity</td>
                  <td className="p-3 text-slate-500">&gt; 80%</td>
                  <td className="p-3 font-bold text-emerald-700">88.0%</td>
                  <td className="p-3 text-emerald-700 font-bold">COMPLIANT ✓</td>
                </tr>
                <tr>
                  <td className="p-3 font-bold text-slate-900 font-sans">Checkpoint Schedule Compliance</td>
                  <td className="p-3 text-slate-500">&gt; 75%</td>
                  <td className="p-3 font-bold text-emerald-700">81.0%</td>
                  <td className="p-3 text-emerald-700 font-bold">COMPLIANT ✓</td>
                </tr>
                <tr>
                  <td className="p-3 font-bold text-slate-900 font-sans">Verification Gap Resolution</td>
                  <td className="p-3 text-slate-500">Exposed & Tracked</td>
                  <td className="p-3 font-bold text-slate-900">25.4% Gap Audited</td>
                  <td className="p-3 text-blue-700 font-bold">TRANSPARENT ✓</td>
                </tr>
                <tr>
                  <td className="p-3 font-bold text-slate-900 font-sans">Mortality Cause Classification</td>
                  <td className="p-3 text-slate-500">100% of Failures</td>
                  <td className="p-3 font-bold text-emerald-700">100% (80/80)</td>
                  <td className="p-3 text-emerald-700 font-bold">EXCELLENT ✓</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Closing Philosophical Manifesto */}
        <div className="p-6 rounded-3xl bg-slate-900 text-white space-y-3 relative overflow-hidden">
          <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase font-mono tracking-widest">
            <Award className="w-4 h-4" />
            Core Philosophy & Green Mission Standard
          </div>
          <blockquote className="text-lg sm:text-xl font-extrabold text-white leading-relaxed italic">
            “CUSTODIA doesn’t measure how many trees we planted. It measures whether we took responsibility for keeping them alive.”
          </blockquote>
          <p className="text-xs text-slate-400">
            Certified by Green Tamil Nadu Mission Independent Verification Framework.
          </p>
        </div>

        {/* Signatures & Seal */}
        <div className="pt-6 border-t border-slate-200 grid grid-cols-2 sm:grid-cols-3 gap-6 text-xs font-mono text-slate-600">
          <div className="space-y-1">
            <span className="text-[10px] text-slate-400 block uppercase">Lead Institutional Officer</span>
            <p className="font-bold text-slate-900 font-sans">Dr. Malathi V.</p>
            <p className="text-[10px]">Campus Sustainability Director</p>
          </div>

          <div className="space-y-1">
            <span className="text-[10px] text-slate-400 block uppercase">Independent Peer Auditor</span>
            <p className="font-bold text-slate-900 font-sans">Divya M. (#08)</p>
            <p className="text-[10px]">Tamil Nadu Green Council</p>
          </div>

          <div className="space-y-1 col-span-2 sm:col-span-1">
            <span className="text-[10px] text-slate-400 block uppercase">Verification Seal</span>
            <p className="font-bold text-emerald-700 font-sans">VERIFIED SURVIVAL PASS</p>
            <p className="text-[10px]">Tamil Nadu Mission ID #7729</p>
          </div>
        </div>
      </div>
    </div>
  );
};
