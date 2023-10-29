import React, { useEffect, useState } from 'react'
import Reveal from '../components/Reveal';
import RevealLeft from '../components/RevealLeft';
import Reveals from '../components/Reveals';
import { motion , AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { Link } from 'react-router-dom';
import formatDateTime from '../helpers/dateTimeFormat';
import Navbar from '../components/Navbar';
import '../App.css';
import RotateLoader from 'react-spinners/RotateLoader';

const EventsReportPage = () => {
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = async () => {
    try {
      const response = await axios.get(`https://htc-event-app-api.onrender.com/api/v1/events?search=${searchQuery}`);
      const eventData = response.data.event.reverse();
      setEvents(eventData);
    } catch (error) {
      console.log('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (searchQuery) {
      handleSearch();
    } else {
    const fetchEvents = async () => {
        try {
           const response = await axios.get(`https://htc-event-app-api.onrender.com/api/v1/events`);
           const eventData = response.data.event.reverse();
           setEvents(eventData);
           setLoading(false);
        } catch (error) {
           console.log('Error fetching events:', error);
           setLoading(false);
        }
      } 

      fetchEvents();
    }
  }, [searchQuery]);

  if(loading) {
    return (
      <>
        <Navbar />
        <div className='mt-[15%] flex justify-center '>
          <RotateLoader
          color={'#00c237'}
          size={20}
          loading={loading}
          />
        </div>
      </>
    )
  }

  return (
    <div>
        <div className='bg-white'>
         <Navbar />
         </div>

    <Reveals>
         {/* //search start */}
  <div className='flex justify-center mt-8'>
    <div className='relative'>
  <input
    className='border-2 border-green-400 bg-white h-10 px-5 pr-16 rounded-lg text-md focus:outline-none'
    type="text"
    placeholder="Search event..."
    value={searchQuery}
    onChange={(e) => setSearchQuery(e.target.value)}
  />
  <button  onClick={handleSearch}>
    <span className='material-symbols-outlined text-black hover:text-teal-400 h-5 w-5 absolute top-2 right-3 fill-current'>search</span>
  </button>
  </div>
</div>
  {/* search end */} 
  </Reveals>

  {events.length === 0 ? (
          searchQuery ? (
            <h1 className='font-semibold text-center mt-16 text-3xl'>Goodholy! There is no event found in your search. </h1>
          ) : (
            <h1 className='font-semibold text-center mt-16 text-4xl'>Goodholy! There are no events yet!</h1>
          )
        ) : <RevealLeft>
        <div className={`flex flex-wrap mt-10`}>
        <AnimatePresence>
        {events && events.map((event) => (
            <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            layout
             key={event._id} className='flex basis-6/12 mb-5 '>
              <div className='mx-4 max-w-[800px] border-3 rounded-md rotating-border bg-white'>
                <div className='flex flex-col md:flex-row'>
                  <div className='relative w-full md:w-1/2'>
                    <div className='h-80 rounded-l-md'>
                      <h2 className='mt-10 mx-5 text-3xl 2xl:text-4xl font-bold text-gray-900 h-16'>
                        {event?.name}
                      </h2>
                      <p className='my-2 mx-5 text-sm 2xl:text-base h-12 font-semibold'>
                        From: {formatDateTime(event.startDate)} <br />To: {formatDateTime(event.endDate)}
                      </p>
                      <p className='mt-2 text-[13px] 2xl:text-[15px] mb-8 mx-5 w-md text-gray-500 h-16'>
                        Sportsmanship is not just about winning or losing, but about respecting your opponents and giving your best effort with integrity and fair play.
                      </p>
      
                      <Link to={`/events/${event._id}/reports`}>
                      <button className='2xl:text-lg mt-2 mx-5 bg-black px-6 py-2 rounded-md text-white w-36 hover:scale-105 hover:bg-green-700 transition delay-0 duration-300 ease-in-out'>
                        Reports
                      </button>
                      </Link>
                    </div>
                  </div>
      
                  <div className='relative w-full md:w-1/2'>
                    <div className='bg-gray-200 h-80 rounded-r-md'>
                      <img
                        className='absolute h-full w-full object-cover rounded-r-md hover:scale-105 transition delay-0 duration-300 ease-in-out'
                        src={`http://localhost:8000/Images/${event.image}`}
                        alt={event.name}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
          </AnimatePresence>
      </div>
      </RevealLeft> }

    </div>
  )
}

export default EventsReportPage