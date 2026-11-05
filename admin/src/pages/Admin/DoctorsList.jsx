import React, { useContext, useEffect, useState } from 'react';
import { AdminContext } from '../../context/AdminContext';
import {
  Star,
  Stethoscope,
  Search,
  Filter,
  MapPin,
  Calendar,
  Users
} from 'lucide-react';

function DoctorsList() {
  const { doctors, adminToken, getAllDoctors, changeAvailability } = useContext(AdminContext);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpeciality, setSelectedSpeciality] = useState('All');

  useEffect(() => {
    if (adminToken) {
      getAllDoctors();
    }
  }, [adminToken]);

  const specialities = ['All', ...new Set(doctors.map(doc => doc.speciality))];

  const filteredDoctors = doctors.filter(doctor => {
    const matchesSearch = doctor.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSpeciality = selectedSpeciality === 'All' || doctor.speciality === selectedSpeciality;
    return matchesSearch && matchesSpeciality;
  });

  return (
    <div className="overflow-auto h-screen w-full bg-gray-50 pb-20">
      <div className="max-w-7xl mx-auto p-3 sm:p-6">
        {/* Header Section */}
        <div className="flex flex-col space-y-4 md:space-y-0 md:flex-row md:items-center md:justify-between mb-6 sm:mb-8">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Stethoscope className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">All Doctors</h1>
              <p className="text-xs sm:text-sm text-gray-500 mt-1">Manage and monitor doctor availability</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            {/* Search Bar */}
            <div className="relative flex-grow sm:flex-grow-0">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search doctors..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 pr-4 py-2 w-full sm:w-64 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none text-sm"
              />
            </div>

            {/* Speciality Filter */}
            <div className="relative flex-grow sm:flex-grow-0">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <select
                value={selectedSpeciality}
                onChange={(e) => setSelectedSpeciality(e.target.value)}
                className="pl-9 pr-4 py-2 w-full sm:w-48 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none appearance-none bg-white text-sm"
              >
                {specialities.map(speciality => (
                  <option key={speciality} value={speciality}>{speciality}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-20 mb-6 sm:mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Users className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-xs sm:text-sm text-gray-500">Total Doctors</p>
                <p className="text-xl sm:text-2xl font-semibold text-gray-900">{doctors.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4">
              <div className="p-2 bg-green-100 rounded-lg">
                <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
              </div>
              <div>
                <p className="text-xs sm:text-sm text-gray-500">Available Now</p>
                <p className="text-xl sm:text-2xl font-semibold text-gray-900">
                  {doctors.filter(d => d.available).length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Doctors Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {filteredDoctors.map((doctor, index) => (
            <div className="group bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300">
              {/* Modified image container to ensure proper centering */}
              <div className="h-44 w-full relative flex items-center justify-center">
                <img  
                  src={doctor.image}
                  alt={doctor.name}
                  className="w-44 h-44 object-contain"  
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
              </div>

              <div className="p-3 sm:p-4">
                <div className="flex-col items-center justify-between mb-5">
                  <h3 className="text-sm sm:text-xl font-bold  text-gray-900 group-hover:text-blue-600 transition-colors">
                    {doctor.name}
                  </h3>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full bg-blue-50 text-blue-600">
                    {doctor.speciality}
                  </span>
                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <input
                        type="checkbox"
                        checked={doctor.available}
                        onChange={() => changeAvailability(doctor._id)}
                        className="peer appearance-none w-8 h-4 rounded-full bg-gray-300 cursor-pointer transition-colors duration-200 ease-in-out checked:bg-blue-500 focus:outline-none"
                      />
                      <div className="absolute left-0.5 top-1 w-3 h-3 rounded-full bg-white transition-transform duration-200 ease-in-out peer-checked:translate-x-4 peer-checked:bg-white shadow-sm" />
                    </div>
                    <span className={`text-xs font-medium pb-1 ${doctor.available ? 'text-green-500' : 'text-red-500'}`}>
                      {doctor.available ? 'Available' : 'Away'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredDoctors.length === 0 && (
          <div className="text-center py-8 sm:py-12">
            <p className="text-sm sm:text-base text-gray-500">No doctors found matching your criteria</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default DoctorsList;