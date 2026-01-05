import { useState } from 'react';
import { motion } from 'framer-motion';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';

const CreateListing = () => {
    const [currentStep, setCurrentStep] = useState(1);
    const totalSteps = 5;

    const steps = [
        { id: 1, title: 'Basic Information', description: 'Tell us about your vehicle' },
        { id: 2, title: 'Vehicle Details', description: 'Specifications and features' },
        { id: 3, title: 'Pricing', description: 'Set your rates' },
        { id: 4, title: 'Photos', description: 'Showcase your vehicle' },
        { id: 5, title: 'Review & Publish', description: 'Review and go live' }
    ];

    const nextStep = () => {
        if (currentStep < totalSteps) {
            setCurrentStep(currentStep + 1);
        }
    };

    const prevStep = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        }
    };

    const renderStepContent = () => {
        switch (currentStep) {
            case 1:
                return (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-6"
                    >
                        <div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-4 font-lexend">Basic Information</h3>
                            <p className="text-gray-600 mb-6">Let's start with the essentials about your vehicle.</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-bold text-gray-800 mb-2">Vehicle Title *</label>
                                <input
                                    type="text"
                                    placeholder="e.g., Cozy Campervan for City Adventures"
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-800 mb-2">Vehicle Type *</label>
                                <select className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent">
                                    <option>Select type</option>
                                    <option>Campervan</option>
                                    <option>Motorhome</option>
                                    <option>Caravan</option>
                                    <option>RV</option>
                                    <option>Other</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-800 mb-2">Location *</label>
                                <input
                                    type="text"
                                    placeholder="City, Country"
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-800 mb-2">Year *</label>
                                <input
                                    type="number"
                                    placeholder="2020"
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-800 mb-2">Description *</label>
                            <textarea
                                rows="4"
                                placeholder="Describe your vehicle, its features, and what makes it special..."
                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                            ></textarea>
                        </div>
                    </motion.div>
                );

            case 2:
                return (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-6"
                    >
                        <div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-4 font-lexend">Vehicle Details</h3>
                            <p className="text-gray-600 mb-6">Help travelers understand what your vehicle offers.</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-bold text-gray-800 mb-2">Make</label>
                                <input
                                    type="text"
                                    placeholder="e.g., Volkswagen"
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-800 mb-2">Model</label>
                                <input
                                    type="text"
                                    placeholder="e.g., California"
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-800 mb-2">Sleeps</label>
                                <select className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent">
                                    <option>Select capacity</option>
                                    <option>1-2 people</option>
                                    <option>3-4 people</option>
                                    <option>5+ people</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-800 mb-2">Length</label>
                                <select className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent">
                                    <option>Select length</option>
                                    <option>Under 5m</option>
                                    <option>5-7m</option>
                                    <option>7-9m</option>
                                    <option>9m+</option>
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-800 mb-3">Amenities & Features</label>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                {[
                                    'Kitchen', 'Bathroom', 'Air Conditioning', 'Heating',
                                    'WiFi', 'TV', 'Fridge', 'Microwave', 'Awning', 'Bike Rack'
                                ].map((amenity) => (
                                    <label key={amenity} className="flex items-center space-x-2 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                                        />
                                        <span className="text-sm text-gray-700">{amenity}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                );

            case 3:
                return (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-6"
                    >
                        <div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-4 font-lexend">Pricing</h3>
                            <p className="text-gray-600 mb-6">Set competitive rates that reflect your vehicle's value.</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-bold text-gray-800 mb-2">Daily Rate (€) *</label>
                                <input
                                    type="number"
                                    placeholder="50"
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-800 mb-2">Minimum Rental Period</label>
                                <select className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent">
                                    <option>1 day</option>
                                    <option>2 days</option>
                                    <option>3 days</option>
                                    <option>1 week</option>
                                </select>
                            </div>
                        </div>

                        <div className="bg-blue-50 p-6 rounded-lg">
                            <h4 className="font-bold text-gray-900 mb-2">Pricing Tips</h4>
                            <ul className="text-sm text-gray-600 space-y-1">
                                <li>• Research similar vehicles in your area</li>
                                <li>• Consider seasonal demand</li>
                                <li>• Factor in fuel costs and maintenance</li>
                                <li>• Set competitive rates to attract bookings</li>
                            </ul>
                        </div>
                    </motion.div>
                );

            case 4:
                return (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-6"
                    >
                        <div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-4 font-lexend">Photos</h3>
                            <p className="text-gray-600 mb-6">Show off your vehicle with high-quality photos.</p>
                        </div>

                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                            <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                                <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            <div className="text-gray-600">
                                <p className="text-lg font-medium mb-1">Upload photos of your vehicle</p>
                                <p className="text-sm">Drag and drop files here, or click to browse</p>
                                <p className="text-xs mt-2">PNG, JPG up to 10MB each</p>
                            </div>
                            <button className="mt-4 bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary-dark transition-colors">
                                Choose Files
                            </button>
                        </div>

                        <div className="bg-yellow-50 p-4 rounded-lg">
                            <h4 className="font-bold text-gray-900 mb-2">Photo Tips</h4>
                            <ul className="text-sm text-gray-600 space-y-1">
                                <li>• Include exterior, interior, and key features</li>
                                <li>• Use natural lighting and clean backgrounds</li>
                                <li>• Show the vehicle from multiple angles</li>
                                <li>• High-quality photos get more bookings</li>
                            </ul>
                        </div>
                    </motion.div>
                );

            case 5:
                return (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-6"
                    >
                        <div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-4 font-lexend">Review & Publish</h3>
                            <p className="text-gray-600 mb-6">Review your listing details before publishing.</p>
                        </div>

                        <div className="bg-gray-50 p-6 rounded-lg space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <h4 className="font-bold text-gray-900 mb-2">Basic Information</h4>
                                    <p className="text-sm text-gray-600">Vehicle Title: [Not provided]</p>
                                    <p className="text-sm text-gray-600">Type: [Not selected]</p>
                                    <p className="text-sm text-gray-600">Location: [Not provided]</p>
                                </div>

                                <div>
                                    <h4 className="font-bold text-gray-900 mb-2">Pricing</h4>
                                    <p className="text-sm text-gray-600">Daily Rate: [Not set]</p>
                                    <p className="text-sm text-gray-600">Min. Period: [Not set]</p>
                                </div>
                            </div>

                            <div className="pt-4 border-t border-gray-200">
                                <p className="text-sm text-gray-500 italic">Complete all steps to see your full listing preview</p>
                            </div>
                        </div>

                        <div className="bg-green-50 p-6 rounded-lg">
                            <h4 className="font-bold text-green-900 mb-2">Ready to Publish?</h4>
                            <p className="text-sm text-green-700 mb-4">
                                Your listing will be reviewed by our team within 24 hours. Once approved, it will be live and ready to accept bookings!
                            </p>
                            <div className="flex items-center space-x-2">
                                <input type="checkbox" id="terms" className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary" />
                                <label htmlFor="terms" className="text-sm text-gray-700">
                                    I agree to the <a href="#" className="text-primary hover:text-primary-dark">Terms of Service</a> and <a href="#" className="text-primary hover:text-primary-dark">Listing Guidelines</a>
                                </label>
                            </div>
                        </div>
                    </motion.div>
                );

            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen bg-bgLight">
            <Navbar />

            <main className="pt-20">
                {/* Hero Section */}
                <section className="bg-main text-white py-16">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                        >
                            <h1 className="text-4xl lg:text-5xl font-bold mb-4 font-lexend">
                                Create Your Listing
                            </h1>
                            <p className="text-xl text-white/90">
                                Share your vehicle with travelers and start earning
                            </p>
                        </motion.div>
                    </div>
                </section>

                {/* Progress Bar */}
                <section className="py-8 bg-white border-b border-gray-200">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex items-center justify-between mb-4">
                            {steps.map((step) => (
                                <div key={step.id} className="flex items-center">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                                        step.id <= currentStep
                                            ? 'bg-primary text-white'
                                            : 'bg-gray-200 text-gray-500'
                                    }`}>
                                        {step.id}
                                    </div>
                                    {step.id < totalSteps && (
                                        <div className={`w-16 h-1 mx-2 ${
                                            step.id < currentStep ? 'bg-primary' : 'bg-gray-200'
                                        }`} />
                                    )}
                                </div>
                            ))}
                        </div>
                        <div className="text-center">
                            <h2 className="text-lg font-bold text-gray-900">{steps[currentStep - 1].title}</h2>
                            <p className="text-gray-600">{steps[currentStep - 1].description}</p>
                        </div>
                    </div>
                </section>

                {/* Form Content */}
                <section className="py-12">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="bg-white rounded-2xl shadow-lg p-8">
                            {renderStepContent()}

                            {/* Navigation Buttons */}
                            <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
                                <button
                                    onClick={prevStep}
                                    disabled={currentStep === 1}
                                    className={`px-6 py-3 rounded-lg font-bold transition-colors ${
                                        currentStep === 1
                                            ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                            : 'bg-secondary text-black hover:bg-gray-300'
                                    }`}
                                >
                                    Previous
                                </button>

                                <button
                                    onClick={nextStep}
                                    disabled={currentStep === totalSteps}
                                    className={`px-6 py-3 rounded-lg font-bold transition-colors ${
                                        currentStep === totalSteps
                                            ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                            : 'bg-primary text-white hover:bg-primary-dark'
                                    }`}
                                >
                                    {currentStep === totalSteps ? 'Publish Listing' : 'Next'}
                                </button>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
};

export default CreateListing;
