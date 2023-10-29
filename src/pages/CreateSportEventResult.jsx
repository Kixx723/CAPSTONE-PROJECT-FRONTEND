import React from 'react'
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import logo from '../assets/logo.png';
import Reveal from '../components/Reveal';
import Reveals from '../components/Reveals';
import RevealLeft from '../components/RevealLeft';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuthContext } from '../hooks/useAuthContext';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import RotateLoader from 'react-spinners/RotateLoader';

const CreateSportEventResult = () => {
   const { id } = useParams();
   const [loading, setLoading] = useState(true);
   const [gold, setGold] = useState('');
   const [silver, setSilver] = useState('');
   const [bronze, setBronze] = useState('');
   const [departments, setDepartments] = useState([]); 
   const [isSubmitting, setIsSubmitting] = useState(false);
   const [eventName, setEventName] = useState('');
   const [sportEventName, setSportEventName] = useState('');
   const [sportEventVenue, setSportEventVenue] = useState('');
   const navigate = useNavigate();
   const { user } = useAuthContext();
   
   const handleCreateSportEventResult = async (e) => {
    e.preventDefault();

    if(!user) {
        return
    }
    
    try {
    setIsSubmitting(true);
    await axios.post(`https://htc-event-app-api.onrender.com/api/v1/results`, {
        sportevent: id,
        gold: gold,
        silver: silver,
        bronze: bronze,
    }, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${user.token}`
        }
    });
    setGold('');
    setSilver('');
    setBronze('');
    setIsSubmitting(false);
   navigate(`/sportevents/${id}/schedules`);
   toast.success('Sport Event Result Added! 🎉', {
    position: toast.POSITION.TOP_CENTER,
    autoClose: 3000, // 3 seconds for the duration of notifacation display
})
    } catch (error) {
        console.log(error);
        setIsSubmitting(false);
        toast.error(error.response.data.error, {
            position: toast.POSITION.TOP_CENTER,
            autoClose: 3000,
        });
    }
  }

  useEffect(() => {
    const fetchDepartment = async () => {
        try {
           const response = await axios.get(`https://htc-event-app-api.onrender.com/api/v1/departments`);
           const departmentData = response.data.department
           setDepartments(departmentData);
        } catch (error) {
            console.log('Error fetching Department', error);
        }
    }

    fetchDepartment();
    fetchSportEventDetails();
 }, [id]);

  const fetchSportEventDetails =  async () => {
    try {
       const response = await axios.get(`https://htc-event-app-api.onrender.com/api/v1/sport-events/${id}`);
       console.log(response.data);
       const eventNameData = response.data.sportEvent.event.name;
       const sportEventNameData = response.data.sportEvent.name;
       const sportEventVenueData = response.data.sportEvent.venue;
       setEventName(eventNameData);
       setSportEventName(sportEventNameData);
       setSportEventVenue(sportEventVenueData);
       setLoading(false);
    } catch (error) {
        console.log('Error fetching data', error);
        setLoading(false);
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
        <Navbar/>
    </div>   
    
    <Reveals>
    <h1 className='font-bold text-3xl 2xl:text-4xl 2xl:mt-6 text-center mt-3 text-green-600'>{eventName}</h1>
    </Reveals>
    <RevealLeft>
    <h1 className={`relative font-bold text-2xl 2xl:text-3xl text-center mt-4 ${!user? 'mb-5' : ''}`}>{sportEventName},{sportEventVenue ? <span className='text-2xl'> Venue: {sportEventVenue}</span> : null }</h1>
    </RevealLeft>
    
    <Reveal>
    <div className='container flex justify-center mt-5 2xl:mt-12 2xl:w-[55%] bg-white w-[65%] rounded-xl animated-gradient-border'>
        <div className='flex justify-center relative w-[50%] bg-gray-400 rounded-l-lg'>
            <img className='absolute w-98 h-full object-cover' src={logo} alt="htc-logo" />
        </div>
        <div className='p-4 w-1/2 rounded-r-lg'>
            <h1 className='text-center mb-4 text-2xl 2xl:text-3xl font-bold'>Create Result</h1>
            <form onSubmit={handleCreateSportEventResult} encType="multipart/form-data">
                <div className='flex flex-col mb-3'>
                    <label htmlFor='gold' className='2xl:text-xl'>Gold: </label>
                    <select id='gold' 
                        className='2xl:py-2 2xl:px-3 border-2 border-gray-300 focus: focus:ring-gray-500 focus:border-gray-900 rounded-md py-1 px-2'
                        required value={gold} onChange={(e) => setGold(e.target.value)}>
                        <option disabled value="">Select Department</option>
                        {departments && departments.map((department) => (
                            <option key={department._id} value={department._id}>{department.name}</option>
                        ))}
                    </select>
                </div>
                <div className='flex flex-col mb-3'>
                    <label htmlFor='silver' className='2xl:text-xl'>Silver: </label>
                    <select id='silver' 
                        className='2xl:py-2 2xl:px-3 border-2 border-gray-300 focus: focus:ring-gray-500 focus:border-gray-900 rounded-md py-1 px-2'
                        required value={silver} onChange={(e) => setSilver(e.target.value)}>
                        <option disabled value="">Select Department</option>
                        {departments && departments.map((department) => (
                            <option key={department._id} value={department._id}>{department.name}</option>
                        ))}
                    </select>
                </div>
                <div className='flex flex-col mb-3'>
                <label htmlFor='bronze' className='2xl:text-xl'>Bronze: </label>
                <select id='bronze'
                    className='2xl:py-2 2xl:px-3 border-2 border-gray-300 focus: focus:ring-gray-500 focus:border-gray-900 rounded-md py-1 px-2'
                    required value={bronze} onChange={(e) => setBronze(e.target.value)}>
                    <option disabled value="">Select Department</option>
                    {departments && departments.map((department) => (
                        <option key={department._id} value={department._id}>{department.name}</option>
                    ))}
                </select>
                </div>
                <div className="pt-4 flex items-center space-x-4">
                <Link to={`/sportevents/${id}/schedules`} className="relative bg-white flex justify-center items-center w-full text-black px-1 py-2 rounded-md focus:outline-none hover:scale-100 hover:bg-black hover:text-white transition delay-0 duration-300 ease-in-out">
                <span className="material-symbols-outlined absolute left-10">
                close
                </span>
                    Cancel
                </Link>
                <button types='submit' 
                disabled={isSubmitting} 
                className="bg-black flex justify-center items-center w-full text-white px-1 py-2 rounded-md focus:outline-none hover:scale-105 hover:bg-green-700 transition delay-0 duration-300 ease-in-out"> Create
                </button>
                </div>
            </form>
        </div>
    </div>
    </Reveal>
    </div>
  )
}

export default CreateSportEventResult;