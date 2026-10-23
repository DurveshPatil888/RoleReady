import axios from 'axios';

export const baseUrl = axios.create({
  baseURL: 'http://localhost:3000',
  withCredentials: true,
});

export async function register({ name, email, password }) {
  try {
    const response = await baseUrl.post('/api/auth/register', {
      name,
      email,
      password,
    });
    return response.data;
  } catch (error) {
    console.error('Error during registration:', error);
  }
}

export async function login({ email, password }) {
  try {
    const response = await baseUrl.post('/api/auth/login', { email, password });
    return response.data;
  } catch (error) {
    console.error('Error during login:', error);
  }
}

export async function logout() {
  try {
    const response = await baseUrl.post('/api/auth/logout');
    return response.data;
  } catch (error) {
    console.error('Error during logout:', error);
    throw error;
  }
}

export async function getCurrentUser() {
  try {
    const response = await baseUrl.get('/api/auth/current-user', {
      headers: {
        'Cache-Control': 'no-cache',
        Pragma: 'no-cache',
        Expires: '0',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching current user:', error);
    return null; // Ensure null return ho error aane par
  }
}
