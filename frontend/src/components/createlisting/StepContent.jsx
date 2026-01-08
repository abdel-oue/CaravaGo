import Step1BasicInfo from './Step1BasicInfo';
import Step2Details from './Step2Details';
import Step3Pricing from './Step3Pricing';
import Step4Photos from './Step4Photos';
import Step5Review from './Step5Review';

const StepContent = ({
    currentStep,
    formData,
    errors,
    updateFormData,
    query,
    setQuery,
    suggestions,
    locationLoading,
    selectedLocation,
    selectLocation,
    showDropdown,
    handleInputFocus,
    handleInputBlur
}) => {
    const stepProps = {
        formData,
        errors,
        updateFormData,
        query,
        setQuery,
        suggestions,
        locationLoading,
        selectedLocation,
        selectLocation,
        showDropdown,
        handleInputFocus,
        handleInputBlur
    };

    switch (currentStep) {
        case 1:
            return <Step1BasicInfo {...stepProps} />;
        case 2:
            return <Step2Details {...stepProps} />;
        case 3:
            return <Step3Pricing {...stepProps} />;
        case 4:
            return <Step4Photos {...stepProps} />;
        case 5:
            return <Step5Review {...stepProps} />;
        default:
            return null;
    }
};

export default StepContent;