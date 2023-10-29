import React, { useState } from 'react'
import { useLogin } from '../hooks/useLogin';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import wildCatLogo from '../assets/wildcat-logo.png'
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const LoginForm = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isLoggingIn, setIsLoggingIn] = useState(false);
    const { login } = useLogin();
    const navigate = useNavigate();
    
    const handleLogin = async (e) => {
        e.preventDefault();

        setIsLoggingIn(true);
      
        const loginSuccess = await login(username, password);

        setIsLoggingIn(false);
        
        if(loginSuccess) {
          setUsername('');
          setPassword('');
          navigate('/');
          toast.success('Logged In Successfully!', {
            position: toast.POSITION.TOP_CENTER,
            autoClose: 1500, // 1.5 seconds for the duration of notifacation display
          })
        }
        
        if(!loginSuccess) {
          setPassword('');
        }

    }
    
  return (
        // <div className=''>
        //   <Navbar />
        // <div>
        //   <label htmlFor="username">Username: </label>
        //   <input id='username' type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
        //   <label htmlFor="password">Password: </label>
        //   <input id='password' type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        //   <button type='submit'> Login </button> 
        <div className='h-screen bg-slate-200'>
          <div className='bg-white'>
          <Navbar />
          </div>
         <div className="py-6 flex flex-col justify-center sm:py-12 2xl:mt-20">
          <div className="relative py-3 sm:max-w-xl sm:mx-auto">
            <div
              className="absolute inset-0 bg-gradient-to-r from-green-300 to-green-600 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl">
            </div>
            <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
              <form onSubmit={handleLogin} className="max-w-md mx-auto">
                <div>
                  <h1 className="text-2xl font-semibold">GoodHoly! Login to your account</h1>
                </div>
                <div className="divide-y divide-gray-200">
                  <div className="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
                    <div className="relative">
                      <input autoComplete="off" id="username" name="username" type="text" className="peer placeholder-transparent h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:border-green-600" 
                      placeholder="Username" required
                      value={username} onChange={(e) => setUsername(e.target.value)}/>
                      <label htmlFor="username" className="absolute left-0 -top-3.5 text-gray-600 text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-440 peer-placeholder-shown:top-2 transition-all peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm">Username</label>
                    </div>
                    <div className="relative">
                      <input autoComplete="off" id="password" name="password" type="password" className="peer placeholder-transparent h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:border-green-600" 
                      placeholder="Password" required value={password} onChange={(e) => setPassword(e.target.value)} />
                      <label htmlFor="password" className="absolute left-0 -top-3.5 text-gray-600 text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-440 peer-placeholder-shown:top-2 transition-all peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm">Password</label>
                    </div>
                    <div className="relative">
                      <button 
                      disabled={isLoggingIn}
                      type='submit' className="bg-green-600 hover:bg-green-500 text-white rounded-md px-2 py-1">Submit</button>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
        </div>
  )
}

export default LoginForm;