import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import Link from 'next/link';
import styles from '@/styles/Search.module.css';

export default function SearchFlights() {
  const [airports, setAirports] = useState([]);
  const [departure, setDeparture] = useState("");
  const [arrival, setArrival] = useState("");
  const [date, setDate] = useState("");
  const [flights, setFlights] = useState([]);
  const [selectedFlight, setSelectedFlight] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    // Fetch available airports
    fetch("http://localhost:5000/api/airports")
      .then((res) => res.json())
      .then((data) => setAirports(data))
      .catch((err) => console.error("Error fetching airports:", err));
  }, []);

  const searchFlights = async (e) => {
    e.preventDefault();
    setFlights([]);
    setMessage("");

    const response = await fetch(
      `http://localhost:5000/api/flights/search?departureAirport=${departure}&arrivalAirport=${arrival}&date=${date}`
    );
    const data = await response.json();
    setFlights(data);
  };

  const bookFlight = async () => {
    const token = Cookies.get("token"); // Get JWT token

    if (!token) {
      setMessage("Please log in to book a flight.");
      return;
    }

    const response = await fetch("http://localhost:5000/api/bookings/book", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ flightId: selectedFlight.flightId }),
    });

    const result = await response.json();

    if (response.ok) {
      setMessage("Flight booked successfully!");
      setSelectedFlight(null);
    } else {
      setMessage(result.error || "Booking failed.");
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Search Flights</h1>
      <form onSubmit={searchFlights} className={styles.form}>
        <label>Departure Airport:</label>
        <select value={departure} onChange={(e) => setDeparture(e.target.value)} required>
          <option value="">Select Airport</option>
          {airports.map((airport) => (
            <option key={airport.airportCode} value={airport.airportCode}>
              {airport.airportName} ({airport.airportCode})
            </option>
          ))}
        </select>

        <label>Arrival Airport:</label>
        <select value={arrival} onChange={(e) => setArrival(e.target.value)} required>
          <option value="">Select Airport</option>
          {airports.map((airport) => (
            <option key={airport.airportCode} value={airport.airportCode}>
              {airport.airportName} ({airport.airportCode})
            </option>
          ))}
        </select>

        <label>Date:</label>
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />

        <button type="submit" className={styles.button}>Search</button>
      </form>

      <h2 className={styles.subtitle}>Available Flights</h2>
      <ul className={styles.flightList}>
        {flights.length > 0 ? (
          flights.map((flight) => (
            <li key={flight.flightId} onClick={() => setSelectedFlight(flight)} className={styles.flightItem}>
              {flight.flightNumber} - {flight.departureAirportName} to {flight.arrivalAirportName} - ₹{flight.price}
            </li>
          ))
        ) : (
          <p>No flights found.</p>
        )}
      </ul>

      {selectedFlight && (
        <div className={styles.confirmation}>
          <h3>Confirm Booking for {selectedFlight.flightNumber}</h3>
          <button onClick={bookFlight} className={styles.button}>Book Flight</button>
          <button onClick={() => setSelectedFlight(null)} className={styles.button}>Cancel</button>
        </div>
      )}

      {message && <p className={styles.message}>{message}</p>}
      <Link href="/dashboard">Back to Dashboard</Link>
    </div>
  );
}
