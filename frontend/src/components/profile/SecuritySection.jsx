import { motion } from 'framer-motion';

const SecuritySection = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-xl shadow-lg p-6"
    >
      <h2 className="text-lg font-bold text-gray-900 mb-4 font-lexend">Security Settings</h2>

      <div className="space-y-4">
        <div className="p-4 bg-gray-50 rounded-lg">
          <div className="flex justify-between items-center">
            <div>
              <h4 className="font-semibold text-gray-900 text-sm">Password</h4>
              <p className="text-gray-600 text-xs">Last changed 30 days ago</p>
            </div>
            <button className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg font-semibold transition-colors text-sm">
              Change
            </button>
          </div>
        </div>

        <div className="p-4 bg-gray-50 rounded-lg">
          <div className="flex justify-between items-center">
            <div>
              <h4 className="font-semibold text-gray-900 text-sm">Two-Factor Authentication</h4>
              <p className="text-gray-600 text-xs">Add extra security layer</p>
            </div>
            <span className="text-xs text-gray-500 bg-white px-2 py-1 rounded">Disabled</span>
          </div>
        </div>

        <div className="p-4 bg-red-50 rounded-lg border border-red-200">
          <div className="flex justify-between items-center">
            <div>
              <h4 className="font-semibold text-red-900 text-sm">Delete Account</h4>
              <p className="text-red-700 text-xs">Permanently remove your account</p>
            </div>
            <button className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-lg font-semibold transition-colors text-xs">
              Delete
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default SecuritySection;
