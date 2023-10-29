import React, { useEffect, useState } from 'react'
import Reveal from '../components/Reveal';
import RevealLeft from '../components/RevealLeft';
import Reveals from '../components/Reveals';
import { motion , AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { Link } from 'react-router-dom';
import formatDateTime from '../helpers/dateTimeFormat';
import { useAuthContext } from '../hooks/useAuthContext';
import Navbar from '../components/Navbar';
import '../App.css';
import RotateLoader from 'react-spinners/RotateLoader';

const Events = () => {
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const { user } = useAuthContext();
  

  const handleDeleteEvent = async (eventID) =>{
    if(!user) {
      return
    }

    if(window.confirm('Are you sure you want to delete this event?')) {
     try {
      await axios.delete(`https://htc-event-app-api.onrender.com/api/v1/events/${eventID}`, {
        headers: {
          'Authorization' : `Bearer ${user.token}`
        }
      });
      setEvents(events.filter(event => event._id !== eventID)); //  e updates ang state with this new filtered array. As a result, the event is removed from the rendered list on the page.
      setSearchQuery('');
    } catch (error) {
      console.log('Error delete event:', error);
     }
    }
  };

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
    <div className='bg-slate-50'> 
        <div className='bg-white'>
         <Navbar />
         </div>
        
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


    {user && (
      <>
    <Reveals>
    <Link to={`/create-event`} type="button" className="2xl:text-base ml-5 mt-8 text-white bg-gradient-to-r from-green-400 via-green-500 to-green-600 hover:bg-gradient-to-br focus:ring-2 focus:outline-none focus:ring-green-300 dark:focus:ring-green-400 shadow-lg shadow-green-500/50 dark:shadow-lg dark:shadow-green-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2">
      Add Event
    </Link>
    </Reveals>
    </>
    )
    }

   {events.length === 0 ? (
          searchQuery ? (
            <h1 className='font-semibold text-center mt-16 text-3xl'>Goodholy! There is no event found in your search. </h1>
          ) : (
            <h1 className='font-semibold text-center mt-16 text-4xl'>Goodholy! There are no events yet!</h1>
          )
        ) : <Reveal>
        <div className={`flex flex-wrap ${!user ? 'mt-10' : ''}`}>
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
      
                      {user && (
                        <div className='absolute top-0 right-0 mt-1 mr-5 cursor-pointer'>
                          <Link to={`/update-event/${event._id}`}>
                            <span className='material-symbols-outlined 2xl:text-[30px] mr-2 border-2 rounded-md hover:text-white hover:bg-black hover:rounded-md'>
                              edit
                            </span>
                          </Link>
                          <Link>
                            <span
                              onClick={() => handleDeleteEvent(event._id)}
                              className='material-symbols-outlined 2xl:text-[30px] border-2 rounded-md hover:text-white  hover:bg-black hover:rounded-md'
                            >
                              delete
                            </span>
                          </Link>
                        </div>
                      )}
                      <Link to={`/event/${event._id}/sportevents`}>
                      <button className='2xl:text-lg mt-2 mx-5 bg-black px-6 py-2 rounded-md text-white w-36 hover:scale-105 hover:bg-green-700 transition delay-0 duration-300 ease-in-out'>
                        View
                      </button>
                      </Link>
                    </div>
                  </div>
      
                  <div className='relative w-full md:w-1/2'>
                    <div className='bg-gray-200 h-80 rounded-r-md'>
                      <img
                        className='absolute h-full w-full object-cover rounded-r-md hover:scale-105 transition delay-0 duration-300 ease-in-out'
                        src={`https://htc-event-app-api.onrender.com/Images/${event.image}`}
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
      </Reveal> }

  {/* <Reveal>
  <div className={`flex flex-wrap ${!user ? 'mt-10' : ''}`}>
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

                {user && (
                  <div className='absolute top-0 right-0 mt-1 mr-5 cursor-pointer'>
                    <Link to={`/update-event/${event._id}`}>
                      <span className='material-symbols-outlined 2xl:text-[30px] mr-2 border-2 rounded-md hover:text-white hover:bg-black hover:rounded-md'>
                        edit
                      </span>
                    </Link>
                    <Link>
                      <span
                        onClick={() => handleDeleteEvent(event._id)}
                        className='material-symbols-outlined 2xl:text-[30px] border-2 rounded-md hover:text-white  hover:bg-black hover:rounded-md'
                      >
                        delete
                      </span>
                    </Link>
                  </div>
                )}
                <Link to={`/event/${event._id}/sportevents`}>
                <button className='2xl:text-lg mt-2 mx-5 bg-black px-6 py-2 rounded-md text-white w-36 hover:scale-105 hover:bg-green-700 transition delay-0 duration-300 ease-in-out'>
                  View
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
</Reveal> */}
         {/* <div className='flex flex-wrap mt-24 bg-black'>

          {events && events.map((event) => (
            
         <div key={event._id} className='flex basis-6/12 mb-5 border-3 rounded-md rotating-border bg-white'>
         <div className='w-[450px] h-80 rounded-l-md relative'>
          <h2 className='mt-10 mx-5  text-4xl font-bold text-gray-900 h-16'> {event?.name} </h2>
          <p className="my-1 mx-5 text-sm h-12 font-semibold">From: {formatDateTime(event.startDate)} To: {formatDateTime(event.endDate)}</p>
          <p className="mt-2 text-sm mb-8 mx-5 w-md text-gray-500 h-12 ">Sportsmanship is not just about winning or losing, but about respecting your opponents and giving your best effort with integrity and fair play.</p>
          
          {user && (
          <div className='w-[62px] absolute top-0 right-0 mt-1 mr-5 cursor-pointer'>
              <Link to={`/update-event/${event._id}`} ><span className="material-symbols-outlined mr-2 border-2 rounded-md hover:text-white hover:bg-black hover:rounded-md">edit</span></Link>
              <Link><span onClick={() => handleDeleteEvent(event._id)} className="material-symbols-outlined border-2 rounded-md hover:text-white  hover:bg-black hover:rounded-md">delete</span></Link>
          </div>
          )}
          <button className='mt-2 mx-5 bg-black px-6 py-2 rounded-md text-white w-36 hover:scale-105 hover:bg-green-700 transition delay-0 duration-300 ease-in-out'>
            View
          </button>
         </div>
         <div className='relative bg-gray-200 w-[350px] h-80 rounded-r-md'>
         <img className="absolute h-full w-full object-cover rounded-r-md hover:scale-105 transition delay-0 duration-300 ease-in-out"
         src={`http://localhost:8000/Images/${event.image}`} />
         </div>
         </div>
         ))}
         </div> */}
        {/* <div>
        <h1>Events</h1>
        {user && (
          <h2> <Link to={`/create-event`}> Add Event </Link> </h2>
          )
        }
        <ul>
            {events && events.map((event) => (
                <li key={event._id}>
                    <Link to={`/event/${event._id}/sportevents`}> {event?.name} </Link> - From {formatDateTime(event.startDate)} To {formatDateTime(event.endDate)}
                    {user && (
                      <>
                    <Link to={`/update-event/${event._id}`}> <button type='Submit'>Edit</button> </Link>
                    <button onClick={() => handleDeleteEvent(event._id)}> Delete </button>
                      </>
                    )}
                </li>
            ))}
        </ul>
        </div> */}
     </div>   
  ) 
}

export default Events;