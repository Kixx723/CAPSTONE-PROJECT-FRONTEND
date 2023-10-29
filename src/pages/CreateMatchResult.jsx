import React, { useEffect } from 'react'
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuthContext } from '../hooks/useAuthContext';
import formatDateTime from '../helpers/dateTimeFormat';
import Navbar from '../components/Navbar';
import logo from '../assets/logo.png';
import Reveals from '../components/Reveals';
import Reveal from '../components/Reveal';
import RevealLeft from '../components/RevealLeft';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import RotateLoader from 'react-spinners/RotateLoader';

const CreateMatchResult = () => {
  const [loading, setLoading] = useState(true);
  const { id } = useParams();
  const [winner, setWinner] = useState('');
  const [loser, setLoser] = useState('');
  const [schedule, setSchedule] = useState([]);
  const [eventName, setEventName] = useState('');
  const [eventID, setEventID] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuthContext();

  const handleCreateMatchResult = async (e) => {
    e.preventDefault();
    
    if(!user) {
      return
    }

    try {
    setIsSubmitting(true);
    await axios.post(`https://htc-event-app-api.onrender.com/api/v1/matches`, {
        schedule: id,
        winner: winner,
        loser: loser,
    }, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${user.token}`
        }
    });
    setWinner('');
    setLoser('');
    navigate(`/schedules/${id}/match`);
    setIsSubmitting(false);
    toast.success('Match Result Created! 🎉', {
      position: toast.POSITION.TOP_CENTER,
      autoClose: 3000, // 3 seconds for the duration of notifacation display
  })
    } catch (error) {
      console.log(error);
      setIsSubmitting(false);
      toast.error(error.response.data.error, {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 3000,
    })
    }
  }
  

  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        const response = await axios.get(`https://htc-event-app-api.onrender.com/api/v1/schedules/${id}`);
        const scheduleData = response.data.schedule;
        setSchedule(scheduleData);
        const eventid = response.data.schedule.sportevent.event;
        setEventID(eventid);
        setLoading(false);
      } catch (error) {
        console.log('Error fetching schedule', error);
        setLoading(false);
      }
    };

    fetchSchedule();
    fetchEventName();

  }, [id, eventID]);

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

        <Reveal>
        <div className='container flex justify-center mt-10 2xl:mt-16 2xl:w-[55%] bg-white w-[65%] rounded-xl animated-gradient-border'>
        <div className='flex justify-center relative w-[50%] bg-gray-400 rounded-l-lg'>
            <img className='absolute w-98 h-full object-cover' src={logo} alt="htc-logo" />
        </div>
        <div className='p-4 w-1/2 rounded-r-lg'>
            <h1 className='text-center mb-4 text-2xl 2xl:text-3xl font-bold'>Create Match Result</h1>
            <form onSubmit={handleCreateMatchResult} encType="multipart/form-data">
                <div className='flex flex-col mb-3'>
                    <label htmlFor='winner' className='2xl:text-xl'>Winner: </label>
                    <select id='winner' 
                        className='2xl:py-2 2xl:px-3 border-2 border-gray-300 focus: focus:ring-gray-500 focus:border-gray-900 rounded-md py-1 px-2'
                        required value={winner} onChange={(e) => setWinner(e.target.value)}>
                        <option disabled value="">Select Winner</option>
                        <option 
                        key={schedule.department1?._id} 
                        value={schedule.department1?._id}>{schedule.department1?.name}</option>
                        <option 
                        key={schedule.department2?._id} 
                        value={schedule.department2?._id}>{schedule.department2?.name}</option>
                    </select>
                </div>
                <div className='flex flex-col mb-3'>
                <label htmlFor='loser' className='2xl:text-xl'>Loser: </label>
                    <select id='loser' 
                        className='2xl:py-2 2xl:px-3 border-2 border-gray-300 focus: focus:ring-gray-500 focus:border-gray-900 rounded-md py-1 px-2'
                        required value={loser} onChange={(e) => setLoser(e.target.value)}>
                        <option disabled value="">Select Loser</option>
                        <option 
                        key={schedule.department1?._id} 
                        value={schedule.department1?._id}>{schedule.department1?.name}</option>
                        <option 
                        key={schedule.department2?._id} 
                        value={schedule.department2?._id}>{schedule.department2?.name}</option>
                    </select>
                </div>

                <div className="pt-4 flex items-center space-x-4">
                <Link to={`/schedules/${id}/match`} className="relative bg-white flex justify-center items-center w-full text-black px-1 py-2 rounded-md focus:outline-none hover:scale-100 hover:bg-black hover:text-white transition delay-0 duration-300 ease-in-out">
                <span className="material-symbols-outlined absolute left-10">
                close
                </span>
                    Cancel
                </Link>
                <button 
                disabled={isSubmitting}
                types='submit' className="bg-black flex justify-center items-center w-full text-white px-1 py-2 rounded-md focus:outline-none hover:scale-105 hover:bg-green-700 transition delay-0 duration-300 ease-in-out"> Create
                </button>
                </div>
            </form>
        </div>
    </div>
    </Reveal>
    </div>
  )
}

export default CreateMatchResult;