import React, { useMemo } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './Calendar.css';
import { formatDateKey, getRelativeDateInfo, isToday as checkIsToday } from '../utils/dateUtils';

function AppCalendar({ selectedDate, onSelectDate, todoList = [], onAddTaskClick }) {
  const currentDate = selectedDate instanceof Date ? selectedDate : new Date(selectedDate);
  const isSelectedToday = checkIsToday(currentDate);
  const dateInfo = getRelativeDateInfo(currentDate);

  // Group tasks by date key
  const tasksByDate = useMemo(() => {
    const map = {};
    for (const item of todoList) {
      const key = formatDateKey(item.date || item.createdAt);
      if (!key) continue;
      if (!map[key]) {
        map[key] = { total: 0, pending: 0, completed: 0 };
      }
      map[key].total += 1;
      if (item.isComplete) {
        map[key].completed += 1;
      } else {
        map[key].pending += 1;
      }
    }
    return map;
  }, [todoList]);

  // Selected date statistics
  const currentKey = formatDateKey(currentDate);
  const selectedStats = tasksByDate[currentKey] || { total: 0, pending: 0, completed: 0 };

  // Total tasks across all days
  const totalTasksCount = todoList.length;

  // Custom tile content with task indicator dots and counts
  const renderTileContent = ({ date, view }) => {
    if (view !== 'month') return null;
    const key = formatDateKey(date);
    const dayStats = tasksByDate[key];
    if (!dayStats || dayStats.total === 0) return null;

    const hasPending = dayStats.pending > 0;

    return (
      <div className="day-task-indicator" title={`${dayStats.total} tasks (${dayStats.pending} pending, ${dayStats.completed} done)`}>
        <span className={`day-task-dot ${hasPending ? 'pending' : 'completed'}`} />
        {dayStats.total > 1 && (
          <span className="day-task-badge opacity-80">
            {dayStats.total}
          </span>
        )}
      </div>
    );
  };

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
              {dateInfo.subtitle}
            </p>
          </div>
        </div>

        {!isSelectedToday ? (
          <button
            onClick={() => onSelectDate(new Date())}
            type="button"
            className="px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-600 hover:bg-indigo-100 border border-indigo-200/60 transition-colors cursor-pointer active:scale-95 shadow-2xs"
            title="Jump to today's date"
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
        <Calendar 
          onChange={(newVal) => onSelectDate(newVal)} 
          value={currentDate} 
          tileContent={renderTileContent}
          className="shadow-none border-0" 
        />
      </div>

      {/* Selected Day Info & Legend Footer */}
      <div className="mt-4 pt-3.5 border-t border-slate-100 flex flex-col gap-2.5">
        <div className="flex items-center justify-between text-xs text-slate-600 font-medium">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-600 ring-2 ring-indigo-200"></span>
            <span>
              <strong className="text-slate-800">{dateInfo.title}</strong>
              <span className="text-slate-400 mx-1">·</span>
              {selectedStats.total === 0 ? (
                <span className="text-slate-400">No tasks</span>
              ) : (
                <span className="text-slate-700 font-semibold">
                  {selectedStats.total} {selectedStats.total === 1 ? 'task' : 'tasks'}
                  {selectedStats.pending > 0 ? ` (${selectedStats.pending} pending)` : ' (All done)'}
                </span>
              )}
            </span>
          </div>

          {onAddTaskClick && (
            <button
              onClick={onAddTaskClick}
              type="button"
              className="text-[11px] font-semibold text-orange-600 hover:text-orange-700 hover:underline cursor-pointer flex items-center gap-1"
            >
              <svg className="w-3 h-3 stroke-[2.5]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
              <span>Add task</span>
            </button>
          )}
        </div>

        {/* Legend */}
        <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-50">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-orange-500"></span>
              <span>Pending</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span>Completed</span>
            </span>
          </div>
          <span>Total: <strong className="text-slate-600 font-semibold">{totalTasksCount}</strong> tasks</span>
        </div>
      </div>

    </div>
  );
}

export default AppCalendar;