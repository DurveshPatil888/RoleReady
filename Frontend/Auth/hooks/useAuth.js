import { useState } from 'react';
import { login, register } from '../../services/auth.api'; // Apni api file ka path yahan adjust kar lena

export const useAuth = () => {
  const [loading, setLoading] = useState(false);

  // Login Handle karne ka logic
  const handleLogin = async ({ email, password }) => {
    setLoading(true);
    try {
      const data = await login({ email, password });
      if (data) {
        return true; // Success hone par true return karega taaki UI navigate kar sake
      }
    } catch (error) {
      console.error('Login Error:', error);
      alert('Login fail ho gaya bhai! Email ya password galat hai.');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Register Handle karne ka logic
  const handleRegister = async ({ name, email, password }) => {
    setLoading(true);
    try {
      const data = await register({ name, email, password });
      if (data) {
        return true;
      }
    } catch (error) {
      console.error('Register Error:', error);
      alert('Register karne me error aagaya!');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Jo bhi functions aur states chahiye wo yahan se bhej rahe hain
  return { loading, handleLogin, handleRegister };
};
