import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {FaArrowRight, FaArrowLeft, FaCar, FaCogs, FaDollarSign, FaCamera, FaRocket, FaSpinner } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import { useAuth } from '../context/AuthContext';
import { useLocationAutocomplete } from '../hooks/useLocations';
import { Navigate } from 'react-router-dom';

import { createListing } from '../api/listings.js';
import Notification from '../components/ui/Notification';
import {
    HeroSection,
    StepNavigation,
    ListingSummary,
    StepContent
} from '../components/createlisting';

const CreateListing = () => {
    const { user, loading } = useAuth();
    const navigate = useNavigate();
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
        dailyRate: '',
        minRentalPeriod: '1',
        currency: 'EUR',
        photos: [],
        amenities: []
    });

    const [completedSteps, setCompletedSteps] = useState([]);
    const [errors, setErrors] = useState({});
    const [creating, setCreating] = useState(false);
    const [createError, setCreateError] = useState('');
    const [notification, setNotification] = useState({ message: '', type: 'success', isVisible: false });

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

    if (loading) {
        return (
          <div className="flex items-center justify-center min-h-screen">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600"></div>
          </div>
        );
      }
    
      // Check if user exists, if not redirect to signin
      if (!user) {
        return <Navigate to="/signin" replace />;
      }

      
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
                const uploadedPhotos = formData.photos.filter(photo => photo.uploaded);
                if (uploadedPhotos.length === 0) newErrors.photos = 'At least one photo must be uploaded successfully';
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

    const handleCreateListing = async () => {
        if (!validateStep(currentStep)) return;

        setCreating(true);
        setCreateError('');

        try {
            // Prepare listing data for API
            const uploadedPhotos = formData.photos.filter(photo => photo.uploaded);
            const listingData = {
                title: formData.title,
                description: formData.description,
                vehicle_type_id: parseInt(formData.vehicleType),
                make: formData.make,
                model: formData.model,
                year: parseInt(formData.year),
                sleeps: formData.sleeps ? parseInt(formData.sleeps) : null,
                length_meters: formData.length ? parseFloat(formData.length) : null,
                location_city: formData.location?.city || '',
                location_country: formData.location?.country || '',
                latitude: formData.location?.lat || null,
                longitude: formData.location?.lng || null,
                daily_rate: parseFloat(formData.dailyRate),
                currency: formData.currency,
                min_rental_days: parseInt(formData.minRentalPeriod),
                photos: uploadedPhotos.map(photo => photo.path), // Send photo paths
                amenity_ids: formData.amenities.map(a => parseInt(a))
            };

            const result = await createListing(listingData);

            // Show success notification
            setNotification({
                message: '🎉 Listing created successfully! Your vehicle is now live.',
                type: 'success',
                isVisible: true
            });

            // Navigate to the newly created listing after 1500ms
            setTimeout(() => {
                navigate(`/listing/${result.id}`);
            }, 1500);

        } catch (error) {
            console.error('Failed to create listing:', error);
            setCreateError(error.message || 'Failed to create listing. Please try again.');
        } finally {
            setCreating(false);
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
                                            <button
                                                onClick={handleCreateListing}
                                                disabled={creating}
                                                className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                {creating ? (
                                                    <>
                                                        <FaSpinner className="text-sm animate-spin" />
                                                        Creating Listing...
                                                    </>
                                                ) : (
                                                    <>
                                                        <FaRocket className="text-sm" />
                                                        Publish Listing
                                                    </>
                                                )}
                                            </button>
                                        )}
                                    </div>
                                </div>

                                {/* Listing Creation Error */}
                                {createError && (
                                    <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                                        <p className="text-red-800 text-sm">{createError}</p>
                                    </div>
                                )}
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

            {/* Success Notification */}
            <Notification
                message={notification.message}
                type={notification.type}
                isVisible={notification.isVisible}
                onClose={() => setNotification({ ...notification, isVisible: false })}
                autoHide={false}
            />
        </div>
    );
};

export default CreateListing;