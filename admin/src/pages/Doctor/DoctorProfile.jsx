import React, { useContext, useEffect, useState } from 'react';
import { DoctorContext } from '../../context/DoctorContext';
import { AppContext } from '../../context/AppContext';
import { toast } from 'react-toastify';
import { Calendar, MapPin, Award, Stethoscope, Clock, Edit2, Save, Star, IndianRupee } from 'lucide-react';
import axios from 'axios';

const DoctorProfile = () => {
    const { doctorToken, profileData, setProfileData, getProfileData } = useContext(DoctorContext);
    const { currency, backendUrl } = useContext(AppContext);
    const [isEdit, setIsEdit] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);

    const updateProfile = async () => {
        try {
            const updateData = {
                address: profileData.address,
                fees: profileData.fees,
                about: profileData.about,
                available: profileData.available
            };

            const { data } = await axios.post(
                backendUrl + '/api/doctor/update-profile',
                updateData,
                { headers: { doctorToken } }
            );

            if (data.success) {
                toast.success(data.message);
                setIsEdit(false);
                getProfileData();
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
            console.log(error);
        }
    };

    const handleAvailabilityToggle = async () => {
        try {
            setIsUpdating(true);
            const newAvailability = !profileData.available;
            
            // Update local state immediately for better UX
            setProfileData(prev => ({ ...prev, available: newAvailability }));
            
            const updateData = {
                address: profileData.address,
                fees: profileData.fees,
                about: profileData.about,
                available: newAvailability
            };

            const { data } = await axios.post(
                backendUrl + '/api/doctor/update-profile',
                updateData,
                { headers: { doctorToken } }
            );

            if (data.success) {
                toast.success('Availability updated successfully');
            } else {
                // Revert local state if update fails
                setProfileData(prev => ({ ...prev, available: !newAvailability }));
                toast.error(data.message);
            }
        } catch (error) {
            // Revert local state if update fails
            setProfileData(prev => ({ ...prev, available: !newAvailability }));
            toast.error('Failed to update availability');
            console.log(error);
        } finally {
            setIsUpdating(false);
        }
    };

    useEffect(() => {
        if (doctorToken) {
            getProfileData();
        }
    }, [doctorToken]);

    return profileData && (
        <div className="relative h-screen w-full overflow-auto bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 overflow-y-auto pb-18">
            <div className="w-full p-4 pb-8 md:p-8">
                <div className="max-w-7xl mx-auto">
                    {/* Hero Section */}
                    <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl shadow-2xl p-6 md:p-8 mb-8">
                        <div className="flex flex-col md:flex-row items-center gap-6">
                            {/* Profile Image */}
                            <div 
                                className="relative group cursor-pointer"
                                onMouseEnter={() => setIsHovered(true)}
                                onMouseLeave={() => setIsHovered(false)}
                            >
                                <div className="w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden ring-4 ring-white shadow-lg">
                                    <img
                                        src={profileData.image}
                                        alt={profileData.name}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                {isHovered && (
                                    <div className="absolute inset-0 bg-black bg-opacity-40 rounded-full flex items-center justify-center">
                                        <Edit2 className="w-6 h-6 text-white" />
                                    </div>
                                )}
                            </div>

                            {/* Name and Credentials */}
                            <div className="text-center md:text-left text-white flex-1">
                                <h1 className="text-2xl md:text-5xl font-bold mb-2">{profileData.name}</h1>
                                <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 text-sm md:text-lg opacity-90">
                                    <span>{profileData.degree}</span>
                                    <span>•</span>
                                    <span>{profileData.speciality}</span>
                                </div>
                            </div>

                            {/* Consultation Fee */}
                            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-white text-center">
                                <div className="flex items-center justify-center gap-1 text-xl md:text-3xl font-bold">
                                    <IndianRupee className="w-6 h-6 md:w-8 md:h-8" />
                                    <span>{profileData.fees}</span>
                                </div>
                                <div className="text-xs md:text-sm opacity-90">Consultation Fee</div>
                            </div>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {/* Left Column - Stats & Info */}
                        <div className="space-y-6">
                            {/* Quick Stats */}
                            <div className="bg-white rounded-3xl shadow-xl p-6">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl">
                                        <Award className="w-5 h-5 text-blue-600 mx-auto mb-2" />
                                        <div className="text-lg font-bold text-gray-800">{profileData.experience}</div>
                                        <div className="text-sm text-gray-600">Experience</div>
                                    </div>
                                    <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl">
                                        <Star className="w-5 h-5 text-purple-600 mx-auto mb-2" />
                                        <div className="text-lg font-bold text-gray-800">4.9/5</div>
                                        <div className="text-sm text-gray-600">Rating</div>
                                    </div>
                                </div>
                            </div>

                            {/* Availability Card */}
                            <div className="bg-white rounded-3xl shadow-xl p-6">
                                <h3 className="text-xl font-bold text-gray-800 mb-4">Availability Status</h3>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        className="sr-only peer"
                                        checked={profileData.available}
                                        onChange={handleAvailabilityToggle}
                                        disabled={isUpdating}
                                    />
                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                    <span className="ml-3 text-sm font-medium text-gray-700">
                                        {isUpdating ? 'Updating...' : (profileData.available ? 'Available for Appointments' : 'Currently Unavailable')}
                                    </span>
                                </label>
                            </div>
                        </div>

                        {/* Right Column - Main Content */}
                        <div className="md:col-span-2 space-y-6">
                            {/* About Section */}
                            <div className="bg-white rounded-3xl shadow-xl p-8">
                                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                                    <h2 className="text-2xl font-bold text-gray-800">About</h2>
                                    {isEdit ? (
                                        <button
                                            onClick={updateProfile}
                                            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:opacity-90 transition-opacity"
                                        >
                                            <Save className="w-5 h-5" />
                                            Save Changes
                                        </button>
                                    ) : (
                                        <button
                                            onClick={() => setIsEdit(true)}
                                            className="flex items-center text-sm gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:opacity-90 transition-opacity"
                                        >
                                            <Edit2 className="w-3 h-3" />
                                            Edit Profile
                                        </button>
                                    )}
                                </div>
                                {isEdit ? (
                                    <textarea
                                        className="w-full p-4 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500 min-h-[200px] transition-all duration-300"
                                        value={profileData.about}
                                        onChange={(e) => setProfileData(prev => ({ ...prev, about: e.target.value }))}
                                    />
                                ) : (
                                    <p className="text-gray-600 leading-relaxed">{profileData.about}</p>
                                )}
                            </div>

                            {/* Location Section */}
                            <div className="bg-white rounded-3xl shadow-xl p-8">
                                <h2 className="text-2xl font-bold text-gray-800 mb-6">Location</h2>
                                <div className="flex items-start gap-4">
                                    <div className="bg-gradient-to-br from-blue-100 to-blue-200 p-3 rounded-full">
                                        <MapPin className="w-4 h-4 text-blue-600" />
                                    </div>
                                    <div className="flex-1">
                                        {isEdit ? (
                                            <div className="space-y-3">
                                                <input
                                                    type="text"
                                                    className="w-full p-3 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
                                                    value={profileData.address.line1}
                                                    onChange={(e) => setProfileData(prev => ({
                                                        ...prev,
                                                        address: { ...prev.address, line1: e.target.value }
                                                    }))}
                                                />
                                                <input
                                                    type="text"
                                                    className="w-full p-3 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
                                                    value={profileData.address.line2}
                                                    onChange={(e) => setProfileData(prev => ({
                                                        ...prev,
                                                        address: { ...prev.address, line2: e.target.value }
                                                    }))}
                                                />
                                            </div>
                                        ) : (
                                            <div className="text-gray-600">
                                                <p className="text-lg">{profileData.address.line1}</p>
                                                <p>{profileData.address.line2}</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DoctorProfile;