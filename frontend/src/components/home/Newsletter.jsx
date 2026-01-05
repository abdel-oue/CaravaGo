import { motion } from 'framer-motion';

const Newsletter = () => {
    return (
        <section className="py-24 bg-main text-white relative overflow-hidden">
            {/* Background Decor */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                >
                    <h2 className="text-3xl md:text-4xl font-bold mb-6 font-lexend">Subscribe to the newsletter</h2>
                    <p className="text-white/90 mb-10 text-lg max-w-2xl mx-auto font-light">
                        Join the community and receive exclusive offers, destination ideas, tips for owners and much more.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                        <input
                            type="email"
                            placeholder="Email address"
                            className="flex-1 px-6 py-4 rounded-xl text-black focus:ring-4 focus:ring-primary/30 focus:outline-none transition-shadow"
                        />
                        <button className="bg-primary text-white px-8 py-4 rounded-xl hover:bg-primary-dark hover:shadow-lg transition-all font-bold text-lg whitespace-nowrap">
                            Sign up
                        </button>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default Newsletter;
