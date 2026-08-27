import React, { useState } from 'react';
import { useApp } from '../AppContext';
import { CANONICAL_SERVICES } from '../mockData';
import type { CanonicalServiceId, PublicUtilityId } from '../types';
import {
  Globe,
  Bell,
  LogOut,
  ChevronDown,
  Menu,
  X,
  UserCheck,
  Search,
  FileText,
  HelpCircle,
  Building2,
  PhoneCall,
  BookOpen,
  Info,
} from 'lucide-react';

export const HeaderNav: React.FC = () => {
  const { taxpayer, activeTaxpayerId, switchTaxpayer, navigateToService, navigateToUtility, navigateToHome } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<'services' | 'tax-info' | 'about-us' | 'help' | null>(null);

  const isGuest = activeTaxpayerId === 'guest';

  const toggleDropdown = (name: 'services' | 'about-us' | 'help' | 'tax-info') => {
    setActiveDropdown((prev) => (prev === name ? null : name));
  };

  const handleServiceClick = (serviceId: CanonicalServiceId) => {
    setActiveDropdown(null);
    setMobileMenuOpen(false);
    navigateToService(serviceId);
  };

  const handleUtilityClick = (utilityId: PublicUtilityId) => {
    setActiveDropdown(null);
    setMobileMenuOpen(false);
    navigateToUtility(utilityId);
  };

  return (
    <header className="bg-[#FAF7F2] border-b border-slate-200/80 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
        
        {/* State Emblem of India Image */}
        <div className="flex items-center space-x-3 cursor-pointer select-none" onClick={navigateToHome}>
          <img
            src="/emblem.png"
            alt="State Emblem of India - Satyameva Jayate"
            className="h-12 w-auto object-contain mix-blend-multiply"
          />

          <div className="border-l border-slate-300 pl-3 py-0.5">
            <div className="font-extrabold text-sm text-[#1E3A2B] tracking-tight uppercase leading-tight font-serif">
              INCOME TAX DEPARTMENT
            </div>
            <div className="text-[10px] text-slate-600 font-bold tracking-widest uppercase mt-0.5">
              GOVERNMENT OF INDIA
            </div>
          </div>
        </div>

        {/* Header Navigation Links with Interactive Dropdown Menus */}
        <nav className="hidden lg:flex items-center space-x-6 font-bold text-xs text-[#1E3A2B]">
          <button
            onClick={navigateToHome}
            className="pb-1 border-b-2 border-[#1E3A2B] text-[#1E3A2B] transition"
          >
            Home
          </button>

          <button
            onClick={() => handleServiceClick('file-itr')}
            className="hover:text-emerald-700 transition"
          >
            e-File
          </button>

          <button
            onClick={() => handleServiceClick('e-verify')}
            className="hover:text-emerald-700 transition"
          >
            e-Verify
          </button>

          {/* Services Dropdown */}
          <div className="relative">
            <button
              onClick={() => toggleDropdown('services')}
              className="hover:text-emerald-700 transition flex items-center space-x-1 py-1"
            >
              <span>Services</span>
              <ChevronDown size={12} />
            </button>

            {activeDropdown === 'services' && (
              <div className="absolute top-full left-0 mt-2 w-64 bg-white border border-slate-200 rounded-xl shadow-xl py-2 z-50 animate-fadeIn">
                <div className="px-3 py-1.5 text-[9px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100">
                  Canonical Services Registry
                </div>
                {Object.values(CANONICAL_SERVICES).map((srv) => (
                  <button
                    key={srv.id}
                    onClick={() => handleServiceClick(srv.id)}
                    className="w-full text-left px-3 py-2 hover:bg-[#F3EFEA] text-xs font-semibold text-[#1E3A2B] transition flex items-center justify-between"
                  >
                    <span>{srv.title}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Tax Information Dropdown */}
          <div className="relative">
            <button
              onClick={() => toggleDropdown('tax-info')}
              className="hover:text-emerald-700 transition flex items-center space-x-1 py-1"
            >
              <span>Tax Information</span>
              <ChevronDown size={12} />
            </button>

            {activeDropdown === 'tax-info' && (
              <div className="absolute top-full left-0 mt-2 w-72 bg-white border border-slate-200 rounded-xl shadow-xl py-2 z-50 animate-fadeIn">
                <div className="px-3 py-1.5 text-[9px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100">
                  Taxpayer Knowledge Base
                </div>
                <button
                  onClick={() => handleServiceClick('ais-tis')}
                  className="w-full text-left px-3 py-2 hover:bg-[#F3EFEA] text-xs font-semibold text-[#1E3A2B] transition flex items-center justify-between"
                >
                  <span>AIS / TIS Statement Overview</span>
                </button>
                <button
                  onClick={() => handleServiceClick('form-26as')}
                  className="w-full text-left px-3 py-2 hover:bg-[#F3EFEA] text-xs font-semibold text-[#1E3A2B] transition flex items-center justify-between"
                >
                  <span>Form 26AS Tax Credit Details</span>
                </button>
                <button
                  onClick={() => handleUtilityClick('tax-calculator')}
                  className="w-full text-left px-3 py-2 hover:bg-[#F3EFEA] text-xs font-semibold text-[#1E3A2B] transition flex items-center justify-between"
                >
                  <span>Tax Slabs & Calculator (AY 2026-27)</span>
                </button>
                <button
                  onClick={() => handleUtilityClick('download-forms')}
                  className="w-full text-left px-3 py-2 hover:bg-[#F3EFEA] text-xs font-semibold text-[#1E3A2B] transition flex items-center justify-between"
                >
                  <span>Download Blank Forms & JSON Schemas</span>
                </button>
              </div>
            )}
          </div>

          {/* About Us Dropdown */}
          <div className="relative">
            <button
              onClick={() => toggleDropdown('about-us')}
              className="hover:text-emerald-700 transition flex items-center space-x-1 py-1"
            >
              <span>About Us</span>
              <ChevronDown size={12} />
            </button>

            {activeDropdown === 'about-us' && (
              <div className="absolute top-full left-0 mt-2 w-64 bg-white border border-slate-200 rounded-xl shadow-xl py-2 z-50 animate-fadeIn">
                <div className="px-3 py-1.5 text-[9px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100">
                  Income Tax Department
                </div>
                <div className="px-3 py-2 text-xs text-slate-600 leading-relaxed border-b border-slate-100">
                  <span className="font-bold text-[#1E3A2B] block mb-1">Government of India Portal</span>
                  Next-generation e-Filing architecture designed for transparent, fast, and accessible taxpayer services.
                </div>
                <div className="px-3 py-2 text-[11px] font-semibold text-slate-500">
                  Central Board of Direct Taxes (CBDT)
                </div>
              </div>
            )}
          </div>

          {/* Help & Support Dropdown */}
          <div className="relative">
            <button
              onClick={() => toggleDropdown('help')}
              className="hover:text-emerald-700 transition flex items-center space-x-1 py-1"
            >
              <span>Help</span>
              <ChevronDown size={12} />
            </button>

            {activeDropdown === 'help' && (
              <div className="absolute top-full left-0 mt-2 w-64 bg-white border border-slate-200 rounded-xl shadow-xl py-2 z-50 animate-fadeIn">
                <div className="px-3 py-1.5 text-[9px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100">
                  Helpline & Support
                </div>
                <div className="px-3 py-2 text-xs text-slate-700 space-y-1">
                  <div className="font-bold text-[#004B32]">Toll-Free Helpline:</div>
                  <div className="font-mono font-bold">1800 103 0025 / 1800 419 0025</div>
                  <div className="text-[10px] text-slate-400">Mon - Sat: 9:00 AM - 8:00 PM</div>
                </div>
                <button
                  onClick={() => handleServiceClick('respond-notices')}
                  className="w-full text-left px-3 py-2 hover:bg-[#F3EFEA] text-xs font-semibold text-[#1E3A2B] transition border-t border-slate-100 flex items-center justify-between"
                >
                  <span>e-Proceeding Notice Support</span>
                </button>
              </div>
            )}
          </div>
        </nav>

        {/* Right Actions */}
        <div className="flex items-center space-x-3">
          <button className="p-2 rounded-full hover:bg-slate-200/60 text-slate-600 transition">
            <Search size={16} />
          </button>

          <div className="flex items-center space-x-1 bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-slate-700 cursor-pointer">
            <Globe size={13} />
            <span>English</span>
            <ChevronDown size={11} />
          </div>

          {isGuest ? (
            <button
              onClick={() => handleServiceClick('file-itr')}
              className="bg-[#004B32] hover:bg-[#003825] text-white font-bold text-xs px-4 py-2 rounded-lg shadow-sm transition flex items-center gap-1.5"
            >
              <UserCheck size={14} />
              <span>Login / Register</span>
            </button>
          ) : (
            <div className="flex items-center space-x-2">
              <div className="hidden sm:block text-right">
                <div className="text-xs font-bold text-[#1E3A2B]">{taxpayer.name}</div>
                <div className="text-[10px] font-mono text-slate-500">PAN: {taxpayer.pan}</div>
              </div>
              <button
                onClick={() => switchTaxpayer('guest')}
                className="bg-white hover:bg-slate-100 text-slate-700 p-2 rounded-lg text-xs font-bold transition flex items-center gap-1 border border-slate-300"
              >
                <LogOut size={14} />
              </button>
            </div>
          )}

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg hover:bg-slate-200 text-slate-700"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

      </div>
    </header>
  );
};
