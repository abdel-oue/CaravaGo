import { motion } from 'framer-motion';

const HeroSection = () => {
    return (
        <section className="relative bg-gradient-to-br from-main via-main-dark to-main pt-32 pb-20 overflow-hidden">
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 font-lexend">
                        List Your Vehicle on CaravaGo
                    </h1>
                    <p className="text-xl text-white/90 max-w-3xl mx-auto mb-8">
                        Join Morocco's premier campervan rental platform. Share your vehicle and start earning today.
                    </p>
                </motion.div>
            </div>
        </section>
    );
};

export default HeroSection;