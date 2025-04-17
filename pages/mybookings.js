import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import Link from "next/link";
import styles from "@/styles/Bookings.module.css";

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [upcomingTrips, setUpcomingTrips] = useState([]);
  const [pastTrips, setPastTrips] = useState([]);
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

          const currentDate = new Date();
          const upcoming = data.filter(
            (booking) => new Date(booking.departureTime) > currentDate
          );
          const past = data.filter(
            (booking) => new Date(booking.departureTime) <= currentDate
          );
          setUpcomingTrips(upcoming);
          setPastTrips(past);
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
        setUpcomingTrips((prev) =>
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
      ) : (
        <div className={styles.horizontalLayout}>
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Upcoming Trips</h2>
            {upcomingTrips.length > 0 ? (
              <ul className={styles.bookingList}>
                {upcomingTrips.map((booking) => (
                  <li key={booking.flightId} className={styles.bookingItem}>
                    <p><strong>Flight Number:</strong> {booking.flightNumber}</p>
                    <p><strong>From:</strong> {booking.departureAirport} → <strong>To:</strong> {booking.arrivalAirport}</p>
                    <p><strong>Departure:</strong> {new Date(booking.departureTime).toLocaleString()}</p>
                    <p><strong>Arrival:</strong> {new Date(booking.arrivalTime).toLocaleString()}</p>
                    <p><strong>Price:</strong> ₹{booking.price}</p>
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
                      <p><strong>Seat Number:</strong> {booking.seatNumber}</p>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <p>No upcoming trips found.</p>
            )}
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Past Trips</h2>
            {pastTrips.length > 0 ? (
              <ul className={styles.bookingList}>
                {pastTrips.map((booking) => (
                  <li key={booking.flightId} className={styles.bookingItem}>
                    <p><strong>Flight Number:</strong> {booking.flightNumber}</p> 
                    <p><strong>From:</strong> {booking.departureAirport} → <strong>To:</strong> {booking.arrivalAirport}</p>
                    <p><strong>Departure:</strong> {new Date(booking.departureTime).toLocaleString()}</p>
                    <p><strong>Arrival:</strong> {new Date(booking.arrivalTime).toLocaleString()}</p>
                    <p><strong>Price:</strong> ₹{booking.price}</p>
                    <p><strong>Seat Number:</strong> {booking.seatNumber}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No past trips found.</p>
            )}
          </section>
        </div>
      )}
      <div className={styles.actions}>
        <button onClick={() => router.push("/search")} className={styles.button}>Search More Flights</button>
        <Link href="/dashboard" className={styles.button}>Back to Dashboard</Link>
      </div>
    </div>
  );
}