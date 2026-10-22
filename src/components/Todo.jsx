import React, { useMemo, useRef, useState, useImperativeHandle, forwardRef } from 'react'
import todo_icon from '../assets/todo_icon.png'
import Todoitems from './Todoitems'
import { 
  formatDateKey, 
  getRelativeDateInfo, 
  addDays, 
  isToday as checkIsToday 
} from '../utils/dateUtils'

const Todo = forwardRef(({ 
  selectedDate, 
  onSelectDate, 
  todoList = [], 
  setTodoList 
}, ref) => {
  const [inputText, setInputText] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all"); // 'all' | 'active' | 'completed'
  const [viewScope, setViewScope] = useState("day"); // 'day' | 'all'
  const inputRef = useRef(null);

  // Expose focus input method to parent ref
  useImperativeHandle(ref, () => ({
    focusInput: () => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }
  }));

  const currentDate = selectedDate instanceof Date ? selectedDate : new Date(selectedDate);
  const selectedDateKey = formatDateKey(currentDate);
  const dateInfo = getRelativeDateInfo(currentDate);
  const isSelectedToday = checkIsToday(currentDate);

  // Filter tasks based on current date (or all dates)
  const scopedTodos = useMemo(() => {
    if (viewScope === "all") {
      return todoList;
    }
    return todoList.filter((item) => {
      const itemKey = formatDateKey(item.date || item.createdAt);
      return itemKey === selectedDateKey;
    });
  }, [todoList, viewScope, selectedDateKey]);

  // Statistics for the current view scope
  const totalCount = scopedTodos.length;
  const completedCount = scopedTodos.filter((t) => t.isComplete).length;
  const activeCount = totalCount - completedCount;
  const percentCompleted = totalCount === 0 ? 0 : Math.round((completedCount / totalCount) * 100);

  // Add task for the selected date
  const add = () => {
    const text = inputText.trim();
    if (text === "") return;

    const newTodo = {
      id: Date.now(),
      text,
      isComplete: false,
      createdAt: new Date().toISOString(),
      date: selectedDateKey,
    };

    setTodoList((prev) => [newTodo, ...prev]);
    setInputText("");
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  // Delete task
  const deleteTodo = (id) => {
    setTodoList((prev) => prev.filter((todo) => todo.id !== id));
  };

  // Toggle complete
  const toggle = (id) => {
    setTodoList((prev) =>
      prev.map((todo) =>
        todo.id === id ? { ...todo, isComplete: !todo.isComplete } : todo
      )
    );
  };

  // Clear completed tasks in the current view
  const clearCompleted = () => {
    if (viewScope === "all") {
      setTodoList((prev) => prev.filter((t) => !t.isComplete));
    } else {
      setTodoList((prev) =>
        prev.filter((t) => {
          const itemKey = formatDateKey(t.date || t.createdAt);
          if (itemKey === selectedDateKey) {
            return !t.isComplete;
          }
          return true;
        })
      );
    }
  };

  // Filter tasks according to search query and status filter (all, active, completed)
  const displayedTodos = useMemo(() => {
    return scopedTodos.filter((todo) => {
      const matchesSearch = todo.text.toLowerCase().includes(searchQuery.trim().toLowerCase());
      if (!matchesSearch) return false;

      if (statusFilter === "active") return !todo.isComplete;
      if (statusFilter === "completed") return todo.isComplete;
      return true;
    });
  }, [scopedTodos, searchQuery, statusFilter]);

  // Day navigation helpers
  const handlePrevDay = () => {
    onSelectDate(addDays(currentDate, -1));
  };

  const handleNextDay = () => {
    onSelectDate(addDays(currentDate, 1));
  };

  const handleGoToday = () => {
    onSelectDate(new Date());
  };

  return (
    <div className='bg-white/95 backdrop-blur-2xl w-full sm:w-[440px] flex-shrink-0 flex flex-col rounded-3xl shadow-[0_25px_60px_-15px_rgba(0,0,0,0.35)] relative z-10 border border-white/80 p-6 sm:p-7 transition-all duration-300'>
      
      {/* Header */}
      <div className='flex items-center justify-between pb-5 border-b border-slate-100'>
        <div className='flex items-center gap-3.5'>
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center p-2 shadow-md shadow-orange-500/20">
            <img src={todo_icon} alt="todo icon" className='w-6 h-6 object-contain filter brightness-0 invert'/>
          </div>
          <div>
            <h1 className='text-xl sm:text-2xl font-bold text-slate-900 tracking-tight'>
              To-Do List
            </h1>
            <p className='text-xs text-slate-500 font-medium mt-0.5'>
              {viewScope === 'day' 
                ? (totalCount === 0 ? `No tasks for ${dateInfo.title}` : `${activeCount} pending · ${completedCount} completed`)
                : `${activeCount} pending · ${completedCount} completed across all days`
              }
            </p>
          </div>
        </div>

        {totalCount > 0 && (
          <span className='px-3 py-1 rounded-full text-xs font-semibold bg-orange-50 text-orange-600 border border-orange-200/60 shadow-2xs'>
            {percentCompleted}% Done
          </span>
        )}
      </div>

      {/* Progress Bar */}
      {totalCount > 0 && (
        <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden mt-4 mb-2">
          <div 
            className="h-full bg-gradient-to-r from-orange-500 to-amber-500 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${percentCompleted}%` }}
          />
        </div>
      )}

      {/* Date Switcher & Navigation Bar */}
      <div className="flex items-center justify-between bg-slate-100/70 p-1.5 rounded-2xl mt-3.5 mb-2 border border-slate-200/60">
        {/* Scope Toggle: Day vs All */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => setViewScope('day')}
            type="button"
            className={`px-3 py-1 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
              viewScope === 'day'
                ? 'bg-white text-slate-900 shadow-2xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-orange-500"></span>
            <span>{dateInfo.title}</span>
          </button>

          <button
            onClick={() => setViewScope('all')}
            type="button"
            className={`px-3 py-1 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-1 ${
              viewScope === 'all'
                ? 'bg-white text-slate-900 shadow-2xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <span>All Tasks</span>
            <span className="text-[10px] opacity-70 ml-0.5">({todoList.length})</span>
          </button>
        </div>

        {/* Day Stepper (Previous / Next / Today) */}
        {viewScope === 'day' && (
          <div className="flex items-center gap-1">
            <button
              onClick={handlePrevDay}
              type="button"
              title="Previous day"
              aria-label="Previous day"
              className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-500 hover:text-slate-800 hover:bg-white transition-all cursor-pointer"
            >
              <svg className="w-3.5 h-3.5 stroke-[2.5]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
              </svg>
            </button>

            {!isSelectedToday && (
              <button
                onClick={handleGoToday}
                type="button"
                className="px-2 py-0.5 rounded-lg text-[11px] font-semibold text-orange-600 bg-orange-50 hover:bg-orange-100 border border-orange-200/60 transition-colors cursor-pointer"
                title="Return to Today"
              >
                Today
              </button>
            )}

            <button
              onClick={handleNextDay}
              type="button"
              title="Next day"
              aria-label="Next day"
              className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-500 hover:text-slate-800 hover:bg-white transition-all cursor-pointer"
            >
              <svg className="w-3.5 h-3.5 stroke-[2.5]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
              </svg>
            </button>
          </div>
        )}
      </div>

      {/* Date Banner Description */}
      <div className="flex items-center justify-between px-1 mb-2">
        <span className="text-[11px] font-medium text-slate-500">
          {viewScope === 'day' ? (
            <>Showing tasks for <strong className="text-slate-700">{dateInfo.subtitle}</strong></>
          ) : (
            <>Showing all tasks across every date</>
          )}
        </span>
        {viewScope === 'day' && !isSelectedToday && (
          <button 
            onClick={handleGoToday} 
            type="button" 
            className="text-[11px] font-semibold text-orange-600 hover:underline cursor-pointer"
          >
            Jump to Today &rarr;
          </button>
        )}
      </div>

      {/* Add Task Input Form */}
      <div className='mb-4'>
        <div className='relative flex items-center bg-slate-50/80 hover:bg-slate-50 focus-within:bg-white border-2 border-slate-200/90 focus-within:border-orange-500 rounded-2xl p-1.5 shadow-2xs transition-all duration-200 focus-within:ring-4 focus-within:ring-orange-500/10'>
          <input 
            ref={inputRef}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className='min-w-0 flex-1 bg-transparent border-0 outline-none h-11 pl-3.5 pr-2 placeholder:text-slate-400 text-slate-800 text-sm font-medium' 
            type="text" 
            placeholder={viewScope === 'day' ? `Add a task for ${dateInfo.title}...` : 'Add task for selected day...'}
            aria-label="Add a new task"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                add();
              }
            }}
          />
          <button 
            onClick={add} 
            type="button"
            aria-label="Add task"
            className='flex-shrink-0 cursor-pointer inline-flex items-center justify-center gap-1.5 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 active:scale-95 text-white text-sm font-semibold px-4 h-11 rounded-xl transition-all duration-150 shadow-sm hover:shadow-md select-none'
          >
            <svg className="w-4 h-4 stroke-[2.5]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            <span>Add</span>
          </button>
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className='flex flex-col gap-2.5 mb-4 pt-3 border-t border-slate-100'>
        {/* Search Bar */}
        <div className='relative flex items-center bg-slate-50 border border-slate-200/70 hover:border-slate-300 focus-within:border-slate-400 focus-within:bg-white rounded-xl px-3 h-9 transition-all duration-200 shadow-2xs'>
          <svg className="w-3.5 h-3.5 text-slate-400 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
          </svg>
          <input 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            type="text" 
            placeholder='Search tasks...' 
            aria-label="Search tasks"
            className='w-full min-w-0 bg-transparent border-0 outline-none text-slate-700 placeholder:text-slate-400 text-xs font-normal'
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              type="button"
              className='p-1 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-200/60 transition-colors cursor-pointer flex-shrink-0'
              aria-label="Clear search"
              title="Clear search"
            >
              <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        {/* Filter Chips & Clear Completed */}
        <div className='flex items-center justify-between gap-2 text-xs'>
          <div className='flex items-center gap-1 bg-slate-100/80 p-1 rounded-xl'>
            <button
              onClick={() => setStatusFilter('all')}
              type="button"
              className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer font-medium ${
                statusFilter === 'all' 
                  ? 'bg-white text-slate-900 shadow-2xs font-semibold' 
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              All {totalCount > 0 && <span className="opacity-60 ml-0.5">({totalCount})</span>}
            </button>
            <button
              onClick={() => setStatusFilter('active')}
              type="button"
              className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer font-medium ${
                statusFilter === 'active' 
                  ? 'bg-white text-slate-900 shadow-2xs font-semibold' 
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Active {activeCount > 0 && <span className="opacity-60 ml-0.5">({activeCount})</span>}
            </button>
            <button
              onClick={() => setStatusFilter('completed')}
              type="button"
              className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer font-medium ${
                statusFilter === 'completed' 
                  ? 'bg-white text-slate-900 shadow-2xs font-semibold' 
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Done {completedCount > 0 && <span className="opacity-60 ml-0.5">({completedCount})</span>}
            </button>
          </div>

          {completedCount > 0 && (
            <button 
              onClick={clearCompleted}
              type="button"
              className='text-xs font-medium text-slate-400 hover:text-red-500 hover:underline transition-colors cursor-pointer px-1'
            >
              Clear completed
            </button>
          )}
        </div>
      </div>

      {/* Task List */}
      <div className="flex flex-col gap-2 max-h-[300px] overflow-y-auto pr-1">
        {displayedTodos.length > 0 ? (
          displayedTodos.map((item) => (
            <Todoitems 
              key={item.id} 
              text={item.text} 
              id={item.id} 
              isComplete={item.isComplete} 
              date={item.date || item.createdAt}
              showDateBadge={viewScope === 'all'}
              onSelectDate={onSelectDate}
              deleteTodo={deleteTodo} 
              toggle={toggle}
            />
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-8 px-4 text-center bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
            {searchQuery ? (
              <>
                <p className="text-xs font-semibold text-slate-600">No tasks match &ldquo;{searchQuery}&rdquo;</p>
                <button 
                  onClick={() => setSearchQuery('')}
                  type="button"
                  className="mt-1.5 text-xs font-semibold text-orange-600 hover:text-orange-700 underline cursor-pointer"
                >
                  Clear search
                </button>
              </>
            ) : statusFilter === 'completed' ? (
              <p className="text-xs font-medium text-slate-500">No completed tasks yet.</p>
            ) : statusFilter === 'active' ? (
              <p className="text-xs font-medium text-slate-500">No active tasks right now.</p>
            ) : (
              <>
                <div className="w-10 h-10 rounded-2xl bg-orange-50 border border-orange-100 flex items-center justify-center text-orange-500 mb-2 shadow-2xs">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5.5L19 7.5V19a2 2 0 0 1-2 2Z" />
                  </svg>
                </div>
                <p className="text-xs font-semibold text-slate-700">
                  {viewScope === 'day' ? `No tasks for ${dateInfo.title}` : 'No tasks created yet'}
                </p>
                <p className="text-[11px] text-slate-400 mt-0.5 max-w-[260px]">
                  {viewScope === 'day' 
                    ? `Click the input above to schedule a task for ${dateInfo.subtitle}.` 
                    : 'Add a new task above to get started!'}
                </p>
                {viewScope === 'day' && !isSelectedToday && (
                  <button
                    onClick={handleGoToday}
                    type="button"
                    className="mt-2 text-xs font-semibold text-orange-600 hover:text-orange-700 hover:underline cursor-pointer"
                  >
                    Go back to Today
                  </button>
                )}
              </>
            )}
          </div>
        )}
      </div>

    </div>
  );
});

Todo.displayName = "Todo";

export default Todo;