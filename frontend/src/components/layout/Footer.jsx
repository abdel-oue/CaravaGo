import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="bg-main-dark text-white py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                    <div className="space-y-4">
                        <h3 className="text-white text-2xl font-bold font-lexend">CaravaGo</h3>
                        <p className="text-sm text-white/70 leading-relaxed">
                            CaravaGo connects Moroccan travelers with local campervan and motorhome owners across Morocco through its secure platform. Discover Morocco's beauty from Marrakech to Chefchaouen, with comprehensive insurance and 24/7 support included. Connect, share and explore Morocco with CaravaGo!
                        </p>
                    </div>
                    <div>
                        <h4 className="text-white font-bold mb-6 tracking-wide text-sm">MOTORHOME RENTAL</h4>
                        <ul className="space-y-3 text-sm text-white/70">
                            <li><a href="#how-it-works" className="hover:text-white transition-colors">How it works?</a></li>
                            <li><a href="#rent-rv" className="hover:text-white transition-colors">Rent an RV</a></li>
                            <li><a href="#first-steps" className="hover:text-white transition-colors">Your first steps driving a motorhome</a></li>
                            <li><a href="#reviews" className="hover:text-white transition-colors">Our customers' reviews</a></li>
                            <li><a href="#help-renters" className="hover:text-white transition-colors">Help for renters</a></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="text-white font-bold mb-6 tracking-wide text-sm">OWNERS</h4>
                        <ul className="space-y-3 text-sm text-white/70">
                            <li><a href="#create-listing" className="hover:text-white transition-colors">Create a listing</a></li>
                            <li><a href="#contract" className="hover:text-white transition-colors">Rental contract</a></li>
                            <li><a href="#insurance" className="hover:text-white transition-colors">Rental insurance</a></li>
                            <li><a href="#breakdown" className="hover:text-white transition-colors">Breakdown assistance</a></li>
                            <li><a href="#help-owners" className="hover:text-white transition-colors">Help for motorhome owners</a></li>
                        </ul>
                    </div>
                    <div>
                        <div className="bg-white/5 p-6 rounded-xl border border-white/10">
                            <div className="flex items-center gap-2 mb-2 text-yellow-400">
                                ★★★★☆
                            </div>
                            <p className="text-sm text-white/90 font-medium mb-1">Excellent</p>
                            <p className="text-sm text-white/60 mb-4">3.54/5 on 306 customer reviews on Trusted Shops</p>
                            <div className="text-xs text-white/40">Verified reviews</div>
                        </div>
                    </div>
                </div>
                <div className="border-t border-white/10 pt-8 text-center text-sm text-white/60 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p>&copy; 2024 CaravaGo. All rights reserved.</p>
                    <div className="flex gap-6">
                        <Link to="#" className="hover:text-white transition-colors">Privacy Policy</Link>
                        <Link to="#" className="hover:text-white transition-colors">Terms of Service</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
