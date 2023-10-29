import React, { useState } from 'react'
import Navbar from '../components/Navbar';
import { useAuthContext } from '../hooks/useAuthContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';

const ChangePassword = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessages, setErrorMessages] = useState([]);
  const { user } = useAuthContext();
  const navigate = useNavigate();

  const validatePassword = () => {
    const errors = [];

    // Check if newPassword and confirmPassword match
    if (newPassword !== confirmPassword) {
      errors.push("New passwords don't match");
    }
    
    // Validate password length
    if (newPassword.length < 6) {
      errors.push('Password must be at least 6 characters');
    }

    return errors;
  };


  const handleChangePassword = async (e) => {
    e.preventDefault();

   // Clear previous error messages
   setErrorMessages([]);

   // Validate the form data
   const validationErrors = validatePassword();

   if (validationErrors.length > 0) {
     // Set validation errors in state
     setErrorMessages(validationErrors);
     return;
   }

    try {
        setIsSubmitting(true);
        await axios.post(`https://htc-event-app-api.onrender.com/api/v1/users/change-password/${user?.id}`, {
        oldPassword: oldPassword,
        newPassword: newPassword, 
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        }
      });
    setIsSubmitting(false);
    navigate(`/events`);
    setOldPassword('');
    setNewPassword('');
    setConfirmPassword('');
    toast.success('password changes successfully', {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 2000, // 2 seconds and duration sa notification display
    })

    } catch (err) {
      setIsSubmitting(false);
      console.log(err);
      const validationErrors = validatePassword();
      validationErrors.push(err.response.data.error);
      setErrorMessages(validationErrors);
    }
  };


  return (
    <div>
        <div className='bg-white'>
        <Navbar/>
        </div>   
        <div className="flex flex-col mt-[3%] items-center justify-center px-6 py-8 mx-auto lg:py-0">
        <h1 className='mb-3 font-bold text-xl'><span className='text-green-600'>Goodholy!</span> {user?.firstname} {user?.lastname}</h1>

      <div className="w-full p-6 bg-gray-50 border-2 border-black rounded-lg shadow md:mt-0 sm:max-w-md sm:p-8">
          <h2 className="mb-1 text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl ">
              Change Password
          </h2>
          <form className="mt-4 space-y-4 lg:mt-5 md:space-y-5" onSubmit={handleChangePassword} >
              <div>
                  <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 ">Old Password</label>
                  <input type="password" 
                  onChange={(e) => setOldPassword(e.target.value)}
                  name="old-password" id="old-password" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 " placeholder="••••••••" required/>
              </div>
              <div>
                  <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 ">New Password</label>
                  <input type="password"
                  onChange={(e) => setNewPassword(e.target.value)}
                   name="password" id="password" placeholder="••••••••" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5" required/>
              </div>
              <div>
                  <label htmlFor="confirm-password" className="block mb-2 text-sm font-medium text-gray-900 ">Confirm password</label>
                  <input type="password"
                  onChange={(e) => setConfirmPassword(e.target.value)}
                   name="confirm-password" id="confirm-password" placeholder="••••••••" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 " required/>
              </div>
              
              <button type="submit" 
              disabled={isSubmitting}
              className="w-full text-white bg-black  hover:bg-green-500 hover:text-white   focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center ">Submit</button>
          </form>
          {errorMessages.length > 0 && (
        <div className="text-red-500 mt-2">
          <ul>
            {errorMessages.map((error, index) => (
              <li key={index}>{error}</li>
            ))}
          </ul>
        </div>
      )}
      </div>
  </div>
    </div>
  )
}

export default ChangePassword