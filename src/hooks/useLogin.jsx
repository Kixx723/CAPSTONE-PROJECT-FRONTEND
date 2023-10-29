import { useAuthContext } from './useAuthContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


export const useLogin = () => {
    const { dispatch } = useAuthContext();
    
    const login = async (username, password) => {
        try {
            const response = await axios.post('https://htc-event-app-api.onrender.com/api/v1/users/login', {
                username: username,
                password: password,
            }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            const json = response.data;
            
            if (response.data.success) {
                // Save the user to local storage
                localStorage.setItem('user', JSON.stringify(json));
                
                // Update the auth context
                dispatch({ type: 'LOGIN', payload: json });
                
                return true;
            }
        } catch (error) {
            console.error(error);
            toast.error(error.response.data.message, {
                position: toast.POSITION.TOP_CENTER,
                autoClose: 2000,
            })
            return false;
        }
    }

    return { login };
}