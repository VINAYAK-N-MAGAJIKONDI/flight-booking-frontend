// pages/dashboard.js
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = Cookies.get('token');

    if (!token) {
      router.push('/login');
      return;
    }

    // Fetch user details from the backend
    const fetchUserDetails = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/users/me', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const data = await response.json();
          setUser(data);
        } else {
          Cookies.remove('token');
          router.push('/login');
        }
      } catch (error) {
        console.error('Error fetching user details:', error);
        Cookies.remove('token');
        router.push('/login');
      } finally {
        setLoading(false);
      }
    };

    fetchUserDetails();
  }, [router]);

  const handleLogout = () => {
    Cookies.remove('token');
    router.push('/login');
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <h1>Dashboard</h1>
      {user ? (
        <div>
          <p>Welcome, {user.name}</p>
          <p>Email: {user.email}</p>
          <button onClick={handleLogout}>Logout</button>
        </div>
      ) : (
        <p>Unauthorized access. Redirecting...</p>
      )}
    </div>
  );
}
