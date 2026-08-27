import React, { useState } from 'react';
import { useApp } from '../AppContext';
import { CANONICAL_SERVICES } from '../mockData';
import type { CanonicalServiceId, PublicUtilityId } from '../types';
import {
  FileText,
  ShieldCheck,
  CreditCard,
  BarChart3,
  FileSpreadsheet,
  RefreshCw,
  AlertCircle,
  Link,
  History,
  Calculator,
  Download,
  Calendar as CalendarIcon,
  ArrowRight,
  ChevronRight,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

const ICON_MAP: Record<string, React.ReactNode> = {
  FileText: <FileText size={20} className="text-[#004B32]" />,
  ShieldCheck: <ShieldCheck size={20} className="text-blue-700" />,
  CreditCard: <CreditCard size={20} className="text-purple-700" />,
  BarChart3: <BarChart3 size={20} className="text-indigo-700" />,
  FileSpreadsheet: <FileSpreadsheet size={20} className="text-teal-700" />,
  RefreshCw: <RefreshCw size={20} className="text-rose-700" />,
  AlertCircle: <AlertCircle size={20} className="text-red-700" />,
  Link: <Link size={20} className="text-violet-700" />,
  History: <History size={20} className="text-slate-700" />,
};

export const CanonicalServicesGrid: React.FC = () => {
  const { navigateToService, navigateToUtility } = useApp();
  
  // State for View All Services toggle (Default: First 3 services visible)
  const [showAllServices, setShowAllServices] = useState(false);

  const QUICK_ACCESS_ITEMS = [
    { label: 'Download Forms', utilityId: 'download-forms' as PublicUtilityId, icon: <Download size={16} className="text-[#004B32]" /> },
    { label: 'Tax Calculator', utilityId: 'tax-calculator' as PublicUtilityId, icon: <Calculator size={16} className="text-amber-600" /> },
    { label: 'ITR Status', serviceId: 'filing-history' as CanonicalServiceId, icon: <FileText size={16} className="text-blue-600" /> },
    { label: 'Due Dates', utilityId: 'tax-calendar' as PublicUtilityId, icon: <CalendarIcon size={16} className="text-purple-600" /> },
    { label: 'Link Aadhaar', serviceId: 'link-aadhaar' as CanonicalServiceId, icon: <Link size={16} className="text-violet-600" /> },
    { label: 'Verify Your Account', serviceId: 'e-verify' as CanonicalServiceId, icon: <ShieldCheck size={16} className="text-emerald-600" /> },
  ];

  const allServicesList = Object.values(CANONICAL_SERVICES);
  const displayedServices = showAllServices ? allServicesList : allServicesList.slice(0, 3);

  return (
    <div className="space-y-8 py-6">
      
      {/* 2-Column Grid matching UX Reference Image */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Services You May Need */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <div>
              <h2 className="text-sm font-bold text-[#1E3A2B]">Services You May Need</h2>
              <p className="text-[11px] text-slate-500">Official canonical 9-service portal catalogue</p>
            </div>
            
            {/* View All Services / View Less Button */}
            <button
              onClick={() => setShowAllServices(!showAllServices)}
              className="text-xs font-bold text-[#004B32] hover:underline inline-flex items-center gap-1 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200 transition"
            >
              <span>{showAllServices ? 'Show Less' : `View All Services (${allServicesList.length})`}</span>
              {showAllServices ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {displayedServices.map((srv) => (
              <div
                key={srv.id}
                onClick={() => navigateToService(srv.id)}
                className="group bg-white border border-slate-200/90 hover:border-[#004B32] rounded-xl p-4 shadow-sm hover:shadow-md transition cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="p-2.5 bg-[#FAF7F2] border border-slate-100 rounded-xl w-fit mb-3 group-hover:bg-emerald-50 transition">
                    {ICON_MAP[srv.iconName]}
                  </div>

                  <h3 className="font-bold text-xs text-[#1E3A2B] group-hover:text-[#004B32] transition">
                    {srv.title}
                  </h3>
                  <p className="text-[11px] text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                    {srv.shortDesc}
                  </p>
                </div>

                <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] font-bold text-[#004B32] group-hover:translate-x-1 transition">
                  <span>Access</span>
                  <ArrowRight size={12} />
                </div>
              </div>
            ))}
          </div>

          {/* Bottom View All Toggle Bar */}
          <div className="text-center pt-2">
            <button
              onClick={() => setShowAllServices(!showAllServices)}
              className="text-xs font-bold text-[#004B32] hover:underline inline-flex items-center gap-1"
            >
              <span>{showAllServices ? 'Show Less' : `View All Services (${allServicesList.length - 3} more)`}</span>
              {showAllServices ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </button>
          </div>
        </div>

        {/* Right Column: Quick Access Grid */}
        <div className="lg:col-span-4 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <h2 className="text-sm font-bold text-[#1E3A2B]">Quick Access</h2>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            {QUICK_ACCESS_ITEMS.map((qa, idx) => (
              <button
                key={idx}
                onClick={() => {
                  if (qa.serviceId) navigateToService(qa.serviceId);
                  else if (qa.utilityId) navigateToUtility(qa.utilityId);
                }}
                className="p-3 bg-white border border-slate-200 hover:border-[#004B32] rounded-xl text-left transition flex items-center justify-between group shadow-sm"
              >
                <div className="flex items-center space-x-2">
                  <div className="p-1.5 bg-[#FAF7F2] rounded-lg">
                    {qa.icon}
                  </div>
                  <span className="font-bold text-[11px] text-slate-800 group-hover:text-[#004B32]">
                    {qa.label}
                  </span>
                </div>
                <ChevronRight size={14} className="text-slate-400 group-hover:translate-x-0.5 group-hover:text-[#004B32] transition shrink-0" />
              </button>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
