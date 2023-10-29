import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import logo from '../assets/logo.png';
import Reveal from '../components/Reveal';
import { useNavigate, useParams } from 'react-router-dom';
import formatDateForInput from '../helpers/dateTimeInputFormat';
import { useAuthContext } from '../hooks/useAuthContext';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import RotateLoader from 'react-spinners/RotateLoader';

const UpdateEvent = () => {
    const { id } = useParams();
    const [loading, setLoading] = useState(true);
    const [eventName, setEventName] = useState('');
    const [eventStartDate, setEventStartDate] = useState('');
    const [eventEndDate, setEventEndDate] = useState('');
    const [file, setFile] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();
    const { user } = useAuthContext();
    
    useEffect(() => {
        const fetchEvent = async () => {
            try {
                const response = await axios.get(`https://htc-event-app-api.onrender.com/api/v1/events/${id}/single-event`);
                const name = response.data.event.name;
                const startDate = response.data.event.startDate;
                const endDate = response.data.event.endDate;
                // const image = response.data.event.image;
                setEventName(name);
                setEventStartDate(formatDateForInput(startDate));
                setEventEndDate(formatDateForInput(endDate));
                setLoading(false);
            } catch (error) {
                console.log(error);
                setLoading(false);
            }
        }
        fetchEvent();
    }, [id]);
    
    const handleUpdateEvent = async (e) => {
        e.preventDefault();

        if(!user) {
            return
        }

        const startDate = new Date(eventStartDate);
        const endDate = new Date(eventEndDate);
        
        const formData = new FormData();
        formData.append('name', eventName);
        formData.append('startDate', startDate);
        formData.append('endDate', endDate);
        formData.append('image', file);

        try {
        setIsSubmitting(true);
        await axios.put(`https://htc-event-app-api.onrender.com/api/v1/events/${id}`, formData , {
            headers: {
                'Authorization': `Bearer ${user.token}`
            }
        });
        setIsSubmitting(false);
        navigate('/events');
        toast.info('Changes Successfull! 🎉', {
            position: toast.POSITION.TOP_CENTER,
            autoClose: 3000, // 3 seconds for the duration of notifacation display
        })
        } catch (error) {
            setIsSubmitting(false);
            console.log(error);
            toast.error(error.response.data.error, {
                position: toast.POSITION.TOP_CENTER,
                autoClose: 3000,
            });
        }
    };

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
    <div className='container flex justify-center mt-10 bg-white w-[65%] rounded-xl animated-gradient-border 2xl:mt-24'>
        <div className='flex justify-center relative w-[60%] bg-gray-400 rounded-l-lg'>
            <img className='absolute w-98 h-full object-cover' src={logo} alt="htc-logo" />
        </div>
        <div className='p-4 w-1/2 rounded-r-lg'>
            <h1 className='text-center mb-4 text-2xl 2xl:text-3xl font-bold'>Update this Event</h1>
            <form onSubmit={handleUpdateEvent} encType="multipart/form-data">
                <div className='flex flex-col mb-3'>
                    <label htmlFor="name" className='text-lg 2xl:text-xl'>Event Name </label>
                    <input required className='2xl:py-2 2xl:px-3 border-2 border-gray-300 focus:ring-gray-500 focus:border-gray-900 rounded-md py-1 px-2'
                    id="name" type="text" placeholder='Event Name' 
                    value={eventName}
                    onChange={(e) => {
                        setEventName(e.target.value);
                    }} />
                </div>
                <div className='flex flex-col mb-3'>
                    <label htmlFor="start" className='text-lg 2xl:text-xl'>Start </label>
                    <input required className='2xl:py-2 2xl:px-3 border-2 border-gray-300 rounded-md py-1 px-2'
                    id="start" type="datetime-local"
                    value={eventStartDate}
                    onChange={(e) => {
                        setEventStartDate(e.target.value);
                    }} />
                </div>
                <div className='flex flex-col mb-3'>
                    <label htmlFor="end" className='text-lg 2xl:text-xl'>End </label>
                    <input required className='2xl:py-2 2xl:px-3 border-2 border-gray-300 rounded-md py-1 px-2'
                     id="end" type="datetime-local" 
                     value={eventEndDate}
                     onChange={(e) => {
                        setEventEndDate(e.target.value);
                     }}
                     />
                </div>
                <div className='flex flex-col mb-3'>
                    <label htmlFor="image" className='text-lg 2xl:text-xl'> Image </label>
                    <input className="relative m-0 block w-full min-w-0 flex-auto rounded border border-solid border-neutral-300 bg-clip-padding px-3 py-[0.32rem] text-base font-normal text-neutral-700 transition duration-300 ease-in-out file:-mx-3 file:-my-[0.32rem] file:overflow-hidden file:rounded-none file:border-0 file:border-solid file:border-inherit file:bg-black file:px-3 file:py-[0.32rem] file:text-neutral-700 file:transition file:duration-150 file:ease-in-out file:[border-inline-end-width:1px] file:[margin-inline-end:0.75rem] hover:file:bg-green-600 focus:border-primary focus:text-neutral-700 focus:shadow-te-primary focus:outline-none dark:border-neutral-600 dark:text-black dark:file:bg-neutral-700 dark:file:text-neutral-100 dark:focus:border-primary"
                    id="image" type="file" 
                    onChange={(e) => {
                        setFile(e.target.files[0]);
                    }}/>
                </div>
                <div className="pt-4 flex items-center space-x-4">
                <Link to={`/events`} className="relative bg-white flex justify-center items-center w-full text-black px-1 py-2 rounded-md focus:outline-none hover:scale-100 hover:bg-black hover:text-white transition delay-0 duration-300 ease-in-out">
                <span className="material-symbols-outlined absolute left-10">
                close
                </span>
                    Cancel
                </Link>
                <button 
                disabled={isSubmitting}
                types='submit' className="bg-black flex justify-center items-center w-full text-white px-1 py-2 rounded-md focus:outline-none hover:scale-105 hover:bg-green-700 transition delay-0 duration-300 ease-in-out"> Save
                </button>
                </div>
            </form>
        </div>
    </div>
    </Reveal>
    </div>
  )
}
    // <div>
    //     <h1>Update Event</h1>
    //     <form onSubmit={handleUpdateEvent} encType="multipart/form-data">
    //         <label htmlFor="event-name">Event Name</label>
    //         <input 
    //         id="event-name" 
    //         type="text" 
    //         placeholder='Enter event name'
    //         value={eventName}
    //         onChange={(e) => setEventName(e.target.value)}
    //         />
    //         <br />
    //         <label htmlFor="event-start-date">Date Start</label>
    //         <input 
    //         id="event-start-date" 
    //         type="datetime-local"
    //         value={eventStartDate}
    //         onChange={(e) => setEventStartDate(e.target.value)}
    //         />
    //         <br />
    //         <label htmlFor="event-end-date">Date End</label>
    //         <input
    //         id="event-end-date" 
    //         type="datetime-local"
    //         value={eventEndDate}
    //         onChange={(e) => setEventEndDate(e.target.value)}
    //         />
    //         <br /> 
    //         <label htmlFor="event-image">Image</label>
    //         <input
    //         id="event-image" 
    //         type="file"
    //         onChange={(e) => {
    //             setFile(e.target.files[0]);
    //         }}
    //         /> 
    //         <br /> 
    //         <button type="submit"> Save </button> 
    //     </form>
    // </div>
  

export default UpdateEvent;