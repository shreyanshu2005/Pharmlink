import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import { Star, MapPin, Users, Clock } from 'lucide-react';

const TopDoctors = () => {
  const navigate = useNavigate();
  const { doctors } = useContext(AppContext);

  const handleClick = (id) => {
    navigate(`/appointment/${id}`);
    window.scrollTo(0, 0);
  };

  return (
    <div className="w-full">
      <div className="flex flex-col items-center gap-4 sm:gap-6 my-3 sm:my-5 py-8 sm:py-12 px-3 sm:px-4 max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-3 sm:mb-4">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 sm:mb-4 text-center">
            Top-Rated Doctors
          </h1>
          <div className="w-16 sm:w-20 md:w-24 h-1 bg-blue-500 mx-auto mb-3 sm:mb-4 rounded-full"></div>
          <p className="text-gray-600 text-sm sm:text-base md:text-lg text-center px-4 md:px-0">
            Connect with our highly qualified and experienced medical professionals
          </p>
        </div>

        <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-8">
          {doctors.slice(0, 8).map((doctor, index) => (
            <div
              key={index}
              onClick={() => handleClick(doctor._id)}
              className="group relative bg-white rounded-xl sm:rounded-2xl overflow-hidden shadow-md hover:shadow-xl 
                       transition-all duration-300 transform hover:-translate-y-1 cursor-pointer"
            >
              {/* Background Pattern */}
              <div className="absolute inset-0 opacity-5">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-500 opacity-10"></div>
                <div className="h-full w-full bg-[radial-gradient(circle_at_50%_120%,rgba(120,119,198,0.1),rgba(255,255,255,0))]"></div>
              </div>

              {/* Content Container */}
              <div className="relative p-4 sm:p-6">
                {/* Availability Badge */}
                <div className="absolute top-2 sm:top-3 right-2 sm:right-3 z-10">
                  {doctor.available ? (
                    <div className="inline-flex items-center gap-1 bg-green-50 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full border border-green-200">
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-green-700 text-xs font-medium whitespace-nowrap">Available</span>
                    </div>
                  ) : (
                    <div className="inline-flex items-center gap-1 bg-red-50 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full border border-red-200">
                      <div className="w-1.5 h-1.5 bg-red-500 rounded-full"></div>
                      <span className="text-red-700 text-xs font-medium whitespace-nowrap">Unavailable</span>
                    </div>
                  )}
                </div>

                {/* Doctor Image */}
                <div className="relative w-24 h-24 sm:w-32 sm:h-32 mx-auto mb-4 sm:mb-6">
                  <div className="absolute inset-0 bg-blue-200 rounded-full blur opacity-50 group-hover:opacity-75 transition-opacity"></div>
                  <img
                    src={doctor.image}
                    alt={doctor.name}
                    className="relative w-full h-full object-cover rounded-full border-4 border-white shadow-lg 
                             group-hover:border-blue-100 transition-colors duration-300"
                  />
                  <div className="absolute -bottom-2 left-1/2 -translate-x-1/2">
                    <div className="flex items-center gap-1 bg-yellow-50 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full border border-yellow-200 shadow-md">
                      <Star className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-yellow-500 fill-current" />
                      <span className="text-yellow-700 text-xs sm:text-sm font-semibold">{doctor.rating || 4.8}</span>
                    </div>
                  </div>
                </div>

                {/* Doctor Info */}
                <div className="text-center mb-4 sm:mb-6">
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-1 sm:mb-2 group-hover:text-blue-600 transition-colors">
                    {doctor.name}
                  </h3>
                  <p className="text-blue-600 text-sm sm:text-base font-medium mb-1 sm:mb-2">{doctor.speciality}</p>
                  <div className="flex items-center justify-center gap-1 sm:gap-2 text-gray-500">
                    <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    <span className="text-xs sm:text-sm">
                      {doctor.address?.line1 ? `${doctor.address.line1}${doctor.address?.line2 ? `, ${doctor.address.line2}` : ""}` : "Address not available"}
                    </span>
                  </div>
                </div>

                {/* Book Button */}
                <button className="w-full bg-blue-50 text-blue-600 py-2 sm:py-2.5 rounded-lg sm:rounded-xl text-sm sm:text-base font-medium 
                                 hover:bg-blue-100 transition-colors duration-300 group-hover:bg-blue-600 
                                 group-hover:text-white border border-blue-200 group-hover:border-blue-600">
                  Book Appointment
                </button>
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={() => {
            navigate("/doctors");
            window.scrollTo(0, 0);
          }}
          className="mt-8 sm:mt-12 px-6 sm:px-8 py-2.5 sm:py-3 bg-blue-600 text-white rounded-full text-sm sm:text-base font-medium
                     hover:bg-blue-700 transition-colors duration-300 shadow-lg
                     hover:shadow-blue-200 flex items-center gap-2"
        >
          View All Doctors
        </button>
      </div>
    </div>
  );
};

export default TopDoctors;