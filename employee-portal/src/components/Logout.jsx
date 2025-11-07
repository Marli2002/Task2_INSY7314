
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import NavBar from './NavBar';

export default function Logout() {
  const navigate = useNavigate();

  useEffect(() => {
   
    localStorage.removeItem('token');
    localStorage.removeItem('user');


    
    navigate('/login');
  }, [navigate]);

  return (
    <div>
      <h2>Logging out...</h2>
    </div>
  );
}

/*
References

Mozilla Developer Network (MDN). n.d. Using the Web Storage API. Retrieved October 10, 2025, from https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API

React. n.d. Using the Effect Hook – React documentation. Retrieved October 10, 2025, from https://react.dev/reference/react/hooks#effect-hooks
*/
