import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import logo from '../assets/logo.png';
import Reveal from '../components/Reveal';
import Reveals from '../components/Reveals';
import RevealLeft from '../components/RevealLeft';
import { useNavigate, useParams } from 'react-router-dom';
import formatDateForInput from '../helpers/dateTimeInputFormat';
import { useAuthContext } from '../hooks/useAuthContext';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import RotateLoader from 'react-spinners/RotateLoader';

const UpdateSchedule = () => {  
    const { id } = useParams();
    const [loading, setLoading] = useState(true);
    const [scheduleDateTime, setScheduleDateTime] = useState('');
    const [department1, setDepartment1] = useState('');
    const [department2, setDepartment2] = useState('');
    const [departments, setDepartments] = useState([]);
    const [sportEventID, setSportEventID] = useState('');
    const [event, setEvent] = useState('');
    const [eventID, setEventID] = useState('');
    const [eventName, setEventName] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();
    const { user } = useAuthContext();
    
    const isSwimmingOrRunning = /(swimming|running)/i.test(event?.name);

    useEffect(() => {
        const fetchSchedule = async () => {
            try {
                const response = await axios.get(`https://htc-event-app-api.onrender.com/api/v1/schedules/${id}`);
                const sched = response.data.schedule.scheduleDateTime;
                const dep1 = response.data.schedule.department1?._id;
                const dep2 = response.data.schedule.department2?._id;
                const ID = response.data.schedule.sportevent._id;
                const eventDetails = response.data.schedule.sportevent;
                const eventid = response.data.schedule.sportevent.event;
                setEventID(eventid);
                setScheduleDateTime(formatDateForInput(sched));
                setDepartment1(dep1);
                setDepartment2(dep2);
                setSportEventID(ID);
                setEvent(eventDetails); 
                setLoading(false);
            } catch (error) {
                console.log(error);
                setLoading(false);
            }
        }
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
     }, []);

    const handleUpdateSchedule = async (e) => {
        e.preventDefault();
        
        if(!user){
            return
        }
        
        const schedule = new Date(scheduleDateTime);

        try {
        setIsSubmitting(true);
        
        const requestData = {
            scheduleDateTime: schedule,
            sportevent: sportEventID,
        };
    
        // e include ra si department 1 and 2 pag ang sportevent kay dili running or swimming
        if (!isSwimmingOrRunning) {
            requestData.department1 = department1;
            requestData.department2 = department2;
        }

        await axios.put(`http://localhost:8000/api/v1/schedules/${id}`, requestData , {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${user.token}`
        }
    }); 
    setIsSubmitting(false);
    navigate(`/sportevents/${sportEventID}/schedules`);
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

    <Reveals>
    <h1 className='font-bold text-3xl 2xl:text-4xl 2xl:mt-6 text-center mt-3 text-green-600'>{eventName}</h1>
    </Reveals>
    <RevealLeft>
    <h1 className={`relative font-bold text-2xl 2xl:text-3xl text-center mt-4 ${!user? 'mb-5' : ''}`}>{event?.name},{event?.venue ? <span className='text-2xl'> Venue: {event?.venue}</span> : null }</h1>
    </RevealLeft>

    <Reveal>
    <div className='container flex justify-center mt-6 bg-white w-[65%] rounded-xl animated-gradient-border 2xl:mt-12 2xl:w-[55%]'>
        <div className='flex justify-center relative w-[50%] bg-gray-400 rounded-l-lg'>
            <img className='absolute w-98 h-full object-cover' src={logo} alt="htc-logo" />
        </div>
        <div className='p-4 w-1/2 rounded-r-lg'>
            <h1 className='text-center mb-4 text-2xl 2xl:text-3xl font-bold'>Update Schedule</h1>
            <form onSubmit={handleUpdateSchedule} encType="multipart/form-data">
                <div className='flex flex-col mb-3'>
                    <label htmlFor='date-time' className='2xl:text-xl'>Schedule Date and Time</label>
                    <input required className='2xl:py-2 2xl:px-3 border-2 border-gray-300 focus: focus:ring-gray-500 focus:border-gray-900 rounded-md py-1 px-2'
                    id='date-time' type="datetime-local"  placeholder='Event Name' 
                    value={scheduleDateTime}
                    onChange={(e) => {
                        setScheduleDateTime(e.target.value);
                    }} />
                </div>
                {/(swimming|running)/i.test(event?.name) ? <>
                <div className='bg-gray-100 pl-4 rounded-md shadow-md'>
                    <h1 className='text-lg font-bold text-green-600'>Departments: </h1>
                    <ul className='font-semibold'>
                        <li className='text-orange-500'>CETE</li>
                        <li>CCJE</li>
                        <li className='text-yellow-500'>CBMA</li>
                        <li className='text-blue-500'>CTE</li>
                        <li className='text-red-500'>CAS</li>
                    </ul>
                </div>
                </> : (
        <>
            <div className='flex flex-col mb-3'>
                <label htmlFor='department1' className='2xl:text-xl'>Department 1</label>
                <select
                    id='department1'
                    className='2xl:py-2 2xl:px-3 border-2 border-gray-300 focus:ring-gray-500 focus:border-gray-900 rounded-md py-1 px-2'
                    required
                    value={department1}
                    onChange={(e) => setDepartment1(e.target.value)}
                >
                    <option disabled value="">Select Department</option>
                    {departments && departments.map((department) => (
                        <option key={department?._id} value={department?._id}>{department?.name}</option>
                    ))}
                </select>
            </div>
            <div className='flex flex-col mb-3'>
                <label htmlFor='department2' className='2xl:text-xl'>Department 2</label>
                <select
                    id='department2'
                    required
                    className='2xl:py-2 2xl:px-3 border-2 border-gray-300 focus:ring-gray-500 focus:border-gray-900 rounded-md py-1 px-2'
                    value={department2}
                    onChange={(e) => setDepartment2(e.target.value)}
                >
                    <option disabled value="">Select Department</option>
                    {departments && departments.map((department) => (
                        <option key={department?._id} value={department?._id}>{department?.name}</option>
                    ))}
                </select>
            </div>
        </>
    )}
                {/* <div className='flex flex-col mb-3'>
                    <label htmlFor='department1' className='2xl:text-xl'>Department 1</label>
                    <select id='department1' 
                    className='2xl:py-2 2xl:px-3 border-2 border-gray-300 focus: focus:ring-gray-500 focus:border-gray-900 rounded-md py-1 px-2'
                    required value={department1} onChange={(e) => setDepartment1(e.target.value)}>
                    <option disabled value="">Select Department</option>
                    {departments && departments.map((department) => (
                    <option key={department?._id} value={department?._id}>{department?.name}</option>
                    ))}
                    </select>
                </div>
                <div className='flex flex-col mb-3'>
                    <label htmlFor='department2' className='2xl:text-xl'>Department 2</label>
                    <select id='department2' 
                    required className='2xl:py-2 2xl:px-3 border-2 border-gray-300 focus: focus:ring-gray-500 focus:border-gray-900 rounded-md py-1 px-2'
                     value={department2} onChange={(e) => setDepartment2(e.target.value)}>
                    <option disabled value="">Select Department</option>
                    {departments && departments.map((department) => (
                    <option key={department?._id} value={department?._id}>{department?.name}</option>
                    ))}
                    </select>
                </div> */}
                <div className="pt-4 flex items-center space-x-4">
                <Link to={`/sportevents/${sportEventID}/schedules`} className="relative bg-white flex justify-center items-center w-full text-black px-1 py-2 rounded-md focus:outline-none hover:scale-100 hover:bg-black hover:text-white transition delay-0 duration-300 ease-in-out">
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

export default UpdateSchedule