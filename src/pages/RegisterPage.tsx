import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const RegisterPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  useEffect(() => {
    // Pass along any 'from' state to keep track of where the user should be redirected after login
    navigate('/login', { 
      state: { 
        defaultTab: 'register',
        from: location.state?.from || '/' 
      } 
    });
  }, [navigate, location.state]);

  return <div>Redirecting to registration...</div>;
};

export default RegisterPage;
