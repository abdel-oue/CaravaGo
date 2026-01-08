import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import SearchNavbar from '../components/search/SearchNavbar';
import { FaStar, FaBed, FaChair, FaCheckCircle, FaSnowflake, FaWifi, FaShower, FaUtensils, FaCar, FaChevronRight, FaHeart, FaShare } from 'react-icons/fa';
import { FaShieldHalved, FaIdCard } from 'react-icons/fa6';
import vanMain from '../public/vanmain1.jpg';
import van2 from '../public/van2.jpg';
import van3 from '../public/van3.jpg';
import van4 from '../public/van4.jpg';
import van5 from '../public/van5.jpg';

const VehicleDetails = () => {
    const { id } = useParams();

    // Mock data matching the screenshot
    const vehicle = {
        title: "The Grey Horizon – 4 berth Volkswagen T6.1 LWB campervan from 2022",
        location: "West Sussex, United Kingdom",
        reviews: 2,
        rating: 5,
        price: 1689.00, // Total price in screenshot
        basePrice: 1727.02,
        discount: 83.00,
        cleaningFee: 45.00,
        images: [
            vanMain,
            van2,
            van3,
            van4,
            van5
        ],
        owner: {
            name: "Matt",
            joined: "April 2024",
            hiredOut: 27,
            verified: true,
            avatar: "https://randomuser.me/api/portraits/men/32.jpg"
        },
        specs: {
            sleeps: 4,
            seats: 5,
            license: "B",
            verified: true,
            pets: true
        },
        description: `Stunning looking 2022 VW T6.1 LWB converted camper with pop top roof converted by myself.
Sleeps 2 adults and 2 children.
Pets allowed.
5 seat belts.
Very low mileage [9000]
Insurance and breakdown cover [age 25-75]. Please enquire if you have more than 3 points on your licence.
Pop top roof [fitted sheet included]
Rib rail system bed [allowing seating position to be adjusted kids closer to the front plus better storage solution]
Mini electric heater [only functional with electric hook...`,
        features: {
            cab: ["Airbags", "Audio input", "Cruise Control", "Isofix", "Power Steering", "Reversing camera", "Snow chains", "Winter tyres", "Air conditioning cabin", "Bluetooth", "GPS", "Parking assistance", "Radio", "Roof rack", "Towbar"],
            living: ["Air conditioning living", "Bike carrier", "Dinette", "Garage", "Heating", "Kitchen equipment", "L-seat", "Outside shower", "Awning", "Camping table and chairs", "Freezer", "Gas cylinder", "Hot water", "Linens", "Off-grid camping", "Oven"]
        }
    };

    return (
        <div className="min-h-screen bg-white">
            <SearchNavbar />

            <div className="max-w-[1280px] mx-auto px-4 lg:px-6 py-6 font-sans text-[#0C1330]">
                {/* Breadcrumbs / Header Actions */}
                <div className="flex justify-between items-center mb-6 text-sm">
                    <div className="flex gap-2 text-gray-500">
                        <Link to="/" className="hover:underline">Home</Link> /
                        <Link to="/search" className="hover:underline">Campervan hire</Link> /
                        <span className="text-gray-900 truncate max-w-[200px]">{vehicle.title}</span>
                    </div>
                    <div className="flex gap-4">
                        <button className="flex items-center gap-1 text-gray-600 hover:text-black hover:bg-gray-100 px-3 py-1.5 rounded-md transition-colors">
                            <FaHeart className="text-gray-400" /> Save
                        </button>
                        <button className="flex items-center gap-1 text-gray-600 hover:text-black hover:bg-gray-100 px-3 py-1.5 rounded-md transition-colors">
                            <FaShare className="text-gray-400" /> Share
                        </button>
                    </div>
                </div>

                {/* Photo Gallery */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 rounded-xl overflow-hidden h-[400px] md:h-[480px] mb-8 relative">
                    <div className="h-full">
                        <img src={vehicle.images[0]} alt="Main" className="w-full h-full object-cover hover:opacity-95 transition-opacity cursor-pointer" />
                    </div>
                    <div className="grid grid-cols-2 gap-2 h-full">
                        {vehicle.images.slice(1, 5).map((img, idx) => (
                            <img key={idx} src={img} alt={`Gallery ${idx}`} className="w-full h-full object-cover hover:opacity-95 transition-opacity cursor-pointer" />
                        ))}
                    </div>
                    <button className="absolute bottom-4 right-4 bg-white/90 hover:bg-white text-gray-800 px-4 py-2 rounded-md font-medium text-sm shadow-md flex items-center gap-2 transition-all">
                        Show all photos
                    </button>
                </div>

                {/* Main Content Split */}
                <div className="flex flex-col lg:flex-row gap-12">
                    {/* Left Column - Details */}
                    <div className="flex-1">
                        {/* Title Section */}
                        <div className="mb-8 border-b border-gray-100 pb-8">
                            <h1 className="text-2xl md:text-3xl font-bold mb-2 leading-tight">{vehicle.title}</h1>
                            <div className="flex items-center gap-1 mb-6 text-gray-600">
                                <span>{vehicle.location}</span>
                            </div>

                            <div className="flex items-center gap-6">
                                <div className="flex items-center gap-1 text-orange-500">
                                    {[...Array(5)].map((_, i) => <FaStar key={i} className="w-4 h-4" />)}
                                    <span className="text-gray-800 font-medium ml-1">{vehicle.reviews} Reviews</span>
                                </div>
                            </div>
                        </div>

                        {/* Specs Icons */}
                        <div className="grid grid-cols-2 gap-y-6 gap-x-4 mb-8 border-b border-gray-100 pb-8">
                            <div className="flex items-start gap-4">
                                <FaBed className="w-6 h-6 text-gray-400 mt-1" />
                                <div>
                                    <div className="font-bold">Sleeps {vehicle.specs.sleeps}</div>
                                    <div className="text-sm text-gray-500">Comfortable sleeping area for {vehicle.specs.sleeps} persons</div>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <FaChair className="w-6 h-6 text-gray-400 mt-1" />
                                <div>
                                    <div className="font-bold">{vehicle.specs.seats} secure places</div>
                                    <div className="text-sm text-gray-500">Seats with seat belts</div>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <FaIdCard className="w-6 h-6 text-gray-400 mt-1" />
                                <div>
                                    <div className="font-bold">Driving licence {vehicle.specs.license}</div>
                                    <div className="text-sm text-gray-500">Your car license is sufficient</div>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <FaShieldHalved className="w-6 h-6 text-gray-400 mt-1" />
                                <div>
                                    <div className="font-bold">Verified vehicle</div>
                                    <div className="text-sm text-gray-500">The vehicle's license plate and MOT checked</div>
                                </div>
                            </div>
                            {vehicle.specs.pets && (
                                <div className="flex items-start gap-4">
                                    <FaCar className="w-6 h-6 text-gray-400 mt-1" />
                                    <div>
                                        <div className="font-bold">Pets welcome</div>
                                        <div className="text-sm text-gray-500">Pets are allowed in this motorhome</div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Description */}
                        <div className="mb-8 border-b border-gray-100 pb-8">
                            <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                                {vehicle.description}
                            </p>
                            <button className="text-[#E00B41] font-semibold mt-4 flex items-center hover:underline">
                                Read more <FaChevronRight className="w-3 h-3 ml-1" />
                            </button>
                        </div>

                        {/* Features */}
                        <div className="mb-8 border-b border-gray-100 pb-8">
                            <h3 className="text-xl font-bold mb-6">Features</h3>
                            <div className="grid grid-cols-2 gap-8">
                                <div>
                                    <h4 className="font-semibold mb-4 text-gray-900">Cab features</h4>
                                    <ul className="space-y-3">
                                        {vehicle.features.cab.map((feature, i) => (
                                            <li key={i} className="flex items-center gap-3 text-gray-600 text-sm">
                                                <FaCheckCircle className="text-gray-300 w-4 h-4" />
                                                {feature}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <div>
                                    <h4 className="font-semibold mb-4 text-gray-900">Living area</h4>
                                    <ul className="space-y-3">
                                        {vehicle.features.living.map((feature, i) => (
                                            <li key={i} className="flex items-center gap-3 text-gray-600 text-sm">
                                                <FaCheckCircle className="text-gray-300 w-4 h-4" />
                                                {feature}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>

                        {/* Owner Section */}
                        <div className="bg-white rounded-xl border border-gray-200 p-6 flex flex-col md:flex-row items-center md:items-start gap-6">
                            <img src={vehicle.owner.avatar} alt={vehicle.owner.name} className="w-16 h-16 rounded-full object-cover border-2 border-green-400" />
                            <div className="flex-1 text-center md:text-left">
                                <h3 className="text-lg font-bold">Meet the owner, {vehicle.owner.name}</h3>
                                <div className="text-gray-500 text-sm mb-4">Member since {vehicle.owner.joined}</div>
                                <div className="flex flex-wrap justify-center md:justify-start gap-6 text-sm text-gray-600">
                                    <div className="flex items-center gap-2">
                                        <FaStar className="text-gray-300" /> 5/5 based on 23 reviews
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <FaCheckCircle className="text-gray-300" /> Hired out {vehicle.owner.hiredOut} times
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <FaCheckCircle className="text-gray-300" /> Identity verified
                                    </div>
                                </div>
                                <button className="mt-4 px-6 py-2 border border-gray-300 rounded-full font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                                    Send a message
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Sticky Sidebar */}
                    <div className="lg:w-[380px]">
                        <div className="sticky top-[100px] border border-gray-200 rounded-xl p-6 shadow-sm bg-white">
                            {/* Date Picker Dummy */}
                            <div className="border border-gray-200 rounded-lg p-3 mb-6 bg-gray-50 flex justify-between items-center cursor-pointer hover:bg-gray-100">
                                <span className="font-medium text-gray-700">1 Feb until 19 Feb 2026</span>
                                <span className="text-gray-400">×</span>
                            </div>

                            {/* Price Breakdown */}
                            <div className="space-y-3 mb-6 text-sm">
                                <div className="flex justify-between text-gray-600">
                                    <span>Rental Fee (18 days)</span>
                                    <span>£{vehicle.basePrice.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-blue-500">
                                    <span>Long Trip Discount (5%)</span>
                                    <span>- £{vehicle.discount.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-gray-600">
                                    <span>Cleaning Fee</span>
                                    <span>£{vehicle.cleaningFee.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between font-bold text-gray-900 pt-3 border-t border-gray-100 text-base">
                                    <span>Total</span>
                                    <span>£{vehicle.price.toLocaleString('en-GB', { minimumFractionDigits: 2 })}</span>
                                </div>
                            </div>

                            {/* Book Button */}
                            <button className="w-full bg-[#E00B41] hover:bg-[#c90a3b] text-white py-3 rounded-md font-bold text-lg mb-4 transition-colors">
                                Request to Book
                            </button>
                            <div className="text-center text-xs text-gray-500 underline mb-6 cursor-pointer">
                                View the Booking process
                            </div>

                            {/* Trust Bullets */}
                            <div className="space-y-3">
                                <div className="flex gap-3 text-sm text-gray-600">
                                    <FaCheckCircle className="text-green-500 w-4 h-4 shrink-0 mt-0.5" />
                                    <span>Make a request <span className="text-green-600 font-medium">without obligation</span></span>
                                </div>
                                <div className="flex gap-3 text-sm text-gray-600">
                                    <FaCheckCircle className="text-green-500 w-4 h-4 shrink-0 mt-0.5" />
                                    <span>Working towards <span className="text-green-600 font-medium">greener road trips</span></span>
                                </div>
                                <div className="flex gap-3 text-sm text-gray-600">
                                    <FaCheckCircle className="text-green-500 w-4 h-4 shrink-0 mt-0.5" />
                                    <span><span className="text-green-600 font-medium">24/7</span> roadside assistance</span>
                                </div>
                                <div className="flex gap-3 text-sm text-gray-600">
                                    <FaCheckCircle className="text-green-500 w-4 h-4 shrink-0 mt-0.5" />
                                    <span><span className="text-green-600 font-medium">Easy payment</span> with all major debit and credit cards</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VehicleDetails;
