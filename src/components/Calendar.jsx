import { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './Calendar.css';

function MyApp() {
  const [value, onChange] = useState(new Date());

  return (
    <div className='bg-white/80 backdrop-blur-md place-self-center w-11/12 max-w-md flex flex-col px-4 py-6 sm:px-8 sm:py-10 md:px-10 md:py-10 rounded-3xl shadow-2xl relative z-10 border border-white/20'>
      <Calendar onChange={onChange} value={value} className="shadow-sm" />
    </div>
  );
}

export default MyApp;