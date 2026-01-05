import { motion } from 'framer-motion';

const Reviews = () => {
    return (
        <section className="py-24 bg-white relative overflow-hidden">
            {/* Background blobs */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-bgLight rounded-full blur-3xl opacity-50 z-0 pointer-events-none"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="text-center mb-16">
                    <motion.h2
                        className="text-3xl md:text-4xl font-bold text-black mb-6 font-lexend"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        Your reviews on CaravaGo, a never-ending story
                    </motion.h2>

                    <motion.div
                        className="flex items-center justify-center space-x-4 mb-4"
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                    >
                        <div className="flex space-x-1">
                            {[1, 2, 3, 4, 5].map((star, i) => (
                                <motion.span
                                    key={i}
                                    className="text-4xl text-primary"
                                    initial={{ opacity: 0, rotate: -30 }}
                                    whileInView={{ opacity: 1, rotate: 0 }}
                                    transition={{ delay: 0.2 + (i * 0.1) }}
                                >
                                    ★
                                </motion.span>
                            ))}
                        </div>
                        <span className="text-4xl font-bold text-main">4.9/5</span>
                    </motion.div>

                    <motion.p
                        className="text-black/70 text-xl max-w-2xl mx-auto"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.8 }}
                    >
                        That's how our users rate CaravaGo! Rated 4.9 with <span className="font-semibold text-main">369,245 reviews</span>
                    </motion.p>
                </div>
            </div>
        </section>
    );
};

export default Reviews;
