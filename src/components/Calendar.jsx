import { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './Calendar.css';

function MyApp() {
  const [value, onChange] = useState(new Date());

  const formattedDate = value instanceof Date 
    ? value.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })
    : '';

  const isToday = value instanceof Date && 
    value.toDateString() === new Date().toDateString();

  return (
    <div className='bg-white/95 backdrop-blur-2xl w-full sm:w-[440px] flex-shrink-0 flex flex-col rounded-3xl shadow-[0_25px_60px_-15px_rgba(0,0,0,0.35)] relative z-10 border border-white/80 p-6 sm:p-7 transition-all duration-300'>
      
      {/* Calendar Header */}
      <div className='flex items-center justify-between pb-5 mb-4 border-b border-slate-100'>
        <div className='flex items-center gap-3.5'>
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center p-2 shadow-md shadow-indigo-500/20 text-white">
            <svg className="w-6 h-6 stroke-[2]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 9v7.5" />
            </svg>
          </div>
          <div>
            <h2 className='text-xl sm:text-2xl font-bold text-slate-900 tracking-tight'>
              Calendar
            </h2>
            <p className='text-xs text-slate-500 font-medium mt-0.5'>
              {formattedDate}
            </p>
          </div>
        </div>

        {!isToday ? (
          <button
            onClick={() => onChange(new Date())}
            type="button"
            className="px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-600 hover:bg-indigo-100 border border-indigo-200/60 transition-colors cursor-pointer"
          >
            Today
          </button>
        ) : (
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-600 border border-emerald-200/60 shadow-2xs">
            Today
          </span>
        )}
      </div>

      {/* React Calendar */}
      <div className="rounded-2xl overflow-hidden border border-slate-100/90 shadow-2xs p-1 bg-white">
        <Calendar onChange={onChange} value={value} className="shadow-none border-0" />
      </div>

      {/* Selected Day Info Footer */}
      <div className="mt-4 pt-3.5 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-medium">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse"></span>
          <span>Selected: <strong className="text-slate-800">{formattedDate}</strong></span>
        </div>
        <span className="text-[11px] text-slate-400">Click to change</span>
      </div>

    </div>
  );
}

export default MyApp;