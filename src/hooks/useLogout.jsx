
import { useAuthContext } from './useAuthContext'
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const useLogout = () => {
    const { dispatch } = useAuthContext();
    
    const logout = () => {
        // remove user from local storage
        localStorage.removeItem('user');
        
        // dispatch logout action
        dispatch({ type: 'LOGOUT' });

        toast.success('Logged Out Successfully!', {
            position: toast.POSITION.TOP_CENTER,
            autoClose: 1500, // 1.5 seconds for the duration of notifacation display
        })
    }
  
    return { logout }
}

