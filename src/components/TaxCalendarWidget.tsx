import React from 'react';
import { useApp } from '../AppContext';
import { CALENDAR_EVENTS } from '../mockData';
import { Calendar, ArrowRight, AlertTriangle } from 'lucide-react';

export const TaxCalendarWidget: React.FC = () => {
  const { navigateToService, navigateToUtility } = useApp();

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
        <div className="flex items-center space-x-2">
          <div className="bg-amber-100 p-2 rounded-lg text-amber-700">
            <Calendar size={18} />
          </div>
          <div>
            <h3 className="font-bold text-slate-800 text-sm">Tax Calendar & Upcoming Deadlines</h3>
            <p className="text-[11px] text-slate-500">Click any deadline to jump directly into the canonical workflow.</p>
          </div>
        </div>
        <button
          onClick={() => navigateToUtility('tax-calendar')}
          className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
        >
          <span>View All</span>
          <ArrowRight size={13} />
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {CALENDAR_EVENTS.map((evt) => {
          const isHigh = evt.urgency === 'high';
          return (
            <div
              key={evt.id}
              onClick={() => navigateToService(evt.relatedServiceId)}
              className="group p-3 rounded-lg border border-slate-200 hover:border-emerald-500 hover:shadow-md transition cursor-pointer bg-slate-50 hover:bg-white flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-1.5">
                    <span className="font-black text-lg text-slate-900 leading-none">{evt.date}</span>
                    <span className="text-[11px] font-bold text-emerald-700 uppercase bg-emerald-50 px-1.5 py-0.5 rounded">
                      {evt.month}
                    </span>
                  </div>
                  {isHigh && (
                    <span className="bg-rose-100 text-rose-700 text-[9px] font-bold px-1.5 py-0.5 rounded flex items-center gap-1">
                      <AlertTriangle size={10} />
                      Due Soon
                    </span>
                  )}
                </div>

                <div className="font-bold text-xs text-slate-800 group-hover:text-emerald-700 transition line-clamp-1">
                  {evt.title}
                </div>
                <div className="text-[11px] text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                  {evt.description}
                </div>
              </div>

              <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] font-semibold text-emerald-700 group-hover:translate-x-0.5 transition">
                <span>Action: {evt.relatedServiceId}</span>
                <ArrowRight size={12} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
