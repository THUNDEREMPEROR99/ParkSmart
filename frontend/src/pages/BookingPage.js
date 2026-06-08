
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { createBooking, checkout, getActiveBookings } from '../api';

export default function BookingPage() {
  const { slotId } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({ driver_name: '', vehicle_number: '', vehicle_type: '2W' });
  const [booking, setBooking] = useState(null);
  const [activeBookings, setActiveBookings] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => { getActiveBookings().then(r => setActiveBookings(r.data)); }, []);

  const handleBook = async (e) => {
    e.preventDefault();
    try {
      const res = await createBooking({ ...form, slot_id: slotId });
      setBooking(res.data);
      setMessage('Booking confirmed!');
    } catch (err) { setMessage(err.response?.data?.error || 'Booking failed'); }
  };

  const handleCheckout = async (bookingId) => {
    try {
      const res = await checkout(bookingId);
      setMessage(`Checkout done! Amount: Rs.${res.data.amount_paid}`);
      getActiveBookings().then(r => setActiveBookings(r.data));
    } catch (err) { setMessage(err.response?.data?.error || 'Checkout failed'); }
  };

  return (
    <div>
      <button className="btn" onClick={() => navigate('/')} style={{marginBottom:'1rem',background:'#333',color:'#aaa'}}>Back</button>
      <h1>Book Slot: {slotId}</h1>
      {message && <div className="card" style={{background:'#00e5ff11',borderColor:'#00e5ff44',marginBottom:'1rem'}}>{message}</div>}
      {!booking ? (
        <div className="card">
          <h2>Booking Details</h2>
          <form onSubmit={handleBook}>
            <div className="form-group"><label>Driver Name</label><input value={form.driver_name} onChange={e=>setForm({...form,driver_name:e.target.value})} required placeholder="Enter name"/></div>
            <div className="form-group"><label>Vehicle Number</label><input value={form.vehicle_number} onChange={e=>setForm({...form,vehicle_number:e.target.value})} required placeholder="KA01AB1234"/></div>
            <div className="form-group"><label>Vehicle Type</label>
              <select value={form.vehicle_type} onChange={e=>setForm({...form,vehicle_type:e.target.value})}>
                <option value="2W">2-Wheeler</option><option value="4W">4-Wheeler</option><option value="EV">EV</option><option value="Disabled">Disabled</option>
              </select>
            </div>
            <button className="btn btn-primary" type="submit">Confirm Booking</button>
          </form>
        </div>
      ) : (
        <div className="card">
          <h2>Booking Confirmed</h2>
          <p>Booking ID: <strong style={{color:'#00e5ff'}}>{booking.booking_id}</strong></p>
          <p>Slot: <strong>{booking.slot_id}</strong></p>
          <br/>
          <button className="btn btn-danger" onClick={() => handleCheckout(booking.booking_id)}>Check Out</button>
        </div>
      )}
      {activeBookings.length > 0 && (
        <div className="card">
          <h2>Active Bookings</h2>
          <table><thead><tr><th>Slot</th><th>Driver</th><th>Vehicle</th><th>Action</th></tr></thead>
          <tbody>{activeBookings.map(b => (
            <tr key={b.booking_id}><td>{b.slot_id}</td><td>{b.driver_name}</td><td>{b.vehicle_number}</td>
            <td><button className="btn btn-danger" style={{padding:'0.3rem 0.7rem',fontSize:'0.8rem'}} onClick={() => handleCheckout(b.booking_id)}>Checkout</button></td></tr>
          ))}</tbody></table>
        </div>
      )}
    </div>
  );
}
