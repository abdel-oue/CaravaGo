import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {FaArrowRight, FaArrowLeft, FaCar, FaCogs, FaDollarSign, FaCamera, FaRocket } from 'react-icons/fa';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import { useLocationAutocomplete } from '../hooks/useLocations';
import {
    HeroSection,
    StepNavigation,
    ListingSummary,
    StepContent,
    VerticalStepNavigation
} from '../components/createlisting';

const CreateListing = () => {
    const [currentStep, setCurrentStep] = useState(1);
    const totalSteps = 5;

    // Form state
    const [formData, setFormData] = useState({
        title: '',
        vehicleType: '',
        location: null,
        year: '',
        make: '',
        model: '',
        sleeps: '',
        length: '',
        description: '',
        features: [],
        dailyRate: '',
        currency: 'MAD',
        photos: [],
        amenities: []
    });

    const [completedSteps, setCompletedSteps] = useState([]);
    const [errors, setErrors] = useState({});

    const steps = [
        { id: 1, title: 'What is it?', description: 'Basic vehicle information', icon: FaCar },
        { id: 2, title: 'Details & Features', description: 'Specifications and amenities', icon: FaCogs },
        { id: 3, title: 'Set Pricing', description: 'Daily rates and availability', icon: FaDollarSign },
        { id: 4, title: 'Add Photos', description: 'Showcase your vehicle', icon: FaCamera },
        { id: 5, title: 'Review & Publish', description: 'Final review and go live', icon: FaRocket }
    ];

    // Location autocomplete
    const {
        query,
        setQuery,
        suggestions,
        loading: locationLoading,
        selectedLocation,
        selectLocation,
        showDropdown,
        handleInputFocus,
        handleInputBlur
    } = useLocationAutocomplete();

    // Update form data when location is selected
    useEffect(() => {
        if (selectedLocation) {
            setFormData(prev => ({
                ...prev,
                location: selectedLocation
            }));
        }
    }, [selectedLocation]);

    const validateStep = (step) => {
        const newErrors = {};

        switch (step) {
            case 1:
                if (!formData.title.trim()) newErrors.title = 'Title is required';
                if (!formData.vehicleType) newErrors.vehicleType = 'Vehicle type is required';
                if (!selectedLocation) newErrors.location = 'Location is required';
                if (!formData.year || formData.year < 1900 || formData.year > new Date().getFullYear() + 1) {
                    newErrors.year = 'Please enter a valid year';
                }
                if (!formData.description.trim()) newErrors.description = 'Description is required';
                break;
            case 2:
                if (!formData.sleeps || formData.sleeps < 1) newErrors.sleeps = 'Number of sleeps is required';
                break;
            case 3:
                if (!formData.dailyRate || formData.dailyRate <= 0) {
                    newErrors.dailyRate = 'Daily rate is required and must be greater than 0';
                }
                break;
            case 4:
                if (formData.photos.length === 0) newErrors.photos = 'At least one photo is required';
                break;
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const nextStep = () => {
        if (validateStep(currentStep) && currentStep < totalSteps) {
            setCompletedSteps(prev => [...prev, currentStep]);
            setCurrentStep(currentStep + 1);
        }
    };

    const prevStep = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        }
    };

    const goToStep = (stepId) => {
        // Only allow going to completed steps or the next step
        if (stepId <= currentStep || completedSteps.includes(stepId - 1)) {
            setCurrentStep(stepId);
        }
    };

    const updateFormData = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
        // Clear error when user starts typing
        if (errors[field]) {
            setErrors(prev => ({
                ...prev,
                [field]: ''
            }));
        }
    };

    return (
        <div className="min-h-screen bg-bgLight">
            <Navbar />

            <HeroSection />

            {/* Step Navigation */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Always show horizontal step navigation */}
                <div className="mb-8">
                    <StepNavigation steps={steps} currentStep={currentStep} />
                </div>

                {/* Main Content Layout */}
                <div className="flex gap-8">
                    {/* Form Content - Left Side */}
                    <div className="flex-1">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={currentStep}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.3 }}
                                className="bg-white rounded-xl shadow-lg p-8"
                            >

                                {/* Form Content Based on Step */}
                                <StepContent
                                    currentStep={currentStep}
                                    formData={formData}
                                    errors={errors}
                                    updateFormData={updateFormData}
                                    query={query}
                                    setQuery={setQuery}
                                    suggestions={suggestions}
                                    locationLoading={locationLoading}
                                    selectedLocation={selectedLocation}
                                    selectLocation={selectLocation}
                                    showDropdown={showDropdown}
                                    handleInputFocus={handleInputFocus}
                                    handleInputBlur={handleInputBlur}
                                />

                                {/* Navigation Buttons */}
                                <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-200">
                                    <button
                                        onClick={prevStep}
                                        disabled={currentStep === 1}
                                        className="flex items-center gap-2 px-6 py-3 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                    >
                                        <FaArrowLeft className="text-sm" />
                                        Previous
                                    </button>

                                    <div className="flex items-center gap-4">
                                        <span className="text-sm text-gray-500">
                                            Step {currentStep} of {totalSteps}
                                        </span>

                                        {currentStep < totalSteps ? (
                                            <button
                                                onClick={nextStep}
                                                className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
                                            >
                                                Next
                                                <FaArrowRight className="text-sm" />
                                            </button>
                                        ) : (
                                            <button className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                                                <FaRocket className="text-sm" />
                                                Publish Listing
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    {/* Listing Summary - Right Sidebar */}
                    {currentStep > 1 && (
                        <ListingSummary
                            formData={formData}
                            selectedLocation={selectedLocation}
                        />
                    )}
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default CreateListing;