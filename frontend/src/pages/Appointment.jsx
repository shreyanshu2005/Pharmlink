import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import { assets } from "../assets/assets_frontend/assets";
import RelatedDoctors from "../components/RelatedDoctors";
import { toast } from "react-toastify";
import axios from "axios";
import GmeetIcon from "../assets/assets_frontend/google-meet.png"
import medimeetIcon from "../assets/assets_frontend/medimeet-icon.png"
import { Calendar, Clock, MapPin, User, Video, Star, Award, Heart } from "lucide-react";

const Appointment = () => {
    const { docId } = useParams();
    const { doctors, currencySymbol, backendUrl, token, getDoctorsData } = useContext(AppContext);
    const daysOfWeek = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
    const navigate = useNavigate();

    const [docInfo, setDocInfo] = useState(null);
    const [docSlots, setDocSlots] = useState([]);
    const [slotIndex, setSlotIndex] = useState(0);
    const [slotTime, setSlotTime] = useState("");
    const [appointmentType, setAppointmentType] = useState("");
    const [loading, setLoading] = useState(false);
    const [virtualMeetingPlatform, setVirtualMeetingPlatform] = useState("Google Meet");
    const [initialAppointmentType, setInitialAppointmentType] = useState(""); // New state for initial selection

    // Helper function to format time in HH:MM format
    const formatTimeToHHMM = (date) => {
        const hours = String(date.getHours()).padStart(2, "0");
        const minutes = String(date.getMinutes()).padStart(2, "0");
        return `${hours}:${minutes}`;
    };

    // Helper function to format date in DD_MM_YYYY format
    const formatDateToDDMMYYYY = (date) => {
        const day = String(date.getDate()).padStart(2, "0");
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const year = date.getFullYear();
        return `${day}_${month}_${year}`;
    };

    // Fetch doctor information
    const fetchDocInfo = async () => {
        const docInfo = doctors.find((doc) => doc._id === docId);
        setDocInfo(docInfo);
    };

    // Get available slots for the doctor
    const getAvailableSlots = async () => {
        setDocSlots([]);
        let today = new Date();
        let isAfter9PM = today.getHours() >= 21;

        // Start from tomorrow if it's after 9 PM
        let startDate = isAfter9PM ? new Date(today.setDate(today.getDate() + 1)) : today;

        for (let i = 0; i < 7; i++) {
            let currentDate = new Date(startDate);
            currentDate.setDate(startDate.getDate() + i);

            let endTime = new Date(currentDate);
            endTime.setHours(21, 0, 0, 0);

            if (i === 0 && !isAfter9PM) {
                currentDate.setHours(
                    currentDate.getHours() > 10 ? currentDate.getHours() + 1 : 10
                );
                currentDate.setMinutes(currentDate.getMinutes() > 30 ? 30 : 0);
            } else {
                currentDate.setHours(10);
                currentDate.setMinutes(0);
            }

            let timeSlots = [];

            while (currentDate < endTime) {
                const time = formatTimeToHHMM(currentDate);
                const displayTime = currentDate.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                });

                const slotDate = formatDateToDDMMYYYY(currentDate);

                const isSlotAvailable = !(docInfo.slots_booked[slotDate]?.includes(time));

                if (isSlotAvailable) {
                    timeSlots.push({
                        datetime: new Date(currentDate),
                        time: time,
                        displayTime: displayTime,
                    });
                }

                currentDate.setMinutes(currentDate.getMinutes() + 30);
            }

            setDocSlots((prev) => [...prev, timeSlots]);
        }
    };

    // Book appointment
    const bookAppointment = async () => {
        if (!token) {
            toast.warning("Login to book appointment");
            return navigate("/login");
        }

        if (!appointmentType) {
            toast.warning("Please select appointment type");
            return;
        }

        if (!slotTime) {
            toast.warning("Please select appointment time");
            return;
        }

        const date = docSlots[slotIndex][0].datetime;
        const slotDate = formatDateToDDMMYYYY(date);

        setLoading(true); // Start loading

        try {
            const { data } = await axios.post(
                `${backendUrl}/api/user/book-appointment`,
                {
                    docId,
                    slotDate,
                    slotTime,
                    appointmentType,
                    virtualMeetingPlatform, // Include the selected platform
                },
                { headers: { token } }
            );

            if (data.success) {
                toast.success(data.message);
                getDoctorsData();
                navigate("/my-appointments");
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.error("Error booking appointment:", error);
            toast.error(error.message);
        } finally {
            setLoading(false); // Stop loading
        }
    };

    useEffect(() => {
        fetchDocInfo();
    }, [doctors, docId]);

    useEffect(() => {
        if (docInfo) {
            getAvailableSlots();
        }
    }, [docInfo]);

    return (
        docInfo && (
            <div className="min-h-screen py-1 sm:py-5 w-full overflow-x-hidden">
                <div className="w-full max-w-6xl mx-auto px-3 sm:px-4">
                    {/* Hero Section */}
                    <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg overflow-hidden">
                        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 sm:p-6 lg:p-8">
                            <div className="flex flex-col lg:flex-row gap-6 sm:gap-8 items-center">
                                {/* Doctor Image */}
                                <div className="relative shrink-0">
                                    <img
                                        className="w-40 h-40 sm:w-56 md:w-64 sm:h-56 md:h-64 object-cover rounded-xl sm:rounded-2xl shadow-lg"
                                        src={docInfo.image}
                                        alt={docInfo.name}
                                    />
                                    <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-blue-600 text-white px-3 sm:px-4 py-1 rounded-full text-xs sm:text-sm whitespace-nowrap">
                                        ⭐ {docInfo.experience}
                                    </div>
                                </div>

                                {/* Doctor Info */}
                                <div className="flex-1 text-center lg:text-left w-full">
                                    <div className="flex items-center justify-center lg:justify-start gap-2 mb-2">
                                        <Award className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 shrink-0" />
                                        <span className="text-xs sm:text-sm text-blue-600 font-medium">
                                            Top Rated Specialist
                                        </span>
                                    </div>

                                    <h1 className="text-xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-2 sm:mb-3 flex items-center justify-center lg:justify-start gap-2">
                                        <span className="truncate">{docInfo.name}</span>
                                        <img className="w-5 sm:w-6 shrink-0" src={assets.verified_icon} alt="Verified" />
                                    </h1>

                                    <div className="text-sm sm:text-base md:text-lg text-gray-600 mb-3 sm:mb-4">
                                        <span className="truncate block">
                                            {docInfo.degree} • {docInfo.speciality}
                                        </span>
                                    </div>

                                    <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2 sm:gap-4 mb-4 sm:mb-6">
                                        <div className="flex items-center gap-2 bg-blue-50 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg">
                                            <User className="w-4 h-4 text-blue-600 shrink-0" />
                                            <span className="text-sm text-blue-600 whitespace-nowrap">1000+ Patients</span>
                                        </div>
                                        <div className="flex items-center gap-2 bg-green-50 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg">
                                            <Star className="w-4 h-4 text-green-600 shrink-0" />
                                            <span className="text-sm text-green-600 whitespace-nowrap">4.9 Rating</span>
                                        </div>
                                    </div>

                                    <p className="text-sm sm:text-base text-gray-600 max-w-2xl">
                                        {docInfo.about}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Appointment Booking Section */}
                    <div className="mt-4 sm:mt-8 grid md:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
                        {/* Updated Appointment Type Selection */}
                        <div className="bg-white p-2 sm:p-6 rounded-lg sm:rounded-2xl shadow-lg w-full">
                            <h2 className="text-base sm:text-xl lg:text-2xl font-bold mb-2 sm:mb-6">Select Appointment Type</h2>

                            {/* First Step: Choose between Virtual and In-Person */}
                            <div className="grid grid-cols-2 gap-2 sm:gap-4 mb-4 sm:mb-6">
                                <button
                                    onClick={() => setInitialAppointmentType("virtual")}
                                    className={`p-2 sm:p-4 rounded-lg border-2 transition-all ${initialAppointmentType === "virtual"
                                            ? "border-blue-600 bg-blue-50"
                                            : "border-gray-200 hover:border-blue-300"
                                        }`}
                                >
                                    <Video
                                        className={`w-4 h-4 sm:w-6 sm:h-6 mb-1 sm:mb-2 mx-auto ${initialAppointmentType === "virtual"
                                                ? "text-blue-600"
                                                : "text-gray-400"
                                            }`}
                                    />
                                    <div
                                        className={`text-[10px] sm:text-sm font-medium ${initialAppointmentType === "virtual"
                                                ? "text-blue-600"
                                                : "text-gray-600"
                                            }`}
                                    >
                                        Virtual
                                    </div>
                                </button>
                                <button
                                    onClick={() => {
                                        setInitialAppointmentType("in-person");
                                        setAppointmentType("in-person");
                                    }}
                                    className={`p-2 sm:p-4 rounded-lg border-2 transition-all ${initialAppointmentType === "in-person"
                                            ? "border-blue-600 bg-blue-50"
                                            : "border-gray-200 hover:border-blue-300"
                                        }`}
                                >
                                    <User
                                        className={`w-4 h-4 sm:w-6 sm:h-6 mb-1 sm:mb-2 mx-auto ${initialAppointmentType === "in-person"
                                                ? "text-blue-600"
                                                : "text-gray-400"
                                            }`}
                                    />
                                    <div
                                        className={`text-[10px] sm:text-sm font-medium ${initialAppointmentType === "in-person"
                                                ? "text-blue-600"
                                                : "text-gray-600"
                                            }`}
                                    >
                                        In-Person
                                    </div>
                                </button>
                            </div>

                            {/* Second Step: Choose between Google Meet and MediMeet if Virtual is selected */}
                            {initialAppointmentType === "virtual" && (
                                <div className="grid grid-cols-2 gap-2 sm:gap-4">
                                    <button
                                        onClick={() => {
                                            setAppointmentType("virtual");
                                            setVirtualMeetingPlatform("Google Meet");
                                        }}
                                        className={`p-2 sm:p-4 rounded-lg border-2 transition-all ${appointmentType === "virtual" && virtualMeetingPlatform === "Google Meet"
                                                ? "border-blue-600 bg-blue-50"
                                                : "border-gray-200 hover:border-blue-300"
                                            }`}
                                    >
                                        <img
                                            src={GmeetIcon}
                                            alt="Google Meet"
                                            className="w-6 h-6 sm:w-8 sm:h-8 mb-1 sm:mb-2 mx-auto"
                                        />
                                        <div
                                            className={`text-[10px] sm:text-sm font-medium ${appointmentType === "virtual" && virtualMeetingPlatform === "Google Meet"
                                                    ? "text-blue-600"
                                                    : "text-gray-600"
                                                }`}
                                        >
                                            Google Meet
                                        </div>
                                        <div className="text-[8px] sm:text-xs text-gray-500 mt-0.5">
                                            {currencySymbol}
                                            {docInfo.fees}
                                        </div>
                                    </button>
                                    <button
                                        onClick={() => {
                                            setAppointmentType("virtual");
                                            setVirtualMeetingPlatform("MediMeet");
                                        }}
                                        className={`p-2 sm:p-4 rounded-lg border-2 transition-all ${appointmentType === "virtual" && virtualMeetingPlatform === "MediMeet"
                                                ? "border-blue-600 bg-blue-50"
                                                : "border-gray-200 hover:border-blue-300"
                                            }`}
                                    >
                                        <img
                                            src={medimeetIcon}
                                            alt="MediMeet"
                                            className="w-6 h-6 sm:w-8 sm:h-8 mb-1 sm:mb-2 mx-auto"
                                        />
                                        <div
                                            className={`text-[10px] sm:text-sm font-medium ${appointmentType === "virtual" && virtualMeetingPlatform === "MediMeet"
                                                    ? "text-blue-600"
                                                    : "text-gray-600"
                                                }`}
                                        >
                                            MediMeet
                                        </div>
                                        <div className="text-[8px] sm:text-xs text-gray-500 mt-0.5">
                                            {currencySymbol}
                                            {docInfo.fees}
                                        </div>
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Date & Time Selection */}
                        <div className="bg-white p-4 sm:p-6 rounded-xl sm:rounded-2xl shadow-lg">
                            <h2 className="text-lg sm:text-xl lg:text-2xl font-bold mb-4 sm:mb-6">Select Date & Time</h2>
                            <div className="space-y-4 sm:space-y-6">
                                {/* Date Selection - Horizontal Scrollable */}
                                <div className="flex gap-2 sm:gap-3 overflow-x-auto pb-2 scrollbar-hide -mx-1 px-1">
                                    {docSlots.length > 0 &&
                                        docSlots.map((item, index) => (
                                            <button
                                                onClick={() => setSlotIndex(index)}
                                                key={index}
                                                className={`flex-shrink-0 p-2 sm:p-3 lg:p-4 rounded-xl transition-all ${slotIndex === index
                                                        ? "bg-blue-600 text-white"
                                                        : "bg-gray-50 hover:bg-gray-100"
                                                    }`}
                                            >
                                                <div className="text-xs sm:text-sm font-medium whitespace-nowrap">
                                                    {item[0] && daysOfWeek[item[0].datetime.getDay()]}
                                                </div>
                                                <div className="text-lg sm:text-xl lg:text-2xl font-bold mt-0.5">
                                                    {item[0] && item[0].datetime.getDate()}
                                                </div>
                                            </button>
                                        ))}
                                </div>

                                {/* Time Selection Grid */}
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3">
                                    {docSlots.length > 0 &&
                                        docSlots[slotIndex].map((item, index) => (
                                            <button
                                                onClick={() => setSlotTime(item.time)}
                                                key={index}
                                                className={`p-2 sm:p-3 rounded-lg text-center transition-all ${item.time === slotTime
                                                        ? "bg-blue-600 text-white"
                                                        : "bg-gray-50 hover:bg-gray-100 text-gray-600"
                                                    }`}
                                            >
                                                <span className="text-sm whitespace-nowrap">
                                                    {item.displayTime.toLowerCase()}
                                                </span>
                                            </button>
                                        ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Loader */}
                    {loading && (
                        <div className="flex items-center justify-center mt-4">
                            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-indigo-600"></div>
                        </div>
                    )}

                    {/* Book Button */}
                    <div className="mt-10 sm:mt-8 text-center">
                        <button
                            onClick={bookAppointment}
                            className="w-full sm:w-auto bg-blue-600 text-white px-6 sm:px-8 lg:px-12 py-3 sm:py-4 rounded-xl text-base sm:text-base font-medium shadow-lg shadow-blue-600/25 hover:shadow-xl hover:shadow-blue-600/20 transition-all transform hover:-translate-y-0.5"
                        >
                            Book Appointment Now
                        </button>
                    </div>

                    {/* Related Doctors */}
                    <div className="mt-8 sm:mt-12 lg:mt-16">
                        <RelatedDoctors docId={docId} speciality={docInfo.speciality} />
                    </div>
                </div>
            </div>
        )
    );
};

export default Appointment;