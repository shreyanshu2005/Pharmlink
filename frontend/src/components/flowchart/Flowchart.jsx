import React, { useState } from 'react';
import { User, LogIn, Users, Stethoscope, CheckCircle2, ChevronRight } from 'lucide-react';

const Flowchart = () => {
  const [activeStep, setActiveStep] = useState(null);

  const steps = [
    {
      number: 1,
      title: "Sign up",
      color: "bg-purple-600",
      lightColor: "bg-purple-50",
      hoverColor: "group-hover:bg-purple-700",
      borderColor: "border-purple-200",
      textColor: "group-hover:text-purple-700",
      icon: User,
      items: [
        "Sign Up using Google or details",
        "Go to MyProfile and add patient details"
      ]
    },
    {
      number: 2,
      title: "Login",
      color: "bg-orange-500",
      lightColor: "bg-orange-50",
      hoverColor: "group-hover:bg-orange-600",
      borderColor: "border-orange-200",
      textColor: "group-hover:text-orange-600",
      icon: LogIn,
      items: [
        "Login with details or Google",
        "Select the speciality according to the disease"
      ]
    },
    {
      number: 3,
      title: "Select Doctor",
      color: "bg-blue-800",
      lightColor: "bg-blue-50",
      hoverColor: "group-hover:bg-blue-900",
      borderColor: "border-blue-200",
      textColor: "group-hover:text-blue-900",
      icon: Users,
      items: [
        "Select Doctor",
        "Choose time slot and mode of consultation",
        "Complete Payment"
      ]
    },
    {
      number: 4,
      title: "Tele-consult",
      color: "bg-green-700",
      lightColor: "bg-green-50",
      hoverColor: "group-hover:bg-green-800",
      borderColor: "border-green-200",
      textColor: "group-hover:text-green-700",
      icon: Stethoscope,
      items: [
        "Meeting will be scheduled at selected time slot",
        "Check E-mail for meeting details"
      ]
    }
  ];

  return (
    <div className="w-full mx-auto p-4 md:p-0">
      <div className="rounded-2xl p-4 md:p-8">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4 text-center">
          Teleconsultation Process Flow
        </h2>
        <div className="w-16 sm:w-20 md:w-24 h-1 bg-blue-500 mx-auto mb-4 rounded-full"></div>
        <p className="text-gray-600 text-sm sm:text-base md:text-lg text-center px-4 md:px-0">
          Follow these steps to complete your teleconsultation
        </p>
        
        <div className="relative flex flex-col md:flex-row justify-between items-center md:items-start gap-8 md:gap-4 mt-12">
          {steps.map((step, index) => (
            <div 
              key={step.number} 
              className="relative w-full md:flex-1 group"
              onMouseEnter={() => setActiveStep(index)}
              onMouseLeave={() => setActiveStep(null)}
            >
              {/* Connecting Lines - Vertical for mobile, Horizontal for desktop */}
              {index < steps.length - 1 && (
                <>
                  {/* Mobile vertical line */}
                  <div className="absolute left-1/2 top-[95%] h-8 w-1 md:hidden">
                    <div className="h-full bg-gradient-to-b from-gray-200 to-gray-300 rounded-full" />
                    <div className={`absolute top-0 left-0 w-full ${step.color} rounded-full transition-all duration-500`} 
                         style={{ height: activeStep > index ? '100%' : '0%' }} />
                  </div>
                  {/* Desktop horizontal line */}
                  <div className="hidden md:block absolute top-8 left-[60%] w-[80%] h-1">
                    <div className="h-full bg-gradient-to-r from-gray-200 to-gray-300 rounded-full" />
                    <div className={`absolute top-0 left-0 h-full ${step.color} rounded-full transition-all duration-500`} 
                         style={{ width: activeStep > index ? '100%' : '0%' }} />
                  </div>
                </>
              )}
              
              {/* Step Container */}
              <div className={`relative z-10 flex flex-col items-center transition-all duration-300 transform
                ${activeStep === index ? 'scale-105' : 'scale-100'}`}>
                
                {/* Circle with Number and Icon - Updated with smaller sizes for all screens */}
                <div className={`w-12 h-12 sm:w-16 sm:h-16 md:w-16 md:h-16 ${step.color} rounded-full flex flex-col items-center justify-center text-white
                  shadow-lg transition-all duration-300 ${step.hoverColor} relative overflow-hidden`}>
                  <div className={`absolute inset-0 ${step.lightColor} opacity-0 group-hover:opacity-20 transition-opacity duration-300`} />
                  <step.icon className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 mb-0.5" />
                  <span className="text-sm sm:text-base md:text-lg font-bold">{step.number}</span>
                  
                  {/* Completion indicator */}
                  {activeStep > index && (
                    <div className="absolute inset-0 bg-opacity-90 flex items-center justify-center">
                      <CheckCircle2 className="w-4 h-4 sm:w-6 sm:h-6 md:w-6 md:h-6 text-white" />
                    </div>
                  )}
                </div>
                
                {/* Title Box */}
                <div className="mt-3 sm:mt-4 w-full max-w-[250px]">
                  <div className={`${step.color} text-white px-3 sm:px-4 md:px-4 py-1.5 sm:py-2 md:py-2 rounded-xl shadow-md text-center font-semibold text-sm sm:text-base
                    transition-all duration-300 ${step.hoverColor} relative overflow-hidden`}>
                    <div className={`absolute inset-0 ${step.lightColor} opacity-0 group-hover:opacity-20 transition-opacity duration-300`} />
                    {step.title}
                  </div>
                  
                  {/* Items Card */}
                  <div className={`mt-3 sm:mt-4 md:mt-4 bg-white rounded-xl p-3 sm:p-4 md:p-4 shadow-lg border ${step.borderColor}
                    transform transition-all duration-300 ${activeStep === index ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-90'}`}>
                    <ul className="space-y-2 sm:space-y-3 md:space-y-3">
                      {step.items.map((item, i) => (
                        <li key={i} className="flex items-start group/item">
                          <ChevronRight className={`w-3 h-3 sm:w-4 sm:h-4 md:w-4 md:h-4 mr-1.5 sm:mr-2 mt-0.5 transition-all duration-300 ${step.textColor}`} />
                          <span className={`text-xs sm:text-sm text-gray-600 transition-all duration-300 ${step.textColor}`}>
                            {item}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Flowchart;