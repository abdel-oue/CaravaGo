import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const vehicleTypes = [
    {
        name: 'Campervan',
        subtitle: 'Discreet & fun',
        description: 'The campervan is accessible and versatile. Ideal for outdoor enthusiasts and renters who want to feel closer to nature.',
        color: 'bg-pink-100', // Pastel Pink
        link: '#',
        icon: '🚐'
    },
    {
        name: 'Large campervan',
        subtitle: 'Exotic & autonomous',
        description: 'Perfect for couples and short family road trips, the large campervan rhymes with practicality. Handy and compact, it will take you everywhere.',
        color: 'bg-blue-100', // Pastel Blue
        link: '#',
        icon: '🚍'
    },
    {
        name: 'Low profile motorhome',
        subtitle: 'Compact & equipped',
        description: 'The most compact vehicle of all with all the necessary equipment. A little bonus? Its aerodynamic shape is slightly better for your wallet and the planet.',
        color: 'bg-yellow-100', // Pastel Yellow
        link: '#',
        icon: '🚐'
    },
    {
        name: 'Coachbuilt motorhome',
        subtitle: 'Family-friendly & comfortable',
        description: 'Great comfort for larger crews! A coachbuilt offers you a real taste of freedom while allowing you autonomy during your getaways. Kids will love it.',
        color: 'bg-pink-100', // Pastel Pink
        link: '#',
        icon: '🚌'
    },
];

const VehicleTypes = () => {
    return (
        <section className="py-24 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
                    <div className="max-w-xl">
                        <div className="h-1 w-20 bg-primary mb-6"></div>
                        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 font-lexend leading-tight">
                            Looking for a motorhome or a campervan?
                        </h2>
                    </div>
                    <div className="max-w-lg">
                        <p className="text-gray-600 text-lg leading-relaxed">
                            Asking yourself the right questions before hiring a motorhome, campervan or large campervan is the key to a stress-free road trip. There is a perfect vehicle for any travel plan. Don't worry, we'll introduce you.
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {vehicleTypes.map((vehicle, index) => (
                        <motion.div
                            key={index}
                            className="group text-center"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                        >
                            {/* Image/Icon container with pastel blob */}
                            <div className={`relative rounded-3xl ${vehicle.color} aspect-video mb-8 flex items-center justify-center overflow-hidden transition-transform duration-300 group-hover:-translate-y-2`}>
                                <span className="text-8xl drop-shadow-xl">{vehicle.icon}</span>
                            </div>

                            <h3 className="text-xl font-bold text-gray-900 mb-1 font-lexend">{vehicle.name}</h3>
                            <p className="text-main font-semibold mb-3 text-sm uppercase tracking-wide">{vehicle.subtitle}</p>
                            <p className="text-gray-500 text-sm mb-6 leading-relaxed line-clamp-4 min-h-[80px]">{vehicle.description}</p>

                            <Link to={vehicle.link} className="text-primary font-bold text-sm inline-flex items-center hover:underline">
                                Rent a {vehicle.name.toLowerCase()}
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default VehicleTypes;
