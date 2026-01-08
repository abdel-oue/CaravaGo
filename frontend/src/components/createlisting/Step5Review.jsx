import { motion } from 'framer-motion';
import { FaRocket, FaCheck } from 'react-icons/fa';

const Step5Review = ({ formData, selectedLocation }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
        >
            <div className="text-center">
                <FaRocket className="mx-auto text-6xl text-primary mb-4" />
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Ready to Publish!</h3>
                <p className="text-gray-600">
                    Review your listing details and publish when you're ready.
                </p>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                <h4 className="font-medium text-green-900 mb-3">Your listing is almost ready!</h4>
                <div className="space-y-2 text-sm text-green-800">
                    <div className="flex items-center">
                        <FaCheck className="text-green-600 mr-2" />
                        Basic information completed
                    </div>
                    <div className="flex items-center">
                        <FaCheck className="text-green-600 mr-2" />
                        Details and features added
                    </div>
                    <div className="flex items-center">
                        <FaCheck className="text-green-600 mr-2" />
                        Pricing set
                    </div>
                    <div className="flex items-center">
                        <FaCheck className="text-green-600 mr-2" />
                        Photos uploaded
                    </div>
                </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-6">
                <h4 className="font-medium text-gray-900 mb-4">What happens next?</h4>
                <div className="space-y-3 text-sm text-gray-700">
                    <div className="flex items-start">
                        <div className="w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-xs font-bold mr-3 mt-0.5">1</div>
                        <div>Our team will review your listing within 24 hours</div>
                    </div>
                    <div className="flex items-start">
                        <div className="w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-xs font-bold mr-3 mt-0.5">2</div>
                        <div>Once approved, your listing goes live</div>
                    </div>
                    <div className="flex items-start">
                        <div className="w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-xs font-bold mr-3 mt-0.5">3</div>
                        <div>Start receiving booking inquiries</div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default Step5Review;