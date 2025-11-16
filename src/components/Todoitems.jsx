import React from 'react'
import tick from '../assets/tick.png'
import delete_icon from '../assets/delete.png'
import not_tick from '../assets/not_tick.png'

const Todoitems = ({text,id,isComplete, deleteTodo, toggle}) => {
  return (
    <div onClick={()=>{toggle(id)}} className='flex items-center my-2 sm:my-3 gap-2 sm:gap-3'>
        <div className='flex flex-1 items-center cursor-pointer min-h-[44px]'>
        <img src={isComplete ? tick: not_tick} alt=""  className='w-6 sm:w-7 flex-shrink-0'/>
        <p className={`text-slate-700 ml-3 sm:ml-4 text-base sm:text-[17px] decoration-slate-500 break-words ${isComplete ? 'line-through' : ''}`}>{text}</p>
        </div>

        <button onClick={(e)=>{e.stopPropagation(); deleteTodo(id)}} className='p-2 sm:p-1 cursor-pointer hover:bg-gray-100 rounded transition-colors flex-shrink-0' aria-label="Delete task">
          <img src={delete_icon} alt="Delete" className='w-4 sm:w-3.5'/>
        </button>


    </div>
  )
}

export default Todoitems 