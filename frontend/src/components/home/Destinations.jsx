import { motion } from 'framer-motion';

const destinations = [
    { name: 'Chianti', location: 'Florence', image: 'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?auto=format&fit=crop&w=600&q=80' },
    { name: 'Playa de Benijo', location: 'Tenerife', image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80' },
    { name: 'Peak District', location: 'Manchester', image: 'https://images.unsplash.com/photo-1605723517503-3cadb5818a0c?auto=format&fit=crop&w=600&q=80' },
    { name: 'Neuschwanstein', location: 'Bavaria', image: 'https://images.unsplash.com/photo-1543783207-ec64e4d95325?auto=format&fit=crop&w=600&q=80' },
    { name: 'Coastal Route', location: 'Portugal', image: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=600&q=80' },
    { name: 'Swiss Alps', location: 'Switzerland', image: 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=600&q=80' },
];

const cities = [
    'Paris', 'Málaga', 'London', 'Edinburgh', 'Lisbon', 'Rome', 'Barcelona', 'Dublin',
];

const Destinations = () => {
    // Top cities for scroll row


    return (
        <section className="py-24 bg-bgLight">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-12">
                    <div className="h-1 w-20 bg-primary mb-6"></div>
                    <h5 className="text-primary font-bold mb-2 uppercase tracking-wider text-sm">Our destinations</h5>
                    <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 font-lexend max-w-2xl">
                        In a motorhome? Anything is possible
                    </h2>
                    <p className="text-gray-600 text-lg max-w-3xl">
                        Nothing is easier than hitting the road. Hire a motorhome in the UK or Europe and let the adventure begin, for a few days or several weeks. The choice is yours.
                    </p>
                </div>

                {/* Grid of Image Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                    {destinations.map((dest, index) => (
                        <motion.div
                            key={index}
                            className={`group cursor-pointer rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 bg-white ${index === 2 || index === 3 ? 'lg:col-span-2' : ''}`}
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <div className="relative h-48 lg:h-56 overflow-hidden">
                                <img
                                    src={dest.image}
                                    alt={dest.name}
                                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                                />
                            </div>
                            <div className="p-4 flex items-start space-x-3">
                                <div className="mt-1 text-primary">
                                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                                    </svg>
                                </div>
                                <div>
                                    <h4 className="font-bold text-gray-900 text-lg">{dest.name}</h4>
                                    <p className="text-gray-500 text-sm">{dest.location}</p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* City Pills */}
                <div className="flex flex-wrap gap-2 mb-16">
                    {cities.map((city, i) => (
                        <span key={i} className="bg-white px-6 py-3 rounded-full shadow-sm text-gray-700 font-medium hover:bg-gray-50 cursor-pointer border border-gray-100 transition-colors">
                            {city}
                        </span>
                    ))}
                </div>

                <div className="text-center">
                    <a href="#rent" className="inline-block bg-primary text-white px-10 py-4 rounded-full hover:bg-primary-dark transition-all font-bold text-lg">
                        Rent an RV
                        <svg className="w-5 h-5 inline-block ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </a>
                </div>
            </div>
        </section>
    );
};

export default Destinations;
