import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { useAuthContext } from '../hooks/useAuthContext';
import formatDateTime from '../helpers/dateTimeFormat';
import Navbar from '../components/Navbar';
import Reveals from '../components/Reveals';
import Reveal from '../components/Reveal';
import RevealLeft from '../components/RevealLeft';
import RotateLoader from 'react-spinners/RotateLoader';

const Matches = () => {
  const [loading, setLoading] = useState(true);
  const { id } = useParams();
  const [schedule, setSchedule] = useState([]);
  const [eventName, setEventName] = useState('');
  const [eventID, setEventID] = useState('');
  const [matches, setMatches] = useState([]);
  const { user } = useAuthContext();
  
  const handleDeleteMatchResult = async (matchResultID) => {
    
    if(!user) {
      return
    }

    if(window.confirm('Are you sure you want to delete this match result?')){
      try {
        await axios.delete(`https://htc-event-app-api.onrender.com/api/v1/matches/${matchResultID}`, {
          headers: {
            'Authorization': `Bearer ${user.token}`
          }
        });
        setMatches(matches.filter(match => match._id !== matchResultID));
      } catch (error) {
        console.log('error delete match result', error);
      }
    }
  } 

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const response = await axios.get(`https://htc-event-app-api.onrender.com/api/v1/schedules/${id}`);
        const scheduleData = response.data.schedule;
        setSchedule(scheduleData);
        const matchesData = response.data.match;
        setMatches(matchesData);
        const eventid = response.data.schedule.sportevent.event;
        setEventID(eventid);
        setLoading(false);
      } catch (error) {
        console.log('Error fetching schedules:', error);
        setLoading(false);
      }
    };
    
    fetchMatches();
    fetchEventName();
    
  }, [matches]); // eventID sad

  const fetchEventName = async () => {
    try {
      const response = await axios.get(`https://htc-event-app-api.onrender.com/api/v1/events/${eventID}/single-event`);
      const name = response.data.event.name;
      setEventName(name);
    } catch (error) {
      console.log('Error', error);
    }
  }


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
      <h1 className='font-bold text-3xl 2xl:text-4xl 2xl:mt-6 text-center mt-3 text-green-600'>{eventName}  <span className='text-gray-500'>-</span> <span className='text-black'>{schedule.sportevent?.name}</span></h1>
      </Reveals>
        <RevealLeft>
        <h1 className={`relative font-bold text-2xl 2xl:text-3xl text-center mt-4 ${!user? 'mb-5' : ''}`}>{schedule.sportevent?.venue ? <span className='text-2xl'> Venue: {schedule.sportevent?.venue}, <span className='text-xl'>Schedule: {formatDateTime(schedule?.scheduleDateTime)} </span> </span> : null }</h1>
        </RevealLeft>
        {/* <Reveal>
        <h1 className={`relative font-bold text-xl 2xl:text-2xl text-center mt-1 ${!user? 'mb-5' : ''}`}>Schedule: {formatDateTime(schedule?.scheduleDateTime)}</h1>
        </Reveal> */}

        {user && (
         <>
          <Reveals>
          <Link to={`/schedules/${id}/match-result`} type="button" className="2xl:ml-14 2xl:text-base ml-8 mt-2 text-white bg-gradient-to-r from-green-400 via-green-500 to-green-600 hover:bg-gradient-to-br focus:ring-2 focus:outline-none focus:ring-green-300 dark:focus:ring-green-400 shadow-lg shadow-green-500/50 dark:shadow-lg dark:shadow-green-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2">
          Add Result
          </Link>
          </Reveals>
         </>
        )
        }
        <div className='flex justify-center mb-4'>
        <Reveal>
        <h2 className='font-bold mt-1 text-2xl 2xl:text-3xl'>Match Result</h2>
        </Reveal>
        </div>
        <Reveal>
        <div className='flex justify-center mt-5'>
          <div className='border-4 border-slate-800 rounded-xl bg-slate-800 h-52 w-[60%]'>
            <h3 
            className='text-green-500 p-6 text-center font-semibold text-4xl'>
              <span className={`
              ${schedule.department1?.name === 'CETE' ? 'text-orange-600' : null}
              ${schedule.department1?.name === 'CCJE' ? 'text-white' : null}
              ${schedule.department1?.name === 'CBMA' ? 'text-[#d4af37]' : null}
              ${schedule.department1?.name === 'CTE' ? 'text-blue-600' : null}
              ${schedule.department1?.name === 'CAS' ? 'text-red-600' : null}
              `}
              >{schedule.department1?.name}</span> 
              <span className='text-[#C0C0C0]'> VS </span> 
              <span className={`
              ${schedule.department2?.name === 'CETE' ? 'text-orange-600' : null}
              ${schedule.department2?.name === 'CCJE' ? 'text-white' : null}
              ${schedule.department2?.name === 'CBMA' ? 'text-[#d4af37]' : null}
              ${schedule.department2?.name === 'CTE' ? 'text-blue-600' : null}
              ${schedule.department2?.name === 'CAS' ? 'text-red-600' : null}
              `}>{schedule.department2?.name}</span>
            </h3>
            
            {matches.length === 0 ? 
            <div className='text-white text-xl p-2 text-center'>
              <h1>Goodholy! There is no match result yet.</h1>
            </div> : <div className='text-white text-xl p-2 text-center'>
              {matches && matches.map((match) => (
              <ul key={match?._id}>
                <li>Winner: {match.winner?.name} Loser: {match.loser?.name}
                {user && (
                  <>
                <Link to={`/update-match/${match._id}`}> <button className='text-blue-500 hover:underline' type='Submit'>Edit</button> </Link>
                <button className='text-red-500 hover:underline' onClick={() => handleDeleteMatchResult(match._id)}> Delete </button> 
                  </>
                )}
                </li>
              </ul>
            ))}
            </div> }


          </div>
        </div>
        </Reveal>
      
    </div>
  )
}

export default Matches;