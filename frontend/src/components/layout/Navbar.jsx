import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FaUser, FaSignOutAlt, FaChevronDown } from 'react-icons/fa';
import logo from '../../public/logo.png';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
    const { user, logout } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [profileDropdown, setProfileDropdown] = useState(false);
    const profileRef = useRef(null);

    // Generate initials from user's name
    const getInitials = (name) => {
        if (!name) return 'U';
        const names = name.trim().split(' ');
        if (names.length === 1) return names[0].charAt(0).toUpperCase();
        return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase();
    };

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

    // Close profile dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (profileRef.current && !profileRef.current.contains(event.target)) {
                setProfileDropdown(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <header
            className={`fixed w-full top-0 z-50 transition-all duration-500 ease-in-out ${scrolled
                ? 'bg-white shadow-md py-2'
                : 'bg-transparent py-4'
                }`}
        >
            <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-12">
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
                        <Link
                            to="/search"
                            className={`text-sm font-medium transition-colors hover:text-primary ${scrolled ? 'text-gray-600' : 'text-white/90 hover:text-white'}`}
                        >
                            Find your ride
                        </Link>
                        <Link
                            to="/create-listing"
                            className={`text-sm font-medium transition-colors hover:text-primary ${scrolled ? 'text-gray-600' : 'text-white/90 hover:text-white'}`}
                        >
                            Create a listing
                        </Link>

                        {user ? (
                            <div className={`relative pl-4 border-l ${scrolled ? 'border-gray-200' : 'border-white/20'}`}>
                                <div
                                    ref={profileRef}
                                    onClick={() => setProfileDropdown(!profileDropdown)}
                                    className={`flex items-center gap-3 cursor-pointer p-2 rounded-lg transition-colors ${
                                        scrolled ? 'hover:bg-gray-100' : 'hover:bg-white/10'
                                    }`}
                                >
                                    {/* Profile Picture or Initials */}
                                    {user.avatar_url ? (
                                        <img
                                            src={user.avatar_url}
                                            alt="Profile"
                                            className="w-8 h-8 rounded-full object-cover border-2 border-white"
                                        />
                                    ) : (
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2 border-white ${
                                            scrolled ? 'bg-primary text-white' : 'bg-white/20 text-white'
                                        }`}>
                                            {getInitials(user.name)}
                                        </div>
                                    )}

                                    {/* Name and Email */}
                                    <div className="flex flex-col">
                                        <span className={`text-sm font-medium leading-tight ${scrolled ? 'text-gray-800' : 'text-white'}`}>
                                            {user.name?.split(' ')[0]}
                                        </span>
                                        <span className={`text-xs leading-tight ${scrolled ? 'text-gray-500' : 'text-white/70'}`}>
                                            {user.email}
                                        </span>
                                    </div>

                                    {/* Dropdown Arrow */}
                                    <FaChevronDown className={`text-xs transition-transform ${profileDropdown ? 'rotate-180' : ''} ${scrolled ? 'text-gray-400' : 'text-white/70'}`} />
                                </div>

                                {/* Profile Dropdown */}
                                <AnimatePresence>
                                    {profileDropdown && (
                                        <motion.div
                                            initial={{ opacity: 0, y: -10, scale: 0.95 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, y: -10, scale: 0.95 }}
                                            className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50"
                                        >
                                            <Link
                                                to="/profile"
                                                onClick={() => setProfileDropdown(false)}
                                                className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors"
                                            >
                                                <FaUser className="text-gray-400" />
                                                <span className="text-sm font-medium">View Profile</span>
                                            </Link>
                                            <div className="border-t border-gray-100"></div>
                                            <button
                                                onClick={() => {
                                                    setProfileDropdown(false);
                                                    logout();
                                                }}
                                                className="flex items-center gap-3 w-full px-4 py-3 text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors"
                                            >
                                                <FaSignOutAlt className="text-gray-400" />
                                                <span className="text-sm font-medium">Disconnect</span>
                                            </button>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
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
                            <Link
                                to="/search"
                                className="block text-gray-600 hover:text-main font-medium text-lg"
                                onClick={() => setIsOpen(false)}
                            >
                                Find your ride
                            </Link>
                            <Link
                                to="/create-listing"
                                className="block text-gray-600 hover:text-main font-medium text-lg"
                                onClick={() => setIsOpen(false)}
                            >
                                Create a listing
                            </Link>
                            <a
                                href="#help"
                                className="block text-gray-600 hover:text-main font-medium text-lg"
                                onClick={() => setIsOpen(false)}
                            >
                                Help
                            </a>
                            <div className="h-px bg-gray-100 my-2"></div>
                            {user ? (
                                <>
                                    <div className="flex items-center gap-3 py-2">
                                        {user.avatar_url ? (
                                            <img
                                                src={user.avatar_url}
                                                alt="Profile"
                                                className="w-10 h-10 rounded-full object-cover border-2 border-gray-200"
                                            />
                                        ) : (
                                            <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold bg-primary text-white border-2 border-gray-200">
                                                {getInitials(user.name)}
                                            </div>
                                        )}
                                        <div>
                                            <span className="block text-gray-800 font-medium">{user.name?.split(' ')[0]}</span>
                                            <span className="block text-gray-500 text-sm">{user.email}</span>
                                        </div>
                                    </div>
                                    <div className="h-px bg-gray-100 my-2"></div>
                                    <Link
                                        to="/profile"
                                        className="flex items-center gap-3 text-gray-600 hover:text-main font-medium text-lg py-2"
                                        onClick={() => setIsOpen(false)}
                                    >
                                        <FaUser className="text-gray-400" />
                                        View Profile
                                    </Link>
                                    <button
                                        onClick={() => {
                                            setIsOpen(false);
                                            logout();
                                        }}
                                        className="flex items-center gap-3 w-full text-left text-red-600 hover:text-red-700 font-bold py-2"
                                    >
                                        <FaSignOutAlt className="text-red-400" />
                                        Disconnect
                                    </button>
                                </>
                            ) : (
                                <>
                                    <Link to="/signin" className="block text-gray-600 hover:text-main font-medium text-lg py-2" onClick={() => setIsOpen(false)}>Sign in</Link>
                                    <Link to="/signup" className="block text-center bg-primary text-white px-4 py-3 rounded-xl font-bold text-lg shadow-lg" onClick={() => setIsOpen(false)}>Sign up</Link>
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
