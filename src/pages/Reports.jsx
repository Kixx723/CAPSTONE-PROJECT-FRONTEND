import React, { useState, useEffect } from 'react'
import axios from 'axios';
import { useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import RotateLoader from 'react-spinners/RotateLoader';
import TallyPDF from '../components/TallyPDF';
import { PDFDownloadLink } from '@react-pdf/renderer';
import Reveal from '../components/Reveal';


const Reports = () => {
    const { id } = useParams();
    const [loading, setLoading] = useState(true);
    const [sportEvents, setSportEvents] = useState([]);
    const [results, setResults] = useState([]);
    const [eventName, setEventName] = useState('');
    const [departmentMedals, setDepartmentMedals] = useState([]);

    useEffect(() => {
      fetchReports();
      fetchTally();
      fetchEventName();
    }, [results]);

    const fetchTally = async () => {
        try {
          const response = await axios.get(`https://htc-event-app-api.onrender.com/api/v1/events/${id}`);
          const tallyData = response.data.medalTally;
          setDepartmentMedals(tallyData);
          setLoading(false);
        } catch (error) {
          console.log('Error fetching single events:', error);
          setLoading(false);
        }
      }
      fetchTally();

    const fetchEventName = async () => {
        try {
          const response = await axios.get(`https://htc-event-app-api.onrender.com/api/v1/sport-events/event/${id}`);
          const eventname = response.data.event.name;
          setEventName(eventname); 
        } catch (error) {
          console.log('Error fetching single events:', error);
        }
      }

    const fetchReports = async () => {
        try {
            const response = await axios.get(`https://htc-event-app-api.onrender.com/api/v1/events/${id}/reports`);
            const sportEventsData = response.data.sportEvents;
            const resultsData = response.data.results;
            setSportEvents(sportEventsData);
            setResults(resultsData);
        } catch (error) {
            console.log('Error fetching reports:', error);
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
         <Navbar />
         </div>
        <div className='flex justify-center gap-6'>
            <div className='flex justify-center'>
                <h1 className='text-center text-slate-900 font-bold text-2xl mt-4'>{eventName} Official Medal Tally Sheet for Sports Events</h1>
            </div>
            <div>
                <PDFDownloadLink fileName={`${eventName} Medal Tally`} document={<TallyPDF departmentMedals={departmentMedals} eventName={eventName} results={results} sportsEvents={sportEvents}/>}>
                    {({loading}) => loading ? <button>Loading Document...</button> : <button className='hover:text-green-700 underline font-medium cursor-pointer mt-4'>Download PDF</button> }
                </PDFDownloadLink>
            </div>
        </div>

<Reveal>
<div className="relative overflow-x-auto flex justify-center mt-5">
    <table className="w-[70%] text-sm text-center text-gray-500">
        <thead className="text-md text-gray-700 uppercase bg-green-300">
            <tr>
                <th className="px-6 py-3">
                    Sport Events
                </th>
                <th className="px-6 py-3">
                    Gold
                </th>
                <th className="px-6 py-3">
                    Silver
                </th>
                <th className="px-6 py-3">
                    Bronze
                </th>
                <th className="px-6 py-3">
                    Medal Count
                </th>
            </tr>
        </thead>
        <tbody>
            {sportEvents && sportEvents.map((sportevent) => (
    <tr key={sportevent._id} className='bg-green-100 border-b'>
        <td className="px-6 py-4 font-bold text-green-900 whitespace-nowrap text-left">
            {sportevent.name}
        </td>
        <td className='px-6 py-4 font-bold text-green-900'>
            {results.map((result) => {
                // Assuming each result has a sportEventId to match with sportevent._id
                if (result.sportevent._id === sportevent._id) {
                    return result.gold.name;
                }
                return null; // Handle if no matching result is found
            }).filter(Boolean)[0] || 'No result yet'}
        </td>
        <td className='px-6 py-4 font-bold text-green-900'>
            {results.map((result) => {
                if (result.sportevent._id === sportevent._id) {
                    return result.silver.name;
                }
                return null;
            }).filter(Boolean)[0] || 'No result yet'}
        </td>
        <td className='px-6 py-4 font-bold text-green-900'>
            {results.map((result) => {
                if (result.sportevent._id === sportevent._id) {
                    return result.bronze.name;
                }
                return null;
            }).filter(Boolean)[0] || 'No result yet'}
        </td>
        <td className='px-6 py-4 font-bold text-green-900'>
            {sportevent.medalCount}
        </td>
    </tr>
))}
        </tbody>
    </table>
</div>
</Reveal>
        
{/* <h1 className={`relative font-bold text-4xl 2xl:text-5xl text-center mt-2 mb-10`}>{eventName && eventName?.name} Medal Tally</h1> */}
        <div className='flex justify-center mt-6 mb-5'>
        <table className='w-[70%] text-sm'>
            <thead className='bg-gray-300'>
                <tr className='text-slate-800'>
                    <th className='px-6 py-3'>RANK</th>
                    <th className='px-6 py-3'>DEPARTMENT</th>
                    <th className='px-6 py-3'>GOLD</th>
                    <th className='px-6 py-3'>SILVER</th>
                    <th className='px-6 py-3'>BRONZE</th>
                    <th className='px-6 py-3'>TOTAL</th>
                </tr>
            </thead>
                <tbody className='text-white'>
                    {departmentMedals && departmentMedals.map((medal, rank) => (
                        <tr key={medal?.department._id} className='text-center border border-b-2'>
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
                            {medal.department?.name}
                            </td>
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
                        </tr>
                    ))}
                </tbody>
        </table> 
        </div>


    </div>
  )
}

export default Reports