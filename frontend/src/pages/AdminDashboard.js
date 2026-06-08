
import React, { useEffect, useState } from 'react';
import { getAdminStats, getBookings, getRates, updateRate } from '../api';

export default function AdminDashboard() {
  const [stats, setStats] = useState({});
  const [bookings, setBookings] = useState([]);
  const [rates, setRates] = useState([]);
  const [tab, setTab] = useState('overview');

  useEffect(() => {
    getAdminStats().then(r => setStats(r.data));
    getBookings().then(r => setBookings(r.data));
    getRates().then(r => setRates(r.data));
  }, []);

  return (
    <div>
      <h1>Admin Dashboard</h1>
      <div className="filters" style={{marginBottom:'1.5rem'}}>
        {['overview','bookings','rates'].map(t => (
          <button key={t} className={`filter-btn ${tab===t?'active':''}`} onClick={() => setTab(t)}>{t.charAt(0).toUpperCase()+t.slice(1)}</button>
        ))}
      </div>
      {tab === 'overview' && (
        <div className="stat-grid">
          <div className="stat-card"><div className="stat-value">{stats.total_slots}</div><div className="stat-label">Total Slots</div></div>
          <div className="stat-card"><div className="stat-value">{stats.occupied}</div><div className="stat-label">Occupied</div></div>
          <div className="stat-card"><div className="stat-value">{stats.available}</div><div className="stat-label">Available</div></div>
          <div className="stat-card"><div className="stat-value">{stats.occupancy_rate}%</div><div className="stat-label">Occupancy Rate</div></div>
          <div className="stat-card"><div className="stat-value">{stats.total_bookings}</div><div className="stat-label">Total Bookings</div></div>
          <div className="stat-card"><div className="stat-value">Rs.{stats.total_revenue}</div><div className="stat-label">Revenue</div></div>
        </div>
      )}
      {tab === 'bookings' && (
        <div className="card"><h2>All Bookings</h2>
          <table><thead><tr><th>Slot</th><th>Driver</th><th>Vehicle</th><th>Status</th><th>Amount</th></tr></thead>
          <tbody>{bookings.map(b => (
            <tr key={b.booking_id}><td>{b.slot_id}</td><td>{b.driver_name}</td><td>{b.vehicle_number}</td>
            <td><span className={`badge badge-${b.status}`}>{b.status}</span></td><td>Rs.{b.amount_paid}</td></tr>
          ))}</tbody></table>
        </div>
      )}
      {tab === 'rates' && (
        <div className="card"><h2>Parking Rates</h2>
          {rates.map(r => (
            <div key={r.category} style={{display:'flex',alignItems:'center',gap:'1rem',marginBottom:'0.8rem'}}>
              <span style={{width:'80px',color:'#00e5ff'}}>{r.category}</span>
              <input type="number" defaultValue={r.rate_per_hour}
                style={{width:'100px',padding:'0.4rem',background:'#0f0f1a',border:'1px solid #00e5ff33',borderRadius:'6px',color:'#e0e0e0'}}
                onBlur={e => updateRate(r.category, parseFloat(e.target.value)).then(() => getRates().then(res => setRates(res.data)))}
              />
              <span style={{color:'#888',fontSize:'0.85rem'}}>Rs./hour</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
