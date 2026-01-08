import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import logo from '../../public/logo.png';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
    const { user, logout } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            const isScrolled = window.scrollY > 20;
            if (isScrolled !== scrolled) {
                setScrolled(isScrolled);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [scrolled]);

    return (
        <header
            className={`fixed w-full top-0 z-50 transition-all duration-500 ease-in-out ${scrolled
                ? 'bg-white shadow-md py-2'
                : 'bg-transparent py-4'
                }`}
        >
            <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-20">
                    <div className="flex items-center">
                        <Link to="/" className="flex items-center group">
                            {/* Filter for white logo on transparent bg if logo is dark */}
                            <img
                                src={logo}
                                alt="CaravaGo"
                                className={`h-32 w-auto transition-transform duration-300 group-hover:scale-105 ${!scrolled && 'brightness-0 invert'}`}
                            />
                        </Link>
                    </div>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center space-x-8">
                        {['Download the app', 'Create a listing', 'Help'].map((item) => (
                            <a
                                key={item}
                                href={`#${item.toLowerCase().replace(/ /g, '-')}`}
                                className={`text-sm font-medium transition-colors hover:text-primary ${scrolled ? 'text-gray-600' : 'text-white/90 hover:text-white'
                                    }`}
                            >
                                {item}
                            </a>
                        ))}

                        {user ? (
                            <div className={`flex items-center gap-4 pl-4 border-l ${scrolled ? 'border-gray-200' : 'border-white/20'}`}>
                                <Link
                                    to="/profile"
                                    className={`text-sm font-medium transition-colors hover:text-primary ${scrolled ? 'text-gray-600' : 'text-white/90 hover:text-white'}`}
                                >
                                    Profile
                                </Link>
                                <span className={`text-sm font-medium ${scrolled ? 'text-gray-800' : 'text-white'}`}>
                                    Hello, <span className={scrolled ? 'text-main' : 'text-white font-bold'}>{user.name?.split(' ')[0]}</span>
                                </span>
                                <button
                                    onClick={logout}
                                    className={`px-4 py-2 rounded-lg transition-colors text-sm font-medium ${scrolled
                                        ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                        : 'bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm'
                                        }`}
                                >
                                    Logout
                                </button>
                            </div>
                        ) : (
                            <div className={`flex items-center gap-3 pl-4 border-l ${scrolled ? 'border-gray-200' : 'border-white/20'}`}>
                                <Link
                                    to="/signin"
                                    className={`font-medium transition-colors text-sm hover:text-primary ${scrolled ? 'text-gray-600' : 'text-white/90 hover:text-white'
                                        }`}
                                >
                                    Sign in
                                </Link>
                                <Link
                                    to="/signup"
                                    className={`px-6 py-2.5 rounded-full font-bold text-sm transition-all shadow-md hover:-translate-y-0.5 ${scrolled
                                        ? 'bg-primary text-white hover:bg-primary-dark'
                                        : 'bg-white text-main hover:bg-gray-100'
                                        }`}
                                >
                                    Sign up
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Mobile menu button */}
                    <div className="md:hidden">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className={`p-2 transition-colors ${scrolled ? 'text-gray-600 hover:text-main' : 'text-white hover:text-white/80'}`}
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                {isOpen ? (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                ) : (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                )}
                            </svg>
                        </button>
                    </div>
                </div>
            </nav>

            {/* Mobile Menu Dropdown */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        className="md:hidden bg-white/95 backdrop-blur-xl border-t border-gray-100 shadow-xl"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                    >
                        <div className="px-6 py-6 space-y-4">
                            {['Download the app', 'Create a listing', 'Help'].map((item) => (
                                <a
                                    key={item}
                                    href={`#${item.toLowerCase().replace(/ /g, '-')}`}
                                    className="block text-gray-600 hover:text-main font-medium text-lg"
                                >
                                    {item}
                                </a>
                            ))}
                            <div className="h-px bg-gray-100 my-2"></div>
                            {user ? (
                                <>
                                    <span className="block text-gray-800 py-2">Welcome, {user.name?.split(' ')[0]}</span>
                                    <Link to="/profile" className="block text-gray-600 hover:text-main font-medium text-lg py-2">Profile</Link>
                                    <button
                                        onClick={logout}
                                        className="block w-full text-left text-primary font-bold py-2"
                                    >
                                        Logout
                                    </button>
                                </>
                            ) : (
                                <>
                                    <Link to="/signin" className="block text-gray-600 hover:text-main font-medium text-lg py-2">Sign in</Link>
                                    <Link to="/signup" className="block text-center bg-primary text-white px-4 py-3 rounded-xl font-bold text-lg shadow-lg">Sign up</Link>
                                </>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
};

export default Navbar;
