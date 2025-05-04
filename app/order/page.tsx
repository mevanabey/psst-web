"use client"

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";
import { supabase } from "@/lib/supabase";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import Link from "next/link";

// Add validation types
interface ValidationErrors {
  [key: string]: string;
}

interface FormDataType {
  companyName: string;
  contactName: string;
  email: string;
  phone: string;
  quantity: number | string;
  deliveryDate: string;
  notes: string;
  address: string;
  [key: string]: string | number;
}

// Step interfaces
interface BaseStepProps {
  formData: FormDataType;
  errors: ValidationErrors;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  handleBlur: (fieldId: string) => void;
  goToNextStep: () => void;
  goToPrevStep: () => void;
}

interface CompanyInfoStepProps extends BaseStepProps {}
interface ContactInfoStepProps extends BaseStepProps {}
interface OrderDetailsStepProps extends BaseStepProps {
  handleQuantityChange: (value: number | string) => void;
  handleDateChange: (value: string) => void;
}
interface DeliveryInfoStepProps extends BaseStepProps {}
interface ReviewStepProps extends BaseStepProps {
  isSubmitting: boolean;
  submitStatus: { type: 'success' | 'error', message: string } | null;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
}

interface QuantityStepperProps {
  value: number | string;
  onChange: (value: number | string) => void;
  min?: number;
  max?: number;
}

interface DatePickerFieldProps {
  value: string;
  onChange: (value: string) => void;
}

