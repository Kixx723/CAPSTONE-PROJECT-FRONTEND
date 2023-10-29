import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { motion , AnimatePresence } from 'framer-motion';
import RotateLoader from 'react-spinners/RotateLoader';
// import TallyPDF from '../components/TallyPDF';
// import { PDFDownloadLink } from '@react-pdf/renderer';
import CETE from '../assets/CETE.png';
import CCJE from '../assets/CCJE.png';
import CTE from '../assets/CTE.png';
import CAS from '../assets/CAS.png';
import CBMA from '../assets/CBMA.png';


const Tally = () => {
    const [loading, setLoading] = useState(true);
    const { id } = useParams();
    const [eventName, setEventName] = useState([]);
    const [departmentMedals, setDepartmentMedals] = useState([]);
    
    useEffect(() => {
        const fetchTally = async () => {
          try {
            const response = await axios.get(`https://htc-event-app-api.onrender.com/api/v1/events/${id}`);
            const eventData = response.data.event;
            setEventName(eventData);
            const tallyData = response.data.medalTally;
            setDepartmentMedals(tallyData);
            setLoading(false);
          } catch (error) {
            console.log('Error fetching single events:', error);
            setLoading(false);
          }
        }
        fetchTally();
    
    }, [departmentMedals]);


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
    <div className='h-screen'>
        <Navbar />
        {/* <div className='flex justify-end mt-2 mr-20'>
        <PDFDownloadLink fileName={`${eventName?.name} Medal Tally`} document={<TallyPDF departmentMedals={departmentMedals} eventName={eventName?.name}/>}>
          {({loading}) => loading ? <button>Loading Document...</button> : <button className='hover:text-green-700 underline font-medium cursor-pointer'>Download PDF</button> }
        </PDFDownloadLink>
        </div> */}
        <h1 className={`relative font-bold text-4xl 2xl:text-5xl text-center mt-2 mb-10`}>{eventName && eventName?.name} Medal Tally</h1>
        <div className='flex justify-center mt-[4%]'>
        <table className='w-[60%]'>
            <thead className='bg-gray-300'>
                <tr className='text-slate-800'>
                    <th className='p-2 px-5'>RANK</th>
                    <th className='p-2 px-5'>DEPARTMENT</th>
                    <th className='p-2 px-5'>GOLD</th>
                    <th className='p-2 px-5'>SILVER</th>
                    <th className='p-2 px-5'>BRONZE</th>
                    <th className='p-2 px-5'>TOTAL</th>
                </tr>
            </thead>
                <tbody className='text-white'>
                    <AnimatePresence>
                    {departmentMedals && departmentMedals.map((medal, rank) => (
                        <motion.tr 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.8 }}
                        layout
                         key={medal?.department._id} className='text-center border border-b-2'>
                            <td className={`
                            ${medal.department?.name === 'CETE' ? 'bg-orange-600' : null} 
                            ${medal.department?.name === 'CCJE' ? 'bg-black' : null}
                            ${medal.department?.name === 'CBMA' ? 'bg-[#d4af37]' : null}
                            ${medal.department?.name === 'CTE' ? 'bg-blue-600' : null}
                            ${medal.department?.name === 'CAS' ? 'bg-red-600' : null}
                            `}>{rank + 1}</td>
                            <td className={`text-white p-4 relative
                            ${medal.department?.name === 'CETE' ? 'bg-orange-600' : null} 
                            ${medal.department?.name === 'CCJE' ? 'bg-black' : null}
                            ${medal.department?.name === 'CBMA' ? 'bg-[#d4af37]' : null}
                            ${medal.department?.name === 'CTE' ? 'bg-blue-600' : null}
                            ${medal.department?.name === 'CAS' ? 'bg-red-600' : null}
                            `}>
                            {medal.department.name === 'CETE' ? <img src={CETE} alt="logo" className='absolute right-[140px] 2xl:right-[160px] shadow-lg top-2 h-[37px] w-[37px]'/> : null }
                            {medal.department.name === 'CCJE' ? <img src={CCJE} alt="logo" className='absolute right-[140px] 2xl:right-[160px] top-2 h-[35px] w-[36px]'/> : null }
                            {medal.department.name === 'CBMA' ? <img src={CBMA} alt="logo" className='absolute right-[140px] 2xl:right-[160px] top-2 h-[37px] w-[37px]'/> : null }
                            {medal.department.name === 'CTE' ? <img src={CTE} alt="logo" className='absolute right-[140px] 2xl:right-[160px] top-2 h-[37px] w-[37px]'/> : null }
                            {medal.department.name === 'CAS' ? <img src={CAS} alt="logo" className='absolute right-[140px] 2xl:right-[160px] top-2 h-[37px] w-[38px]'/> : null }
                            {medal.department?.name}</td>
                            <td className={`
                            ${medal.department?.name === 'CETE' ? 'bg-orange-600' : null} 
                            ${medal.department?.name === 'CCJE' ? 'bg-black' : null}
                            ${medal.department?.name === 'CBMA' ? 'bg-[#d4af37]' : null}
                            ${medal.department?.name === 'CTE' ? 'bg-blue-600' : null}
                            ${medal.department?.name === 'CAS' ? 'bg-red-600' : null}
                            `}>{medal?.gold}</td>
                            <td className={`
                            ${medal.department?.name === 'CETE' ? 'bg-orange-600' : null} 
                            ${medal.department?.name === 'CCJE' ? 'bg-black' : null}
                            ${medal.department?.name === 'CBMA' ? 'bg-[#d4af37]' : null}
                            ${medal.department?.name === 'CTE' ? 'bg-blue-600' : null}
                            ${medal.department?.name === 'CAS' ? 'bg-red-600' : null}
                            `}>{medal?.silver}</td>
                            <td className={`
                            ${medal.department?.name === 'CETE' ? 'bg-orange-600' : null} 
                            ${medal.department?.name === 'CCJE' ? 'bg-black' : null}
                            ${medal.department?.name === 'CBMA' ? 'bg-[#d4af37]' : null}
                            ${medal.department?.name === 'CTE' ? 'bg-blue-600' : null}
                            ${medal.department?.name === 'CAS' ? 'bg-red-600' : null}
                            `}>{medal?.bronze}</td>
                            <td className={`
                            ${medal.department?.name === 'CETE' ? 'bg-orange-600' : null} 
                            ${medal.department?.name === 'CCJE' ? 'bg-black' : null}
                            ${medal.department?.name === 'CBMA' ? 'bg-[#d4af37]' : null}
                            ${medal.department?.name === 'CTE' ? 'bg-blue-600' : null}
                            ${medal.department?.name === 'CAS' ? 'bg-red-600' : null}
                            `}>{medal?.total}</td>
                        </motion.tr>
                    ))}
                    </AnimatePresence>
                </tbody>
        </table> 
        </div>
    </div>
  )
}

export default Tally