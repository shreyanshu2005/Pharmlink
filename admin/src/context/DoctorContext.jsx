import { createContext, useState } from "react";
import axios from 'axios'
import { toast } from 'react-toastify'

export const DoctorContext = createContext();

const DoctorContextProvider = (props) => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL

    const [doctorToken, setDoctorToken] = useState(localStorage.getItem('doctorToken') ? localStorage.getItem('doctorToken') : '')
    const [appointments, setAppointments] = useState([])

    const [dashData, setDashData] = useState(false)
    const [profileData, setProfileData] = useState(false)


    const getAppointments = async () => {
        try {
            if (!doctorToken) {
                toast.error("Please login first")
                return
            }
    
            const { data } = await axios.get(`${backendUrl}/api/doctor/appointments`, { 
                headers: { 
                    doctorToken: doctorToken 
                }
            })
    
            if (data.success) {
                setAppointments(data.appointments.reverse())
            } else {
                toast.error(data.message)
                // If token is invalid, clear it
                if (data.message === "Invalid token") {
                    localStorage.removeItem('doctorToken')
                    setDoctorToken('')
                }
            }
    
        } catch (error) {
            console.log(error)
            if (error.response?.status === 401) {
                toast.error("Session expired. Please login again")
                localStorage.removeItem('doctorToken')
                setDoctorToken('')
            } else {
                toast.error(error.message || "Error fetching appointments")
            }
        }
    }

     // Getting Doctor profile data from Database using API
     const getProfileData = async () => {
        try {

            const { data } = await axios.get(backendUrl + '/api/doctor/profile', { headers: { doctorToken } })
            console.log(data.profileData)
            setProfileData(data.profileData)

        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    }

    // Function to cancel doctor appointment using API
    const cancelAppointment = async (appointment,docId) => {

        try {

            const { data } = await axios.post(backendUrl + '/api/doctor/cancel-appointment', { appointmentId }, { headers: { doctorToken } })

            if (data.success) {
                toast.success(data.message)
                getAppointments()
                // after creating dashboard
                getDashData()
            } else {
                toast.error(data.message)
            }

        } catch (error) {
            toast.error(error.message)
            console.log(error)
        }

    }

    // Function to Mark appointment completed using API
    const completeAppointment = async (appointmentId,docId) => {

        try {

            const { data } = await axios.post(backendUrl + '/api/doctor/complete-appointment', { appointmentId }, { headers: { doctorToken } })

            if (data.success) {
                toast.success(data.message)
                getAppointments()
                // Later after creating getDashData Function
                getDashData()   
            } else {
                toast.error(data.message)
            }

        } catch (error) {
            toast.error(error.message)
            console.log(error)
        }

    }

    // Getting Doctor dashboard data using API
    const getDashData = async () => {
        try {

            const { data } = await axios.get(backendUrl + '/api/doctor/dashboard', { headers: { doctorToken } })

            if (data.success) {
                setDashData(data.dashData)
            } else {
                toast.error(data.message)
            }

        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }

    }


    const value = {
        doctorToken, setDoctorToken,backendUrl,appointments, setAppointments,getAppointments, dashData, getDashData,
        profileData, setProfileData,
        getProfileData, cancelAppointment,
        completeAppointment,
    }

    return (
        <DoctorContext.Provider value={value}>
            {props.children}
        </DoctorContext.Provider>
    )

}

export default DoctorContextProvider;