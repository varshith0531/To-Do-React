import React from 'react'
import tick from '../assets/tick.png'
import delete_icon from '../assets/delete.png'
import not_tick from '../assets/not_tick.png'

const Todoitems = ({ text, id, isComplete, deleteTodo, toggle }) => {
  return (
    <div 
      onClick={() => toggle(id)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          toggle(id);
        }
      }}
      className={`group flex items-center justify-between p-3 rounded-2xl border transition-all duration-150 cursor-pointer select-none ${
        isComplete 
          ? 'bg-slate-50/70 border-slate-200/60 opacity-70 hover:opacity-90' 
          : 'bg-white hover:bg-slate-50/80 border-slate-200/80 hover:border-slate-300 shadow-2xs hover:shadow-xs'
      }`}
    >
      <div className='flex flex-1 items-center min-w-0 mr-2'>
        <div className="relative flex items-center justify-center flex-shrink-0 w-6 h-6">
          <img 
            src={isComplete ? tick : not_tick} 
            alt={isComplete ? "Completed task" : "Active task"}  
            className={`w-5 h-5 object-contain transition-transform duration-150 group-hover:scale-105 ${isComplete ? 'brightness-95' : ''}`}
          />
        </div>
        <p 
          className={`ml-3 text-sm font-medium break-words overflow-hidden text-ellipsis transition-all duration-150 ${
            isComplete 
              ? 'line-through text-slate-400 font-normal' 
              : 'text-slate-800 group-hover:text-slate-900'
          }`}
        >
          {text}
        </p>
      </div>

      <button 
        onClick={(e) => {
          e.stopPropagation(); 
          deleteTodo(id);
        }} 
        type="button"
        className='p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 active:scale-95 rounded-lg transition-all duration-150 flex-shrink-0 cursor-pointer' 
        aria-label="Delete task"
        title="Delete task"
      >
        <img src={delete_icon} alt="Delete" className='w-3.5 h-3.5 object-contain opacity-50 group-hover:opacity-80 hover:opacity-100 transition-opacity'/>
      </button>
    </div>
  )
}

export default Todoitems
 