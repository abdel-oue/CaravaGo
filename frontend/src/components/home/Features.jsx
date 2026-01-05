import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const Features = () => {
    return (
        <section className="py-16 bg-bgLight -mt-20 relative z-30">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

                    {/* Card 1: Great Deals */}
                    <motion.div
                        className="bg-white rounded-2xl p-8 shadow-lg flex flex-col items-start justify-between min-h-[320px] relative overflow-hidden group"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <div className="relative z-10">
                            <h3 className="text-2xl font-bold text-gray-900 mb-3 font-lexend">Great deals all year round</h3>
                            <p className="text-gray-600 mb-6">The motorhome is the best way to travel <span className="bg-yellow-100 px-1">without breaking the bank!</span></p>
                        </div>
                        <div className="absolute right-0 bottom-0 w-32 h-32 bg-yellow-100 rounded-tl-full opacity-50 z-0"></div>

                        <Link to="#deals" className="relative z-10 bg-pink-100 text-primary px-6 py-3 rounded-full font-bold text-sm hover:bg-pink-200 transition-colors inline-flex items-center">
                            All the best deals
                            <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </Link>
                    </motion.div>

                    {/* Card 2: Reviews */}
                    <motion.div
                        className="bg-white rounded-2xl p-8 shadow-lg flex flex-col items-start justify-between min-h-[320px]"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                    >
                        <div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-3 font-lexend">Your reviews on CaravaGo, a never-ending story</h3>
                            <div className="flex text-secondary text-2xl mb-2">★★★★★</div>
                            <p className="text-4xl font-bold text-gray-900 mb-2">4.9/5</p>
                            <p className="text-gray-500 text-sm">Based on 369,976 reviews</p>
                        </div>
                    </motion.div>

                    {/* Card 3: Owner */}
                    <motion.div
                        className="bg-main text-white rounded-2xl p-8 shadow-lg flex flex-col items-start justify-between min-h-[320px] relative overflow-hidden"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                    >
                        <div className="relative z-10">
                            <h3 className="text-2xl font-bold mb-3 font-lexend">Are you an owner?</h3>
                            <p className="text-white/80 mb-6">Hire and make the most of your vehicle with complete confidence.</p>
                        </div>
                        {/* Decor */}
                        <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-bl-full pointer-events-none"></div>

                        <Link to="#owner" className="relative z-10 bg-primary text-white px-6 py-3 rounded-full font-bold text-sm hover:bg-primary-dark transition-colors inline-flex items-center shadow-lg">
                            Find out more
                            <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </Link>
                    </motion.div>

                </div>
            </div>
        </section>
    );
};

export default Features;
