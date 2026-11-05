import React, { useContext, useEffect } from 'react';
import { AdminContext } from '../../context/AdminContext';
import { AppContext } from '../../context/AppContext';
import { assets } from '../../assets/assets';
import { AlertCircle, CheckCircle, XCircle } from 'lucide-react';

const Dashboard = () => {
  const { adminToken, getDashData, cancelAppointment, dashData } = useContext(AdminContext);
  const { slotDateFormat } = useContext(AppContext);

  useEffect(() => {
    if (adminToken) {
      getDashData();
    }
  }, [adminToken]);

  const StatCard = ({ icon, count, label, bgColor = 'bg-white' }) => (
    <div className={`flex items-center gap-4 ${bgColor} p-4 rounded-lg shadow-sm border border-gray-200 cursor-pointer transition-all duration-300 hover:shadow-md min-w-full`}>
      <div className="p-2 bg-gray-50 rounded-full">
        <img className="w-8 h-8 object-contain" src={icon} alt={label} />
      </div>
      <div>
        <p className="text-xl font-bold text-gray-800">{count}</p>
        <p className="text-sm text-gray-500 font-medium">{label}</p>
      </div>
    </div>
  );

  const AppointmentStatus = ({ status }) => {
    if (status === 'cancelled') {
      return (
        <div className="flex items-center gap-1.5 text-red-500">
          <XCircle size={16} />
          <span className="text-sm font-medium">Cancelled</span>
        </div>
      );
    }
    if (status === 'completed') {
      return (
        <div className="flex items-center gap-1.5 text-green-500">
          <CheckCircle size={16} />
          <span className="text-sm font-medium">Completed</span>
        </div>
      );
    }
    return (
      <button 
        onClick={() => cancelAppointment(item._id)}
        className="flex items-center gap-1.5 text-gray-500 hover:text-red-500 transition-colors"
      >
        <AlertCircle size={16} />
        <span className="text-sm font-medium">Cancel</span>
      </button>
    );
  };

  return dashData && (
    <div className="p-4 max-w-full mx-auto h-full overflow-y-auto">
      {/* Stats Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <StatCard 
          icon={assets.doctor_icon}
          count={dashData.doctors}
          label="Total Doctors"
          bgColor="bg-blue-50"
        />
        <StatCard 
          icon={assets.appointments_icon}
          count={dashData.appointments}
          label="Total Appointments"
          bgColor="bg-green-50"
        />
        <StatCard 
          icon={assets.patients_icon}
          count={dashData.patients}
          label="Total Patients"
          bgColor="bg-purple-50"
        />
      </div>

      {/* Latest Bookings Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="flex items-center gap-3 px-4 py-3 border-b bg-gray-50">
          <img src={assets.list_icon} alt="" className="w-5 h-5" />
          <h2 className="text-base font-semibold text-gray-800">Latest Bookings</h2>
        </div>

        <div className="divide-y divide-gray-100 max-h-96 overflow-y-auto">
          {dashData.latestAppointments.slice(0, 5).map((item, index) => (
            <div 
              key={index}
              className="flex items-center px-4 py-3 gap-3 hover:bg-gray-50 transition-colors"
            >
              <div className="relative flex-shrink-0">
                <img 
                  className="w-10 h-10 rounded-full object-cover border-2 border-gray-200" 
                  src={item.docData.image} 
                  alt={item.docData.name}
                />
                <div className="absolute -bottom-1 -right-1 w-3 h-3 border-2 border-white rounded-full bg-green-400"></div>
              </div>
              
              <div className="flex-1 min-w-0">
                <p className="text-gray-900 font-semibold truncate">{item.docData.name}</p>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <span>Booking on</span>
                  <span className="font-medium">{slotDateFormat(item.slotDate)}</span>
                </div>
              </div>

              <AppointmentStatus 
                status={item.cancelled ? 'cancelled' : item.isCompleted ? 'completed' : 'active'} 
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;