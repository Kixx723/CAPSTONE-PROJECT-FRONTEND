import axios from 'axios';
import React, { useEffect, useState } from 'react'
import Reveals from '../components/Reveals';
import Reveal from '../components/Reveal';
import { motion , AnimatePresence } from 'framer-motion';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import formatDateTime from '../helpers/dateTimeFormat';
import { useAuthContext } from '../hooks/useAuthContext';
import Navbar from '../components/Navbar';
import RotateLoader from 'react-spinners/RotateLoader';

const SportEvents = () => {
    const [loading, setLoading] = useState(true);
    const { id } = useParams();
    const [eventName, setEventName] = useState('');
    const [sportEvents, setSportEvents] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const { user } = useAuthContext();

    
    const handleDeleteSportEvent = async (sportEventID) => {
        
        if(!user) {
            return
        }
        
        if(window.confirm('Are you sure you want to delete this sport event?')){
            try {
                await axios.delete(`https://htc-event-app-api.onrender.com/api/v1/sport-events/${sportEventID}`, {
                    headers: {
                        'Authorization': `Bearer ${user.token}`
                    }
                })
                setSportEvents(sportEvents.filter(sportevent => sportevent._id !== sportEventID));
                setSearchQuery('');
            } catch (error) {
                console.log('Error delete sport event:', error);
            }
        }
    }

    const handleSearch = async () => {
      try {
        const response = await axios.get(`https://htc-event-app-api.onrender.com/api/v1/events/${id}/sportevents?search=${searchQuery}`);
        const sportEventData = response.data.sportevents;
        setSportEvents(sportEventData);
      } catch (error) {
        console.log('Error fetching events:', error);
      }
    };

    const fetchEventName = async () => {
      try {
        const response = await axios.get(`https://htc-event-app-api.onrender.com/api/v1/sport-events/event/${id}`);
        const eventname = response.data.event.name;
        setEventName(eventname); 
      } catch (error) {
        console.log('Error fetching single events:', error);
      }
    }

    useEffect(() => {
        if (searchQuery) {
          handleSearch();
        } else {
        const fetchSportEvents = async () => {
          try {
            const response = await axios.get(`https://htc-event-app-api.onrender.com/api/v1/events/${id}/sportevents`);
            const sportEventsData = response.data.sportevents;
            setSportEvents(sportEventsData);
            setLoading(false);
          } catch (error) {
            console.log('Error fetching single events:', error);
            setLoading(false);
          }
        }

        fetchSportEvents();
        fetchEventName();
      }
    }, [searchQuery]); // di pa final ang dependencies daghan ibahon

    
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
    <div className='h-screen'>
        <div className='bg-white'>
        <Navbar />
        </div>
        <div>
        <Reveal>
        <h1 className={`relative font-bold text-4xl 2xl:text-5xl text-center mt-4 ${!user? 'mb-10' : ''}`}>{eventName} sport events</h1>
        <Link to={`/event/${id}/tally`}><h1 className='absolute top-0 right-[15%] mt-4 text-xl underline cursor-pointer hover:text-green-500'>View Tally</h1></Link>
        </Reveal>
        {/* {user && (
        <h3><Link to={`/event/${id}/create-sportevent`}>Add Sport Event</Link></h3>
        )} */}

        {/* //search start */}
      <div className={`flex justify-center ${user ? 'mt-8' : 'mb-4'}`}>
        <div className='relative'>
      <input
        className='border-2 border-green-400 bg-white h-10 px-5 pr-16 rounded-lg text-md focus:outline-none'
        type="text"
        placeholder="Search sportevent..."
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
          <Link to={`/event/${id}/create-sportevent`} type="button" className="2xl:ml-14 2xl:text-base ml-8 mt-2 text-white bg-gradient-to-r from-green-400 via-green-500 to-green-600 hover:bg-gradient-to-br focus:ring-2 focus:outline-none focus:ring-green-300 dark:focus:ring-green-400 shadow-lg shadow-green-500/50 dark:shadow-lg dark:shadow-green-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2">
          Add Sport Event
          </Link>
          </Reveals>
         </>
        )
        }

         {/* <Reveal>
        <div className='flex justify-center mb-4'>
        <h2 className='font-bold mt-4 text-2xl 2xl:text-3xl'>Sport Events</h2>
        </div>
        </Reveal> */}
   {/* <h1 className='font-semibold text-center mt-10 text-4xl'>Goodholy! sport event not found</h1>  */}
        {sportEvents.length === 0 ? (
          searchQuery ? (
            <h1 className='font-semibold text-center mt-16 text-3xl'>Goodholy! There is no sport event found in your search. </h1>
          ) : (
            <h1 className='font-semibold text-center mt-16 text-4xl'>Goodholy! There are no sport events yet!</h1>
          )
        ) : <Reveal>
        <div className='flex flex-wrap mt-4'>
        <AnimatePresence>
          {sportEvents && sportEvents.map((sportEvent) => (
            <motion.div initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            layout
            key={sportEvent?._id} className='relative flex basis-4/12 justify-center mb-10'>
                <Link to={`/sportevents/${sportEvent._id}/schedules`}> 
                <div className="relative block max-w-sm 2xl:max-w-md p-6 bg-slate-900 border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700">
                <h5 className="mb-2 text-xl 2xl:text-2xl font-bold tracking-tight text-white dark:text-white">{sportEvent?.name}</h5>
                <p className="font-normal 2xl:text-xl text-white dark:text-gray-400">Date and Time: From {formatDateTime(sportEvent?.startDate)} To {formatDateTime(sportEvent?.endDate)}</p>
                {user && (
                    <div className='absolute top-0 right-0 mt-1 mr-2 cursor-pointer'>
                    <Link to={`/update-sportevent/${sportEvent._id}`}>
                      <span className='2xl:text-[27px] material-symbols-outlined mr-2 border-2 rounded-md text-white hover:text-white hover:bg-green-600 hover:rounded-md'>
                        edit
                      </span>
                    </Link>
                    <Link>
                      <span
                        onClick={() => handleDeleteSportEvent(sportEvent._id)}
                        className='2xl:text-[27px] material-symbols-outlined border-2 rounded-md text-white hover:text-white  hover:bg-green-600 hover:rounded-md'
                      >
                        delete
                      </span>
                    </Link>
                  </div>
                )}
                </div>
                </Link>
            </motion.div>
          ))}
          </AnimatePresence>
        </div>
        </Reveal> }
         
        {/* <Reveal>
        <div className='flex flex-wrap mt-4'>
          {sportEvents && sportEvents.map((sportEvent) => (
            
            <div key={sportEvent?._id} className='relative flex basis-4/12 justify-center mb-10'>
                <Link to={`/sportevents/${sportEvent._id}/schedules`}> 
                <div className="relative block max-w-sm 2xl:max-w-md p-6 bg-slate-900 border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700">
                <h5 className="mb-2 text-2xl 2xl:text-3xl font-bold tracking-tight text-white dark:text-white">{sportEvent?.name}</h5>
                <p className="font-normal 2xl:text-xl text-white dark:text-gray-400">Date and Time: From {formatDateTime(sportEvent?.startDate)} To {formatDateTime(sportEvent?.endDate)}</p>
                {user && (
                    <div className='absolute top-0 right-0 mt-1 mr-2 cursor-pointer'>
                    <Link to={`/update-sportevent/${sportEvent._id}`}>
                      <span className='2xl:text-[27px] material-symbols-outlined mr-2 border-2 rounded-md text-white hover:text-white hover:bg-green-600 hover:rounded-md'>
                        edit
                      </span>
                    </Link>
                    <Link>
                      <span
                        onClick={() => handleDeleteSportEvent(sportEvent._id)}
                        className='2xl:text-[27px] material-symbols-outlined border-2 rounded-md text-white hover:text-white  hover:bg-green-600 hover:rounded-md'
                      >
                        delete
                      </span>
                    </Link>
                  </div>
                )}
                </div>
                </Link>
                
            </div>
            
          ))}
        </div>
        </Reveal> */}

        {/* <ul>
            {sportEvents && sportEvents.map((sportEvent) => (
                <li key={sportEvent?._id}>
                   <Link to={`/sportevents/${sportEvent._id}/schedules`}> {sportEvent?.name}  </Link> - From {formatDateTime(sportEvent?.startDate)} To {formatDateTime(sportEvent?.endDate)}
                   {user && ( 
                    <>
                   <Link to={`/update-sportevent/${sportEvent._id}`}> <button type='Submit'>Edit</button> </Link>
                   <button onClick={() => handleDeleteSportEvent(sportEvent._id)}> Delete </button>
                   </>
                   )}
                </li>
            ))}
        </ul> */}
        {/* <table>
            <thead>
                <tr>
                    <th>RANK</th>
                    <th>DEPARTMENT</th>
                    <th>GOLD</th>
                    <th>SILVER</th>
                    <th>BRONZE</th>
                    <th>TOTAL</th>
                </tr>
            </thead>
                <tbody>
                    {departmentMedals && departmentMedals.map((medal, rank) => (
                        <tr key={medal?.department._id}>
                            <td>{rank + 1}</td>
                            <td>{medal.department?.name}</td>
                            <td>{medal?.gold}</td>
                            <td>{medal?.silver}</td>
                            <td>{medal?.bronze}</td>
                            <td>{medal?.total}</td>
                        </tr>
                    ))}
                </tbody>
        </table> */}
        </div>
        </div>
  )
}

export default SportEvents