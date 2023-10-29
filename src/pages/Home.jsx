import React from 'react';
import mascot from '../assets/mascot.png';
import Navbar from '../components/Navbar';
import Reveal from '../components/Reveal';
import Reveals from '../components/Reveals';


const Home = () => {
  return (
    <Reveal>
    <div className='h-screen'>
      <div className='bg-white'>
      <Navbar />
      </div>
    <div>
      <div>
      <div className='absolute right-0 bottom-0 w-[500px] h-[500px] 2xl:w-[600px] 2xl:h-[600px] border lester-shape bg-gradient-to-r from-green-300 to-green-500'>
      </div>
      <div>
        <img className='absolute right-7 bottom-[-60px] w-[500px] h-[550px] 2xl:w-[600px] 2xl:bottom-[-70px] 2xl:h-[670px]' src={mascot} alt="mascot" />
      </div>  
      </div>
      <div className='flex justify-center items-center 2xl:mt-16 w-[50%] h-[420px] border-b-4 border-gray-300'>
        <div className=' w-[70%] h-[50%]'>
          <Reveals>
          <h1 className='mb-10 text-slate-700 mx-10 font-bold text-4xl 2xl:text-5xl'>E-Tally and Medal Ranking System For Sports Events.</h1>
          </Reveals>
          <Reveals>
          <p className='mx-10 italic 2xl:text-lg'>This system utilizing a medal-based system to determine
             overall standings, promoting healthy competition and sportsmanship.</p>
          </Reveals>
        </div>
      </div>
    </div>
    </div>
    </Reveal>
  )
}

export default Home