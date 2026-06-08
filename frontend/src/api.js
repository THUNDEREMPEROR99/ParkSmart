
import axios from 'axios';
const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
export const getSlots = (category) => axios.get(`${BASE_URL}/api/slots`, { params: { category } });
export const getAvailability = () => axios.get(`${BASE_URL}/api/slots/availability`);
export const createBooking = (data) => axios.post(`${BASE_URL}/api/book`, data);
export const checkout = (bookingId) => axios.post(`${BASE_URL}/api/checkout/${bookingId}`);
export const getBookings = () => axios.get(`${BASE_URL}/api/bookings`);
export const getActiveBookings = () => axios.get(`${BASE_URL}/api/bookings/active`);
export const getAdminStats = () => axios.get(`${BASE_URL}/api/admin/stats`);
export const getRates = () => axios.get(`${BASE_URL}/api/admin/rates`);
export const updateRate = (category, rate_per_hour) => axios.put(`${BASE_URL}/api/admin/rates`, { category, rate_per_hour });
