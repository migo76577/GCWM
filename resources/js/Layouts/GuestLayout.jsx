import ApplicationLogo from '@/Components/ApplicationLogo';
import { Link } from '@inertiajs/react';
import { Recycle } from 'lucide-react';

export default function GuestLayout({ children }) {
    return (
        <div className="flex min-h-screen bg-gradient-to-br from-green-50 to-green-100">
            {/* Left side - Branding */}
            <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-green-800 to-green-900 relative overflow-hidden">
                <div className="absolute inset-0 bg-black opacity-10"></div>
                <div className="relative z-10 flex flex-col justify-center items-center text-white p-12">
                    <div className="mb-8">
                        <div className="w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center mb-4">
                            <Recycle className="h-8 w-8 text-green-800" />
                        </div>
                        <h1 className="text-4xl font-bold mb-4">GCWM</h1>
                        <p className="text-green-100 text-lg">
                            Garbage Collection and Waste Management
                        </p>
                    </div>
                    <div className="text-center max-w-md">
                        <h2 className="text-2xl font-semibold mb-4">
                            Efficient Waste Management Solutions
                        </h2>
                        <p className="text-green-200">
                            Streamline your waste collection operations with our comprehensive management system. 
                            Track routes, manage drivers, and optimize your fleet operations.
                        </p>
                    </div>
                </div>
                
                {/* Decorative Elements */}
                <div className="absolute top-20 right-20 w-32 h-32 bg-white opacity-5 rounded-full"></div>
                <div className="absolute bottom-20 left-20 w-24 h-24 bg-white opacity-5 rounded-full"></div>
                <div className="absolute top-1/2 left-10 w-16 h-16 bg-white opacity-5 rounded-full"></div>
            </div>

            {/* Right side - Login Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12">
                <div className="w-full max-w-md">
                    {/* Mobile Logo */}
                    <div className="lg:hidden text-center mb-8">
                        <Link href="/" className="inline-flex items-center gap-3">
                            <div className="w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center">
                                <Recycle className="h-6 w-6 text-green-800" />
                            </div>
                            <span className="text-2xl font-bold text-green-800">GCWM</span>
                        </Link>
                    </div>

                    {/* Form Container */}
                    <div className="bg-white rounded-2xl shadow-xl p-8 sm:p-10 border border-green-100">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
}