// Custom Quantity Stepper Component
const QuantityStepper: React.FC<QuantityStepperProps> = ({ value, onChange, min = 1, max = 100 }) => {
  const handleDecrement = () => {
    if (typeof value === 'number' && value > min) {
      onChange(value - 1);
    }
  };

  const handleIncrement = () => {
    if (typeof value === 'number' && value < max) {
      onChange(value + 1);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseInt(e.target.value);
    if (!isNaN(newValue) && newValue >= min && newValue <= max) {
      onChange(newValue);
    } else if (!e.target.value) {
      onChange("");
    }
  };

  return (
    <div className="flex items-center w-full">
      <div className="relative flex items-center w-full">
        <motion.button
          type="button"
          onClick={handleDecrement}
          className="absolute left-0 flex items-center justify-center w-8 h-8 text-xl bg-black border border-white/10 rounded-full text-white/70 hover:text-white hover:border-white/30 transition-colors"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          disabled={typeof value === 'number' && value <= min}
        >
          <span className="-mt-0.5">−</span>
        </motion.button>
        <input
          type="text"
          value={value}
          onChange={handleInputChange}
          className="w-full py-2 px-14 bg-transparent border-b-2 border-white/20 focus:border-white text-base focus:outline-none transition-colors"
          aria-label="Quantity"
        />
        <motion.button
          type="button"
          onClick={handleIncrement}
          className="absolute right-0 flex items-center justify-center w-8 h-8 text-xl bg-black border border-white/10 rounded-full text-white/70 hover:text-white hover:border-white/30 transition-colors"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          disabled={typeof value === 'number' && value >= max}
        >
          <span className="-mt-0.5">+</span>
        </motion.button>
      </div>
    </div>
  );
};

// Custom Date Picker Component
const DatePickerField: React.FC<DatePickerFieldProps> = ({ value, onChange }) => {
  const [date, setDate] = useState<Date | undefined>(value ? new Date(value) : undefined);

  // Create a date for the day after tomorrow
  const today = new Date();
  const dayAfterTomorrow = new Date(today);
  dayAfterTomorrow.setDate(today.getDate() + 2);
  
  // Reset to midnight to ensure proper comparison
  dayAfterTomorrow.setHours(0, 0, 0, 0);

  const handleSelect = (date: Date | undefined) => {
    setDate(date);
    if (date) {
      onChange(format(date, 'yyyy-MM-dd'));
    }
  };

  return (
    <div className="w-full">
      {date && (
        <div className="w-full py-2 px-0 bg-transparent border-b-2 border-white/20 mb-4 flex items-center justify-between">
          <span className="text-base">{date ? format(date, 'MMMM d, yyyy') : "Select a delivery date"}</span>
          
          {date && (
            <motion.button
              type="button"
              onClick={() => setDate(undefined)}
              className="text-white/50 hover:text-white"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </motion.button>
          )}
        </div>
      )}

      <div className="w-full">
        <Calendar
          mode="single"
          selected={date}
          onSelect={handleSelect}
          disabled={(date) => date < dayAfterTomorrow}
          className="text-white bg-transparent border border-white/10 rounded-lg shadow-lg p-0"
          classNames={{
            months: "space-y-4",
            month: "space-y-4",
            caption: "flex justify-center pt-4 relative items-center",
            caption_label: "text-base font-medium text-white",
            nav: "flex items-center gap-1",
            nav_button: "h-8 w-8 bg-transparent p-0 opacity-70 hover:opacity-100 rounded-full flex items-center justify-center border border-white/20 hover:border-white/60 transition-colors",
            nav_button_previous: "absolute left-3",
            nav_button_next: "absolute right-3",
            table: "w-full border-collapse space-y-1",
            head_row: "flex w-full justify-between px-2",
            head_cell: "text-zinc-400 w-9 h-9 font-normal text-[0.8rem] flex items-center justify-center",
            row: "flex w-full justify-between mt-1 px-2",
            cell: "h-9 w-9 text-center text-sm relative p-0 focus-within:relative focus-within:z-20 [&:has([aria-selected])]:bg-white/5 [&:has([aria-selected].day-outside)]:bg-white/5 [&:has([aria-selected].day-range-end)]:rounded-r-md",
            day: "h-9 w-9 p-0 font-normal aria-selected:opacity-100 rounded-full flex items-center justify-center transition-colors hover:bg-white/20 aria-selected:bg-white aria-selected:text-black",
            day_selected: "bg-white text-black hover:bg-white hover:text-black focus:bg-white focus:text-black",
            day_outside: "opacity-30 aria-selected:bg-white/20 aria-selected:text-white aria-selected:opacity-30",
            day_disabled: "opacity-30 hover:bg-transparent",
            day_range_middle: "aria-selected:bg-white/10 aria-selected:text-white",
            day_today: "border border-zinc-200 bg-none text-white",
            day_hidden: "invisible",
          }}
          footer={
            <div className="mt-3 mb-1 text-xs text-center text-gray-400 px-2">
              Orders must be placed at least 2 days in advance
            </div>
          }
        />
      </div>
    </div>
  );
};

// Step 1: Company Information
const CompanyInfoStep: React.FC<CompanyInfoStepProps> = ({ 
  formData, 
  errors, 
  handleChange, 
  handleBlur, 
  goToNextStep 
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-8"
    >
      <div className="space-y-2">
        <label htmlFor="companyName" className="block text-sm font-medium text-zinc-400">
          Business Name
        </label>
        <input
          type="text"
          id="companyName"
          value={formData.companyName}
          onChange={handleChange}
          onBlur={() => handleBlur('companyName')}
          placeholder="Enter your business name"
          className={cn(
            "w-full bg-transparent border-b-2 border-white/20 focus:border-white px-0 py-2 text-base focus:outline-none transition-all",
            errors.companyName ? "border-red-400/50" : ""
          )}
        />
        {errors.companyName && (
          <div className="mt-1 text-red-400 text-sm animate-fadeIn">
            {errors.companyName}
          </div>
        )}
      </div>

      <motion.div className="pt-4">
        <motion.button
          type="button"
          onClick={goToNextStep}
          className="w-full px-8 py-3 text-sm sm:text-base rounded-full bg-white text-black font-medium hover:bg-gray-200 transition-colors"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          Continue
        </motion.button>
      </motion.div>
    </motion.div>
  );
};

// Step 2: Contact Information
const ContactInfoStep: React.FC<ContactInfoStepProps> = ({ 
  formData, 
  errors, 
  handleChange, 
  handleBlur, 
  goToNextStep,
  goToPrevStep
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-8"
    >
      <div className="space-y-2">
        <label htmlFor="contactName" className="block text-sm font-medium text-zinc-400">
          Contact Name
        </label>
        <input
          type="text"
          id="contactName"
          value={formData.contactName}
          onChange={handleChange}
          onBlur={() => handleBlur('contactName')}
          placeholder="Enter contact person's name"
          className={cn(
            "w-full bg-transparent border-b-2 border-white/20 focus:border-white px-0 py-2 text-base focus:outline-none transition-all",
            errors.contactName ? "border-red-400/50" : ""
          )}
        />
        {errors.contactName && (
          <div className="mt-1 text-red-400 text-sm animate-fadeIn">
            {errors.contactName}
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
          Phone Number
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

      <div className="flex flex-col gap-4 sm:flex-row sm:gap-3 pt-4">
        <motion.button
          type="button"
          onClick={goToPrevStep}
          className="w-full sm:w-1/3 px-8 py-3 text-sm sm:text-base rounded-full border border-white/20 text-white font-medium hover:bg-white/5 transition-colors"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          Back
        </motion.button>
        <motion.button
          type="button"
          onClick={goToNextStep}
          className="w-full sm:w-2/3 px-8 py-3 text-sm sm:text-base rounded-full bg-white text-black font-medium hover:bg-gray-200 transition-colors"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          Continue
        </motion.button>
      </div>
    </motion.div>
  );
};

// Step 3: Order Details
const OrderDetailsStep: React.FC<OrderDetailsStepProps> = ({ 
  formData, 
  errors, 
  handleQuantityChange,
  handleDateChange,
  goToNextStep,
  goToPrevStep
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-8"
    >
      <div className="space-y-2 max-w-[120px]">
        <label htmlFor="quantity" className="block text-sm font-medium text-zinc-400">
          Number of Cases
        </label>
        <QuantityStepper 
          value={formData.quantity} 
          onChange={handleQuantityChange} 
          min={1} 
        />
        {errors.quantity && (
          <div className="mt-1 text-red-400 text-sm animate-fadeIn">
            {errors.quantity}
          </div>
        )}
      </div>
      
      <div className="space-y-2">
        <label htmlFor="deliveryDate" className="block text-sm font-medium text-zinc-400">
          Delivery Date
        </label>
        <DatePickerField
          value={formData.deliveryDate}
          onChange={handleDateChange}
        />
        {errors.deliveryDate && (
          <div className="mt-1 text-red-400 text-sm animate-fadeIn">
            {errors.deliveryDate}
          </div>
        )}
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:gap-3 pt-4">
        <motion.button
          type="button"
          onClick={goToPrevStep}
          className="w-full sm:w-1/3 px-8 py-3 text-sm sm:text-base rounded-full border border-white/20 text-white font-medium hover:bg-white/5 transition-colors"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          Back
        </motion.button>
        <motion.button
          type="button"
          onClick={goToNextStep}
          className="w-full sm:w-2/3 px-8 py-3 text-sm sm:text-base rounded-full bg-white text-black font-medium hover:bg-gray-200 transition-colors"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          Continue
        </motion.button>
      </div>
    </motion.div>
  );
};

// Step 4: Delivery Information
const DeliveryInfoStep: React.FC<DeliveryInfoStepProps> = ({ 
  formData, 
  errors, 
  handleChange, 
  handleBlur, 
  goToNextStep,
  goToPrevStep
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-8"
    >
      <div className="space-y-2">
        <label htmlFor="address" className="block text-sm font-medium text-zinc-400">
          Delivery Address
        </label>
        <textarea
          id="address"
          value={formData.address}
          onChange={handleChange}
          onBlur={() => handleBlur('address')}
          placeholder="Enter your delivery address"
          rows={3}
          className={cn(
            "w-full bg-transparent border-b-2 border-t-0 border-x-0 border-white/20 focus:border-white px-0 py-2 text-base focus:outline-none resize-none transition-all",
            errors.address ? "border-red-400/50" : ""
          )}
        />
        {errors.address && (
          <div className="mt-1 text-red-400 text-sm animate-fadeIn">
            {errors.address}
          </div>
        )}
      </div>
      
      <div className="space-y-2">
        <label htmlFor="notes" className="block text-sm font-medium text-zinc-400">
          Special Instructions <span className="text-zinc-500">(Optional)</span>
        </label>
        <textarea
          id="notes"
          value={formData.notes}
          onChange={handleChange}
          onBlur={() => handleBlur('notes')}
          placeholder="Any special delivery instructions"
          rows={3}
          className={cn(
            "w-full bg-transparent border-b-2 border-t-0 border-x-0 border-white/20 focus:border-white px-0 py-2 text-base focus:outline-none resize-none transition-all",
            errors.notes ? "border-red-400/50" : ""
          )}
        />
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:gap-3 pt-4">
        <motion.button
          type="button"
          onClick={goToPrevStep}
          className="w-full sm:w-1/3 px-8 py-3 text-sm sm:text-base rounded-full border border-white/20 text-white font-medium hover:bg-white/5 transition-colors"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          Back
        </motion.button>
        <motion.button
          type="button"
          onClick={goToNextStep}
          className="w-full sm:w-2/3 px-8 py-3 text-sm sm:text-base rounded-full bg-white text-black font-medium hover:bg-gray-200 transition-colors"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          Review Order
        </motion.button>
      </div>
    </motion.div>
  );
};

// Step 5: Review Order
const ReviewStep: React.FC<ReviewStepProps> = ({ 
  formData, 
  isSubmitting,
  submitStatus,
  handleSubmit,
  goToPrevStep
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-8"
    >
      <div>
        <h3 className="text-lg font-medium mb-4">Review Your Order</h3>
        
        <div className="space-y-4 bg-white/5 p-6 rounded-lg">
          <div className="grid grid-cols-2 gap-2">
            <div className="text-zinc-400 text-sm">Business Name:</div>
            <div>{formData.companyName}</div>
          </div>
          
          <div className="grid grid-cols-2 gap-2">
            <div className="text-zinc-400 text-sm">Contact Name:</div>
            <div>{formData.contactName}</div>
          </div>
          
          <div className="grid grid-cols-2 gap-2">
            <div className="text-zinc-400 text-sm">Email:</div>
            <div>{formData.email}</div>
          </div>
          
          <div className="grid grid-cols-2 gap-2">
            <div className="text-zinc-400 text-sm">Phone:</div>
            <div>{formData.phone}</div>
          </div>
          
          <div className="grid grid-cols-2 gap-2">
            <div className="text-zinc-400 text-sm">Quantity:</div>
            <div>{formData.quantity} cases</div>
          </div>
          
          <div className="grid grid-cols-2 gap-2">
            <div className="text-zinc-400 text-sm">Delivery Date:</div>
            <div>{formData.deliveryDate ? format(new Date(formData.deliveryDate), 'MMMM d, yyyy') : 'Not selected'}</div>
          </div>
          
          <div className="grid grid-cols-2 gap-2">
            <div className="text-zinc-400 text-sm">Delivery Address:</div>
            <div style={{ wordBreak: 'break-word' }}>{formData.address}</div>
          </div>
          
          {formData.notes && (
            <div className="grid grid-cols-2 gap-2">
              <div className="text-zinc-400 text-sm">Special Instructions:</div>
              <div style={{ wordBreak: 'break-word' }}>{formData.notes}</div>
            </div>
          )}
        </div>
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
      
      <div className="flex flex-col gap-4 sm:flex-row sm:gap-3 pt-4">
        <motion.button
          type="button"
          onClick={goToPrevStep}
          disabled={isSubmitting}
          className="w-full sm:w-1/3 px-8 py-3 text-sm sm:text-base rounded-full border border-white/20 text-white font-medium hover:bg-white/5 transition-colors"
          whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
          whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
        >
          Back
        </motion.button>
        <motion.button
          type="button"
          onClick={(e) => handleSubmit(e as any)}
          disabled={isSubmitting}
          className="w-full sm:w-2/3 px-8 py-3 text-sm sm:text-base rounded-full bg-white text-black font-medium hover:bg-gray-200 transition-colors relative"
          whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
          whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
        >
          {isSubmitting ? (
            <>
              <span className="opacity-0">Place Order</span>
              <div className="absolute inset-0 flex items-center justify-center">
                <svg className="animate-spin h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </div>
            </>
          ) : (
            "Place Order"
          )}
        </motion.button>
      </div>
    </motion.div>
  );
};

export default function OrderPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [touched, setTouched] = useState<{ [key: string]: boolean }>({});
  const [formData, setFormData] = useState<FormDataType>({
    companyName: "",
    contactName: "",
    email: "",
    phone: "",
    quantity: 1,
    deliveryDate: "",
    notes: "",
    address: "",
  });

  // Force a refresh on initial load to ensure layout consistency
  useEffect(() => {
    // This helps ensure the layout is consistently applied
    const timer = setTimeout(() => {
      document.body.style.opacity = "1";
    }, 50);
    
    return () => clearTimeout(timer);
  }, []);

  // Step navigation functions
  const goToNextStep = () => {
    // Validate current step fields before moving to the next step
    let canProceed = true;
    const newErrors: ValidationErrors = {};
    const newTouched: { [key: string]: boolean } = { ...touched };
    
    // Determine which fields should be validated based on the current step
    const fieldsToValidate: string[] = [];
    if (currentStep === 1) {
      fieldsToValidate.push('companyName');
    } else if (currentStep === 2) {
      fieldsToValidate.push('contactName', 'email', 'phone');
    } else if (currentStep === 3) {
      fieldsToValidate.push('quantity', 'deliveryDate');
    } else if (currentStep === 4) {
      fieldsToValidate.push('address');
    }
    
    // Validate the fields for the current step
    fieldsToValidate.forEach(fieldId => {
      newTouched[fieldId] = true;
      const error = validateField(fieldId, formData[fieldId]);
      if (error) {
        newErrors[fieldId] = error;
        canProceed = false;
      }
    });
    
    setTouched(newTouched);
    setErrors(prev => ({ ...prev, ...newErrors }));
    
    // Proceed to next step if validation passed
    if (canProceed) {
      setCurrentStep(prev => Math.min(prev + 1, 5));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const goToPrevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Validate a field
  const validateField = (fieldId: string, value: string | number): string => {
    switch (fieldId) {
      case 'companyName':
        return value === '' ? 'Business name is required' : '';
      case 'contactName':
        return value === '' ? 'Contact name is required' : '';
      case 'email':
        return value === '' 
          ? 'Email is required' 
          : !/^\S+@\S+\.\S+$/.test(String(value)) 
            ? 'Please enter a valid email address' 
            : '';
      case 'phone':
        return value === '' 
          ? 'Phone number is required' 
          : !/^[0-9+\s()-]{7,}$/.test(String(value)) 
            ? 'Please enter a valid phone number' 
            : '';
      case 'quantity':
        return value === '' 
          ? 'Quantity is required' 
          : typeof value === 'number' && (value < 1 || value > 1000) 
            ? 'Quantity must be between 1 and 1000' 
            : '';
      case 'deliveryDate':
        return value === '' ? 'Delivery date is required' : '';
      case 'address':
        return value === '' ? 'Address is required' : '';
      default:
        return '';
    }
  };

  // Handler for input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
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

  // Handler for quantity changes
  const handleQuantityChange = (value: number | string) => {
    setFormData(prev => ({ ...prev, quantity: value }));
    
    // If field has been touched, validate in real-time
    if (touched['quantity']) {
      const errorMessage = validateField('quantity', value);
      setErrors(prev => ({
        ...prev,
        quantity: errorMessage
      }));
    }
  };

  // Handler for date changes
  const handleDateChange = (value: string) => {
    setFormData(prev => ({ ...prev, deliveryDate: value }));
    
    // If field has been touched, validate in real-time
    if (touched['deliveryDate']) {
      const errorMessage = validateField('deliveryDate', value);
      setErrors(prev => ({
        ...prev,
        deliveryDate: errorMessage
      }));
    }
  };

  // Handler for field blur
  const handleBlur = (fieldId: string) => {
    setTouched(prev => ({ ...prev, [fieldId]: true }));
    
    // Validate the field on blur
    const value = formData[fieldId as keyof FormDataType];
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
      const orderData = {
        company_name: formData.companyName,
        contact_name: formData.contactName,
        email: formData.email,
        phone: formData.phone,
        quantity: formData.quantity,
        delivery_date: formData.deliveryDate,
        notes: formData.notes,
        address: formData.address,
        status: 'pending'
      };
      
      // Insert data into Supabase
      const { error } = await supabase
        .from('orders')
        .insert(orderData);
      
      if (error) throw error;
      
      // Show success message
      setSubmitStatus({
        type: 'success',
        message: 'Your order has been submitted successfully!'
      });
      
    } catch (error: unknown) {
      console.error('Error submitting order:', error);
      
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      
      setSubmitStatus({
        type: 'error',
        message: `Failed to submit order: ${errorMessage}`
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // If we have a successful submission, show a success screen
  if (submitStatus?.type === 'success') {
    return (
      <div className="relative h-full w-full flex flex-col justify-center items-center z-[100] px-6 max-w-xl mx-auto">
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
            <h2 className="text-2xl sm:text-4xl font-medium mb-4">Order Submitted</h2>
            <p className="text-md text-zinc-400 mb-6">
              Thank you for your order. We&apos;ll be in touch soon to confirm the details.
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

  // Helper function to render the current step
  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <CompanyInfoStep
            formData={formData}
            errors={errors}
            handleChange={handleChange}
            handleBlur={handleBlur}
            goToNextStep={goToNextStep}
            goToPrevStep={goToPrevStep}
          />
        );
      case 2:
        return (
          <ContactInfoStep
            formData={formData}
            errors={errors}
            handleChange={handleChange}
            handleBlur={handleBlur}
            goToNextStep={goToNextStep}
            goToPrevStep={goToPrevStep}
          />
        );
      case 3:
        return (
          <OrderDetailsStep
            formData={formData}
            errors={errors}
            handleChange={handleChange}
            handleBlur={handleBlur}
            handleQuantityChange={handleQuantityChange}
            handleDateChange={handleDateChange}
            goToNextStep={goToNextStep}
            goToPrevStep={goToPrevStep}
          />
        );
      case 4:
        return (
          <DeliveryInfoStep
            formData={formData}
            errors={errors}
            handleChange={handleChange}
            handleBlur={handleBlur}
            goToNextStep={goToNextStep}
            goToPrevStep={goToPrevStep}
          />
        );
      case 5:
        return (
          <ReviewStep
            formData={formData}
            errors={errors}
            handleChange={handleChange}
            handleBlur={handleBlur}
            isSubmitting={isSubmitting}
            submitStatus={submitStatus}
            handleSubmit={handleSubmit}
            goToNextStep={goToNextStep}
            goToPrevStep={goToPrevStep}
          />
        );
      default:
        return null;
    }
  };

  // Progress indicator steps
  const steps = [
    { name: 'Business', step: 1 },
    { name: 'Contact', step: 2 },
    { name: 'Order', step: 3 },
    { name: 'Delivery', step: 4 },
    { name: 'Review', step: 5 }
  ];

  return (
    <div className="h-full w-full overflow-y-auto mt-4 md:mt-32 px-6">
      <Link href="/" className="fixed top-4 left-3 z-[100] text-zinc-300 hover:text-white transition-colors flex items-center gap-2">
        <motion.div
          className="flex items-center gap-2 px-3 py-2 rounded-full"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>
        </motion.div>
      </Link>
      <div className="max-w-xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10 mt-20"
        >
          <h1 className="text-2xl sm:text-4xl font-bold text-center mb-1 tracking-tight">Place an Order</h1>
          <p className="text-sm sm:text-base text-zinc-400 text-center">Fill out the form below to place your order</p>
          
          {/* Progress indicator */}
          <div className="relative flex justify-between mt-8 mb-10 relative px-2 sm:px-4">
            {/* Background line */}
            <div className="absolute top-4 left-4 right-4 h-0.5 bg-white/10 z-0"></div>
            
            {/* Completed line */}
            <div 
              className="absolute top-4 left-4 h-0.5 bg-white/50 z-0 transition-all duration-300 ease-in-out"
              style={{ 
                width: `${(Math.max(0, currentStep - 1) / (steps.length - 1)) * (100 - 8)}%` 
              }}
            ></div>
            
            {steps.map((step) => (
              <div key={step.step} className="flex flex-col items-center relative z-10">
                <div 
                  className={cn(
                    "w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-medium mb-2 border-2 transition-all duration-200 text-sm sm:text-base",
                    currentStep === step.step 
                      ? "bg-white text-black border-white" 
                      : currentStep > step.step 
                        ? "bg-white text-black border-white" 
                        : "bg-black text-zinc-400 border-white/20"
                  )}
                >
                  {currentStep > step.step ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 sm:w-5 sm:h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  ) : (
                    <span>{step.step}</span>
                  )}
                </div>
                <span className={cn(
                  "text-[10px] sm:text-xs whitespace-nowrap",
                  currentStep === step.step 
                    ? "text-white font-medium" 
                    : currentStep > step.step
                      ? "text-white/70"
                      : "text-zinc-500"
                )}>
                  {step.name}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
        
        <form onSubmit={(e) => e.preventDefault()} className="space-y-8">
          <AnimatePresence mode="wait">
            {renderStep()}
          </AnimatePresence>
        </form>
      </div>
    </div>
  );
} 