import React from 'react';
import { Routes, Route , Navigate } from 'react-router-dom';
import Home from './pages/Home';
import SportEvents from './pages/SportEvents';
import Schedules from './pages/Schedules';
import Matches from './pages/Matches';
import Accounts from './pages/Accounts';
import CreateEvent from './pages/CreateEvent';
import CreateSportEvent from './pages/CreateSportEvent';
import CreateSchedule from './pages/CreateSchedule';
import CreateMatchResult from './pages/CreateMatchResult';
import CreateSportEventResult from './pages/CreateSportEventResult';
import CreateUser from './pages/CreateUser';
import UpdateEvent from './pages/UpdateEvent';
import UpdateSportEvent from './pages/UpdateSportEvent';
import UpdateSchedule from './pages/UpdateSchedule';
import UpdateMatch from './pages/UpdateMatch';
import UpdateSportEventResult from './pages/UpdateSportEventResult';
import UpdateUser from './pages/UpdateUser';
import LoginForm from './pages/LoginForm';
import Tally from './pages/Tally';
import Events from './pages/Events';
import Reports from './pages/Reports';
import EventsReportPage from './pages/EventsReportPage';
import ChangePassword from './pages/ChangePassword';
import { useAuthContext } from './hooks/useAuthContext';



function App() {
  const { user } = useAuthContext();

  const isAdmin = user && user.role === 'admin';
  
  return (
    <div>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/events' element={<Events />} />
        <Route path='/events/reports' element={<EventsReportPage />} /> 
        <Route path='/events/:id/reports' element={<Reports />} />
        <Route path='/event/:id/sportevents' element={<SportEvents />} />
        <Route path='/sportevents/:id/schedules' element={<Schedules />} />
        <Route path='/schedules/:id/match' element={<Matches />} />
        <Route path='/create-event' element={user ? <CreateEvent /> : <Navigate to='/login' />} />
        <Route path='/event/:id/create-sportevent' element={user ? <CreateSportEvent /> : <Navigate to='/login' /> } />
        <Route path='/sportevents/:id/create-schedule' element={user ? <CreateSchedule /> : <Navigate to='/login' /> } />
        <Route path='/schedules/:id/match-result' element={user ?  <CreateMatchResult /> : <Navigate to='/login' /> }/>
        <Route path='/sportevents/:id/result' element={user ? <CreateSportEventResult /> : <Navigate to='/login' /> }/>
        <Route path='/update-event/:id' element={user ? <UpdateEvent /> : <Navigate to='/login' />} />
        <Route path='/update-sportevent/:id' element={user ? <UpdateSportEvent/> : <Navigate to='/login' /> } />
        <Route path='/update-schedule/:id' element={user ? <UpdateSchedule />  : <Navigate to='/login' /> }/>
        <Route path='/update-match/:id' element={user ? <UpdateMatch />  : <Navigate to='/login' /> } />
        <Route path='/update-sportevent-result/:id' element={user ? <UpdateSportEventResult /> : <Navigate to='/login' /> } />
        <Route path='/update-user/:id' element={user ? <UpdateUser /> : <Navigate to='/login' /> } />
        <Route path='/login' element={!user ? <LoginForm /> : <Navigate to='/' />} />
        <Route path='/event/:id/tally' element={<Tally/>} />
        <Route path='/ssc' element={isAdmin ? <Accounts /> : <Navigate to='/' /> } />
        <Route path='/create-user' element={isAdmin ? <CreateUser /> : <Navigate to='/' /> } />
        <Route path='/change-password' element={<ChangePassword/>} />
        <Route path='*' element="ROUTE DOES NOT EXIST" />
      </Routes>
    </div>
  )
}

export default App
