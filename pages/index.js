// pages/index.js
import Link from 'next/link';
import styles from '@/styles/Home.module.css';

export default function Home() {
  const popularDestinations = [
    { city: 'New York', video: '/videos/NYC.mp4' },
    { city: 'Paris', video: '/videos/Paris.mp4' },
    { city: 'Tokyo', video: '/videos/tokyo.mp4' },
    { city: 'Dubai', video: '/videos/Dubai.mp4' },
  ];

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Welcome to the Flight Booking System!</h1>
      <p className={styles.description}>
        Book your next adventure with ease. Search for flights, manage your bookings, and check-in online.
      </p>


      <section className={styles.popularDestinations}>
        <h2 className={styles.sectionTitle}>Popular Destinations</h2>
        <div className={styles.cards}>
          {popularDestinations.map((destination, index) => (
            <div key={index} className={styles.card}>
              <video
                src={destination.video}
                className={styles.cardVideo}
                autoPlay
                loop
                muted
              />
              <h3 className={styles.cardTitle}>{destination.city}</h3>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.cta}>
        <h2 className={styles.sectionTitle}>Ready to Fly?</h2>
        <p>Sign up now and start booking your dream trips today!</p>
        <Link href="/register">
          <button className={styles.ctaButton}>Get Started</button>
        </Link>

      </section>
    </div>
  );
}