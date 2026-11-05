import React, { useContext } from 'react'
import { AdminContext } from '../context/AdminContext'
import LogoImage from '../assets/PharmLink logo.png'
import { useNavigate } from 'react-router-dom'
import { LogOut } from 'lucide-react';
import { DoctorContext } from '../context/DoctorContext'
function Navbar() {
    const { adminToken, setAdminToken } = useContext(AdminContext)
    const { doctorToken, setDoctorToken } = useContext(DoctorContext)
    const navigate = useNavigate()

    const logout = () => {
        navigate('/')
        adminToken && setAdminToken('')
        adminToken && localStorage.removeItem('adminToken')
        doctorToken && setDoctorToken('')
        doctorToken && localStorage.removeItem('doctorToken')
    }

    return (
        <div className='flex justify-between items-center px-4 sm:px-10 py-3 border-b bg-white shadow-md'>
            <div className='flex items-center gap-3 text-xs'>
                <img onClick={() => navigate('/')} className='w-36 sm:w-40 cursor-pointer transition-transform ' src={LogoImage} alt="Logo" />
                <p className='border px-3 py-1 rounded-full bg-gradient-to-r from-blue-500 to-[#5CE1E6] text-white font-semibold tracking-wide'>
                    {adminToken ? 'Admin' : 'Doctor'}
                </p>
            </div>
            <button
                onClick={() => logout()}
                className='bg-gradient-to-r from-blue-500 to-purple-500 hover:from-purple-500 hover:to-blue-500 text-white text-sm px-6 sm:px-10 py-2 rounded-full shadow-lg transform transition-transform hover:scale-103 focus:outline-none focus:ring-2 focus:ring-purple-400'
            >
                <LogOut className="w-5 h-5" />
            </button>
        </div>
    )
}

export default Navbar