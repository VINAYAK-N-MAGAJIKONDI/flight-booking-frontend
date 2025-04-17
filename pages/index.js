// pages/index.js
import Link from 'next/link';
import styles from '@/styles/Home.module.css';

export default function Base() {


  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Welcome to my DBMS Project</h1>
      <p className={styles.description}>
        This is a simple flight booking system that allows users to search for flights, view flight details, and book flights.
      </p>




      <section className={styles.cta}>
        <h2 className={styles.sectionTitle}>Whats Special</h2>
        <p>This app is built with latest web technologies</p>
        <Link href="/home">
          <button className={styles.ctaButton}>Get Started</button>
        </Link>

      </section>
    </div>
  );
}