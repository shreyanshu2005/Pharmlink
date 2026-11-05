import React, { useState } from 'react';
import { Mail, Phone, MapPin, Clock, Send, AlertCircle, Loader2 } from 'lucide-react';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: '', message: '' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: '', message: '' });

    try {
      const response = await fetch('/api/contact/send-message', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });
      
      const data = await response.json();
      
      if (data.success) {
        setStatus({
          type: 'success',
          message: 'Thank you for your message! We will get back to you soon.'
        });
        setFormData({ name: '', email: '', subject: '', message: '' });
      } else {
        throw new Error(data.message || 'Failed to send message');
      }
    } catch (error) {
      setStatus({
        type: 'error',
        message: 'Something went wrong. Please try again later.'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br -mt-5">
      {/* Hero Section with enhanced gradient */}
     

      <div className="container mx-auto px-6 py-16">
        <div className="grid lg:grid-cols-3 gap-10">
          {/* Contact Information */}
          <div className="lg:col-span-1 space-y-8">
            {/* Contact Card */}
            <div className="bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-shadow duration-300">
              <div className="p-8">
                <div className="space-y-8">
                  <ContactItem
                    icon={<Mail className="w-6 h-6 text-blue-600" />}
                    title="Email Us"
                    content={
                      <a href="mailto:support@pharmlink.example" 
                         className="text-blue-600 hover:text-blue-700 transition-colors break-all hover:underline">
                        support@pharmlink.example
                      </a>
                    }
                  />

                  <ContactItem
                    icon={<Phone className="w-6 h-6 text-blue-600" />}
                    title="Call Us"
                    content={
                      <div className="space-y-1">
                        <a href="tel:+918057037479" className="text-gray-700 font-medium hover:text-blue-600 transition-colors">+91 8057037479</a>
                        <p className="text-sm text-gray-500">Available Mon-Fri, 9AM-6PM</p>
                      </div>
                    }
                  />

                  <ContactItem
                    icon={<MapPin className="w-6 h-6 text-blue-600" />}
                    title="Visit Us"
                    content={
                      <address className="text-gray-700 not-italic">
                        Bhopal<br />
                        Madhya Pradesh
                      </address>
                    }
                  />

                  
                </div>
              </div>
            </div>

            {/* Help Card */}
            <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl shadow-xl p-6 text-white">
              <div className="flex gap-4 items-start">
                <div className="bg-white/20 p-3 rounded-lg backdrop-blur-sm">
                  <AlertCircle className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Need Immediate Help?</h3>
                  <p className="text-blue-100">
                    Our support team is available during business hours for urgent assistance.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-shadow duration-300">
              <div className="p-8 md:p-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Send us a Message</h2>
                <p className="text-gray-600 mb-8 text-lg">Fill out the form below and we'll get back to you shortly.</p>

                {status.message && (
                  <div className={`mb-8 p-4 rounded-xl ${
                    status.type === 'success' 
                      ? 'bg-green-50 text-green-700 border border-green-200' 
                      : 'bg-red-50 text-red-700 border border-red-200'
                  }`}>
                    {status.message}
                  </div>
                )}
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <FormInput
                      label="Full Name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="John Doe"
                      required
                    />
                    <FormInput
                      label="Email Address"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="john@example.com"
                      required
                    />
                  </div>

                  <FormInput
                    label="Subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="How can we help you?"
                    required
                  />

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Message
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      rows="6"
                      required
                      placeholder="Tell us more about your inquiry..."
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition-all placeholder:text-gray-400"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 px-6 rounded-xl hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 flex items-center justify-center gap-2 transition-all text-lg font-medium"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        Send Message
                        <Send className="w-5 h-5" />
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ContactItem = ({ icon, title, content }) => (
  <div className="group flex gap-4 items-start">
    <div className="bg-blue-50 p-3 rounded-xl group-hover:bg-blue-100 transition-colors">
      {icon}
    </div>
    <div>
      <h3 className="font-semibold text-gray-900 mb-2 text-lg">{title}</h3>
      {content}
    </div>
  </div>
);

const FormInput = ({ label, ...props }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-2">
      {label}
    </label>
    <input
      {...props}
      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder:text-gray-400"
    />
  </div>
);

export default Contact;