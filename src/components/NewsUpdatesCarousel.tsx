import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, ArrowRight, Tag, X, FileText, ShieldAlert, BookOpen, AlertCircle } from 'lucide-react';
import { useApp } from '../AppContext';

interface NewsCard {
  id: string;
  category: 'Important' | 'Advisory' | 'Guide' | 'Update';
  title: string;
  date: string;
  shortDescription: string;
  fullContent: string;
  officialRefNo: string;
  relatedServiceId?: string;
}

const NEWS_UPDATES: NewsCard[] = [
  {
    id: 'news-1',
    category: 'Important',
    title: 'CBDT extends due date for filing ITR for AY 2026-27 to 31st August 2026',
    date: '20 May 2026',
    shortDescription: 'Non-audit individual taxpayers can file their income tax returns without late fee till 31st August 2026.',
    fullContent: 'The Central Board of Direct Taxes (CBDT) under Section 119 of the Income-tax Act, 1961 hereby extends the due date of furnishing Return of Income for Assessment Year 2026-27 from 31st July 2026 to 31st August 2026 for all non-audit individual taxpayers, HUFs and salaried professionals. Taxpayers are advised to review pre-filled AIS and Form 26AS data before filing.',
    officialRefNo: 'Circular No. 09/2026-IT',
    relatedServiceId: 'file-itr',
  },
  {
    id: 'news-2',
    category: 'Advisory',
    title: 'Security Alert: Do not share your OTP, password or PAN with anyone',
    date: '18 May 2026',
    shortDescription: 'Income Tax Department never asks for PIN, OTP or bank details over phone, WhatsApp or email.',
    fullContent: 'Taxpayers are cautioned against phishing emails, SMS and fraudulent calls pretending to originate from the Income Tax Department offering instant tax refunds. The Income Tax Department never requests bank PINs, net banking credentials or OTPs via SMS/phone calls. Always verify notices directly inside the official e-Proceedings tab.',
    officialRefNo: 'Advisory No. ADV-SEC-2026-04',
  },
  {
    id: 'news-3',
    category: 'Guide',
    title: 'Comprehensive Guide: How to file ITR using pre-filled salary & AIS data',
    date: '15 May 2026',
    shortDescription: 'Check step-by-step guidance for pre-filled salary data, deduction claims and instant e-Verification.',
    fullContent: 'The e-Filing portal now automatically populates salary income (Form 16 Part B), interest income, dividend credits and TDS deductions directly from AIS/TIS and Form 26AS. Taxpayers need only to verify pre-filled information, claim Chapter VI-A deductions (80C, 80D, 80CCD), submit the return and complete e-Verification using Aadhaar OTP within 30 days.',
    officialRefNo: 'Taxpayer Guide PDF #88',
    relatedServiceId: 'file-itr',
  },
  {
    id: 'news-4',
    category: 'Update',
    title: 'ITR Forms & Offline Utilities for AY 2026-27 are now available',
    date: '12 May 2026',
    shortDescription: 'Download JSON schemas, blank PDF forms and Form 16 templates for offline return preparation.',
    fullContent: 'Offline Java/Python utilities and Excel schemas for ITR-1 (Sahaj), ITR-2, and ITR-3 for Assessment Year 2026-27 are now available for public download. Taxpayers preparing returns using third-party tax software or offline tools can download the official JSON schemas directly from the Utilities section.',
    officialRefNo: 'Update Ref UT-2026-12',
  },
];

