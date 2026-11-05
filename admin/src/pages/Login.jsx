import axios from 'axios';
import React, { useContext, useState } from 'react'

import loginImage from '../assets/login_image.png'
import { LockKeyhole, Mail, User, Hospital } from 'lucide-react';
import { AdminContext } from '../context/AdminContext';
import { DoctorContext } from '../context/DoctorContext';
import { toast } from 'react-toastify';


function Login() {
    const [isInputFocused, setIsInputFocused] = useState({
        email: false,
        password: false
    });
    
    const [state, setState] = useState('Admin')
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');


    const {setAdminToken,backendUrl} = useContext(AdminContext)
    const {setDoctorToken} = useContext(DoctorContext)

    const onSubmitHandler = async (event) => {
        event.preventDefault();
    
        if (state === 'Admin') {
    
          const { data } = await axios.post(backendUrl + '/api/admin/login', { email, password })
          if (data.success) {
            setAdminToken(data.token)
            localStorage.setItem('adminToken', data.token)
          } else {
            toast.error(data.message)
          }
    
        } else {
    
          const { data } = await axios.post(backendUrl + '/api/doctor/login', { email, password })
          if (data.success) {
            setDoctorToken(data.token)
            localStorage.setItem('doctorToken', data.token)
          } else {
            toast.error(data.message)
          }
    
        }
    
      }
    

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
            <div className="container mx-auto min-h-screen flex items-center justify-center p-4 ">
                <div className="w-full max-w-5xl bg-cyan-100  rounded-2xl shadow-2xl flex flex-col md:flex-row overflow-hidden">
                    {/* Login Form */}
                    <div className="w-full md:w-1/2 p-6 sm:p-8 lg:p-12 order-2 md:order-1">
                        <form onSubmit={onSubmitHandler} className="space-y-6">
                            <div className="text-center mb-6 lg:mb-8">
                                <p className="text-gray-500 text-sm sm:text-base">Welcome to</p>
                                <h2 className="text-2xl sm:text-3xl font-bold text-primary mt-1">{state} Dashboard</h2>
                            </div>

                            <div className="space-y-4 sm:space-y-5">
                                <div className={`relative transition-all duration-300 ${isInputFocused.email ? 'scale-[1.02] sm:scale-105' : ''
                                    }`}>
                                    <label className="block text-gray-700 mb-2 font-medium text-sm sm:text-base">
                                        Email Address
                                    </label>
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none">
                                            <Mail className={`h-4 w-4 sm:h-5 sm:w-5 transition-colors duration-200 ${isInputFocused.email ? 'text-primary' : 'text-gray-400'
                                                }`} />
                                        </div>
                                        <input
                                            type="email"
                                            onChange={(e) => setEmail(e.target.value)}
                                            onFocus={() => setIsInputFocused(prev => ({ ...prev, email: true }))}
                                            onBlur={() => setIsInputFocused(prev => ({ ...prev, email: false }))}
                                            className="w-full pl-10 sm:pl-12 pr-4 py-2.5 sm:py-3 text-sm sm:text-base border-2 border-gray-200 rounded-xl focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200"
                                            placeholder="Enter your email"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className={`relative transition-all duration-300 ${isInputFocused.password ? 'scale-[1.02] sm:scale-105' : ''
                                    }`}>
                                    <label className="block text-gray-700 mb-2 font-medium text-sm sm:text-base">
                                        Password
                                    </label>
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none">
                                            <LockKeyhole className={`h-4 w-4 sm:h-5 sm:w-5 transition-colors duration-200 ${isInputFocused.password ? 'text-primary' : 'text-gray-400'
                                                }`} />
                                        </div>
                                        <input
                                            type="password"
                                            onChange={(e) => setPassword(e.target.value)}
                                            onFocus={() => setIsInputFocused(prev => ({ ...prev, password: true }))}
                                            onBlur={() => setIsInputFocused(prev => ({ ...prev, password: false }))}
                                            className="w-full pl-10 sm:pl-12 pr-4 py-2.5 sm:py-3 text-sm sm:text-base border-2 border-gray-200 rounded-xl focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200"
                                            placeholder="Enter your password"
                                            required
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="pt-2">
                                <button
                                    type="submit"
                                    className="w-full bg-gray-700 text-white py-3 sm:py-4 rounded-xl font-medium text-base sm:text-lg
                      shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40
                      transform hover:-translate-y-0.5 transition-all duration-200"
                                >
                                    Login
                                </button>
                            </div>

                            <div className="text-center mt-6">
                                <div className="relative">
                                    <div className="absolute inset-0 flex items-center">
                                        <div className="w-full border-t border-gray-200"></div>
                                    </div>
                                    <div className="relative flex justify-center">
                                        <span className=" px-4 text-xs sm:text-sm text-gray-500">or</span>
                                    </div>
                                </div>

                                <div className="mt-6">
                                    {state === 'Admin' ? (
                                        <button
                                            type="button"
                                            onClick={() => setState('Doctor')}
                                            className="text-primary hover:text-primary-dark font-medium text-sm sm:text-base inline-flex items-center gap-2
                          hover:underline underline-offset-10 transition-all duration-200"
                                        >
                                            <User className="h-3 w-3 sm:h-4 sm:w-4 " />
                                            Switch to Doctor Login
                                        </button>
                                    ) : (
                                        <button
                                            type="button"
                                            onClick={() => setState('Admin')}
                                            className="text-primary hover:text-primary-dark font-medium text-sm sm:text-base inline-flex items-center gap-2
                          hover:underline underline-offset-4 transition-all duration-200"
                                        >
                                            <User className="h-3 w-3 sm:h-4 sm:w-4" />
                                            Switch to Admin Login
                                        </button>
                                    )}
                                </div>
                            </div>
                        </form>
                    </div>

                    {/* Image Section */}
                    <div className="w-full md:w-1/2 order-1 md:order-2 ">
                        <div className="p-6 md:p-12 h-48 md:h-full">
                            <div className="h-full flex items-center justify-center">
                                <img
                                    src={loginImage}
                                    alt="Login"
                                    className="object-contain w-full h-full  "
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    )
}

export default Login