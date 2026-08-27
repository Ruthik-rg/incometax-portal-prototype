import React from 'react';
import { AppProvider, useApp } from './AppContext';
import { ErrorBoundary } from './ErrorBoundary';
import { TaxpayerSwitcherBar } from './components/TaxpayerSwitcherBar';
import { HeaderNav } from './components/HeaderNav';
import { IntelligentEntryHero } from './components/IntelligentEntryHero';
import { CanonicalServicesGrid } from './components/CanonicalServicesGrid';
import { PostLoginDashboard } from './components/PostLoginDashboard';
import { NewsUpdatesCarousel } from './components/NewsUpdatesCarousel';
import { LoginGateModal } from './components/LoginGateModal';
import { ArrowLeft, Home, ChevronRight } from 'lucide-react';

// Canonical Services
import { FileItrWorkflow } from './components/FileItrWorkflow';
import { EVerifyWorkflow } from './components/EVerifyWorkflow';
import { EPayTaxWorkflow } from './components/EPayTaxWorkflow';
import { AisTisWorkflow } from './components/AisTisWorkflow';
import { Form26asWorkflow } from './components/Form26asWorkflow';
import { RefundStatusWorkflow } from './components/RefundStatusWorkflow';
import { RespondNoticesWorkflow } from './components/RespondNoticesWorkflow';
import { LinkAadhaarWorkflow } from './components/LinkAadhaarWorkflow';
import { FilingHistoryWorkflow } from './components/FilingHistoryWorkflow';

// Public Utilities
import { TaxCalculatorUtility, DownloadFormsUtility } from './components/Utilities';
import { Footer } from './components/Footer';

const MainLayout: React.FC = () => {
  const { activeView, activeTaxpayerId, navigateToHome } = useApp();
  const isGuest = activeTaxpayerId === 'guest';
  const isInnerPage = activeView.type === 'service' || activeView.type === 'utility';

  const renderActiveContent = () => {
    if (activeView.type === 'service') {
      switch (activeView.id) {
        case 'file-itr':
          return <FileItrWorkflow />;
        case 'e-verify':
          return <EVerifyWorkflow />;
        case 'e-pay-tax':
          return <EPayTaxWorkflow />;
        case 'ais-tis':
          return <AisTisWorkflow />;
        case 'form-26as':
          return <Form26asWorkflow />;
        case 'refund-status':
          return <RefundStatusWorkflow />;
        case 'respond-notices':
          return <RespondNoticesWorkflow />;
        case 'link-aadhaar':
          return <LinkAadhaarWorkflow />;
        case 'filing-history':
          return <FilingHistoryWorkflow />;
        default:
          return <CanonicalServicesGrid />;
      }
    }

    if (activeView.type === 'utility') {
      switch (activeView.id) {
        case 'tax-calculator':
          return <TaxCalculatorUtility />;
        case 'download-forms':
          return <DownloadFormsUtility />;
        case 'tax-calendar':
          return <CanonicalServicesGrid />;
        default:
          return <CanonicalServicesGrid />;
      }
    }

    // Home Default View (Pre-login & Post-login layout)
    return (
      <div className="space-y-6">
        <IntelligentEntryHero />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          {!isGuest && <PostLoginDashboard />}
          <CanonicalServicesGrid />
          <NewsUpdatesCarousel />
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between selection:bg-emerald-500 selection:text-white">
      <div>
        <TaxpayerSwitcherBar />
        <HeaderNav />

        {/* Global Back Navigation Bar for all Services & Utilities */}
        {isInnerPage && (
          <div className="bg-[#FAF7F2] border-b border-slate-200 py-3 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto flex items-center justify-between">
              <button
                onClick={navigateToHome}
                className="bg-white hover:bg-slate-100 border border-slate-300 text-[#1E3A2B] font-bold text-xs px-3.5 py-2 rounded-xl transition shadow-sm flex items-center gap-2 group"
              >
                <ArrowLeft size={16} className="text-[#004B32] group-hover:-translate-x-1 transition" />
                <span>Back to Home</span>
              </button>

              <div className="flex items-center space-x-1 text-xs text-slate-500 font-semibold">
                <span className="hover:underline cursor-pointer flex items-center gap-1" onClick={navigateToHome}>
                  <Home size={13} />
                  Home
                </span>
                <ChevronRight size={13} className="text-slate-400" />
                <span className="text-[#004B32] font-bold uppercase">{activeView.type}: {activeView.id}</span>
              </div>
            </div>
          </div>
        )}

        <main>{renderActiveContent()}</main>
        {activeView.type === 'login-gate' && <LoginGateModal />}
      </div>
      <Footer />
    </div>
  );
};

export default function App() {
  return (
    <ErrorBoundary>
      <AppProvider>
        <MainLayout />
      </AppProvider>
    </ErrorBoundary>
  );
}
