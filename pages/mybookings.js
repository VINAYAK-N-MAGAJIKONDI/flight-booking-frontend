import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import Link from 'next/link';
import styles from '@/styles/Bookings.module.css';

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [selectedFlight, setSelectedFlight] = useState(null);
  const [seats, setSeats] = useState([]);
  const [selectedSeat, setSelectedSeat] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchBookings = async () => {
      const token = Cookies.get("token");
      if (!token) {
        setMessage("Please log in to view your bookings.");
        setLoading(false);
        return;
      }
      try {
        const response = await fetch("http://localhost:5000/api/bookings/my-bookings", {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        if (response.ok) {
          setBookings(data);
        } else {
          setMessage(data.error || "Failed to fetch bookings.");
        }
      } catch (error) {
        setMessage("An error occurred while fetching bookings.");
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

  const fetchSeats = async (flightId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/seats/${flightId}`);
      const data = await response.json();
      if (response.ok) {
        setSeats(data);
        setSelectedFlight(flightId);
      } else {
        setMessage("Failed to fetch seats.");
      }
    } catch (error) {
      setMessage("An error occurred while fetching seats.");
    }
  };

  const handleCheckIn = async (flightId, bookingId) => {
    if (!selectedSeat) return alert("Please select a seat.");
    const token = Cookies.get("token");
    try {
      const response = await fetch("http://localhost:5000/api/seats/book", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ flightId, seatNumber: selectedSeat, bookingId }),
      });
      const data = await response.json();
      if (response.ok) {
        alert(data.message);
        setSelectedFlight(null);
        setBookings((prev) =>
          prev.map((booking) =>
            booking.bookingId === bookingId ? { ...booking, seatNumber: selectedSeat } : booking
          )
        );
      } else {
        alert(data.error || "Check-in failed.");
      }
    } catch (error) {
      alert("An error occurred while checking in.");
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>My Bookings</h1>
      {loading ? (
        <p>Loading...</p>
      ) : message ? (
        <p>{message}</p>
      ) : bookings.length > 0 ? (
        <ul className={styles.bookingList}>
          {bookings.map((booking) => (
            <li key={booking.flightId} className={styles.bookingItem}>
              <p>Flight Number: {booking.flightNumber}</p>
              <p>From: {booking.departureAirportName} → To: {booking.arrivalAirportName}</p>
              <p>Departure: {new Date(booking.departureTime).toLocaleString()}</p>
              <p>Arrival: {new Date(booking.arrivalTime).toLocaleString()}</p>
              <p>Price: ₹{booking.price}</p>
              {booking.seatNumber === "NA" ? (
                <>
                  <button onClick={() => fetchSeats(booking.flightId)} className={styles.button}>Check-in</button>
                  {selectedFlight === booking.flightId && (
                    <div className={styles.seatSelection}>
                      <h3>Select a Seat</h3>
                      <div className={styles.seatGrid}>
                        {seats.map((seat) => (
                          <button
                            key={seat.seatNumber}
                            disabled={!seat.isAvailable}
                            onClick={() => setSelectedSeat(seat.seatNumber)}
                            className={`${styles.seatButton} ${selectedSeat === seat.seatNumber ? styles.selectedSeat : ''}`}
                          >
                            {seat.seatNumber}
                          </button>
                        ))}
                      </div>
                      <button onClick={() => handleCheckIn(booking.flightId, booking.bookingId)} className={styles.button}>Confirm Check-in</button>
                    </div>
                  )}
                </>
              ) : (
                <p>Seat Number: {booking.seatNumber}</p>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p>No bookings found.</p>
      )}
      <button onClick={() => router.push("/search")} className={styles.button}>Search More Flights</button>
      <Link href="/dashboard">Back to Dashboard</Link>
    </div>
  );
}
