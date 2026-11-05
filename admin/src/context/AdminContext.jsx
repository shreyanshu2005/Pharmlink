import { createContext, useState, useEffect } from "react";
import axios from "axios";
import { toast } from 'react-toastify';

export const AdminContext = createContext();

const AdminContextProvider = (props) => {
    const [adminToken, setAdminToken] = useState(localStorage.getItem('adminToken') || '');
    const [doctors, setDoctors] = useState([]);
    const [appointments, setAppointments] = useState([]);
    const [dashData, setDashData] = useState(false);

    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    // Create axios instance with default config
    const api = axios.create({
        baseURL: backendUrl,
        headers: {
            'Content-Type': 'application/json'
        }
    });

    // Update axios headers when adminToken changes
    useEffect(() => {
        if (adminToken) {
            api.defaults.headers.common['admintoken'] = adminToken;
        } else {
            delete api.defaults.headers.common['admintoken'];
        }
    }, [adminToken]);

    // Getting all Doctors data from Database using API
    const getAllDoctors = async () => {

        try {

            const { data } = await axios.get(backendUrl + '/api/admin/all-doctors', { headers: { admintoken: adminToken }  })
            if (data.success) {
                setDoctors(data.doctors)
            } else {
                toast.error(data.message)
            }

        } catch (error) {
            toast.error(error.message)
        }

    }

    // Function to change doctor availablity using API
    const changeAvailability = async (docId) => {
        try {

            const { data } = await axios.post(backendUrl + '/api/admin/change-availability', { docId }, { headers: { admintoken: adminToken }  })
            if (data.success) {
                toast.success(data.message)
                getAllDoctors()
            } else {
                toast.error(data.message)
            }

        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    }

    // Getting all appointment data from Database using API
    const getAllAppointments = async () => {

        try {

            const { data } = await axios.get(backendUrl + '/api/admin/appointments', { headers: { admintoken: adminToken }  })
            if (data.success) {
                setAppointments(data.appointments.reverse())
            } else {
                toast.error(data.message)
            }

        } catch (error) {
            toast.error(error.message)
            console.log(error)
        }

    }
// Function to cancel appointment using API
const cancelAppointment = async (appointmentId) => {

    try {

        const { data } = await axios.post(backendUrl + '/api/admin/cancel-appointment', { appointmentId }, { headers: { admintoken: adminToken } })

        if (data.success) {
            toast.success(data.message)
            getAllAppointments()
        } else {
            toast.error(data.message)
        }

    } catch (error) {
        toast.error(error.message)
        console.log(error)
    }

}

    // Getting Admin Dashboard data from Database using API
    const getDashData = async () => {
        try {

            const { data } = await axios.get(backendUrl + '/api/admin/dashboard', { headers: { admintoken: adminToken }  })

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
        adminToken,
        setAdminToken,
        backendUrl,
        getAllDoctors,
        doctors,
        changeAvailability,
        getAllAppointments,
        appointments,
        cancelAppointment,
        getDashData,
        dashData
    };

    return (
        <AdminContext.Provider value={value}>
            {props.children}
        </AdminContext.Provider>
    );
};

export default AdminContextProvider;