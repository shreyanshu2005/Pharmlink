    import React, { useContext, useState, useEffect } from 'react';
    import { AppContext } from '../context/AppContext';
    import { useNavigate } from 'react-router-dom';
    import { MapPin, Star, Calendar, Clock } from 'lucide-react';

    const RelatedDoctors = ({ speciality, docId }) => {
    const { doctors } = useContext(AppContext);
    const [relDocs, setRelDocs] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        if (doctors.length > 0 && speciality) {
        const doctorsData = doctors.filter(
            (doc) => doc.speciality === speciality && doc._id !== docId
        );
        setRelDocs(doctorsData);
        }
    }, [doctors, speciality, docId]);

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="text-center mb-12">
            <span className="text-blue-600 font-medium text-sm tracking-wider uppercase mb-3 block">
            Find Your Specialist
            </span>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Top Recommended Doctors
            </h1>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-blue-600 mx-auto mb-6 rounded-full"></div>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover experienced healthcare professionals specialized in your needs
            </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
            {relDocs.slice(0, 8).map((item, index) => (
            <div
                key={index}
                onClick={() => {
                navigate(`/appointment/${item._id}`);
                scrollTo(0, 0);
                }}
                className="group bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-100 hover:border-blue-200 cursor-pointer transform hover:-translate-y-1"
            >
                <div className="p-3">
                <div className="flex justify-end mb-4">
                    <span className="bg-white px-3 py-1 rounded-full text-sm font-medium text-blue-600 shadow-sm">
                    4.9 <Star className="w-4 h-4 inline-block ml-1 text-yellow-400" />
                    </span>
                </div>
                
                <div className="flex items-center gap-2 mb-3">
                    <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                    <span className="text-sm text-green-600 font-medium">Available Today</span>
                    </span>
                </div>
                
                <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                    {item.name}
                </h3>
                
                <p className="text-gray-600 mb-4 flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    {item.speciality}
                </p>
                
                <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span className="flex items-center gap-1.5">
                    <Calendar className="w-4 h-4" />
                    Next: Today
                    </span>
                    <span className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4" />
                    10:00 AM
                    </span>
                </div>
                </div>
            </div>
            ))}
        </div>

        <div className="text-center mt-12">
            <button
            onClick={() => {
                navigate("/doctors");
                scrollTo(0, 0);
            }}
            className="inline-flex items-center justify-center px-8 py-4 text-lg font-medium rounded-full text-white bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 transform hover:-translate-y-0.5 transition-all duration-300 shadow-sm hover:shadow-md"
            >
            View All Doctors
            </button>
        </div>
        </div>
    );
    };

    export default RelatedDoctors;