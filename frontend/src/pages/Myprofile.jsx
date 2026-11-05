import React, { useContext, useState } from "react";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Edit2,
  Save,
  Camera,
  X,
} from "lucide-react";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";
import userImg from '../assets/assets_frontend/user-img.png';

const ProfilePage = () => {
  const [isEdit, setIsEdit] = useState(false);
  const [image, setImage] = useState(null);
  const [tempUserData, setTempUserData] = useState(null);
  const [imgError, setImgError] = useState(false);

  const { token, backendUrl, userData, setUserData, loadUserProfileData } =
    useContext(AppContext);

  const handleImageError = () => {
    setImgError(true);
  };

  const enterEditMode = () => {
    setTempUserData({ ...userData });
    setIsEdit(true);
    setImgError(false);
  };

  const cancelEdit = () => {
    setUserData(tempUserData);
    setIsEdit(false);
    setImage(null);
    setImgError(false);
  };

  const updateUserProfileData = async () => {
    try {
      const formData = new FormData();
      formData.append("name", userData.name);
      formData.append("phone", userData.phone);
      formData.append("address", JSON.stringify(userData.address));
      formData.append("gender", userData.gender);
      formData.append("dob", userData.dob);

      if (image) {
        formData.append("image", image);
      }

      const { data } = await axios.post(
        backendUrl + "/api/user/update-profile",
        formData,
        { headers: { token } }
      );

      if (data.success) {
        toast.success(data.message);
        await loadUserProfileData();
        setIsEdit(false);
        setImage(null);
        setImgError(false);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    }
  };

  if (!userData) return null;

  const getDisplayImage = () => {
    if (image) {
      return URL.createObjectURL(image);
    }
    if (!imgError && userData?.image) {
      return userData.image;
    }
    return userImg;
  };

  return (
    <div className="min-h-screen py-2 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden">
        <div
          className="p-2 md:p-6"
          style={{
            background:
              "linear-gradient(to left, #5AE2E9, rgba(90, 226, 233, 0))",
          }}
        >
          <div className="flex flex-col md:flex-row items-center space-y-6 md:space-y-0 md:space-x-8">
            <div className="relative group w-32 h-32 md:w-40 md:h-40">
              {isEdit ? (
                <label className="cursor-pointer block w-full h-full">
                  <div className="relative w-full h-full">
                    <img
                      src={getDisplayImage()}
                      alt="Profile"
                      onError={handleImageError}
                      className="w-full h-full rounded-full object-cover border-4 border-white shadow-md transition-all"
                    />
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black bg-opacity-50 rounded-full">
                      <Camera className="text-white w-12 h-12 md:w-16 md:h-16" />
                    </div>
                  </div>
                  <input
                    type="file"
                    className="hidden"
                    onChange={(e) => {
                      setImage(e.target.files[0]);
                      setImgError(false);
                    }}
                    accept="image/*"
                  />
                </label>
              ) : (
                <img
                  src={getDisplayImage()}
                  alt="Profile"
                  onError={handleImageError}
                  className="w-full h-full rounded-full object-cover border-4 border-white shadow-md"
                />
              )}
            </div>

            <div className="text-center md:text-left text-black">
              {isEdit ? (
                <input
                  type="text"
                  value={userData.name}
                  onChange={(e) =>
                    setUserData((prev) => ({ ...prev, name: e.target.value }))
                  }
                  className="text-2xl md:text-4xl font-bold bg-transparent border-b-2 border-grey focus:outline-none text-black w-full text-center md:text-left capitalize"
                />
              ) : (
                <h2 className="text-2xl md:text-4xl font-bold capitalize -mt-2">
                  {userData.name}
                </h2>
              )}
              <p className="text-base md:text-lg opacity-80 mt-2 truncate">
                {userData.email}
              </p>
            </div>
          </div>
        </div>

        <div className="p-6 md:p-8 space-y-8">
          <div>
            <h3 className="text-lg md:text-2xl font-semibold text-indigo-600 border-b-2 border-indigo-600 pb-2 mb-4 text-center">
              Contact Information
            </h3>
            <div className="space-y-6">
              <ProfileField
                icon={<Mail className="text-indigo-500 w-5 h-5" />}
                label="Email"
                value={userData.email}
              />
              <ProfileField
                icon={<Phone className="text-indigo-500 w-5 h-5" />}
                label="Phone"
                isEditable={isEdit}
                value={userData.phone}
                onChange={(e) =>
                  setUserData((prev) => ({
                    ...prev,
                    phone: e.target.value,
                  }))
                }
              />
              <ProfileField
                icon={<MapPin className="text-indigo-500 w-5 h-5" />}
                label="Address"
                isEditable={isEdit}
                value={`${userData.address.line1}, ${userData.address.line2}`}
                onChange={(e) => {
                  const [line1, line2] = e.target.value.split(",");
                  setUserData((prev) => ({
                    ...prev,
                    address: {
                      line1: line1.trim(),
                      line2: line2 ? line2.trim() : "",
                    },
                  }));
                }}
              />
            </div>
          </div>

          <div>
            <h3 className="text-lg md:text-2xl font-semibold text-indigo-600 border-b-2 border-indigo-600 pb-2 mb-4 text-center">
              Personal Details
            </h3>
            <div className="space-y-4">
              <ProfileField
                icon={<User className="text-indigo-500 w-5 h-5" />}
                label="Gender"
                isEditable={isEdit}
                value={userData.gender}
                renderEdit={() => (
                  <select
                    value={userData.gender}
                    onChange={(e) =>
                      setUserData((prev) => ({
                        ...prev,
                        gender: e.target.value,
                      }))
                    }
                    className="w-full border-2 border-indigo-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 text-sm"
                  >
                    <option value="Not Selected">Not Selected</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                )}
              />
              <ProfileField
                icon={<Calendar className="text-indigo-500 w-5 h-5" />}
                label="Birthday"
                isEditable={isEdit}
                value={userData.dob}
                renderEdit={() => (
                  <input
                    type="date"
                    value={userData.dob}
                    onChange={(e) =>
                      setUserData((prev) => ({
                        ...prev,
                        dob: e.target.value,
                      }))
                    }
                    className="w-full border-2 border-indigo-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 text-sm"
                  />
                )}
              />
            </div>
          </div>
        </div>

        <div className="p-6 md:p-8 border-t border-gray-200 flex flex-col-reverse sm:flex-row justify-end space-y-4 sm:space-y-0 sm:space-x-4">
          {isEdit ? (
            <>
              <button
                onClick={cancelEdit}
                className="w-full sm:w-auto px-6 py-2 border-2 border-gray-300 text-gray-600 rounded-full hover:bg-gray-100 transition-colors flex items-center justify-center gap-2"
              >
                <X size={20} /> Cancel
              </button>
              <button
                onClick={updateUserProfileData}
                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-indigo-600 text-white px-6 py-2 rounded-full hover:bg-indigo-700 shadow-md transition-colors"
              >
                <Save size={20} /> Save Changes
              </button>
            </>
          ) : (
            <button
              onClick={enterEditMode}
              className="w-full sm:w-auto flex items-center justify-center gap-2 text-black px-6 py-2 rounded-full hover:bg-cyan-200 shadow-md transition-colors bg-cyan-300"
            >
              <Edit2 size={20} /> Edit Profile
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

const ProfileField = ({
  icon,
  label,
  value,
  isEditable = false,
  onChange,
  renderEdit,
}) => {
  return (
    <div className="flex items-center space-x-4">
      {icon}
      <div className="flex-1">
        <p className="text-sm font-semibold text-gray-600">{label}</p>
        {isEditable && renderEdit ? (
          renderEdit()
        ) : isEditable ? (
          <input
            type="text"
            value={value}
            onChange={onChange}
            className="w-full border-2 border-indigo-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 text-sm"
          />
        ) : (
          <p className="text-base text-gray-900">{value}</p>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;