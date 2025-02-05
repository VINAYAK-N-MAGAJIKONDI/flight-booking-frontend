// pages/dashboard.js
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';
import Link from 'next/link';
import styles from '@/styles/Dashboard.module.css';

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
    <div className={styles.container}>
      <h1 className={styles.title}>Dashboard</h1>
      {user ? (
        <div className={styles.userDetails}>
          <p>Welcome, {user.name}</p>
          <p>Email: {user.email}</p>
          <button onClick={handleLogout} className={styles.button}>Logout</button>
          <nav className={styles.nav}>
            <ul className={styles.navList}>
              <li className={styles.navItem}>
                <Link href="/search">Search Flights</Link>
              </li>
              <li className={styles.navItem}>
                <Link href="/mybookings">My Bookings</Link>
              </li>
            </ul>
          </nav>
        </div>
      ) : (
        <p>Unauthorized access. Redirecting...</p>
      )}
    </div>
  );
}
