import React, { useContext } from 'react'
import { AdminContext } from '../context/AdminContext'
import { NavLink } from 'react-router-dom'
import { Home, Calendar, UserPlus, Users,UserRoundPen  } from 'lucide-react';
import { DoctorContext } from '../context/DoctorContext';

function Sidebar() {
  const { adminToken } = useContext(AdminContext)
  const {doctorToken} = useContext(DoctorContext)

  const navLinkStyles = ({ isActive }) =>
    `flex items-center gap-4 py-3 px-4 md:px-6 w-full text-sm font-medium 
     rounded-lg transition-all duration-300 cursor-pointer 
     ${isActive ? 'bg-blue-100 border-r-4 border-blue-500 text-blue-700' : 'hover:bg-gray-200 text-gray-800'}`;

  return (


    <div>

      {
        adminToken && <ul >
          <nav className="bg-slate-200 w-full md:w-72 h-screen p-0 shadow-md pt-5 rounded">
            <div className="space-y-1 ">
              <NavLink to={'/admin-dashboard'} className={navLinkStyles}>
                <Home className="w-5 h-5" />
                <span className="hidden md:block">Dashboard</span>
              </NavLink>
              <NavLink to={'/all-appointments'} className={navLinkStyles}>
                <Calendar className="w-5 h-5" />
                <span className="hidden md:block">Appointments</span>
              </NavLink>
              <NavLink to={'/add-doctor'} className={navLinkStyles}>
                <UserPlus className="w-5 h-5" />
                <span className="hidden md:block">Add Doctor</span>
              </NavLink>
              <NavLink to={'/doctor-list'} className={navLinkStyles}>
                <Users className="w-5 h-5" />
                <span className="hidden md:block">Doctors List</span>
              </NavLink>
            </div>
          </nav>
        </ul>
      }
      {
        doctorToken && <ul >
          <nav className="bg-slate-200 w-full md:w-72 h-screen p-0 shadow-md pt-5 rounded">
            <div className="space-y-1 ">
              <NavLink to={'/doctor-dashboard'} className={navLinkStyles}>
                <Home className="w-5 h-5" />
                <span className="hidden md:block">Dashboard</span>
              </NavLink>
              <NavLink to={'/doctor-appointments'} className={navLinkStyles}>
                <Calendar className="w-5 h-5" />
                <span className="hidden md:block">Appointments</span>
              </NavLink>
              
              <NavLink to={'/doctor-profile'} className={navLinkStyles}>
                <UserRoundPen  className="w-5 h-5" />
                <span className="hidden md:block">Profile</span>
              </NavLink>
            </div>
          </nav>
        </ul>
      }

    </div>

  )
}

export default Sidebar