export const NewsUpdatesCarousel: React.FC = () => {
  const { navigateToService } = useApp();
  const [scrollIndex, setScrollIndex] = useState(0);
  const [selectedNews, setSelectedNews] = useState<NewsCard | null>(null);

  const handlePrev = () => {
    setScrollIndex((prev) => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    setScrollIndex((prev) => Math.min(NEWS_UPDATES.length - 2, prev + 1));
  };

  return (
    <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-sm space-y-4">
      {/* Header with Carousel Navigation Controls */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div>
          <h3 className="font-bold text-xs text-[#1E3A2B] uppercase tracking-wider flex items-center gap-1.5">
            <Tag size={15} className="text-[#004B32]" />
            Latest Updates & Important Information
          </h3>
          <p className="text-[11px] text-slate-500">Official advisories, tax guides, and portal notifications.</p>
        </div>

        <div className="flex items-center space-x-1">
          <button
            onClick={handlePrev}
            disabled={scrollIndex === 0}
            className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-40 text-slate-700 transition"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            onClick={handleNext}
            disabled={scrollIndex >= NEWS_UPDATES.length - 2}
            className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-40 text-slate-700 transition"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* News Cards Carousel Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {NEWS_UPDATES.slice(scrollIndex, scrollIndex + 2).map((item) => (
          <div
            key={item.id}
            className="p-4 bg-[#FAF7F2] border border-slate-200/80 rounded-xl flex flex-col justify-between hover:border-[#004B32] hover:shadow-md transition cursor-pointer group"
            onClick={() => setSelectedNews(item)}
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span
                  className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded ${
                    item.category === 'Important'
                      ? 'bg-rose-100 text-rose-800 border border-rose-200'
                      : item.category === 'Advisory'
                      ? 'bg-amber-100 text-amber-800 border border-amber-200'
                      : 'bg-emerald-100 text-[#004B32] border border-emerald-200'
                  }`}
                >
                  {item.category}
                </span>
                <span className="text-[10px] text-slate-400 font-mono">{item.date}</span>
              </div>

              <h4 className="font-bold text-xs text-[#1E3A2B] line-clamp-2 group-hover:text-[#004B32] transition">
                {item.title}
              </h4>
              <p className="text-[11px] text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                {item.shortDescription}
              </p>
            </div>

            <div className="mt-3 pt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px] font-bold text-[#004B32]">
              <span>Read Full Circular & Details</span>
              <ArrowRight size={12} className="group-hover:translate-x-1 transition" />
            </div>
          </div>
        ))}
      </div>

      {/* FULL NEWS & OFFICIAL CIRCULAR MODAL */}
      {selectedNews && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-lg w-full shadow-2xl overflow-hidden animate-fadeIn">
            
            {/* Modal Header */}
            <div className="bg-[#0b2341] text-white p-5 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-[#004B32] rounded-lg">
                  <BookOpen size={18} className="text-amber-400" />
                </div>
                <div>
                  <div className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">
                    {selectedNews.category} Notification
                  </div>
                  <h3 className="text-xs font-mono text-slate-300">{selectedNews.officialRefNo}</h3>
                </div>
              </div>
              <button
                onClick={() => setSelectedNews(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg transition"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4 text-left">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400">{selectedNews.date}</span>
                <span className="text-[10px] font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded border">
                  CBDT Official Order
                </span>
              </div>

              <h3 className="text-base font-extrabold text-[#1E3A2B] leading-snug">{selectedNews.title}</h3>

              <div className="p-4 bg-[#FAF7F2] border border-slate-200 rounded-xl text-xs text-slate-700 leading-relaxed space-y-2">
                <p className="font-bold text-[#1E3A2B]">Official Statement & Clarification:</p>
                <p>{selectedNews.fullContent}</p>
              </div>

              <div className="flex justify-between items-center pt-2">
                {selectedNews.relatedServiceId ? (
                  <button
                    onClick={() => {
                      const serviceId = selectedNews.relatedServiceId;
                      setSelectedNews(null);
                      if (serviceId) navigateToService(serviceId as any);
                    }}
                    className="w-full bg-[#004B32] hover:bg-[#003825] text-white font-bold text-xs py-2.5 rounded-xl shadow-md transition flex items-center justify-center gap-1.5"
                  >
                    <FileText size={15} />
                    <span>Proceed to Service: {selectedNews.relatedServiceId}</span>
                  </button>
                ) : (
                  <button
                    onClick={() => setSelectedNews(null)}
                    className="w-full bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs py-2.5 rounded-xl transition"
                  >
                    Close Advisory Window
                  </button>
                )}
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};
