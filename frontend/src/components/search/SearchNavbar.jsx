import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FaSearch, FaChevronDown, FaUser, FaBars, FaQuestionCircle, FaGlobe, FaCarSide, FaRoute, FaLifeRing, FaSignInAlt, FaUserPlus, FaPlusCircle, FaMobileAlt } from 'react-icons/fa';
import logo from '/src/public/logo.png';

const SearchNavbar = ({ destination, startDate, endDate, onSearchChange }) => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [showHelpMenu, setShowHelpMenu] = useState(false);
    const [showUserMenu, setShowUserMenu] = useState(false);
    const [showMobileMenu, setShowMobileMenu] = useState(false);

    // Refs for click outside handling
    const helpMenuRef = useRef(null);
    const userMenuRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (helpMenuRef.current && !helpMenuRef.current.contains(event.target)) {
                setShowHelpMenu(false);
            }
            if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
                setShowUserMenu(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const helpItems = [
        {
            icon: FaGlobe,
            label: 'Take the road',
            desc: 'Enjoy a unique motorhome experience',
            bg: 'bg-[#FDF0F3]',
            color: 'text-[#E00B41]'
        },
        {
            icon: FaCarSide,
            label: 'Vehicle owner?',
            desc: 'How to make the most of your vehicle with Yescapa',
            bg: 'bg-[#F3F4F6]',
            color: 'text-[#374151]'
        },
        {
            icon: FaRoute,
            label: 'How it works?',
            desc: 'Discover step by step how we work',
            bg: 'bg-[#EBF7FA]',
            color: 'text-[#006C85]'
        },
        {
            icon: FaLifeRing,
            label: 'Help Centre',
            desc: 'Find the answers to my questions',
            bg: 'bg-[#FEFCE8]',
            color: 'text-[#B45309]'
        }
    ];

    return (
        <header className="sticky top-0 z-30 bg-white border-b border-gray-200">
            <div className="max-w-[1920px] mx-auto px-4 lg:px-6">
                <div className="flex items-center justify-between h-[72px]">
                    {/* Logo */}
                    <Link to="/" className="flex items-center mr-8">
                        <img
                            src={logo}
                            alt="CaravaGo"
                            className="h-32 w-auto object-contain border-none"
                        />
                    </Link>

                    {/* Search Bar - Center */}
                    <div className="hidden md:flex flex-1 max-w-[800px] h-[48px] items-stretch shadow-sm">
                        {/* Location Input */}
                        <div className="flex-[1.5] relative min-w-0 bg-white">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
                                {/* Optional: Location Icon if needed, but not in screenshot */}
                            </div>
                            <input
                                type="text"
                                readOnly
                                value={destination || 'Brighton, England, United Kingdom'}
                                className="block w-full h-full pl-4 pr-3 py-2 border border-gray-200 rounded-l-md text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-main focus:border-main sm:text-sm truncate cursor-pointer hover:bg-gray-50"
                                onClick={() => onSearchChange && onSearchChange()}
                            />
                        </div>

                        {/* Dates Input */}
                        <div className="flex-[1] relative min-w-0 bg-white -ml-px">
                            <input
                                type="text"
                                readOnly
                                value={`${startDate} - ${endDate}`}
                                className="block w-full h-full px-4 py-2 border border-gray-200 text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-main focus:border-main sm:text-sm whitespace-nowrap cursor-pointer hover:bg-gray-50"
                                onClick={() => onSearchChange && onSearchChange()}
                            />
                        </div>

                        {/* Search Button */}
                        <button
                            onClick={() => onSearchChange && onSearchChange()}
                            className="relative -ml-px px-5 bg-[#E00B41] hover:bg-[#c90a3b] text-white rounded-r-md transition-colors flex items-center justify-center min-w-[50px]"
                        >
                            <FaSearch className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Right Side - Help, User, Menu */}
                    <div className="flex items-center gap-2 lg:gap-4 ml-4">
                        {/* Help Dropdown */}
                        <div className="relative hidden md:block" ref={helpMenuRef}>
                            <button
                                onClick={() => setShowHelpMenu(!showHelpMenu)}
                                className="flex items-center gap-1 px-2 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md transition-colors"
                            >
                                <span>Help</span>
                                <FaChevronDown className={`text-xs ml-1 transition-transform ${showHelpMenu ? 'rotate-180' : ''}`} />
                            </button>

                            {/* Dropdown Menu */}
                            {showHelpMenu && (
                                <div className="absolute top-full right-0 mt-4 w-[420px] bg-white rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.08)] border border-gray-100 p-2 z-50">
                                    <div className="flex flex-col gap-1">
                                        {helpItems.map((item, index) => (
                                            <a
                                                key={index}
                                                href="#"
                                                className="flex items-start gap-4 p-4 hover:bg-gray-50 rounded-lg transition-colors group"
                                            >
                                                <div className={`w-12 h-12 ${item.bg} rounded-lg flex items-center justify-center shrink-0 transition-colors`}>
                                                    <item.icon className={`w-6 h-6 ${item.color}`} />
                                                </div>
                                                <div className="flex-1">
                                                    <div className="font-bold text-[#0C1330] text-[15px] mb-0.5 group-hover:text-main transition-colors">
                                                        {item.label}
                                                    </div>
                                                    <div className="text-sm text-gray-500 font-medium leading-relaxed">
                                                        {item.desc}
                                                    </div>
                                                </div>
                                            </a>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* User Profile / Menu Button Group */}
                        <div className="relative" ref={userMenuRef}>
                            <button
                                onClick={() => setShowUserMenu(!showUserMenu)}
                                className="flex items-center gap-3 p-1 rounded-full hover:bg-gray-50 transition-colors"
                            >
                                {/* User Avatar Placeholder */}
                                <div className="w-9 h-9 bg-gray-200 rounded-full flex items-center justify-center text-gray-500">
                                    <FaUser className="w-5 h-5 text-white" />
                                </div>

                                {/* Hamburger Menu Icon */}
                                <FaBars className="w-5 h-5 text-gray-600 mr-1" />
                            </button>

                            {/* User Menu Dropdown */}
                            {showUserMenu && (
                                <div className="absolute top-full right-0 mt-2 w-[280px] bg-white rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.08)] border border-gray-100 py-2 z-50">
                                    {/* Section 1: Sign in / Sign up */}
                                    <div className="px-2 pb-2 border-b border-gray-100">
                                        <Link to="/signin" className="flex items-center gap-3 px-4 py-3 text-[#374151] hover:bg-gray-50 rounded-lg transition-colors group">
                                            <FaSignInAlt className="w-5 h-5 text-[#E00B41] group-hover:scale-110 transition-transform" />
                                            <span className="font-medium">Sign in</span>
                                        </Link>
                                        <Link to="/signup" className="flex items-center gap-3 px-4 py-3 text-[#374151] hover:bg-gray-50 rounded-lg transition-colors group">
                                            <FaUserPlus className="w-5 h-5 text-[#E00B41] group-hover:scale-110 transition-transform" />
                                            <span className="font-medium">Sign up</span>
                                        </Link>
                                    </div>

                                    {/* Section 2: Rent / Create Listing */}
                                    <div className="p-2 border-b border-gray-100">
                                        <Link to="/search" className="flex items-center gap-3 px-4 py-3 text-[#374151] hover:bg-gray-50 rounded-lg transition-colors group">
                                            <FaSearch className="w-5 h-5 text-[#E00B41] group-hover:scale-110 transition-transform" />
                                            <span className="font-medium">Rent an RV</span>
                                        </Link>
                                        <Link to="/create-listing" className="flex items-center gap-3 px-4 py-3 text-[#374151] hover:bg-gray-50 rounded-lg transition-colors group">
                                            <FaPlusCircle className="w-5 h-5 text-[#E00B41] group-hover:scale-110 transition-transform" />
                                            <span className="font-medium">Create a listing</span>
                                        </Link>
                                    </div>

                                    {/* Section 3: Info */}
                                    <div className="p-2 border-b border-gray-100">
                                        <Link to="#" className="flex items-center gap-3 px-4 py-3 text-[#374151] hover:bg-gray-50 rounded-lg transition-colors">
                                            <span className="font-medium ml-8">How it works?</span>
                                        </Link>
                                        <Link to="#" className="flex items-center gap-3 px-4 py-3 text-[#374151] hover:bg-gray-50 rounded-lg transition-colors">
                                            <span className="font-medium ml-8">Help Centre</span>
                                        </Link>
                                    </div>

                                    {/* Section 4: Download */}
                                    <div className="p-2">
                                        <Link to="#" className="flex items-center gap-3 px-4 py-3 text-[#374151] hover:bg-gray-50 rounded-lg transition-colors group">
                                            <FaMobileAlt className="w-5 h-5 text-[#E00B41] group-hover:scale-110 transition-transform" />
                                            <span className="font-medium">Download the app</span>
                                        </Link>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Mobile Menu */}
                {showMobileMenu && (
                    <div className="md:hidden border-t border-gray-200 py-4 space-y-3 absolute top-[72px] left-0 right-0 bg-white shadow-lg z-40 px-4">
                        {!user && (
                            <>
                                <Link
                                    to="/signin"
                                    className="block px-4 py-2 text-sm font-medium text-gray-700"
                                    onClick={() => setShowMobileMenu(false)}
                                >
                                    Sign in
                                </Link>
                                <Link
                                    to="/signup"
                                    className="block px-4 py-2 text-sm font-semibold text-white bg-main rounded-lg text-center"
                                    onClick={() => setShowMobileMenu(false)}
                                >
                                    Sign up
                                </Link>
                            </>
                        )}
                        <div className="border-t border-gray-100 my-2 pt-2">
                            <div className="px-4 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">Help</div>
                            {helpItems.map((item, index) => (
                                <a key={index} href="#" className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                                    <item.icon className={`w-4 h-4 ${item.color}`} />
                                    <span>{item.label}</span>
                                </a>
                            ))}
                        </div>
                        <Link to="/create-listing" className="block px-4 py-2 text-sm text-gray-700" onClick={() => setShowMobileMenu(false)}>
                            Create a listing
                        </Link>
                    </div>
                )}
            </div>
        </header>
    );
};

export default SearchNavbar;

