import { motion } from 'framer-motion';
import { FaCheck } from 'react-icons/fa';

const VerticalStepNavigation = ({
    steps,
    currentStep,
    completedSteps,
    goToStep
}) => {
    return (
        <div className="flex-1">
            <div className="mb-8">
                <div className="flex flex-col space-y-4">
                    {steps.map((step) => (
                        <motion.button
                            key={step.id}
                            onClick={() => goToStep(step.id)}
                            disabled={!completedSteps.includes(step.id - 1) && step.id > currentStep}
                            className={`flex items-center p-4 rounded-lg border-2 transition-all text-left ${
                                currentStep === step.id
                                    ? 'border-primary bg-primary/5'
                                    : completedSteps.includes(step.id)
                                        ? 'border-green-500 bg-green-50 hover:bg-green-100'
                                        : step.id <= currentStep || completedSteps.includes(step.id - 1)
                                            ? 'border-gray-300 hover:border-primary hover:bg-primary/5'
                                            : 'border-gray-200 opacity-50 cursor-not-allowed'
                            }`}
                            whileHover={step.id <= currentStep || completedSteps.includes(step.id - 1) ? { scale: 1.02 } : {}}
                            whileTap={step.id <= currentStep || completedSteps.includes(step.id - 1) ? { scale: 0.98 } : {}}
                        >
                            <div className={`flex items-center justify-center w-10 h-10 rounded-full mr-4 ${
                                completedSteps.includes(step.id)
                                    ? 'bg-green-500 text-white'
                                    : currentStep === step.id
                                        ? 'bg-primary text-white'
                                        : 'bg-gray-200 text-gray-500'
                            }`}>
                                {completedSteps.includes(step.id) ? (
                                    <FaCheck className="text-sm" />
                                ) : (
                                    <step.icon className="text-sm" />
                                )}
                            </div>
                            <div className="flex-1">
                                <div className="font-medium text-gray-900">{step.title}</div>
                                <div className="text-sm text-gray-500">{step.description}</div>
                            </div>
                            <div className={`text-sm ${
                                completedSteps.includes(step.id) ? 'text-green-600' :
                                currentStep === step.id ? 'text-primary' : 'text-gray-400'
                            }`}>
                                {completedSteps.includes(step.id) ? 'Completed' :
                                 currentStep === step.id ? 'In Progress' : 'Pending'}
                            </div>
                        </motion.button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default VerticalStepNavigation;