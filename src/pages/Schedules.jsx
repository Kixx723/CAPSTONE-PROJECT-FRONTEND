import axios from 'axios';
import React from 'react'
import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom';
import Reveal from '../components/Reveal';
import RevealLeft from '../components/RevealLeft';
import Reveals from '../components/Reveals';
import formatDateTime from '../helpers/dateTimeFormat';
import { Link } from 'react-router-dom';
import { useAuthContext } from '../hooks/useAuthContext';
import Navbar from '../components/Navbar';
import RotateLoader from 'react-spinners/RotateLoader';

const Schedules = () => {
    const [loading, setLoading] = useState(true);
    const { id } = useParams();
    const [eventName, setEventName] = useState([]);
    const [sportEventName, setSportEventName] = useState([]);
    const [venue, setVenue] = useState('');
    const [schedules, setSchedules] = useState([]);
    const [results, setResults] = useState([]);
    const { user } = useAuthContext();
    const [currentPage, setCurrentPage] = useState(1);
    const schedsPerPage = 4;
    const lastIndex = currentPage * schedsPerPage;
    const firstIndex = lastIndex - schedsPerPage;
    const displayedSchedules = schedules.slice(firstIndex, lastIndex);
    const totalPages = Math.ceil(schedules.length / schedsPerPage);

    const isSwimmingOrRunning = /(swimming|running)/i.test(sportEventName.name);
    
    const handlePageChange = (newPage) => {
      setCurrentPage(newPage);
    };
  
    const handleNextPage = () => {
      if (currentPage < totalPages) {
        setCurrentPage(currentPage + 1);
      }
    };
    
    const handlePrevPage = () => {
      if (currentPage > 1) {
        setCurrentPage(currentPage - 1);
      }
    };

    const handleDeleteSchedule = async (schedID) => {

        if(!user) {
            return
        }

        if(window.confirm('Are you sure you want to delete this schedule?')) {
            try {
                await axios.delete(`https://htc-event-app-api.onrender.com/api/v1/schedules/${schedID}`, {
                    headers: {
                       'Authorization': `Bearer ${user.token}`
                    }
                });
                setSchedules(schedules.filter(schedule => schedule._id !== schedID));
            } catch (error) {
                console.log('error delete schedule', error);
            }
        }
    }

    const handleDeleteSportEventResult = async (sportEventResultID) => {

        if(!user) {
            return
        }

        if(window.confirm('Are you sure you want to delete this sport event result?')) {
            try {
                await axios.delete(`https://htc-event-app-api.onrender.com/api/v1/results/${sportEventResultID}`, {
                    headers: {
                       'Authorization': `Bearer ${user.token}`
                    }
                });
                setResults(results.filter(result => result._id !== sportEventResultID));
            } catch (error) {
                console.log('error delete sport event result', error);
            }
        }
    }

    
    useEffect(() => {
        const fetchSchedules = async () => {
            try {
                const response = await axios.get(`https://htc-event-app-api.onrender.com/api/v1/sport-events/${id}`);
                const eventData = response.data.sportEvent.event.name;
                setEventName(eventData);
                const sportEventData = response.data.sportEvent;
                setSportEventName(sportEventData);
                const sportEventVenue = response.data.sportEvent.venue;
                setVenue(sportEventVenue);
                const schedulesData = response.data.schedule
                setSchedules(schedulesData.reverse());
                const resultData = response.data.result;
                setResults(resultData);
                setLoading(false);
            } catch (error) {
                console.log('Error fetching sport-events:', error);
                setLoading(false);
            }
        };
        fetchSchedules();
    }, [schedules]);

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
        <Navbar />
        <div>
          {!user && (
            <>
            <RevealLeft>
            <h1 className='font-bold text-3xl 2xl:text-5xl text-center mt-3 text-green-600'>{eventName}</h1>
            </RevealLeft>
            </>
          )}
          {user && (
            <>
            <Reveal>
            <h1 className='font-bold text-3xl 2xl:text-5xl text-center mt-3 text-green-600'>{eventName}</h1>
            </Reveal>
            </>
          )}
          
        {!user && (
          <>
          <Reveals>
         <h1 className={`relative font-bold text-3xl 2xl:text-4xl text-center mt-4 ${!user? 'mb-5' : ''}`}>{sportEventName?.name}{venue ? <span className='text-2xl'>, Venue: {venue}</span> : null }</h1>
        </Reveals>
          </>
        )}
        <div className='flex justify-between mt-5 2xl:mt-1'>
        {user && (
        // <h3> <Link to={`/sportevents/${id}/create-schedule`}>Add Schedule</Link></h3>
        <>
        <Reveals>
            <Link to={`/sportevents/${id}/create-schedule`} type="button" className="ml-10 2xl:text-lg 2xl:m-12 text-white bg-gradient-to-r from-green-400 via-green-500 to-green-600 hover:bg-gradient-to-br focus:ring-2 focus:outline-none focus:ring-green-300 dark:focus:ring-green-400 shadow-lg shadow-green-500/50 dark:shadow-lg dark:shadow-green-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2">
            Add Schedule
            </Link>
        </Reveals>
        </>
        )}
        {user && (
        <>
        <RevealLeft>
        <h1 className='font-bold mr-10'> <Link to={`/sportevents/${id}/result`} type="button" className="2xl:text-lg 2xl:mr-5 2xl:m-12  text-white bg-gradient-to-r from-green-400 via-green-500 to-green-600 hover:bg-gradient-to-br focus:ring-2 focus:outline-none focus:ring-green-300 dark:focus:ring-green-400 shadow-lg shadow-green-500/50 dark:shadow-lg dark:shadow-green-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2">
            Add Result
            </Link> <span className='text-xl 2xl:text-2xl'>for {sportEventName?.name}</span> 
        </h1>
        </RevealLeft>
        </>
        )}
        </div>
        <div className='flex justify-between'>
            <h2 
            className={`${!user ? 'w-4/12' : 'w-1/2 '} font-bold text-3xl mt-5 ml-10 2xl:mt-0 2xl:text-4xl`}>
            <Reveal>
            Schedules{user ? <span className={`text-2xl`}>, Venue: {venue}</span> : null}
            </Reveal>
            </h2>
            <h2 className='w-1/2 font-bold text-3xl mt-5 pl-4 mr-10 ml-10 2xl:mt-0 2xl:text-4xl 2xl:pl-16'>
                <Reveal>
                Result
                </Reveal>
            </h2>
        </div>
        <Reveal>
        <div className='flex justify-between m-10 mt-2 2xl:mt-8 '>
        {/* <div className='relative overflow-x-auto shadow-md sm:rounded-lg'> */}
        
        <div className=''>
        <table className={`w-[600px] shadow-md text-sm text-left 2xl:text-lg 2xl:w-[800px] text-gray-500 dark:text-gray-400`}>
            <thead className={`${schedules.length === 1 ? 'text-md' : null } text-md 2xl:text-lg text-gray-700 uppercase bg-slate-700 dark:bg-gray-700 dark:text-gray-400`}>
                <tr>
                {schedules.length === 0 ? <><th className='px-6 py-3 text-white text-center'>Goodholy!</th></> : 
                <>
                <th className='px-6 py-3 text-white'>DATE AND TIME</th>
                    <th className='px-6 py-3 text-white'>DEPARTMENTS</th>
                    {user && (
                    <th className='px-6 py-3 text-white'>ACTION</th>
                    )}
                </>}
                    
                </tr>
            </thead>
            <tbody>
            {schedules.length === 0 ? 
            <>
            <tr>
            <td className='text-white text-lg text-center bg-white border-b dark:bg-gray-900 dark:border-gray-700'>There is no schedule yet for this sport event.</td>
            </tr>
            </> :
            displayedSchedules && displayedSchedules.map((schedule) => (
              <>
              <tr
              key={schedule?._id} className={`bg-slate-900 border-b dark:bg-gray-900 dark:border-gray-700 ${schedules.length === 1 ? 'text-md' : null }`}>
                <td className='px-6 py-4 text-white'>
                <Link >{formatDateTime(schedule?.scheduleDateTime)}</Link>
                </td>
                {isSwimmingOrRunning ? <>
                <td className='px-6 py-4 text-sm text-white hover:text-green-600'>
                CETE | CCJE | CBMA | CTE | CAS
                </td>
                </> : <>
                <td className='px-6 py-4 underline text-white hover:text-green-600'>
                <Link to={`/schedules/${schedule._id}/match`}>{schedule?.department1.name} VS {schedule?.department2.name}</Link>
                </td>
                </>}
                {user && (
                <td className='px-6 py-4'> 
                <Link to={`/update-schedule/${schedule._id}`}> <button type='Submit' className='font-medium text-blue-600 dark:text-blue-500 hover:underline'> Edit </button> </Link>
                <button className='font-medium text-red-500 dark:text-red-500 hover:underline' onClick={() => handleDeleteSchedule(schedule._id)}> Delete </button>
                </td>
                )}
              </tr>
              </>
          ))}
            
        </tbody>
        </table>
         {/* Pagination */}
    <div className="mt-4 flex justify-center">
      <button
        onClick={handlePrevPage}
        className={`px-3 py-1 mx-1 hover:bg-green-500 hover:text-black ${
          currentPage === 1 ? 'bg-black text-white cursor-not-allowed' : 'bg-black text-white'
        }`}
        disabled={currentPage === 1}
      >
        Previous
      </button>
      {Array.from({ length: totalPages }, (_, index) => (
        <button
          key={index}
          onClick={() => handlePageChange(index + 1)}
          className={`px-3 py-1 mx-1 ${
            currentPage === index + 1 ? 'bg-green-600 text-black' : 'bg-gray-200 text-black'
          }`}
        >
          {index + 1}
        </button>
      ))}
      <button
        onClick={handleNextPage}
        className={`px-3 py-1 mx-1 hover:bg-green-500 hover:text-black ${
          currentPage === totalPages ? 'bg-black text-white cursor-not-allowed' : 'bg-black text-white'
        }`}
        disabled={currentPage === totalPages}
      >
        Next
      </button>
    </div>
    </div>


        <div className={`${!user ? 'w-3/4' : 'w-1/2'} relative text-white bg-gray-900 ml-10 font-bold p-4 text-3xl h-40 border-2 2xl:w-[800px] 2xl:text-4xl 2xl:h-48 border-white  rounded-lg`}>
        {results.length === 0 ? 
        <div className='text-white text-3xl p-2 text-center'>
        <h1 className='text-white'>Goodholy! There is no result yet for this sport event.</h1>
        </div>
        : <>
        {results && results.map((result) => (
            <ul key={result?._id}>
                <li> <span className='text-[#FFD700]'>Gold:</span> {result?.gold.name}</li> 
                <li className='mt-2 2xl:mt-4'> <span className='text-[#C0C0C0]'>Silver:</span> {result?.silver.name}</li>
                <li className='mt-2 2xl:mt-4'> <span className='text-[#cd7f32]'>Bronze:</span> {result?.bronze.name}</li>

                {user && (
                    <div className='absolute top-0 right-0 mt-1 mr-2 cursor-pointer'>
                    <Link to={`/update-sportevent-result/${result._id}`}>
                      <span className='material-symbols-outlined mr-2 border-2 rounded-md text-white 2xl:text-[30px] hover:text-white hover:bg-green-600 hover:rounded-md'>
                        edit
                      </span>
                    </Link>
                    <Link>
                      <span
                        onClick={() => handleDeleteSportEventResult(result._id)}
                        className='material-symbols-outlined border-2 rounded-md text-white 2xl:text-[30px] hover:text-white  hover:bg-green-600 hover:rounded-md'
                      >
                        delete
                      </span>
                    </Link>
                  </div>
                )}
            </ul> 
        ))}
        </>}
        </div>
        </div>
        </Reveal>
        </div>
    </div>
  )
}

export default Schedules