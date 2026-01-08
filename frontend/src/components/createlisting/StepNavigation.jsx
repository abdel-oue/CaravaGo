import { motion } from 'framer-motion';
import { FaCheck } from 'react-icons/fa';

const StepNavigation = ({ currentStep, steps }) => {
    return (
        <div className="flex justify-center mb-8">
            <div className="flex items-center space-x-4">
                {steps.map((step, index) => (
                    <div key={step.id} className="flex items-center">
                        <motion.div
                            className={`flex items-center justify-center w-12 h-12 rounded-full border-2 transition-all ${
                                currentStep >= step.id
                                    ? 'bg-primary border-primary text-white'
                                    : 'border-gray-300 text-gray-400'
                            }`}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            {currentStep > step.id ? (
                                <FaCheck className="text-sm" />
                            ) : (
                                <step.icon className="text-sm" />
                            )}
                        </motion.div>
                        <div className="ml-3 hidden md:block">
                            <div className={`text-sm font-medium ${
                                currentStep >= step.id ? 'text-gray-900' : 'text-gray-400'
                            }`}>
                                {step.title}
                            </div>
                            <div className="text-xs text-gray-500">{step.description}</div>
                        </div>
                        {index < steps.length - 1 && (
                            <div className={`w-12 h-0.5 mx-4 ${
                                currentStep > step.id ? 'bg-primary' : 'bg-gray-300'
                            }`} />
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default StepNavigation;