import React, { useState, useEffect } from 'react';
import { resolveIntent } from '../intentRouter';
import type { IntentMatch, CalendarEvent } from '../types';
import { useApp } from '../AppContext';
import { Search, ArrowRight, CornerDownLeft, Calendar as CalendarIcon, Clock, ShieldCheck, UserCheck, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import { CALENDAR_EVENTS } from '../mockData';

export const IntelligentEntryHero: React.FC = () => {
  const { navigateToService, navigateToUtility, switchTaxpayer, activeTaxpayerId, triggerLoginModal } = useApp();
  const [query, setQuery] = useState('');
  const [match, setMatch] = useState<IntentMatch | null>(null);

  const isGuest = activeTaxpayerId === 'guest';

  // 2-Slide State for Calendar Alert Section (Classic Horizontal Sliding Track)
  const [calendarSlide, setCalendarSlide] = useState<'events-list' | 'monthly-grid'>('events-list');
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent>(CALENDAR_EVENTS[0]);
  const [isHovered, setIsHovered] = useState<boolean>(false);

  // Calendar Dynamic Year & Month Navigation State
  const [currentYear, setCurrentYear] = useState<number>(2026);
  const [currentMonthIndex, setCurrentMonthIndex] = useState<number>(7); // 0-indexed: 7 = August

  const MONTH_NAMES = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const MONTH_SHORT_MAP: Record<number, string> = {
    0: 'JAN', 1: 'FEB', 2: 'MAR', 3: 'APR', 4: 'MAY', 5: 'JUN',
    6: 'JUL', 7: 'AUG', 8: 'SEP', 9: 'OCT', 10: 'NOV', 11: 'DEC'
  };

  // Fast & Continuous Classic Auto-Slide Movement every 2.5 seconds
  useEffect(() => {
    if (isHovered) return;
    const slideTimer = setInterval(() => {
      setCalendarSlide((prev) => (prev === 'events-list' ? 'monthly-grid' : 'events-list'));
    }, 2500);

    return () => clearInterval(slideTimer);
  }, [isHovered]);

  // Per-Event Real-Time Live Countdown Clocks
  const [countdowns, setCountdowns] = useState<Record<string, { days: number; hours: number; mins: number; secs: number }>>({});

  useEffect(() => {
    const updateTimers = () => {
      const newTimers: Record<string, { days: number; hours: number; mins: number; secs: number }> = {};
      const now = new Date();

      CALENDAR_EVENTS.forEach((evt) => {
        const monthMap: Record<string, number> = { AUG: 7, SEP: 8, DEC: 11 };
        const targetDate = new Date(currentYear, monthMap[evt.month] ?? 7, parseInt(evt.date) || 31, 23, 59, 59);
        const diff = targetDate.getTime() - now.getTime();

        if (diff > 0) {
          const days = Math.floor(diff / (1000 * 60 * 60 * 24));
          const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
          const mins = Math.floor((diff / 1000 / 60) % 60);
          const secs = Math.floor((diff / 1000) % 60);
          newTimers[evt.id] = { days, hours, mins, secs };
        } else {
          newTimers[evt.id] = { days: 0, hours: 0, mins: 0, secs: 0 };
        }
      });
      setCountdowns(newTimers);
    };

    updateTimers();
    const interval = setInterval(updateTimers, 1000);
    return () => clearInterval(interval);
  }, [currentYear]);

  const handlePrevMonth = () => {
    if (currentMonthIndex === 0) {
      setCurrentMonthIndex(11);
      setCurrentYear((prev) => prev - 1);
    } else {
      setCurrentMonthIndex((prev) => prev - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonthIndex === 11) {
      setCurrentMonthIndex(0);
      setCurrentYear((prev) => prev + 1);
    } else {
      setCurrentMonthIndex((prev) => prev + 1);
    }
  };

  const handleDayClick = (dayNum: number) => {
    const activeShortMonth = MONTH_SHORT_MAP[currentMonthIndex];
    const matched = CALENDAR_EVENTS.find(
      (e) => parseInt(e.date) === dayNum && e.month === activeShortMonth
    );

    if (matched) {
      setSelectedEvent(matched);
      setCalendarSlide('events-list');
    }
  };

  const daysInMonth = new Date(currentYear, currentMonthIndex + 1, 0).getDate();
  const firstDayOfWeek = new Date(currentYear, currentMonthIndex, 1).getDay();

  const SUGGESTION_CHIPS = [
    { label: "File Return", prompt: "I want to file my return" },
    { label: "Check Refund", prompt: "I haven't received my refund" },
    { label: "Pay Tax", prompt: "Pay advance tax" },
    { label: "Respond to Notice", prompt: "I got a notice" },
    { label: "Verify Account", prompt: "Verify Account" },
  ];

  const handleSearch = (text: string) => {
    setQuery(text);
    const result = resolveIntent(text);
    setMatch(result);
  };

  const handleExecuteIntent = () => {
    if (!match) return;
    if (match.matchedServiceId === 'tax-calculator' || match.matchedServiceId === 'download-forms' || match.matchedServiceId === 'tax-calendar') {
      navigateToUtility(match.matchedServiceId);
    } else {
      navigateToService(match.matchedServiceId);
    }
  };

  const activeTimer = selectedEvent && countdowns[selectedEvent.id]
    ? countdowns[selectedEvent.id]
    : { days: 28, hours: 10, mins: 45, secs: 32 };

  return (
    <div className="relative border-b border-slate-200/60 py-10 px-4 sm:px-6 lg:px-8 overflow-hidden bg-[#FAF7F2]">
      
      {/* 80th Independence Day Dark-Visible High Resolution Background Layer */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-right lg:bg-center bg-no-repeat transition-all duration-300"
        style={{ backgroundImage: `url('/hero-bg-dark.png')` }}
      />

      {/* Subtle Gradient Overlay */}
      <div className="absolute inset-0 z-0 bg-gradient-to-r from-[#FAF7F2]/90 via-[#FAF7F2]/65 to-transparent pointer-events-none" />

      {/* Content Layer */}
      <div className="max-w-7xl mx-auto space-y-8 relative z-10">
        
        {/* Top Grid: Headline + Highlighted Search Card (Left) vs Classic Sliding Due Date Alert (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Headline & Highlighted Intent Search Box */}
          <div className="lg:col-span-7 space-y-6">
            <div>
              <h1 className="text-4xl sm:text-5xl font-extrabold text-[#1E3A2B] tracking-tight leading-tight font-serif drop-shadow-md">
                Your Taxes. <br />
                <span className="text-[#004B32]">India's Tomorrow.</span>
              </h1>
              <p className="mt-2.5 text-xs sm:text-sm font-semibold text-slate-800 max-w-xl leading-relaxed">
                A simple, transparent and trusted tax ecosystem for every citizen. Together, let's build a stronger, self-reliant India.
              </p>
            </div>

            {/* HIGHLIGHTED CHERRY ON TOP INTENT CARD */}
            <div className="bg-white/95 backdrop-blur-xl border-2 border-[#004B32] rounded-3xl p-6 sm:p-7 shadow-2xl space-y-5 relative ring-4 ring-emerald-500/20 transform hover:-translate-y-0.5 transition">
              
              <div className="absolute -top-3.5 left-6 bg-[#004B32] text-amber-300 font-extrabold text-[10px] uppercase tracking-wider px-3.5 py-1 rounded-full shadow-md flex items-center gap-1.5 border border-amber-300/40">
                <Sparkles size={13} className="animate-spin text-amber-300" />
                <span>INTELLIGENT INTENT ROUTER</span>
              </div>

              <div className="pt-1">
                <h3 className="block text-sm sm:text-base font-extrabold text-[#1E3A2B] tracking-tight">
                  What would you like to do today?
                </h3>
                <p className="text-xs text-slate-600 mt-0.5 font-medium">Tell us your need, our AI intent router will guide you step by step.</p>
              </div>

              <div className="relative">
                <input
                  type="text"
                  value={query}
                  onChange={(e) => handleSearch(e.target.value)}
                  placeholder="e.g. File ITR, Check Refund, Pay Tax, Respond to Notice..."
                  className="w-full bg-slate-50 border-2 border-slate-300/80 rounded-2xl py-3.5 pl-4 pr-12 text-xs sm:text-sm text-slate-900 font-medium placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#004B32] focus:bg-white focus:border-[#004B32] transition shadow-inner"
                />
                <button
                  onClick={handleExecuteIntent}
                  className="absolute right-2.5 top-2.5 bottom-2.5 bg-[#004B32] hover:bg-[#003825] text-white p-2.5 rounded-xl transition flex items-center justify-center shadow-md"
                >
                  <Search size={18} />
                </button>
              </div>

              {/* Filter Suggestion Buttons */}
              <div className="flex flex-wrap gap-2 pt-1 items-center">
                {SUGGESTION_CHIPS.map((chip, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSearch(chip.prompt)}
                    className="bg-[#F4F1EA] hover:bg-[#004B32] hover:text-white text-[#1E3A2B] border border-slate-300/80 text-[11px] px-3.5 py-1.5 rounded-xl font-bold transition flex items-center gap-1.5 shadow-sm"
                  >
                    <span>{chip.label}</span>
                  </button>
                ))}
              </div>

              {/* Matched Intent Card */}
              {match && (
                <div className="p-4 bg-emerald-50 border-2 border-emerald-500/70 rounded-2xl flex items-center justify-between animate-fadeIn shadow-md">
                  <div>
                    <span className="text-[9px] font-bold uppercase bg-[#004B32] text-white px-2.5 py-0.5 rounded-full">
                      Matched Service
                    </span>
                    <div className="font-bold text-xs text-slate-900 mt-1">{match.title}</div>
                    <div className="text-[11px] text-slate-600 mt-0.5">{match.description}</div>
                  </div>

                  <button
                    onClick={handleExecuteIntent}
                    className="bg-[#004B32] text-white font-bold text-xs px-4 py-2.5 rounded-xl hover:bg-[#003825] transition flex items-center gap-1.5 shadow-md shrink-0"
                  >
                    <span>Continue</span>
                    <CornerDownLeft size={14} />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: CLASSIC HORIZONTAL SLIDING CAROUSEL FOR DUE DATE ALERT */}
          <div
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className="lg:col-span-5 bg-white/95 backdrop-blur-md border border-slate-200/90 rounded-3xl p-6 shadow-xl space-y-4 relative overflow-hidden"
          >
            
            {/* Header Controls with Classic Slide Nav Arrows & Auto-Scroll Status */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center space-x-1.5 text-amber-700 font-extrabold text-xs uppercase tracking-wider">
                <Clock size={15} />
                <span>DUE DATE ALERT</span>
                <span className="text-[9px] text-[#004B32] bg-emerald-100 font-bold px-2 py-0.5 rounded-full ml-1 animate-pulse">
                  Auto-Scrolling
                </span>
              </div>

              <div className="flex items-center space-x-2">
                {/* Classic Prev / Next Slide Arrows */}
                <button
                  onClick={() => setCalendarSlide((prev) => (prev === 'events-list' ? 'monthly-grid' : 'events-list'))}
                  className="p-1.5 rounded-lg border border-slate-300 hover:bg-slate-100 text-slate-700 transition"
                  title="Previous Slide"
                >
                  <ChevronLeft size={14} />
                </button>
                <button
                  onClick={() => setCalendarSlide((prev) => (prev === 'events-list' ? 'monthly-grid' : 'events-list'))}
                  className="p-1.5 rounded-lg border border-slate-300 hover:bg-slate-100 text-slate-700 transition"
                  title="Next Slide"
                >
                  <ChevronRight size={14} />
                </button>

                {/* Bullet Indicators */}
                <div className="flex space-x-1 ml-1">
                  <div
                    onClick={() => setCalendarSlide('events-list')}
                    className={`w-2.5 h-2.5 rounded-full cursor-pointer transition-all ${
                      calendarSlide === 'events-list' ? 'bg-[#004B32] w-5' : 'bg-slate-300'
                    }`}
                  />
                  <div
                    onClick={() => setCalendarSlide('monthly-grid')}
                    className={`w-2.5 h-2.5 rounded-full cursor-pointer transition-all ${
                      calendarSlide === 'monthly-grid' ? 'bg-[#004B32] w-5' : 'bg-slate-300'
                    }`}
                  />
                </div>
              </div>
            </div>

            {/* CLASSIC HORIZONTAL SLIDE TRACK CONTAINER */}
            <div className="relative overflow-hidden min-h-[300px]">
              <div
                className="flex transition-transform duration-700 ease-in-out w-[200%]"
                style={{
                  transform: calendarSlide === 'events-list' ? 'translateX(0%)' : 'translateX(-50%)',
                }}
              >
                {/* SLIDE 1 (Left 50% width) */}
                <div className="w-1/2 pr-2 space-y-3 shrink-0">
                  <div className="flex space-x-1.5 overflow-x-auto custom-scrollbar pb-1">
                    {CALENDAR_EVENTS.map((evt) => (
                      <button
                        key={evt.id}
                        onClick={() => setSelectedEvent(evt)}
                        className={`px-2.5 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition border ${
                          selectedEvent.id === evt.id
                            ? 'bg-[#004B32] text-white border-[#004B32]'
                            : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {evt.date} {evt.month}
                      </button>
                    ))}
                  </div>

                  <div className="p-4 bg-[#FAF7F2] border border-slate-200 rounded-xl space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] font-bold uppercase bg-amber-100 text-amber-800 px-2 py-0.5 rounded">
                        AY {selectedEvent.assessmentYear}
                      </span>
                      <span className="text-xs font-bold text-slate-600">{selectedEvent.date} {selectedEvent.month} {currentYear}</span>
                    </div>

                    <div>
                      <h4 className="font-bold text-xs text-[#1E3A2B]">{selectedEvent.title}</h4>
                      <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">{selectedEvent.description}</p>
                    </div>

                    <div className="pt-2 border-t border-slate-200">
                      <div className="text-[10px] font-bold text-slate-400 uppercase mb-1.5 flex items-center gap-1">
                        <Clock size={11} className="text-amber-600" />
                        <span>Task Live Countdown Timer</span>
                      </div>
                      <div className="grid grid-cols-4 gap-1.5 text-center font-mono font-bold text-xs text-[#1E3A2B]">
                        <div className="bg-white p-2 rounded-xl border border-slate-200">{activeTimer.days}<span className="text-[8px] font-sans block text-slate-400">DAYS</span></div>
                        <div className="bg-white p-2 rounded-xl border border-slate-200">{activeTimer.hours}<span className="text-[8px] font-sans block text-slate-400">HOURS</span></div>
                        <div className="bg-white p-2 rounded-xl border border-slate-200">{activeTimer.mins}<span className="text-[8px] font-sans block text-slate-400">MINS</span></div>
                        <div className="bg-white p-2 rounded-xl border border-slate-200 text-rose-600 animate-pulse">{activeTimer.secs}<span className="text-[8px] font-sans block text-slate-400">SECS</span></div>
                      </div>
                    </div>

                    <button
                      onClick={() => navigateToService(selectedEvent.relatedServiceId)}
                      className="w-full bg-[#004B32] hover:bg-[#003825] text-white font-bold text-xs py-2.5 rounded-xl shadow-sm transition flex items-center justify-center gap-1.5"
                    >
                      <span>Launch Service: {selectedEvent.relatedServiceId}</span>
                      <ArrowRight size={13} />
                    </button>
                  </div>
                </div>

                {/* SLIDE 2 (Right 50% width) */}
                <div className="w-1/2 pl-2 space-y-3 shrink-0">
                  <div className="flex items-center justify-between bg-[#FAF7F2] p-2.5 rounded-xl border border-slate-200">
                    <button
                      onClick={handlePrevMonth}
                      className="p-1 rounded-lg border border-slate-300 hover:bg-white text-slate-700 transition"
                    >
                      <ChevronLeft size={14} />
                    </button>

                    <div className="font-bold text-xs text-[#1E3A2B] font-serif">
                      {MONTH_NAMES[currentMonthIndex]} {currentYear}
                    </div>

                    <button
                      onClick={handleNextMonth}
                      className="p-1 rounded-lg border border-slate-300 hover:bg-white text-slate-700 transition"
                    >
                      <ChevronRight size={14} />
                    </button>
                  </div>

                  <div className="grid grid-cols-7 gap-1 text-center font-bold text-[10px] text-slate-400 uppercase">
                    <div>Su</div><div>Mo</div><div>Tu</div><div>We</div><div>Th</div><div>Fr</div><div>Sa</div>
                  </div>

                  <div className="grid grid-cols-7 gap-1 text-center text-xs font-semibold">
                    {Array.from({ length: firstDayOfWeek }).map((_, i) => (
                      <div key={`blank-${i}`} className="p-2 text-slate-200"></div>
                    ))}

                    {Array.from({ length: daysInMonth }).map((_, i) => {
                      const dayNum = i + 1;
                      const activeShortMonth = MONTH_SHORT_MAP[currentMonthIndex];
                      const matchedEvent = CALENDAR_EVENTS.find(
                        (e) => parseInt(e.date) === dayNum && e.month === activeShortMonth
                      );
                      const isMarked = !!matchedEvent;

                      return (
                        <div
                          key={dayNum}
                          onClick={() => handleDayClick(dayNum)}
                          className={`p-2 rounded-lg border transition text-xs font-bold ${
                            isMarked
                              ? 'bg-[#004B32] text-white border-[#004B32] cursor-pointer hover:scale-110 shadow-md ring-2 ring-amber-400'
                              : 'bg-slate-50 border-slate-100 text-slate-700 hover:bg-slate-100'
                          }`}
                          title={isMarked ? matchedEvent?.title : undefined}
                        >
                          {dayNum}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

          </div>

        </div>

        {/* Personalisation Banner */}
        {isGuest && (
          <div className="bg-white/95 backdrop-blur-md border border-slate-200/90 rounded-2xl p-5 shadow-md flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center space-x-4">
              <div className="w-11 h-11 bg-emerald-100/70 text-[#004B32] rounded-full flex items-center justify-center shrink-0">
                <ShieldCheck size={24} />
              </div>
              <div>
                <h3 className="font-bold text-sm text-[#1E3A2B]">Login to access your personalised overview</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  View your tax status, pending actions, returns, refunds and more in your secure dashboard.
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <button
                onClick={triggerLoginModal}
                className="bg-[#004B32] hover:bg-[#003825] text-white font-bold text-xs px-5 py-2.5 rounded-lg shadow-sm transition flex items-center gap-1.5"
              >
                <UserCheck size={15} />
                <span>Login / Register</span>
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
