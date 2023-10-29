import React, { useEffect, useState } from 'react'
import axios from 'axios';
import Navbar from '../components/Navbar';
import logo from '../assets/logo.png';
import { Link } from 'react-router-dom';
import { useNavigate, useParams } from 'react-router-dom';
import Reveal from '../components/Reveal';
import { useAuthContext } from '../hooks/useAuthContext';
import RotateLoader from 'react-spinners/RotateLoader';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const CreateSportEvent = () => {
  const [loading, setLoading] = useState(true);
  const { id } = useParams();
  const [eventName, setEventName] = useState('');
  const [sportEventName , setSportEventName] = useState('');
  const [venue, setVenue] = useState('');
  const [sportEventStartDate , setSportEventStartDate] = useState('');
  const [sportEventEndDate , setSportEventEndDate] = useState('');
  const [sportEventMedalCount , setSportEventMedalCount] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuthContext();
  
  const handleCreateSportEvent = async (e) => {
    e.preventDefault();
    
    if(!user) {
      return
    }

    const startDate = new Date(sportEventStartDate);
    const endDate = new Date(sportEventEndDate);
    
    try {
    setIsSubmitting(true);
    await axios.post(`https://htc-event-app-api.onrender.com/api/v1/sport-events`, {
        name: sportEventName,
        event: id,
        venue: venue,
        startDate: startDate,
        endDate: endDate,
        medalCount: sportEventMedalCount,
    }, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${user.token}`
        }
    });
    setSportEventName('');
    setSportEventStartDate('');
    setSportEventEndDate('');
    setIsSubmitting(false);
    navigate(`/event/${id}/sportevents`)
    toast.success('Sport Event Created! 🎉', {
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
  };
  
  useEffect(() => {
    const fetchEventName = async () => {
        try {
           const response = await axios.get(`https://htc-event-app-api.onrender.com/api/v1/sport-events/event/${id}`);
           const eventData = response.data.event.name;
           setEventName(eventData);
           setLoading(false);
        } catch (error) {
           console.log('Error fetching events:', error);
           setLoading(false);
        }
      } 
      
      fetchEventName();
    }, []);

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
        <Navbar/>
    </div>   

    <Reveal>
    <h1 className={`relative font-bold text-3xl 2xl:text-5xl text-center mt-4 ${!user ? 'mb-10' : ''}`}>{eventName}</h1>
    </Reveal>

    <div className='container flex justify-center mt-5 bg-white w-[65%] rounded-xl animated-gradient-border 2xl:mt-16 2xl:w-[55%]'>
        <div className='flex justify-center relative w-[50%] bg-gray-400 rounded-l-lg'>
            <img className='absolute mt-14 w-96 h-80 object-cover 2xl:mt-20' src={logo} alt="htc-logo" />
        </div>
        <div className='p-4 w-1/2 rounded-r-lg'>
            <h1 className='text-center mb-4 text-2xl 2xl:text-3xl font-bold'>Add Sport Event</h1>
            <form onSubmit={handleCreateSportEvent} encType="multipart/form-data">
                <div className='flex flex-col mb-3'>
                    <label htmlFor="sportevent-name" className='text-md 2xl:text-xl'>Sport Event Name </label>
                    <input required className='2xl:py-2 2xl:px-3 border-2 border-gray-300 focus: focus:ring-gray-500 focus:border-gray-900 rounded-md py-1 px-2'
                    id="sportevent-name" type="text" placeholder='Enter a sport event name' 
                    value={sportEventName}
                    onChange={(e) => {
                      setSportEventName(e.target.value);
                    }} />
                </div>
                <div className='flex flex-col mb-3'>
                    <label htmlFor="venue" className='text-md 2xl:text-xl'>Venue </label>
                    <input required className='2xl:py-2 2xl:px-3 border-2 border-gray-300 focus: focus:ring-gray-500 focus:border-gray-900 rounded-md py-1 px-2'
                    id="venue" type="text" placeholder='Enter venue for the sport event' 
                    value={venue}
                    onChange={(e) => {
                      setVenue(e.target.value);
                    }} />
                </div>

                <div className='flex gap-44'>
                  <label htmlFor="start" className='text-md 2xl:text-xl'>Start </label>
                  <label htmlFor="end" className='text-md 2xl:text-xl'>End </label>
                </div>

                <div className='flex gap-1 mb-3'>
                    
                    <input required className='2xl:py-2 2xl:px-3 border-2 border-gray-300 rounded-md py-1 px-2'
                    id="start" type="datetime-local"
                    value={sportEventStartDate}
                    style={{ fontSize: '14px' }}
                    onChange={(e) => {
                      setSportEventStartDate(e.target.value);
                    }} />

                    <input required className='2xl:py-2 2xl:px-3 border-2 border-gray-300 rounded-md py-1 px-2'
                     id="end" type="datetime-local" 
                     value={sportEventEndDate} 
                     style={{ fontSize: '14px' }}
                     onChange={(e) => {
                      setSportEventEndDate(e.target.value);
                     }}
                     />
                </div>
                {/* <div className='flex flex-col mb-3'>
                    <label htmlFor="end" className='text-md 2xl:text-xl'>End </label>
                    <input required className='2xl:py-2 2xl:px-3 border-2 border-gray-300 rounded-md py-1 px-2'
                     id="end" type="datetime-local" 
                     value={sportEventEndDate} 
                     onChange={(e) => {
                      setSportEventEndDate(e.target.value);
                     }}
                     />
                </div> */}
                <div className='flex flex-col mb-3'>
                    <label htmlFor="medal-count" className='text-md 2xl:text-xl'>Medal Count </label>
                    <input required className='2xl:py-2 2xl:px-3 border-2 border-gray-300 rounded-md py-1 px-2'
                     id="medal-count" type="number" 
                     value={sportEventMedalCount} 
                     onChange={(e) => {
                      setSportEventMedalCount(e.target.value);
                     }}
                     />
                </div>
                
                <div className="pt-4 flex items-center space-x-4">
                <Link to={`/event/${id}/sportevents`} className="relative bg-white flex justify-center items-center w-full text-black px-1 py-2 rounded-md focus:outline-none hover:scale-100 hover:bg-black hover:text-white transition delay-0 duration-300 ease-in-out">
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
    </div>
  )
}

export default CreateSportEvent;