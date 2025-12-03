import React, { useEffect, useRef, useState } from 'react'
import todo_icon from '../assets/todo_icon.png'
import Todoitems from './Todoitems'

const Todo = () => {
const [todoList,setTodoList]=useState(localStorage.getItem("todos")?JSON.parse(localStorage.getItem("todos")):[]);
const inputRef=useRef();
const add=()=>{
    const inputText=inputRef.current.value.trim();
    if(inputText===""){
        return null;
    }
    const newTodo={
        id:Date.now(),
        text: inputText,
        isComplete: false,
    }
    setTodoList((prev)=>[...prev,newTodo]);
    inputRef.current.value="";
}
const deleteTodo=(id)=>{
    setTodoList((prvTodos)=>{
        return prvTodos.filter((todo)=>todo.id!==id)
    })
}
const toggle=(id)=>{
    setTodoList((prevTodos)=>{
        return prevTodos.map((todo)=>{
            if(todo.id===id){
                return {...todo, isComplete: !todo.isComplete}
            }
            return todo;
        })
    })
}
useEffect(()=>{
    localStorage.setItem("todos",JSON.stringify(todoList));
},[todoList])


  return (
    <div className='bg-white backdrop-blur-md place-self-center w-11/12 max-w-md flex flex-col rounded-3xl shadow-2xl relative z-10 border border-white/20 p-6 sm:p-10 min-h-[500px]'>

        <div className='flex items-center justify-center gap-4 mb-12 mt-4'>
            <div className="p-4 rounded-2xl">
                <img src={todo_icon} alt="todo" className='w-8 h-8 sm:w-10 sm:h-10'/>
            </div>
            <h1 className='text-3xl sm:text-4xl font-bold text-gray-800 tracking-tight'>To-Do List</h1>
        </div>

        <div className='relative flex items-center bg-gray-100 rounded-xl mb-12 shadow-inner p-5'>
            <input 
                ref={inputRef} 
                className='bg-transparent border-0 outline-none flex-1 h-16 pl-8 pr-4 placeholder:text-gray-500 text-gray-700 text-lg font-medium rounded-l-xl mr-4' 
                type="text" 
                placeholder='Add a new task...'
                onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                        add();
                    }
                }}
            />
            <button 
                onClick={add} 
                className='border-none rounded-xl bg-orange-600 hover:bg-orange-700 px-10 h-16 text-white text-lg font-semibold cursor-pointer transition-all duration-200 shadow-md hover:shadow-lg active:scale-95 z-10'
            >
                Add
            </button>
        </div>

        <div className="flex flex-col gap-3">
        {todoList.map((item,index)=>{
            return <Todoitems key={index} text={item.text}  id={item.id} isComplete={item.isComplete} deleteTodo={deleteTodo} toggle={toggle}/>
        })}
        </div>
    </div>
  )
}

export default Todo