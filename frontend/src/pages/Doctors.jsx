import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import { 
  Heart, Star, ArrowRight, Filter, X, Search, 
  SortDesc, Calendar, MapPin, CheckCircle2, 
  Phone, UserCheck, Award, Stethoscope, GraduationCap
} from 'lucide-react';

const Doctors = () => {
  const { speciality } = useParams();
  const [filterDoc, setFilterDoc] = useState([]);
  const [showFilter, setShowFilter] = useState(false);
  const [selectedSpeciality, setSelectedSpeciality] = useState(speciality || '');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [availabilityFilter, setAvailabilityFilter] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState({
    experience: null,
    rating: null
  });
  const [isMobileSpecialityMenuOpen, setIsMobileSpecialityMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { doctors } = useContext(AppContext);

  const specialities = [
    "All Doctors",
    "General Physician",
    "Gynecologist", 
    "Dermatologist", 
    "Pediatricians", 
    "Neurologist", 
    "Gastroenterologist"
  ];

  const applyFilter = () => {
    let filteredDoctors = doctors;

    // Existing filter logic remains the same
    if (selectedSpeciality && selectedSpeciality !== "All Doctors") {
      filteredDoctors = filteredDoctors.filter((doc) => doc.speciality === selectedSpeciality);
    }

    if (searchTerm) {
      filteredDoctors = filteredDoctors.filter((doc) => 
        doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.speciality.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (availabilityFilter) {
      filteredDoctors = filteredDoctors.filter((doc) => doc.available);
    }

    // Rest of the filter logic remains the same...

    setFilterDoc(filteredDoctors);
  };

  useEffect(() => {
    applyFilter();
  }, [
    doctors, 
    selectedSpeciality, 
    searchTerm, 
    availabilityFilter, 
    sortBy,
    selectedFilters
  ]);

  const handleSpecialitySelect = (spec) => {
    if (spec === "All Doctors") {
      setSelectedSpeciality('');
      navigate("/doctors");
    } else {
      setSelectedSpeciality(spec);
      navigate(`/doctors/${spec}`);
    }
    setIsMobileSpecialityMenuOpen(false);
  };

  return (
    <div className="container mx-auto min-h-screen px-4 sm:px-6 lg:px-8">
      {/* Mobile Speciality Menu Toggle */}
      <div className="lg:hidden mb-4">
        <button 
          onClick={() => setIsMobileSpecialityMenuOpen(!isMobileSpecialityMenuOpen)}
          className="w-full bg-white shadow-md rounded-lg p-3 flex justify-between items-center"
        >
          <span className="flex items-center">
            <Stethoscope className="mr-2 text-blue-600" />
            {selectedSpeciality || "Select Speciality"}
          </span>
          {isMobileSpecialityMenuOpen ? <X /> : <Filter />}
        </button>
      </div>

      {/* Advanced Filters */}
      <div className="mb-8 bg-white shadow-md rounded-xl p-4 sm:p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
          {/* Search Input */}
          <div className="relative">
            <input 
              type="text"
              placeholder="Search doctors by name or speciality"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition"
            />
            <Search className="absolute left-3 top-3 text-gray-400" />
          </div>

          {/* Availability Toggle */}
          <div className="flex items-center justify-end">
            <label className="flex items-center cursor-pointer">
              <input 
                type="checkbox"
                checked={availabilityFilter}
                onChange={() => setAvailabilityFilter(!availabilityFilter)}
                className="hidden peer"
              />
              <div className={`
                w-12 h-6 bg-gray-200 rounded-full 
                relative transition-colors duration-300
                peer-checked:bg-blue-500
                before:content-[''] before:absolute 
                before:w-5 before:h-5 before:bg-white 
                before:rounded-full before:top-0.5 before:left-0.5
                before:transition-transform duration-300
                peer-checked:before:translate-x-6
              `}></div>
              <span className="ml-2 text-gray-700">Available</span>
            </label>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Speciality Sidebar - Desktop */}
        <div className="hidden lg:block lg:w-64 bg-white shadow-lg rounded-xl p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
            <Stethoscope className="mr-2 text-blue-600" />
            Specialities
          </h3>
          <div className="space-y-3">
            {specialities.map((spec) => (
              <button
                key={spec}
                onClick={() => handleSpecialitySelect(spec)}
                className={`
                  w-full text-left px-4 py-2.5 rounded-lg transition-all
                  flex items-center justify-between
                  ${selectedSpeciality === spec || 
                    (spec === "All Doctors" && !selectedSpeciality) 
                    ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100'}
                `}
              >
                {spec}
                <CheckCircle2 
                  className={`
                    w-5 h-5 
                    ${selectedSpeciality === spec || 
                      (spec === "All Doctors" && !selectedSpeciality) 
                      ? 'text-blue-600' : 'text-transparent'}
                  `} 
                />
              </button>
            ))}
          </div>
        </div>

        {/* Mobile Speciality Menu - Sliding Overlay */}
        {isMobileSpecialityMenuOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div 
              className="absolute inset-0 bg-black opacity-50"
              onClick={() => setIsMobileSpecialityMenuOpen(false)}
            ></div>
            <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl p-6 max-h-[70vh] overflow-y-auto">
              <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
                <Stethoscope className="mr-2 text-blue-600" />
                Specialities
              </h3>
              <div className="space-y-3">
                {specialities.map((spec) => (
                  <button
                    key={spec}
                    onClick={() => handleSpecialitySelect(spec)}
                    className={`
                      w-full text-left px-4 py-2.5 rounded-lg transition-all
                      flex items-center justify-between
                      ${selectedSpeciality === spec || 
                        (spec === "All Doctors" && !selectedSpeciality) 
                        ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100'}
                    `}
                  >
                    {spec}
                    <CheckCircle2 
                      className={`
                        w-5 h-5 
                        ${selectedSpeciality === spec || 
                          (spec === "All Doctors" && !selectedSpeciality) 
                          ? 'text-blue-600' : 'text-transparent'}
                      `} 
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Doctors Grid */}
        <div className="flex-grow">
          {filterDoc.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {filterDoc.map((doctor, index) => (
                <div 
                  key={index} 
                  className="bg-white rounded-2xl shadow-lg overflow-hidden 
                    transform transition-all duration-300 hover:scale-105 hover:shadow-xl"
                >
                  {/* Doctor Card Header */}
                  <div className="relative flex justify-center">
                    <img 
                      src={doctor.image} 
                      alt={doctor.name} 
                      className=" h-44 sm:h-48 object-cover"
                    />
                    <div className="absolute top-4 right-4 flex gap-2">
                      <button 
                        className="bg-white/80 rounded-full p-2 hover:bg-white hover:text-red-500 transition-colors"
                        aria-label="Favorite"
                      >
                        <Heart className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  {/* Doctor Details */}
                  <div className="p-4 sm:p-5">
                    <div className="flex justify-between items-center mb-3">
                      {doctor.available ? (
                        <div className="flex items-center gap-2 text-green-600">
                          <span className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse"></span>
                          <span className="text-xs sm:text-sm">Available</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 text-red-600">
                          <span className="text-xs sm:text-sm">Not Available</span>
                        </div>
                      )}
                      <div className="flex items-center text-yellow-500">
                        <Star className="w-4 h-4 sm:w-5 sm:h-5 fill-current" />
                        <span className="ml-1 font-semibold text-sm sm:text-base">{doctor.rating || 4.8}</span>
                      </div>
                    </div>

                    <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-1">{doctor.name}</h3>
                    <div className="flex items-center text-gray-600 mb-2 text-sm sm:text-base">
                      <GraduationCap className="w-3 h-3 sm:w-4 sm:h-4 mr-2"/>
                      <span>{doctor.speciality}</span>
                    </div>
                    
                    {/* Additional Doctor Info */}
                    <div className="flex justify-between text-xs sm:text-sm text-gray-500 mb-4">
                      <div className="flex items-center">
                        <UserCheck className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                        <span>{doctor.experience || 0} years</span>
                      </div>
                      <div className="flex items-center">
                        <Phone className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                        <span>{doctor.consultationFee ? `$${doctor.consultationFee}` : 'Consult'}</span>
                      </div>
                    </div>

                    <button 
                      onClick={() => navigate(`/appointment/${doctor._id}`)}
                      className="w-full flex items-center justify-center 
                        bg-blue-600 text-white py-2 rounded-lg 
                        hover:bg-blue-700 transition-colors group text-sm sm:text-base"
                    >
                      Book Appointment
                      <ArrowRight 
                        className="ml-2 w-4 h-4 sm:w-5 sm:h-5 transform transition-transform group-hover:translate-x-1" 
                      />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-xl shadow-lg">
              <img 
                src="/api/placeholder/400/300" 
                alt="No doctors found" 
                className="mx-auto mb-6 opacity-50 max-w-full h-auto"
              />
              <p className="text-xl sm:text-2xl text-gray-600 font-semibold">No doctors found</p>
              <p className="text-gray-500 mt-2 text-sm sm:text-base">Try adjusting your search or filters</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Doctors;