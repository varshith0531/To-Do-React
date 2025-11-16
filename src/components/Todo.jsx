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
    <div className='bg-white place-self-center w-11/12 max-w-md flex flex-col p-4 sm:p-6 md:p-7 min-h-[400px] sm:min-h-[500px] md:min-h-[550px] rounded-xl'>


        <div className='flex items-center mt-4 sm:mt-6 md:mt-7 gap-2'>
            <img src={todo_icon} alt="todo" className='w-8 h-8 sm:w-10 sm:h-10'/>
            <h1 className='text-2xl sm:text-3xl font-semibold'>To-Do List</h1>
        </div>


        <div className='flex flex-col sm:flex-row items-stretch sm:items-center my-4 sm:my-6 md:my-7 bg-gray-300 rounded-full sm:rounded-full'>
            <input ref={inputRef} className='bg-transparent border-0 outline-none flex-1 h-12 sm:h-14 pl-4 sm:pl-6 pr-2 placeholder:text-slate-600 text-sm sm:text-base' type="text" placeholder='Add a new task'/>
            <button onClick={add} className='border-none rounded-full sm:rounded-full bg-orange-600 w-full sm:w-32 h-12 sm:h-14 text-white text-base sm:text-lg font-medium cursor-pointer mt-2 sm:mt-0'>ADD +</button>
        </div>

        <div>
        {todoList.map((item,index)=>{
            return <Todoitems key={index} text={item.text}  id={item.id} isComplete={item.isComplete} deleteTodo={deleteTodo} toggle={toggle}/>
        })}
        </div>
    </div>
  )
}

export default Todo