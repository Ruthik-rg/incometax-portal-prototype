import React from 'react';
import { HelpCircle, CheckCircle2, ShieldAlert, BookOpen, ExternalLink, Sparkles, AlertTriangle } from 'lucide-react';

interface OfficialGuideProps {
  serviceName: string;
  whoShouldUse: string[];
  whyChooseThis: string[];
  keyRules: string[];
  officialDocRef: string;
}

export const OfficialServiceGuideDrawer: React.FC<OfficialGuideProps> = ({
  serviceName,
  whoShouldUse,
  whyChooseThis,
  keyRules,
  officialDocRef,
}) => {
  return (
    <aside className="bg-[#FAF7F2] border border-slate-200/90 rounded-2xl p-5 shadow-sm space-y-4 font-sans">
      <div className="flex items-center space-x-2 border-b border-slate-200/80 pb-3">
        <div className="p-2 bg-[#004B32] text-amber-300 rounded-xl">
          <BookOpen size={18} />
        </div>
        <div>
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">CBDT Official Knowledge Guide</span>
          <h3 className="font-extrabold text-xs text-[#1E3A2B]">{serviceName}: Eligibility & Process Guide</h3>
        </div>
      </div>

      {/* Who Should Choose This Service */}
      <div className="space-y-2">
        <h4 className="text-xs font-extrabold text-[#1E3A2B] uppercase tracking-wider flex items-center gap-1.5">
          <CheckCircle2 size={14} className="text-[#004B32]" />
          Who Should Choose This?
        </h4>
        <ul className="space-y-1.5 pl-1">
          {whoShouldUse.map((item, idx) => (
            <li key={idx} className="text-[11px] text-slate-700 flex items-start gap-1.5 leading-snug">
              <span className="text-[#004B32] font-bold">•</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Why Choose This Service */}
      <div className="space-y-2 border-t border-slate-200/60 pt-3">
        <h4 className="text-xs font-extrabold text-[#1E3A2B] uppercase tracking-wider flex items-center gap-1.5">
          <Sparkles size={14} className="text-amber-600" />
          Why Choose This Service?
        </h4>
        <ul className="space-y-1.5 pl-1">
          {whyChooseThis.map((item, idx) => (
            <li key={idx} className="text-[11px] text-slate-700 flex items-start gap-1.5 leading-snug">
              <span className="text-amber-600 font-bold">•</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Key Portal Compliance Rules */}
      <div className="space-y-2 border-t border-slate-200/60 pt-3">
        <h4 className="text-xs font-extrabold text-[#1E3A2B] uppercase tracking-wider flex items-center gap-1.5">
          <AlertTriangle size={14} className="text-rose-600" />
          Important Compliance Rules
        </h4>
        <ul className="space-y-1.5 pl-1">
          {keyRules.map((item, idx) => (
            <li key={idx} className="text-[11px] text-slate-700 flex items-start gap-1.5 leading-snug">
              <span className="text-rose-600 font-bold">•</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Official Reference Footer */}
      <div className="pt-2 border-t border-slate-200/60 text-[10px] text-slate-500 font-mono flex items-center justify-between">
        <span>Ref: {officialDocRef}</span>
        <span className="text-[#004B32] font-bold">incometax.gov.in Guide</span>
      </div>
    </aside>
  );
};
