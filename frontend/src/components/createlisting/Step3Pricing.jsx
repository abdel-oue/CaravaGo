import { motion } from 'framer-motion';

const Step3Pricing = ({ formData, errors, updateFormData }) => {
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
                        placeholder="150"
                        min="1"
                        step="1"
                        value={formData.dailyRate}
                        onChange={(e) => updateFormData('dailyRate', e.target.value)}
                        className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${
                            errors.dailyRate ? 'border-red-500' : 'border-gray-300'
                        }`}
                    />
                    {errors.dailyRate && <p className="text-red-500 text-sm mt-1">{errors.dailyRate}</p>}

                    <p className="text-sm text-gray-500 mt-2">
                        Set a competitive price. You can always change it later.
                    </p>
                </div>

                <div>
                    <label className="block text-sm font-bold text-gray-800 mb-2">Minimum Rental Period</label>
                    <select
                        value={formData.minRentalPeriod || '1'}
                        onChange={(e) => updateFormData('minRentalPeriod', e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    >
                        <option value="1">1 day</option>
                        <option value="2">2 days</option>
                        <option value="3">3 days</option>
                        <option value="7">1 week</option>
                    </select>
                </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-medium text-blue-900 mb-2">Pricing Tips</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Research similar vehicles in your area</li>
                    <li>• Factor in fuel, maintenance, and insurance costs</li>
                    <li>• Consider seasonal demand variations</li>
                    <li>• Start with competitive pricing to build reviews</li>
                </ul>
            </div>
        </motion.div>
    );
};

export default Step3Pricing;