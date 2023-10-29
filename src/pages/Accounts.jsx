import axios from 'axios';
import React, { useEffect, useState } from 'react'
import Reveals from '../components/Reveals';
import Reveal from '../components/Reveal';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import RotateLoader from 'react-spinners/RotateLoader';
import { useAuthContext } from '../hooks/useAuthContext';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const Accounts = () => {
    const [loading, setLoading] = useState(true);
    const [users, setUsers] = useState([]);
    const { user } = useAuthContext();
    const [currentPage, setCurrentPage] = useState(1);
    const accountsPerPage = 6;
    const lastIndex = currentPage * accountsPerPage;
    const firstIndex = lastIndex - accountsPerPage;
    const displayedAccounts = users.slice(firstIndex, lastIndex);
    const totalPages = Math.ceil(users.length / accountsPerPage);

    const handlePageChange = (newPage) => {
      setCurrentPage(newPage);
    };
  
    const handleNextPage = () => {
      if (currentPage < totalPages) {
        setCurrentPage(currentPage + 1);
      }
    };
    
    const handlePrevPage = () => {
      if (currentPage > 1) {
        setCurrentPage(currentPage - 1);
      }
    };
  

    const handleDeleteUser = async (userID) =>{
        if(!user) {
          return
        }
    
        if(window.confirm('Are you sure you want to delete this event?')) {
         try {
          await axios.delete(`https://htc-event-app-api.onrender.com/api/v1/users/${userID}`, {
            headers: {
              'Authorization' : `Bearer ${user.token}`
            }
          });
          setUsers(users.filter(user => user._id !== userID)); //  updates the state with this new filtered array. As a result, the user is removed from the rendered list on the page.
          toast.success('Account Deleted!', {
            position: toast.POSITION.TOP_CENTER,
            autoClose: 3000, // 3 seconds for the duration of notifacation display
        })
        } catch (error) {
          console.log('Error deleting user:', error);
         }
        }
      };
  
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get(`https://htc-event-app-api.onrender.com/api/v1/users`);
                const usersData = response.data.user;
                setUsers(usersData);
                setLoading(false);
             } catch (error) {
                console.log('Error fetching events:', error);
                setLoading(false);
             }
        }

        fetchUsers();
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
         <Navbar />
         </div>

        <Reveal>
         <h1 className='text-3xl 2xl:text-5xl text-center mt-8 font-bold'>SUPREME STUDENT COUNCIL ACCOUNTS</h1>
         </Reveal>

    <Reveals>
        <Link to={`/create-user`} type="button" className="2xl:text-base ml-5 mt-10 text-white bg-gradient-to-r from-green-400 via-green-500 to-green-600 hover:bg-gradient-to-br focus:ring-2 focus:outline-none focus:ring-green-300 dark:focus:ring-green-400 shadow-lg shadow-green-500/50 dark:shadow-lg dark:shadow-green-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2">
        Add User
        </Link>
    </Reveals>
        
        <Reveal>
        <div className='flex justify-center mb-7'>
         <table className={`w-[70%] shadow-md text-sm text-left 2xl:text-lg 2xl:w-[65%px] text-gray-500 dark:text-gray-400 `}>
            <thead className={`text-md 2xl:text-lg text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400`}>
                <tr>
                    <th className='px-6 py-3 text-green-500'>FIRST NAME</th>
                    <th className='px-6 py-3 text-green-500'>LAST NAME</th>
                    <th className='px-6 py-3 text-green-500'>USERNAME</th>
                    <th className='px-6 py-3 text-green-500'>ACTION</th>
                </tr>
            </thead>
            <tbody>
            {displayedAccounts && displayedAccounts.map((user) => {
                if (user.role === 'ssc') {
                    return (
                        <tr key={user?._id} className='bg-white border-b dark:bg-gray-900 dark:border-gray-700' >
                            <td className='px-6 py-3 text-white'>{user?.firstname}</td>
                            <td className='px-6 py-3 text-white'>{user?.lastname}</td>
                            <td className='px-6 py-3 text-white'>{user?.username}</td>
                            <td className='px-6 py-3'> 
                            <Link to={`/update-user/${user?._id}`}> <button type='Submit' className='mr-2 font-medium text-blue-600 dark:text-blue-500 hover:underline'> Edit </button> </Link>
                            <button className='font-medium text-red-500 dark:text-red-500 hover:underline' onClick={() => handleDeleteUser(user._id)}> Delete </button>
                            </td>
                        </tr>
                    );
                }
                return null;
            })}
            </tbody>
         </table>
         </div>
         {/* Pagination */}
    <div className="mt-4 flex justify-center">
      <button
        onClick={handlePrevPage}
        className={`px-3 py-1 mx-1 ${
          currentPage === 1 ? 'bg-black text-white cursor-not-allowed' : 'bg-black text-white'
        }`}
        disabled={currentPage === 1}
      >
        Previous
      </button>
      {Array.from({ length: totalPages }, (_, index) => (
        <button
          key={index}
          onClick={() => handlePageChange(index + 1)}
          className={`px-3 py-1 mx-1 ${
            currentPage === index + 1 ? 'bg-green-600 text-black' : 'bg-white text-black'
          }`}
        >
          {index + 1}
        </button>
      ))}
      <button
        onClick={handleNextPage}
        className={`px-3 py-1 mx-1 ${
          currentPage === totalPages ? 'bg-black text-white cursor-not-allowed' : 'bg-black text-white'
        }`}
        disabled={currentPage === totalPages}
      >
        Next
      </button>
    </div>
         </Reveal>
    </div>
  )
}

export default Accounts;