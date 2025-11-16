import { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './Calendar.css';

function MyApp() {
  const [value, onChange] = useState(new Date());

  return (
    <div className='bg-white place-self-center w-11/12 max-w-md flex flex-col px-4 py-6 sm:px-8 sm:py-10 md:px-12 md:py-12 rounded-xl'>
      <Calendar onChange={onChange} value={value} />
    </div>
  );
}

export default MyApp;