import { motion } from 'framer-motion';

const OwnerCTA = () => {
    return (
        <>
            {/* Simple CTA */}
            <section className="py-20 bg-bgLight">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-3xl md:text-4xl font-bold text-black mb-4 font-lexend">Are you an owner?</h2>
                        <p className="text-lg text-black/70 mb-8 max-w-2xl mx-auto">
                            Hire and make the most of your vehicle with complete confidence
                        </p>
                        <a href="#owner" className="inline-flex bg-primary text-white px-8 py-3 rounded-xl hover:bg-primary-dark hover:shadow-lg hover:-translate-y-1 transition-all duration-300 font-bold text-lg items-center">
                            Find out more
                            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </a>
                    </motion.div>
                </div>
            </section>

            {/* Detailed Process */}
            <section className="py-24 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        className="text-center mb-16"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-3xl md:text-4xl font-bold text-black mb-4 max-w-4xl mx-auto font-lexend">
                            Rent out your campervan in complete security
                        </h2>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mt-12 relative">
                        {/* Connector Line (Desktop) */}
                        <div className="hidden md:block absolute top-8 left-[16%] right-[16%] h-1 bg-gray-100 -z-10"></div>

                        {[
                            { title: 'Create your listing', desc: 'Availability, pricing, options... You stay in control!', step: '01' },
                            { title: 'Receive requests', desc: 'Consult your dashboard and manage all your requests.', step: '02' },
                            { title: 'Departure is imminent', desc: 'Hand the keys to your renters and make your vehicle profitable.', step: '03' }
                        ].map((item, index) => (
                            <motion.div
                                key={index}
                                className="text-center bg-white"
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.2 }}
                            >
                                <div className="w-16 h-16 bg-main text-white rounded-full mx-auto mb-6 flex items-center justify-center text-2xl font-bold shadow-lg ring-4 ring-white">
                                    {item.step}
                                </div>
                                <h3 className="text-xl font-bold text-black mb-3">{item.title}</h3>
                                <p className="text-black/60 leading-relaxed px-4">{item.desc}</p>
                            </motion.div>
                        ))}
                    </div>

                    <motion.div
                        className="text-center mt-16"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.6 }}
                    >
                        <a href="#create-listing" className="inline-block bg-primary text-white px-8 py-3 rounded-xl hover:bg-primary-dark hover:shadow-lg transition-all font-bold text-lg mr-4 mb-4">
                            Create your listing
                        </a>
                        <a href="#owner-info" className="inline-block text-main hover:text-primary font-bold text-lg transition-colors">
                            How it works
                        </a>
                    </motion.div>
                </div>
            </section>
        </>
    );
};

export default OwnerCTA;
