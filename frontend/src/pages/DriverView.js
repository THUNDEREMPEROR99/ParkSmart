
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getSlots, getAvailability } from '../api';

const CATEGORIES = ['All', '2W', '4W', 'EV', 'Disabled'];

export default function DriverView() {
  const [slots, setSlots] = useState([]);
  const [availability, setAvailability] = useState([]);
  const [activeFilter, setActiveFilter] = useState('All');
  const [showAvailable, setShowAvailable] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    getSlots(activeFilter).then(r => setSlots(r.data));
    getAvailability().then(r => setAvailability(r.data));
  }, [activeFilter]);

  const displayed = showAvailable ? slots.filter(s => s.status === 'available') : slots;
  const categories = [...new Set(displayed.map(s => s.category))];

  return (
    <div>
      <h1>Driver View</h1>
      <p style={{color:'#888', marginBottom:'1rem'}}>Select an available slot to book</p>
      <div className="stat-grid" style={{gridTemplateColumns:'repeat(4,1fr)'}}>
        {availability.map(a => (
          <div className="stat-card" key={a.category}>
            <div className="stat-value">{a.available}</div>
            <div className="stat-label">{a.category} available / {a.total}</div>
          </div>
        ))}
      </div>
      <div className="card">
        <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'1rem'}}>
          <div className="filters">
            {CATEGORIES.map(c => (
              <button key={c} className={`filter-btn ${activeFilter===c?'active':''}`} onClick={() => setActiveFilter(c)}>{c}</button>
            ))}
          </div>
          <label style={{fontSize:'0.85rem', color:'#aaa', display:'flex', alignItems:'center', gap:'0.4rem'}}>
            <input type="checkbox" checked={showAvailable} onChange={e => setShowAvailable(e.target.checked)} />
            Available only
          </label>
        </div>
        {categories.map(cat => (
          <div key={cat}>
            <div className="category-label">{cat}</div>
            <div className="slot-grid">
              {displayed.filter(s=>s.category===cat).map(slot => (
                <div key={slot.slot_id} className={`slot ${slot.status}`}
                  onClick={() => slot.status === 'available' && navigate(`/book/${slot.slot_id}`)}>
                  {slot.slot_id.split('-')[1]}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
