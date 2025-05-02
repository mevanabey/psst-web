"use client"

import { Logo } from "@/components/logos";
import { useState } from "react";

export default function OrderPage() {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({
    companyName: "",
    businessId: "",
    contactName: "",
    email: "",
    phone: "",
    productType: "premium",
    quantity: "",
    deliveryDate: "",
    notes: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    country: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value
    });
  };

  const nextStep = () => {
    if (step < formSteps.length - 1) {
      setStep(step + 1);
    }
  };

  const prevStep = () => {
    if (step > 0) {
      setStep(step - 1);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    // Here you would typically send the data to your backend
  };

  const formSteps = [
    {
      id: "companyName",
      label: "What is the name of your business?",
      type: "text",
      placeholder: "Enter your business name"
    },
    // {
    //   id: "businessId",
    //   label: "What is your business license ID?",
    //   type: "text",
    //   placeholder: "Enter your business ID"
    // },
    {
      id: "contactName",
      label: "Who should we contact?",
      type: "text",
      placeholder: "Enter your name"
    },
    {
      id: "email",
      label: "What is your email address?",
      type: "email",
      placeholder: "Enter your email"
    },
    {
      id: "phone",
      label: "What is your phone number?",
      type: "tel",
      placeholder: "Enter your phone number"
    },
    {
      id: "productType",
      label: "Which vodka would you like to order?",
      type: "select",
      options: [
        { value: "premium", label: "Premium Vodka" },
        { value: "craft", label: "Craft Vodka" },
        { value: "flavored", label: "Flavored Vodka" }
      ]
    },
    {
      id: "quantity",
      label: "How many cases would you like?",
      type: "number",
      placeholder: "Enter number of cases",
      min: "1"
    },
    {
      id: "deliveryDate",
      label: "When do you need your order?",
      type: "date",
      placeholder: "Select delivery date"
    },
    {
      id: "notes",
      label: "Any special instructions?",
      type: "textarea",
      placeholder: "Enter special instructions (optional)"
    },
    {
      id: "address",
      label: "What is your business address?",
      type: "text",
      placeholder: "Enter business address"
    },
  ];

  const currentStep = formSteps[step];
  const progress = Math.round(((step + 1) / formSteps.length) * 100);

  return (
    <div className="h-screen w-screen overflow-hidden flex flex-col bg-black text-white">
      {/* Header with logo */}
      <header className="p-6 fixed top-0 left-0 z-10">
        <Logo className="w-20 text-white" />
      </header>

      {/* Main ordering section */}
      <main className="flex-1 flex items-center justify-center">
        <form onSubmit={handleSubmit} className="w-full max-w-xl px-8">
          <div className="fixed top-0 left-0 w-full">
            <div className="h-1 w-full bg-zinc-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-white" 
                style={{ width: `${progress}%`, transition: "width 0.5s ease-in-out" }}
              ></div>
            </div>
            <div className="text-right mt-6 mr-4 text-zinc-500 text-md">{step + 1} of {formSteps.length}</div>
          </div>

          <div className="flex flex-col justify-center">
            {/* <label 
              htmlFor={currentStep.id} 
              className="text-xl sm:text-3xl font-light mb-8 text-center"
            >
              {currentStep.label}
            </label> */}

            {currentStep.type === "select" ? (
              <select
                id={currentStep.id}
                value={formData[currentStep.id as keyof typeof formData]}
                onChange={handleChange}
                className="bg-transparent border-b-2 border-white/30 focus:border-white px-4 py-3 text-center text-xl focus:outline-none transition-colors"
              >
                {currentStep.options?.map((option) => (
                  <option key={option.value} value={option.value} className="bg-black">
                    {option.label}
                  </option>
                ))}
              </select>
            ) : currentStep.type === "textarea" ? (
              <textarea
                id={currentStep.id}
                value={formData[currentStep.id as keyof typeof formData]}
                onChange={handleChange}
                placeholder={currentStep.placeholder}
                rows={3}
                className="bg-transparent border-b-2 border-white/30 focus:border-white px-4 py-3 text-center text-xl focus:outline-none resize-none transition-colors"
              />
            ) : (
              <input
                type={currentStep.type}
                id={currentStep.id}
                value={formData[currentStep.id as keyof typeof formData]}
                onChange={handleChange}
                placeholder={currentStep.placeholder}
                min={currentStep.min}
                className="bg-transparent border-b-2 border-white/30 focus:border-white px-4 py-3 text-center text-md focus:outline-none transition-colors"
              />
            )}
          </div>

          <div className="flex justify-between mt-8">
            <button
              type="button"
              onClick={prevStep}
              className={`px-6 py-3 rounded-full transition-colors ${
                step === 0 ? "opacity-0 cursor-default" : "text-white/70 hover:text-white"
              }`}
            >
              Back
            </button>
            
            {step === formSteps.length - 1 ? (
              <button
                type="submit"
                className="px-8 py-3 text-sm rounded-full bg-white text-black font-medium hover:bg-gray-200 transition-colors"
              >
                Complete Order
              </button>
            ) : (
              <button
                type="button"
                onClick={nextStep}
                className="px-6 py-0 rounded-full bg-white text-black text-sm font-medium hover:bg-gray-200 transition-colors"
              >
                Continue
              </button>
            )}
          </div>
        </form>
      </main>

      {/* Footer */}
      {/* <footer className="p-6 text-center text-sm text-zinc-600 absolute bottom-0 left-0 right-0">
        &copy; {new Date().getFullYear()} TSURU Distilleries
      </footer> */}
    </div>
  );
} 