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
      <header className={styles.header}>
        <h1 className={styles.title}>Welcome to Your Dashboard</h1>
        <p className={styles.subtitle}>Manage your bookings, search for flights, and more!</p>
      </header>

      {user ? (
        <div className={styles.content}>
          <section className={styles.userSection}>
            <h2 className={styles.sectionTitle}>User Information</h2>
            <p><strong>Name:</strong> {user.name}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <button onClick={handleLogout} className={styles.logoutButton}>Logout</button>
          </section>

          <section className={styles.navigationSection}>
            <h2 className={styles.sectionTitle}>Quick Links</h2>
            <div className={styles.navCards}>
              <Link href="/search">
                <div className={styles.navCard}>
                  <h3>Search Flights</h3>
                  <p>Find and book your next flight.</p>
                </div>
              </Link>
              <Link href="/mybookings">
                <div className={styles.navCard}>
                  <h3>My Bookings</h3>
                  <p>View and manage your flight bookings.</p>
                </div>
              </Link>

            </div>
          </section>

          
        </div>
      ) : (
        <p className={styles.errorMessage}>Unauthorized access. Redirecting...</p>
      )}
    </div>
  );
}