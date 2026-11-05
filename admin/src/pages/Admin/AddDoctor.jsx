import React, { useContext, useState } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';
import { AdminContext } from '../../context/AdminContext';
import { User, Plus, Upload } from 'lucide-react';

function AddDoctor() {
  const [docImg, setDocImg] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [experience, setExperience] = useState('1 Year');
  const [fees, setFees] = useState('');
  const [about, setAbout] = useState('');
  const [speciality, setSpeciality] = useState('General physician');
  const [degree, setDegree] = useState('');
  const [address1, setAddress1] = useState('');
  const [address2, setAddress2] = useState('');

  const { backendUrl, adminToken } = useContext(AdminContext);

  const experienceOptions = [
    "1 Year", "2 Years", "3 Years", "4 Years", "5 Years",
    "6 Years", "8 Years", "9 Years", "10+ Years"
  ];

  const specialities = [
    "General physician", "Gynecologist", "Dermatologist",
    "Pediatricians", "Neurologist", "Gastroenterologist"
  ];

  const onSubmitHandler = async (event) => {
    event.preventDefault();

    try {
      if (!docImg) {
        return toast.error('Image Not Selected');
      }

      const formData = new FormData();
      formData.append('image', docImg);
      formData.append('name', name);
      formData.append('email', email);
      formData.append('password', password);
      formData.append('experience', experience);
      formData.append('fees', Number(fees));
      formData.append('about', about);
      formData.append('speciality', speciality);
      formData.append('degree', degree);
      formData.append('address', JSON.stringify({ line1: address1, line2: address2 }));

      const { data } = await axios.post(
        backendUrl + '/api/admin/add-doctor',
        formData,
        { headers: { adminToken } }
      );

      if (data.success) {
        toast.success(data.message);
        setDocImg(false);
        setName('');
        setPassword('');
        setEmail('');
        setAddress1('');
        setAddress2('');
        setDegree('');
        setAbout('');
        setFees('');
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
      console.log(error);
    }
  };

  return (
    <div className="h-screen w-full bg-gradient-to-br from-blue-50 via-white to-blue-50 p-4 sm:p-6 lg:p-4 overflow-auto">
      <form onSubmit={onSubmitHandler} className="">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100">
          {/* Header */}
          <div className="relative px-4 sm:px-6 lg:px-8 py-2 lg:py-8 border-b border-gray-200 bg-gradient-to-r from-blue-600 to-blue-700">
            <div className="absolute inset-0 bg-grid-white/[0.1] bg-[size:8px_8px] pointer-events-none"></div>
            <div className="relative max-w-7xl mx-auto">
              <h2 className="text-lg sm:text-2xl lg:text-3xl font-bold text-white text-center sm:text-left">
                Add New Doctor
              </h2>

              <p className="hidden sm:block mt-2 text-xs sm:text-sm lg:text-base text-blue-100">
                Fill in the details to register a new medical professional
              </p>

            </div>
          </div>

          <div className="p-6 sm:p-8 space-y-8">
            {/* Profile Image Upload */}
            <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-14 bg-gray-50 p-0 sm:p-6 rounded-xl">
              <label htmlFor="doc-img" className="cursor-pointer group">
                {docImg ? (
                  <div className="relative w-32 h-32">
                    <img
                      className="w-32 h-32 rounded-2xl object-cover border-4 border-blue-500 shadow-lg transition-all duration-300 group-hover:scale-105 group-hover:rotate-2"
                      src={URL.createObjectURL(docImg)}
                      alt="Doctor preview"
                    />
                    <div className="absolute inset-0 rounded-2xl bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center">
                      <Upload className="w-8 h-8 text-white" />
                    </div>
                  </div>
                ) : (
                  <div className="relative w-32 h-32 rounded-2xl bg-white border-4 border-dashed border-gray-300 flex items-center justify-center group-hover:border-blue-500 transition-all duration-300">
                    <User className="w-12 h-12 text-gray-400" />
                    <div className="absolute -bottom-2 -right-2 bg-blue-500 rounded-xl p-2 shadow-lg group-hover:scale-110 transition-transform">
                      <Plus className="w-5 h-5 text-white" />
                    </div>
                  </div>
                )}
              </label>
              <input
                onChange={(e) => setDocImg(e.target.files[0])}
                type="file"
                id="doc-img"
                className="hidden"
                accept="image/*"
              />
              <div className="text-center sm:text-left">
                <h3 className="text-lg font-semibold text-gray-800">Profile Picture</h3>
                <p className="hidden sm:block text-sm text-gray-600 mt-1">
                  Upload a professional photo (recommended size: 300x300)
                </p>
                <p className="text-xs text-gray-500 mt-2">Supported formats: JPG, PNG, SVG</p>
              </div>
            </div>


            {/* Form Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6">
              {/* Left Column */}
              <div className="space-y-6">
                <div className="space-y-2">
                  <label htmlFor="name" className="block text-sm font-semibold text-gray-700">
                    Full Name
                  </label>
                  <input
                    id="name"
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all duration-300 bg-white placeholder-gray-400"
                    placeholder="Dr. John Smith"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="email" className="block text-sm font-semibold text-gray-700">
                    Email Address
                  </label>
                  <input
                    id="email"
                    type="email"
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all duration-300 bg-white placeholder-gray-400"
                    placeholder="doctor@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="password" className="block text-sm font-semibold text-gray-700">
                    Password
                  </label>
                  <input
                    id="password"
                    type="password"
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all duration-300 bg-white"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="experience" className="block text-sm font-semibold text-gray-700">
                    Years of Experience
                  </label>
                  <select
                    value={experience}
                    onChange={(e) => setExperience(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all duration-300 bg-white"
                  >
                    {experienceOptions.map((year) => (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label htmlFor="fees" className="block text-sm font-semibold text-gray-700">
                    Consultation Fees
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500">₹</span>
                    <input
                      id="fees"
                      type="number"
                      className="w-full pl-8 pr-4 py-3 rounded-xl border border-gray-300 focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all duration-300 bg-white placeholder-gray-400"
                      placeholder="Enter amount"
                      value={fees}
                      onChange={(e) => setFees(e.target.value)}
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                <div className="space-y-2">
                  <label htmlFor="speciality" className="block text-sm font-semibold text-gray-700">
                    Specialization
                  </label>
                  <select
                    value={speciality}
                    onChange={(e) => setSpeciality(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all duration-300 bg-white"
                  >
                    {specialities.map((spec) => (
                      <option key={spec} value={spec}>
                        {spec}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label htmlFor="degree" className="block text-sm font-semibold text-gray-700">
                    Medical Degree
                  </label>
                  <input
                    id="degree"
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all duration-300 bg-white placeholder-gray-400"
                    placeholder="e.g., MBBS, MD"
                    value={degree}
                    onChange={(e) => setDegree(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="address1" className="block text-sm font-semibold text-gray-700">
                    Primary Address
                  </label>
                  <input
                    id="address1"
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all duration-300 bg-white placeholder-gray-400"
                    placeholder="Street address"
                    value={address1}
                    onChange={(e) => setAddress1(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="address2" className="block text-sm font-semibold text-gray-700">
                    Secondary Address
                  </label>
                  <input
                    id="address2"
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all duration-300 bg-white placeholder-gray-400"
                    placeholder="Suite, floor, etc."
                    value={address2}
                    onChange={(e) => setAddress2(e.target.value)}
                    required
                  />
                </div>
              </div>
            </div>

            {/* About Section */}
            <div className="space-y-2">
              <label htmlFor="about" className="block text-sm font-semibold text-gray-700">
                About Doctor
              </label>
              <textarea
                id="about"
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all duration-300 min-h-40 resize-y bg-white placeholder-gray-400"
                placeholder="Write a brief professional summary..."
                value={about}
                onChange={(e) => setAbout(e.target.value)}
                required
              />
            </div>

            {/* Submit Button */}
            <div className="flex justify-end pt-6">
              <button
                type="submit"
                className="px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 focus:ring-4 focus:ring-blue-200 transition-all duration-300 font-semibold text-lg shadow-lg hover:shadow-xl flex items-center gap-2 hover:-translate-y-0.5"
              >
                Add Doctor
                <Plus className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

export default AddDoctor;
