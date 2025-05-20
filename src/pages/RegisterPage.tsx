
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const RegisterPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    navigate('/login', { state: { defaultTab: 'register' } });
  }, [navigate]);

  return <div>Redirecting to registration...</div>;
};

export default RegisterPage;
