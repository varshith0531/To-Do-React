import React from 'react'
import Todo from './components/Todo'
import Calendar from './components/Calendar'
import PixelBlast from './components/PixelBlast'

const App = () => {
  return (
    <div className='bg-gray-950 relative min-h-screen w-full overflow-hidden m-0 p-0'>
      <div 
        className='fixed w-full h-full'
        style={{
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          width: '100vw',
          height: '100vh',
          zIndex: 0
        }}
      >
        <PixelBlast
          variant="circle"
          pixelSize={6}
          color="rgb(255,0,0)"
          patternScale={8}
          patternDensity={1.15}
          pixelSizeJitter={0.5}
          enableRipples
          rippleSpeed={0.4}
          rippleThickness={0.12}
          rippleIntensityScale={1.5}
          liquid
          liquidStrength={0.12}
          liquidRadius={1.2}
          liquidWobbleSpeed={5}
          speed={0.15}
          edgeFade={0}
          transparent
          style={{ width: '100%', height: '100%' }}
        />
      </div>
      <div className='relative z-10 flex flex-col md:flex-row gap-4 sm:gap-6 py-4 sm:py-6 px-3 sm:px-4 min-h-screen justify-center items-start'>
        <Todo />
        <Calendar />
      </div>
    </div>
  )
}

export default App