// pages/index.js
import Link from 'next/link';
import styles from '@/styles/Home.module.css';

export default function Home() {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Welcome to the Flight Booking System!</h1>
      <nav className={styles.nav}>
        <ul className={styles.navList}>
          <li className={styles.navItem}>
            <Link href="/login">Login</Link>
          </li>
          <li className={styles.navItem}>
            <Link href="/register">Register</Link>
          </li>
        </ul>
      </nav>
    </div>
  );
}
