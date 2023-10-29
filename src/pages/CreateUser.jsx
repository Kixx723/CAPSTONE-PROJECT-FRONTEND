import React, { useEffect, useState } from 'react'
import axios from 'axios';
import Navbar from '../components/Navbar';
import logo from '../assets/logo.png';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../hooks/useAuthContext';
import RotateLoader from 'react-spinners/RotateLoader';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const CreateUser = () => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [username, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();
    const { user } = useAuthContext();

    const handleCreateUser = async (e) => {
        e.preventDefault();
        
        if(!user) {
          return
        }
    
        try {
        setIsSubmitting(true);
        await axios.post(`https://htc-event-app-api.onrender.com/api/v1/users/register`, {
            firstname: firstName,
            lastname: lastName,
            username: username,
            password: password,
            confirmPassword: confirmPassword,
            role: 'ssc',
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${user.token}`
            }
        });
        setFirstName('');
        setLastName('');
        setUserName('');
        setPassword('');
        setIsSubmitting(false);
        navigate(`/ssc`);
        toast.success('SCC ACCOUNT Created! 🎉', {
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

  return (
    <div>
        <div className='bg-white'>
         <Navbar />
         </div>
        
         <div className='container flex justify-center mt-10 bg-white w-[65%] rounded-xl animated-gradient-border 2xl:mt-24 2xl:w-[55%]'>
        <div className='flex justify-center relative w-[50%] bg-gray-400 rounded-l-lg'>
            <img className='absolute w-98 h-100  object-cover' src={logo} alt="htc-logo" />
        </div>
        <div className='p-4 w-1/2 rounded-r-lg'>
            <h1 className='text-center mb-4 text-2xl 2xl:text-3xl font-bold'>Add Account for SSC</h1>
            <form onSubmit={handleCreateUser} encType="multipart/form-data">
                <div className='flex flex-col mb-1'>
                    <label htmlFor="firstname" className='text-md 2xl:text-md'>First Name </label>
                    <input required className='2xl:py-2 2xl:px-3 border-2 border-gray-300 focus: focus:ring-gray-500 focus:border-gray-900 rounded-md py-1 px-2'
                    id="firstname" type="text" placeholder='Enter first name' 
                    value={firstName}
                    onChange={(e) => {
                      setFirstName(e.target.value);
                    }} />
                </div>
                <div className='flex flex-col mb-1'>
                    <label htmlFor="lastname" className='text-md 2xl:text-md'>Last Name </label>
                    <input required className='2xl:py-2 2xl:px-3 border-2 border-gray-300 rounded-md py-1 px-2'
                    id="lastname" type="text" placeholder='Enter last name'
                    value={lastName}
                    onChange={(e) => {
                      setLastName(e.target.value);
                    }} />
                </div>
                <div className='flex flex-col mb-1'>
                    <label htmlFor="username" className='text-md 2xl:text-md'>Username </label>
                    <input required className='2xl:py-2 2xl:px-3 border-2 border-gray-300 rounded-md py-1 px-2'
                    id="username" type="text" placeholder='Enter username'
                    value={username}
                    onChange={(e) => {
                      setUserName(e.target.value);
                    }} />
                </div>
                <div className='flex flex-col mb-1'>
                    <label htmlFor="password" className='text-md 2xl:text-md'>Password </label>
                    <input required className='2xl:py-2 2xl:px-3 border-2 border-gray-300 rounded-md py-1 px-2'
                    id="password" type="password" placeholder='Enter password'
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                    }} />
                </div>
                <div className='flex flex-col mb-1'>
                    <label htmlFor="confirm-password" className='text-md 2xl:text-md'>Confirm Password </label>
                    <input required className='2xl:py-2 2xl:px-3 border-2 border-gray-300 rounded-md py-1 px-2'
                    id="confirm-password" type="password" placeholder='Confirm password'
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                    }} />
                </div>
                
                <div className="pt-4 flex items-center space-x-4">
                <Link to={`/ssc`} className="relative bg-white flex justify-center items-center w-full text-black px-1 py-2 rounded-md focus:outline-none hover:scale-100 hover:bg-black hover:text-white transition delay-0 duration-300 ease-in-out">
                <span className="material-symbols-outlined absolute left-10">
                close
                </span>
                    Cancel
                </Link>
                <button 
                disabled={isSubmitting}
                type='submit' className="bg-black flex justify-center items-center w-full text-white px-1 py-2 rounded-md focus:outline-none hover:scale-105 hover:bg-green-700 transition delay-0 duration-300 ease-in-out"> Create
                </button>
                </div>
            </form>
        </div>
    </div>

        
    </div>
  )
}

export default CreateUser