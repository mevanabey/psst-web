"use client"

import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

// Add validation types
interface ValidationErrors {
  [key: string]: string;
}

interface FormDataType {
  name: string;
  email: string;
  phone: string;
  message: string;
  [key: string]: string;
}

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [touched, setTouched] = useState<{ [key: string]: boolean }>({});
  const [formData, setFormData] = useState<FormDataType>({
    name: "",
    email: "",
    phone: "",
    message: ""
  });

  // Force a refresh on initial load to ensure layout consistency
  useEffect(() => {
    // This helps ensure the layout is consistently applied
    const timer = setTimeout(() => {
      document.body.style.opacity = "1";
    }, 50);
    
    return () => clearTimeout(timer);
  }, []);

  // Validate a field
  const validateField = (fieldId: string, value: string): string => {
    switch (fieldId) {
      case 'name':
        return value === '' ? 'Name is required' : '';
      case 'email':
        return value === '' 
          ? 'Email is required' 
          : !/^\S+@\S+\.\S+$/.test(value) 
            ? 'Please enter a valid email address' 
            : '';
      case 'phone':
        return value !== '' && !/^[0-9+\s()-]{7,}$/.test(value)
          ? 'Please enter a valid phone number'
          : '';
      case 'message':
        return value === '' ? 'Message is required' : '';
      default:
        return '';
    }
  };

  // Handler for input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
    
    // If field has been touched, validate in real-time
    if (touched[id]) {
      const errorMessage = validateField(id, value);
      setErrors(prev => ({
        ...prev,
        [id]: errorMessage
      }));
    }
  };

  // Handler for field blur
  const handleBlur = (fieldId: string) => {
    setTouched(prev => ({ ...prev, [fieldId]: true }));
    
    // Validate the field on blur
    const value = formData[fieldId];
    const errorMessage = validateField(fieldId, value);
    setErrors(prev => ({
      ...prev,
      [fieldId]: errorMessage
    }));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate all fields before submitting
    let hasErrors = false;
    const newErrors: ValidationErrors = {};
    const newTouched: { [key: string]: boolean } = {};
    
    // Validate each field
    Object.keys(formData).forEach(fieldId => {
      newTouched[fieldId] = true;
      const error = validateField(fieldId, formData[fieldId]);
      if (error) {
        newErrors[fieldId] = error;
        hasErrors = true;
      }
    });
    
    setTouched(newTouched);
    setErrors(newErrors);
    
    if (hasErrors) {
      // Don't submit if there are validation errors
      setSubmitStatus({
        type: 'error',
        message: 'Please fix the errors before submitting'
      });
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus(null);
    
    try {
      // Format the data for insertion
      const contactData = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        message: formData.message
      };
      
      // Insert data into Supabase
      const { error } = await supabase
        .from('contacts')
        .insert(contactData);
      
      if (error) throw error;
      
      // Show success message
      setSubmitStatus({
        type: 'success',
        message: 'Your message has been sent successfully!'
      });
      
      // Reset form after successful submission
      setFormData({
        name: "",
        email: "",
        phone: "",
        message: ""
      });
      setTouched({});
      
    } catch (error: unknown) {
      console.error('Error submitting contact:', error);
      
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      
      setSubmitStatus({
        type: 'error',
        message: `Failed to send message: ${errorMessage}`
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // If we have a successful submission, show a success screen
  if (submitStatus?.type === 'success') {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen pt-20 pb-10 px-6 max-w-xl mx-auto">
        <Link href="/" className="fixed top-4 left-3 z-[100] text-zinc-300 hover:text-white transition-colors flex items-center gap-2">
          <motion.div
            className="flex items-center gap-2 px-3 py-2 rounded-full"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>
        </motion.div>
      </Link>
        <motion.div 
          className="w-full text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white/10 rounded-full mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
            </div>
            <h2 className="text-2xl sm:text-4xl font-medium mb-4">Message Sent</h2>
            <p className="text-md text-zinc-400 mb-6">
              Thank you for your message. We&apos;ll get back to you soon.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
              <Link href="/">
                <motion.button
                  className="text-sm sm:text-base px-8 py-3 rounded-full bg-white text-black font-medium hover:bg-gray-200 transition-colors"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Back to Home
                </motion.button>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen pt-20 pb-10 overflow-auto">
      <Link href="/" className="fixed top-4 left-3 z-[100] text-zinc-300 hover:text-white transition-colors flex items-center gap-2">
        <motion.div
          className="flex items-center gap-2 px-3 py-2 rounded-full"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>
        </motion.div>
      </Link>
      <div className="max-w-xl w-full mx-auto px-6 flex-1 sm:mt-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <h1 className="text-2xl sm:text-3xl font-bold text-center mb-1 tracking-tight">Contact Us</h1>
          <p className="text-xs sm:text-base text-zinc-400 text-center">Drop us a line and our team will get back to you</p>
        </motion.div>
        
        <form onSubmit={handleSubmit} className="space-y-8 mb-10">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-8"
          >
            <div className="space-y-2">
              <label htmlFor="name" className="block text-sm font-medium text-zinc-400">
                Name
              </label>
              <input
                type="text"
                id="name"
                value={formData.name}
                onChange={handleChange}
                onBlur={() => handleBlur('name')}
                placeholder="Enter your name"
                className={cn(
                  "w-full bg-transparent border-b-2 border-white/20 focus:border-white px-0 py-2 text-base focus:outline-none transition-all",
                  errors.name ? "border-red-400/50" : ""
                )}
              />
              {errors.name && (
                <div className="mt-1 text-red-400 text-sm animate-fadeIn">
                  {errors.name}
                </div>
              )}
            </div>
            
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium text-zinc-400">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                value={formData.email}
                onChange={handleChange}
                onBlur={() => handleBlur('email')}
                placeholder="Enter your email"
                className={cn(
                  "w-full bg-transparent border-b-2 border-white/20 focus:border-white px-0 py-2 text-base focus:outline-none transition-all",
                  errors.email ? "border-red-400/50" : ""
                )}
              />
              {errors.email && (
                <div className="mt-1 text-red-400 text-sm animate-fadeIn">
                  {errors.email}
                </div>
              )}
            </div>
            
            <div className="space-y-2">
              <label htmlFor="phone" className="block text-sm font-medium text-zinc-400">
                Phone Number <span className="text-zinc-500">(Optional)</span>
              </label>
              <input
                type="tel"
                id="phone"
                value={formData.phone}
                onChange={handleChange}
                onBlur={() => handleBlur('phone')}
                placeholder="Enter your phone number"
                className={cn(
                  "w-full bg-transparent border-b-2 border-white/20 focus:border-white px-0 py-2 text-base focus:outline-none transition-all",
                  errors.phone ? "border-red-400/50" : ""
                )}
              />
              {errors.phone && (
                <div className="mt-1 text-red-400 text-sm animate-fadeIn">
                  {errors.phone}
                </div>
              )}
            </div>
            
            <div className="space-y-2">
              <label htmlFor="message" className="block text-sm font-medium text-zinc-400">
                Message
              </label>
              <textarea
                id="message"
                value={formData.message}
                onChange={handleChange}
                onBlur={() => handleBlur('message')}
                placeholder="Enter your message"
                rows={4}
                className={cn(
                  "w-full bg-transparent border-b-2 border-t-0 border-x-0 border-white/20 focus:border-white px-0 py-2 text-base focus:outline-none resize-none transition-all",
                  errors.message ? "border-red-400/50" : ""
                )}
              />
              {errors.message && (
                <div className="mt-1 text-red-400 text-sm animate-fadeIn">
                  {errors.message}
                </div>
              )}
            </div>
            
            {submitStatus?.type === 'error' && (
              <motion.div 
                className="py-3 px-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-300 text-sm"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {submitStatus.message}
              </motion.div>
            )}
            
            <motion.button
              type="submit"
              disabled={isSubmitting}
              className="w-full px-8 py-3 text-sm sm:text-base rounded-full bg-white text-black font-medium hover:bg-gray-200 transition-colors relative"
              whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
              whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
            >
              {isSubmitting ? (
                <>
                  <span className="opacity-0">Send Message</span>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <svg className="animate-spin h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  </div>
                </>
              ) : (
                "Send Message"
              )}
            </motion.button>
          </motion.div>
        </form>
      </div>
    </div>
  );
} 