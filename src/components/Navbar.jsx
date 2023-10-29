import React, { useState } from 'react'
import { Link } from 'react-router-dom';
import { useLogout } from '../hooks/useLogout';
import { useAuthContext } from '../hooks/useAuthContext';
import { Transition } from '@headlessui/react';
import logo from '../assets/logo.png';
import { FaBars, FaTimes } from 'react-icons/fa';
import '../App.css';

// ang buhaton nako kay ang media queries para sa responsive 

const Navbar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const { logout } = useLogout();
    const { user } = useAuthContext();

  const handleLogout = () => {
     logout();
  } 

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  }

  return (
    <div className='relative shadow-xl shadow-green-200/40 px-24 py-2'>
      <div className="flex items-center justify-between">
        <div className='flex'>
        <img src={logo} alt="logo" className='w-16 h-16 2xl:w-20 2xl:h-20'/>
        <h1 className='htc mt-5 ml-2 font-bold text-md 2xl:text-xl 2xl:mt-6'>Holy Trinity College of General Santos City</h1>
        </div>
        <div className='flex items-center space-x-12 font-normal 2xl:text-lg'>
        <FaBars className='absolute right-20 bars-icon' /> 
          {!user && (
          <>
            <Link to="/"><span className='nav-links hover:text-green-400 hover:border-b-4 hover:rounded-sm pb-6 hover:border-green-400'>Home</span></Link>
            <Link to="/events"><span className='nav-links hover:text-green-400 hover:border-b-4 hover:rounded-sm pb-6 hover:border-green-400'>Events</span></Link>
            <Link to="/login" className='nav-links'>
            <button className="nav-links relative inline-flex items-center justify-center px-5 py-2 overflow-hidden  font-medium tracking-tighter text-white bg-gray-800 rounded-lg group">
              <span className="nav-links absolute w-0 h-0 transition-all duration-500 ease-out bg-green-500 rounded-full group-hover:w-56 group-hover:h-56"></span>
              <span className="nav-links absolute inset-0 w-full h-full -mt-1 rounded-lg opacity-30 bg-gradient-to-b from-transparent via-transparent to-gray-700"></span>
              <span className="nav-links relative">Log In</span>
            </button>
            </Link>
          </>
          )}
          {user && (
          <>
            <Link to="/"><span className='nav-links hover:text-green-400 hover:border-b-4 hover:rounded-sm pb-6 hover:border-green-400'>Home </span></Link>
            <Link to="/events"><span className='nav-links hover:text-green-400 hover:border-b-4 hover:rounded-sm pb-6 hover:border-green-400'>Events</span></Link>
            <Link to="/events/reports"><span className='nav-links hover:text-green-400 hover:border-b-4 hover:rounded-sm pb-6 hover:border-green-400'>Reports</span></Link>
            {user.role === 'admin' ? <Link to="/ssc"><span className='nav-links hover:text-green-400 hover:border-b-4 hover:rounded-sm pb-6 hover:border-green-400'>SSC </span></Link> : null }
            <Transition
                show={true}
              >
            <Link className='nav-links'><button onClick={toggleDropdown} className='nav-links flex justify-center uppercase font-normal  text-slate-600 border px-3 py-1 border-gray-300 hover:ring-[3px] hover:border-white hover:ring-gray-300 rounded-full focus:font-semibold w-32 overflow-hidden' >
              <span className='nav-links whitespace-nowrap overflow-hidden overflow-ellipsis'>{user.firstname}</span>
              <svg className="nav-links mt-1 w-6 h-4" role="presentation" aria-hidden="true" alt="" viewBox="0 0 16 16"><path d="M8.67903 10.7962C8.45271 11.0679 8.04729 11.0679 7.82097 10.7962L4.63962 6.97649C4.3213 6.59428 4.5824 6 5.06866 6L11.4313 6C11.9176 6 12.1787 6.59428 11.8604 6.97649L8.67903 10.7962Z" fill="currentColor"></path></svg>
              </button>
            </Link>
            {isDropdownOpen && (
                <div className="absolute right-0 z-10 w-56 mt-4 origin-top-right bg-white border border-gray-100 rounded-md shadow-lg">
                <div className="p-2">
                    <span className="block font-semibold border-b-2 px-4 py-2 text-sm text-gray-500 rounded-lg bg-gray-50 hover:text-gray-700">
                      Signed in as <br /><span className='capitalize'>{user.firstname} {user.lastname}</span>
                    </span>
                    <Link to={'/change-password'}><span className="block px-4 py-2 text-sm text-gray-500 rounded-lg hover:bg-gray-50 hover:text-gray-700 cursor-pointer">
                        Change Password
                    </span></Link>
                    <Link to={'/login'}><span onClick={handleLogout} className="block px-4 py-2 text-sm text-gray-500 rounded-lg hover:bg-gray-50 hover:text-gray-700">
                        Log Out
                    </span>
                    </Link>
                </div>
            </div>
              )}
            </Transition>
          </>
          )}
        </div>
      </div>
    </div>
  ) 
}

export default Navbar;

