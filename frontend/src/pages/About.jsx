import React from "react";
import { assets } from "../assets/assets_frontend/assets";

const About = () => {
  return (
    <div>
      <div className=" text-3xl pt-10 text-gray-500 font-medium italic">
        <p>
          ABOUT US
        </p>
      </div>

      <div className="my-10 flex flex-col md:flex-row gap-12 justify-center">
        <img
          className="w-full md:max-w-[360px] rounded-3xl"
          src="https://esanjeevani.mohfw.gov.in/assets/images/slider/slider_img5.svg"
          alt=""
        />
        <div className="flex flex-col justify-center gap-6 md:w-2/4  text-gray-600">
          <p>
            Welcome to PharmLink, your trusted partner in managing your
            healthcare needs conveniently and efficiently. At PharmLink, we
            understand the challenges individuals face when it comes to
            scheduling doctor appointments and managing their health records.
          </p>
          <p>
            PharmLink is committed to excellence in healthcare technology. We
            continuously strive to enhance our platform, integrating the latest
            advancements to improve user experience and deliver superior
            service. Whether you're booking your first appointment or managing
            ongoing care, PharmLink is here to support you every step of the
            way.
          </p>
          <b className="text-gray-800">Our Vision</b>
          <p>
            Our vision at PharmLink is to create a seamless healthcare
            experience for every user. We aim to bridge the gap between patients
            and healthcare providers, making it easier for you to access the
            care you need, when you need it.
          </p>
        </div>
      </div>

      <div className="text-2xl my-10 mt-10 font-medium italic text-gray-500 ">
        <p >
          WHY CHOOSE US
        </p>
      </div>

      <div className="flex flex-col md:flex-row mb-20">
        <div className="border px-10 md:px-16 py-8 sm:py-16 flex flex-col gap-5 text-[15px] hover:bg-primary hover:text-white transition-all duration-300 text-gray-600 cursor-pointer">
          <b className="text-center text-lg">Efficience </b>
          <p>
            Streamlined appointment sceduling that fits into your busy
            lifestyle.
          </p>
        </div>
        <div className="border px-10 md:px-16 py-8 sm:py-16 flex flex-col gap-5 text-[15px] hover:bg-primary hover:text-white transition-all duration-300 text-gray-600 cursor-pointer">
          <b className="text-center text-lg">Convenience </b>
          <p>
            Access to a network of trusted healthcare professionals in your
            area.
          </p>
        </div>
        <div className="border px-10 md:px-16 py-8 sm:py-16 flex flex-col gap-5 text-[15px] hover:bg-primary hover:text-white transition-all duration-300 text-gray-600 cursor-pointer">
          <b className="text-center text-lg">Personalization  </b>
          <p>
            Tailored recommendations and remainders to help you stay on top of
            your health.
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;