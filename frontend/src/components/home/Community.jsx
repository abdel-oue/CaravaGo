import { motion } from 'framer-motion';

const Community = () => {
    const users = [
        { name: 'Andrei', date: 'February 2025', image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80' },
        { name: 'Vyacheslav', date: 'August 2024', image: 'https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?auto=format&fit=crop&w=300&q=80' },
        { name: 'Tanya', date: 'July 2023', image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=300&q=80' },
    ];

    return (
        <section className="py-24 bg-white overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col-reverse lg:flex-row items-center gap-16">

                    {/* Left Side: Image collage */}
                    <div className="w-full lg:w-1/2">
                        <div className="grid grid-cols-2 gap-4">
                            {users.map((user, i) => (
                                <motion.div
                                    key={i}
                                    className={`relative rounded-2xl overflow-hidden shadow-lg aspect-[4/5] ${i === 1 ? 'mt-12' : ''}`}
                                    initial={{ opacity: 0, x: -20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.2 }}
                                >
                                    <img src={user.image} alt={user.name} className="w-full h-full object-cover" />
                                    <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/80 to-transparent p-6 text-white">
                                        <p className="font-bold text-lg">{user.name}</p>
                                        <p className="text-xs opacity-80">{user.date}</p>
                                    </div>
                                </motion.div>
                            ))}
                            {/* Fake 4th item for grid balance */}
                            <div className="rounded-2xl bg-bgLight flex items-center justify-center aspect-[4/5] mt-12">
                                <span className="text-4xl">🚐</span>
                            </div>
                        </div>
                    </div>

                    {/* Right Side: Text */}
                    <div className="w-full lg:w-1/2">
                        <div className="h-1 w-20 bg-primary mb-6"></div>
                        <h5 className="text-primary font-bold mb-2 uppercase tracking-wider text-sm">Meet the community</h5>
                        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-8 font-lexend leading-tight">
                            Your reviews on CaravaGo,<br /> a never-ending story
                        </h2>

                        <div className="flex items-center space-x-1 mb-4 text-secondary text-3xl">
                            <span>★</span><span>★</span><span>★</span><span>★</span><span>★</span>
                        </div>
                        <p className="text-2xl font-bold text-main mb-2">4.9/5</p>
                        <p className="text-gray-600 mb-8">
                            A service rated 4.9/5<br />
                            Based on <span className="font-bold text-gray-800">369,976 user reviews</span>
                        </p>

                        <a href="#reviews" className="text-primary font-bold text-lg hover:underline inline-flex items-center">
                            Read more reviews
                            <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </a>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Community;
