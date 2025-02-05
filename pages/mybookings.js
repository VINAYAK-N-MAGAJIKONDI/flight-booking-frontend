import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/router";

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
    <div>
      <h1>My Bookings</h1>
      {loading ? (
        <p>Loading...</p>
      ) : message ? (
        <p>{message}</p>
      ) : bookings.length > 0 ? (
        <ul>
          {bookings.map((booking) => (
            <li key={booking.flightId} style={{ border: "1px solid gray", padding: "10px", margin: "5px" }}>
              <p>Flight Number: {booking.flightNumber}</p>
              <p>From: {booking.departureAirportName} → To: {booking.arrivalAirportName}</p>
              <p>Departure: {new Date(booking.departureTime).toLocaleString()}</p>
              <p>Arrival: {new Date(booking.arrivalTime).toLocaleString()}</p>
              <p>Price: ₹{booking.price}</p>
              {booking.seatNumber === "NA" ? (
                <>
                  <button onClick={() => fetchSeats(booking.flightId)}>Check-in</button>
                  {selectedFlight === booking.flightId && (
                    <div>
                      <h3>Select a Seat</h3>
                      <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "5px" }}>
                        {seats.map((seat) => (
                          <button
                            key={seat.seatNumber}
                            disabled={!seat.isAvailable}
                            onClick={() => setSelectedSeat(seat.seatNumber)}
                            style={{
                              backgroundColor: selectedSeat === seat.seatNumber ? "green" : seat.isAvailable ? "white" : "gray",
                              padding: "10px",
                              border: "1px solid black",
                            }}
                          >
                            {seat.seatNumber}
                          </button>
                        ))}
                      </div>
                      <button onClick={() => handleCheckIn(booking.flightId, booking.bookingId)}>Confirm Check-in</button>
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
      <button onClick={() => router.push("/search")}>Search More Flights</button>
    </div>
  );
}
