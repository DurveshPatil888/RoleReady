import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCurrentUser } from '../services/auth.api'; // Tera api file ka path

const ProtectedRoute = ({ children }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Backend se check kar rahe hain ki user login hai ya nahi
        const data = await getCurrentUser();

        if (data && data._id) {
          setIsAuthenticated(true);
        } else {
          // Agar valid data nahi hai, toh replace karke login bhej do
          navigate('/login', { replace: true });
        }
      } catch (error) {
        console.error('Auth check error:', error);
        navigate('/login');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [navigate]);

  // Jab tak API check kar rahi hai, tab tak Loading dikhayega
  if (loading) {
    return (
      <main>
        <h1>Loading...</h1>
      </main>
    );
  }

  // Agar user login hai, toh usko asli page (children) dikha do
  return isAuthenticated ? children : null;
};

export default ProtectedRoute;
