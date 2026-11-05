import React, { useEffect, useState } from 'react';
import { useContext } from 'react';
import { AdminContext } from '../../context/AdminContext';
import { AppContext } from '../../context/AppContext';
import { assets } from '../../assets/assets';
import { 
  Check, X, Calendar, Clock, IndianRupee, Search, 
  Filter, ChevronRight, ChevronDown, User, Phone 
} from 'lucide-react';

const AllAppointments = () => {
  const { adminToken, appointments, cancelAppointment, getAllAppointments, } = useContext(AdminContext);
  const { slotDateFormat, calculateAge, currency } = useContext(AppContext);

  // State management
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    status: 'all',
    date: 'all',
  });

  useEffect(() => {
    if (adminToken) {
      getAllAppointments();
    }
  }, [adminToken]);

  // Filter logic
  const filteredAppointments = appointments.filter(appointment => {
    let matches = true;
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      matches = matches && (
        appointment.userData.name.toLowerCase().includes(query) ||
        appointment.docData.name.toLowerCase().includes(query)
      );
    }
    if (filters.status !== 'all') {
      if (filters.status === 'cancelled') matches = matches && appointment.cancelled;
      else if (filters.status === 'completed') matches = matches && appointment.isCompleted;
      else if (filters.status === 'active') matches = matches && !appointment.cancelled && !appointment.isCompleted;
    }
    if (filters.date !== 'all') {
      const appointmentDate = new Date(appointment.slotDate);
      const today = new Date();
      if (filters.date === 'today') {
        matches = matches && appointmentDate.toDateString() === today.toDateString();
      } else if (filters.date === 'week') {
        const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
        matches = matches && appointmentDate >= weekAgo;
      } else if (filters.date === 'month') {
        const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
        matches = matches && appointmentDate >= monthAgo;
      }
    }
    return matches;
  });

  const StatusBadge = ({ status }) => {
    // Handle status change and cancellation
    const handleStatusChange = async (appointmentId) => {
      try {
        const success = await cancelAppointment(appointmentId);
        if (success) {
          // Refresh the appointments list after successful cancellation
          await getAllAppointments();
        }
      } catch (error) {
        console.error('Error cancelling appointment:', error);
      }
    };

    if (status.cancelled) {
      return (
        <span className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-red-700 bg-red-50 rounded-full ring-1 ring-red-100">
          <X size={12} />
          Cancelled
        </span>
      );
    } else if (status.isCompleted) {
      return (
        <span className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-emerald-700 bg-emerald-50 rounded-full ring-1 ring-emerald-100">
          <Check size={12} />
          Completed
        </span>
      );
    }
    return (
      <button
        onClick={() => handleStatusChange(status._id)}
        className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-gray-700 bg-white rounded-full ring-1 ring-gray-200 hover:bg-red-50 hover:text-red-600 hover:ring-red-200 transition-all"
      >
        <X size={12} />
        Cancel
      </button>
    );
  };

  // Mobile appointment card component
  const MobileAppointmentCard = ({ item }) => (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 space-y-4">
      <div className="flex justify-between items-start">
        <div className="flex gap-3">
          <img
            src={item.userData.image}
            className="w-12 h-12 rounded-full object-cover ring-2 ring-white shadow-sm"
            alt={item.userData.name}
          />
          <div>
            <div className="font-medium text-gray-900">{item.userData.name}</div>
            <div className="text-sm text-gray-500">Age: {calculateAge(item.userData.dob)}</div>
          </div>
        </div>
        <StatusBadge status={item} />
      </div>

      <div className="grid grid-cols-2 gap-4 text-sm">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-gray-600">
            <Calendar size={14} className="text-blue-500" />
            {slotDateFormat(item.slotDate)}
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <Clock size={14} className="text-blue-500" />
            {item.slotTime}
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-gray-900 font-medium">
            <User size={14} className="text-blue-500" />
            {item.docData.name}
          </div>
          <div className="flex items-center gap-2 text-gray-900 font-medium">
            <IndianRupee size={14} className="text-blue-500" />
            {item.amount}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="w-full max-w-6xl h-screen flex flex-col -mt-5 pb-10">
      {/* Header Section - Fixed */}
      <div className="p-4 md:p-8 space-y-6 md:space-y-8 bg-gray-50">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-xl md:text-2xl font-semibold text-gray-900">All Appointments</h1>
            <p className="text-sm text-gray-500 mt-1">
              {filteredAppointments.length} appointments found
            </p>
          </div>
          
          {/* Search and Filter Section */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1 sm:flex-none">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search appointments..." 
                className="w-full sm:w-48 pl-10 pr-4 py-2 border rounded-full text-sm focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all bg-gray-50 hover:bg-white"
              />
            </div>
            <div className="relative">
              <button 
                onClick={() => setShowFilters(!showFilters)}
                className={`w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium ${
                  showFilters ? 'text-blue-600 bg-blue-50 ring-blue-200' : 'text-gray-700 bg-white ring-gray-200'
                } rounded-full ring-1 hover:bg-gray-50 transition-all`}
              >
                <Filter size={16} />
                Filter
                <ChevronDown size={14} className={`transform transition-transform ${showFilters ? 'rotate-180' : ''}`} />
              </button>
              {showFilters && (
                <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                  <div className="p-4 space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                      <select 
                        value={filters.status}
                        onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                        className="w-full rounded-md border border-gray-300 py-2 px-3 text-sm"
                      >
                        <option value="all">All Status</option>
                        <option value="active">Active</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
                      <select 
                        value={filters.date}
                        onChange={(e) => setFilters(prev => ({ ...prev, date: e.target.value }))}
                        className="w-full rounded-md border border-gray-300 py-2 px-3 text-sm"
                      >
                        <option value="all">All Time</option>
                        <option value="today">Today</option>
                        <option value="week">This Week</option>
                        <option value="month">This Month</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Content Area - Scrollable */}
      <div className="flex-1 overflow-y-auto p-4 md:p-8 -mt-6 pb-10">
        {/* Desktop View */}
        <div className="hidden md:block bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="grid grid-cols-[0.5fr_2fr_0.9fr_1.5fr_2fr_1fr_1.5fr] gap-4 py-4 px-6 bg-gray-50 border-b font-medium text-gray-700">
            <div>#</div>
            <div>Patient</div>
            <div>Age</div>
            <div>Date & Time</div>
            <div>Doctor</div>
            <div>Fees</div>
            <div className="text-center">Status</div>
          </div>

          <div className="divide-y">
            {filteredAppointments.map((item, index) => (
              <div
                key={index}
                className="grid grid-cols-[0.5fr_2fr_0.8fr_1.5fr_2fr_1fr_1.5fr] items-center p-4 hover:bg-blue-50/30 group transition-all"
              >
                <div className="text-gray-500">{index + 1}</div>
                
                <div className="flex items-center gap-3">
                  <img
                    src={item.userData.image}
                    className="w-10 h-10 rounded-full object-cover ring-2 ring-white shadow-sm group-hover:ring-blue-100 transition-all"
                    alt={item.userData.name}
                  />
                  <div className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                    {item.userData.name}
                  </div>
                </div>

                <div className="text-gray-600">
                  {calculateAge(item.userData.dob)}
                </div>

                <div className="flex flex-col text-gray-600 group-hover:text-gray-900 text-sm">
                  <div className="flex items-center gap-2">
                    <Calendar size={14} className="text-blue-500" />
                    {slotDateFormat(item.slotDate)}
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <Clock size={14} className="text-blue-500" />
                    {item.slotTime}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <img
                    src={item.docData.image}
                    className="w-10 h-10 rounded-full object-cover ring-2 ring-white shadow-sm group-hover:ring-blue-100 transition-all"
                    alt={item.docData.name}
                  />
                  <div className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-1">
                    {item.docData.name}
                  </div>
                </div>

                <div className="flex items-center gap-1 font-medium text-gray-900">
                  <IndianRupee size={14} className="text-blue-500" />
                  {item.amount}
                </div>

                <div className="flex items-center justify-center gap-2">
                  <StatusBadge status={item} />
                  <ChevronRight size={16} className="text-gray-300 group-hover:text-blue-500 transition-colors" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Mobile View - Now Scrollable */}
        <div className="md:hidden space-y-4 pb-4">
          {filteredAppointments.map((item, index) => (
            <MobileAppointmentCard key={index} item={item} />
          ))}
          
          {/* Empty State */}
          {filteredAppointments.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 text-gray-500 bg-white rounded-lg border border-gray-200">
              <p className="text-lg font-medium">No appointments found</p>
              <p className="text-sm">Try adjusting your filters or search query</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AllAppointments;