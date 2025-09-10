import { Head, Link } from '@inertiajs/react';
import { 
    Truck, 
    Users, 
    Route, 
    Shield, 
    Clock, 
    CheckCircle, 
    Recycle,
    MapPin,
    Phone,
    Mail,
    ArrowRight,
    Leaf,
    BarChart3,
    Calendar,
    Bell
} from 'lucide-react';

export default function Welcome({ auth }) {
    return (
        <>
            <Head title="Garbage Collection and Waste Management" />
            <div className="bg-gradient-to-br from-green-50 via-white to-green-50 min-h-screen">
                {/* Navigation */}
                <nav className="relative px-6 lg:px-8 py-6">
                    <div className="mx-auto flex max-w-7xl items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-600">
                                <Recycle className="h-6 w-6 text-white" />
                            </div>
                            <div>
                                <h1 className="text-xl font-bold text-gray-900">GCWM</h1>
                                <p className="text-xs text-gray-600">Garbage Collection and Waste Management</p>
                            </div>
                        </div>
                        
                        <div className="flex items-center gap-4">
                            {auth.user ? (
                                <Link
                                    href={route('dashboard')}
                                    className="flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-green-700"
                                >
                                    <BarChart3 className="h-4 w-4" />
                                    Dashboard
                                </Link>
                            ) : (
                                <div className="flex items-center gap-3">
                                    <Link
                                        href={route('login')}
                                        className="rounded-lg px-4 py-2 text-sm font-medium text-gray-700 transition hover:text-green-600"
                                    >
                                        Log in
                                    </Link>
                                    <Link
                                        href={route('register')}
                                        className="flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-green-700"
                                    >
                                        Get Started
                                        <ArrowRight className="h-4 w-4" />
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                </nav>

                {/* Hero Section */}
                <section className="px-6 lg:px-8 py-16">
                    <div className="mx-auto max-w-7xl text-center">
                        <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
                            Smart{' '}
                            <span className="text-green-600">Garbage Collection</span>{' '}
                            and Waste Management
                        </h1>
                        <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-gray-600">
                            Streamline your garbage collection and waste management operations with our comprehensive system. 
                            Track routes, manage customers, monitor vehicle maintenance, and optimize collections 
                            for efficient waste management operations.
                        </p>
                        <div className="mt-10 flex items-center justify-center gap-6">
                            {!auth.user && (
                                <>
                                    <Link
                                        href={route('register')}
                                        className="rounded-lg bg-green-600 px-8 py-3 text-base font-semibold text-white shadow-sm hover:bg-green-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600"
                                    >
                                        Start Free Trial
                                    </Link>
                                    <Link
                                        href="#features"
                                        className="text-base font-semibold leading-6 text-gray-900 hover:text-green-600"
                                    >
                                        Learn more <ArrowRight className="inline h-4 w-4 ml-1" />
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                </section>

                {/* Stats Section */}
                <section className="px-6 lg:px-8 py-16 bg-white">
                    <div className="mx-auto max-w-7xl">
                        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
                            <div className="text-center">
                                <div className="flex justify-center">
                                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                                        <Users className="h-8 w-8 text-green-600" />
                                    </div>
                                </div>
                                <h3 className="mt-4 text-2xl font-bold text-gray-900">10,000+</h3>
                                <p className="text-gray-600">Active Customers</p>
                            </div>
                            <div className="text-center">
                                <div className="flex justify-center">
                                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                                        <Truck className="h-8 w-8 text-green-600" />
                                    </div>
                                </div>
                                <h3 className="mt-4 text-2xl font-bold text-gray-900">500+</h3>
                                <p className="text-gray-600">Fleet Vehicles</p>
                            </div>
                            <div className="text-center">
                                <div className="flex justify-center">
                                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                                        <Route className="h-8 w-8 text-green-600" />
                                    </div>
                                </div>
                                <h3 className="mt-4 text-2xl font-bold text-gray-900">200+</h3>
                                <p className="text-gray-600">Collection Routes</p>
                            </div>
                            <div className="text-center">
                                <div className="flex justify-center">
                                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                                        <Recycle className="h-8 w-8 text-green-600" />
                                    </div>
                                </div>
                                <h3 className="mt-4 text-2xl font-bold text-gray-900">99.5%</h3>
                                <p className="text-gray-600">Collection Efficiency</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Features Section */}
                <section id="features" className="px-6 lg:px-8 py-20">
                    <div className="mx-auto max-w-7xl">
                        <div className="text-center">
                            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                                Complete Garbage Collection & Waste Management Solution
                            </h2>
                            <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-600">
                                Everything you need to manage your garbage collection and waste management operations efficiently.
                            </p>
                        </div>

                        <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                            {/* Customer Management */}
                            <div className="rounded-2xl bg-white p-8 shadow-sm ring-1 ring-gray-200">
                                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-600">
                                    <Users className="h-6 w-6 text-white" />
                                </div>
                                <h3 className="mt-6 text-xl font-semibold text-gray-900">Customer Management</h3>
                                <p className="mt-4 text-gray-600">
                                    Manage customer registrations, categories, billing information, and service preferences 
                                    with our comprehensive customer database.
                                </p>
                                <ul className="mt-4 space-y-2">
                                    <li className="flex items-center gap-2 text-sm text-gray-600">
                                        <CheckCircle className="h-4 w-4 text-green-500" />
                                        Customer registration & approval
                                    </li>
                                    <li className="flex items-center gap-2 text-sm text-gray-600">
                                        <CheckCircle className="h-4 w-4 text-green-500" />
                                        Billing & payment tracking
                                    </li>
                                    <li className="flex items-center gap-2 text-sm text-gray-600">
                                        <CheckCircle className="h-4 w-4 text-green-500" />
                                        Service history & complaints
                                    </li>
                                </ul>
                            </div>

                            {/* Route Planning */}
                            <div className="rounded-2xl bg-white p-8 shadow-sm ring-1 ring-gray-200">
                                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-600">
                                    <Route className="h-6 w-6 text-white" />
                                </div>
                                <h3 className="mt-6 text-xl font-semibold text-gray-900">Smart Route Planning</h3>
                                <p className="mt-4 text-gray-600">
                                    Optimize collection routes, schedule pickups, and assign drivers efficiently 
                                    to reduce costs and improve service quality.
                                </p>
                                <ul className="mt-4 space-y-2">
                                    <li className="flex items-center gap-2 text-sm text-gray-600">
                                        <CheckCircle className="h-4 w-4 text-green-500" />
                                        Optimized route planning
                                    </li>
                                    <li className="flex items-center gap-2 text-sm text-gray-600">
                                        <CheckCircle className="h-4 w-4 text-green-500" />
                                        Driver assignments
                                    </li>
                                    <li className="flex items-center gap-2 text-sm text-gray-600">
                                        <CheckCircle className="h-4 w-4 text-green-500" />
                                        Schedule management
                                    </li>
                                </ul>
                            </div>

                            {/* Fleet Management */}
                            <div className="rounded-2xl bg-white p-8 shadow-sm ring-1 ring-gray-200">
                                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-600">
                                    <Truck className="h-6 w-6 text-white" />
                                </div>
                                <h3 className="mt-6 text-xl font-semibold text-gray-900">Fleet Management</h3>
                                <p className="mt-4 text-gray-600">
                                    Track vehicle maintenance, monitor performance, and ensure your fleet 
                                    operates at peak efficiency with minimal downtime.
                                </p>
                                <ul className="mt-4 space-y-2">
                                    <li className="flex items-center gap-2 text-sm text-gray-600">
                                        <CheckCircle className="h-4 w-4 text-green-500" />
                                        Vehicle maintenance tracking
                                    </li>
                                    <li className="flex items-center gap-2 text-sm text-gray-600">
                                        <CheckCircle className="h-4 w-4 text-green-500" />
                                        Performance monitoring
                                    </li>
                                    <li className="flex items-center gap-2 text-sm text-gray-600">
                                        <CheckCircle className="h-4 w-4 text-green-500" />
                                        Cost optimization
                                    </li>
                                </ul>
                            </div>

                            {/* Real-time Tracking */}
                            <div className="rounded-2xl bg-white p-8 shadow-sm ring-1 ring-gray-200">
                                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-600">
                                    <MapPin className="h-6 w-6 text-white" />
                                </div>
                                <h3 className="mt-6 text-xl font-semibold text-gray-900">Real-time Tracking</h3>
                                <p className="mt-4 text-gray-600">
                                    Monitor collection progress in real-time, track vehicle locations, 
                                    and provide accurate ETAs to customers.
                                </p>
                            </div>

                            {/* Analytics & Reports */}
                            <div className="rounded-2xl bg-white p-8 shadow-sm ring-1 ring-gray-200">
                                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-600">
                                    <BarChart3 className="h-6 w-6 text-white" />
                                </div>
                                <h3 className="mt-6 text-xl font-semibold text-gray-900">Analytics & Reports</h3>
                                <p className="mt-4 text-gray-600">
                                    Comprehensive reporting and analytics to help you make data-driven 
                                    decisions and improve operational efficiency.
                                </p>
                            </div>

                            {/* Automated Scheduling */}
                            <div className="rounded-2xl bg-white p-8 shadow-sm ring-1 ring-gray-200">
                                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-600">
                                    <Calendar className="h-6 w-6 text-white" />
                                </div>
                                <h3 className="mt-6 text-xl font-semibold text-gray-900">Smart Scheduling</h3>
                                <p className="mt-4 text-gray-600">
                                    Automated scheduling system that optimizes collection times based on 
                                    customer preferences, route efficiency, and resource availability.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Benefits Section */}
                <section className="px-6 lg:px-8 py-20 bg-green-50">
                    <div className="mx-auto max-w-7xl">
                        <div className="lg:grid lg:grid-cols-2 lg:gap-16 lg:items-center">
                            <div>
                                <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                                    Why Choose GCWM?
                                </h2>
                                <p className="mt-4 text-lg text-gray-600">
                                    Our platform is designed specifically for garbage collection and waste management companies 
                                    who want to modernize their operations and provide better service to their communities.
                                </p>
                                
                                <div className="mt-10 space-y-6">
                                    <div className="flex items-start gap-4">
                                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-600">
                                            <Clock className="h-4 w-4 text-white" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-gray-900">Reduce Operational Costs</h3>
                                            <p className="text-gray-600">Optimize routes and schedules to reduce fuel costs and improve efficiency by up to 30%.</p>
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-start gap-4">
                                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-600">
                                            <Users className="h-4 w-4 text-white" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-gray-900">Improve Customer Satisfaction</h3>
                                            <p className="text-gray-600">Provide reliable service with real-time updates and efficient complaint management.</p>
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-start gap-4">
                                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-600">
                                            <Shield className="h-4 w-4 text-white" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-gray-900">Ensure Compliance</h3>
                                            <p className="text-gray-600">Maintain detailed records and reports to meet regulatory requirements and environmental standards.</p>
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-start gap-4">
                                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-600">
                                            <Leaf className="h-4 w-4 text-white" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-gray-900">Environmental Impact</h3>
                                            <p className="text-gray-600">Reduce carbon footprint through optimized routes and better waste diversion tracking.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="mt-12 lg:mt-0">
                                <div className="rounded-2xl bg-white p-8 shadow-xl">
                                    <h3 className="text-xl font-semibold text-gray-900 mb-6">Platform Highlights</h3>
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <span className="text-gray-600">Customer Management</span>
                                            <CheckCircle className="h-5 w-5 text-green-500" />
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-gray-600">Route Optimization</span>
                                            <CheckCircle className="h-5 w-5 text-green-500" />
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-gray-600">Fleet Tracking</span>
                                            <CheckCircle className="h-5 w-5 text-green-500" />
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-gray-600">Maintenance Scheduling</span>
                                            <CheckCircle className="h-5 w-5 text-green-500" />
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-gray-600">Real-time Analytics</span>
                                            <CheckCircle className="h-5 w-5 text-green-500" />
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-gray-600">Mobile Access</span>
                                            <CheckCircle className="h-5 w-5 text-green-500" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Supported Locations Section */}
                <section className="px-6 lg:px-8 py-20 bg-white">
                    <div className="mx-auto max-w-7xl text-center">
                        <div className="mx-auto max-w-2xl">
                            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                                Service Areas
                            </h2>
                            <p className="mt-4 text-lg text-gray-600">
                                Currently serving select areas in Kenya. Expanding to more locations soon!
                            </p>
                        </div>

                        <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 max-w-4xl mx-auto">
                            {/* Kilifi Town */}
                            <div className="relative rounded-2xl bg-gradient-to-br from-green-50 to-green-100 p-8 text-center shadow-sm ring-1 ring-green-200">
                                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-600 mb-6">
                                    <MapPin className="h-8 w-8 text-white" />
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900">Kilifi Town</h3>
                                <p className="mt-4 text-gray-700">
                                    Comprehensive garbage collection and waste management services 
                                    covering all areas within Kilifi Town and surrounding neighborhoods.
                                </p>
                                <div className="mt-6">
                                    <span className="inline-flex items-center rounded-full bg-green-600 px-3 py-1 text-sm font-medium text-white">
                                        <CheckCircle className="mr-1 h-4 w-4" />
                                        Active
                                    </span>
                                </div>
                            </div>

                            {/* Mombasa Township */}
                            <div className="relative rounded-2xl bg-gradient-to-br from-green-50 to-green-100 p-8 text-center shadow-sm ring-1 ring-green-200">
                                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-600 mb-6">
                                    <MapPin className="h-8 w-8 text-white" />
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900">Mombasa Township</h3>
                                <p className="mt-4 text-gray-700">
                                    Reliable waste collection services across Mombasa Township areas, 
                                    ensuring clean and healthy communities for all residents.
                                </p>
                                <div className="mt-6">
                                    <span className="inline-flex items-center rounded-full bg-green-600 px-3 py-1 text-sm font-medium text-white">
                                        <CheckCircle className="mr-1 h-4 w-4" />
                                        Active
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Expansion Notice */}
                        <div className="mt-12 rounded-2xl bg-gray-50 p-8 text-center">
                            <h4 className="text-lg font-semibold text-gray-900">Coming Soon to More Areas</h4>
                            <p className="mt-2 text-gray-600">
                                We're working to expand our services to more locations across Kenya. 
                                <br className="hidden sm:inline" />
                                Contact us to learn when we'll be available in your area.
                            </p>
                            <div className="mt-4">
                                <a
                                    href="#contact"
                                    className="inline-flex items-center text-sm font-medium text-green-600 hover:text-green-500"
                                >
                                    Get notified about expansion
                                    <ArrowRight className="ml-1 h-4 w-4" />
                                </a>
                            </div>
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                {!auth.user && (
                    <section className="px-6 lg:px-8 py-20 bg-green-600">
                        <div className="mx-auto max-w-4xl text-center">
                            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                                Ready to Transform Your Garbage Collection & Waste Management?
                            </h2>
                            <p className="mx-auto mt-6 max-w-2xl text-lg text-green-100">
                                Join garbage collection and waste management companies in Kilifi Town and Mombasa Township 
                                already using GCWM to streamline operations and improve service delivery.
                            </p>
                            <div className="mt-10 flex items-center justify-center gap-6">
                                <Link
                                    href={route('register')}
                                    className="rounded-lg bg-white px-8 py-3 text-base font-semibold text-green-600 shadow-sm hover:bg-green-50"
                                >
                                    Start Your Free Trial
                                </Link>
                                <a
                                    href="#contact"
                                    className="text-base font-semibold text-white hover:text-green-100"
                                >
                                    Contact Sales <ArrowRight className="inline h-4 w-4 ml-1" />
                                </a>
                            </div>
                        </div>
                    </section>
                )}

                {/* Contact Section */}
                <section id="contact" className="px-6 lg:px-8 py-20 bg-gray-50">
                    <div className="mx-auto max-w-7xl">
                        <div className="text-center">
                            <h2 className="text-3xl font-bold tracking-tight text-gray-900">
                                Get in Touch
                            </h2>
                            <p className="mt-4 text-lg text-gray-600">
                                Have questions? We'd love to hear from you.
                            </p>
                        </div>

                        <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-3">
                            <div className="text-center">
                                <div className="flex justify-center">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-600">
                                        <Phone className="h-6 w-6 text-white" />
                                    </div>
                                </div>
                                <h3 className="mt-4 text-lg font-semibold text-gray-900">Phone</h3>
                                <p className="mt-2 text-gray-600">+1 (555) 123-4567</p>
                            </div>
                            
                            <div className="text-center">
                                <div className="flex justify-center">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-600">
                                        <Mail className="h-6 w-6 text-white" />
                                    </div>
                                </div>
                                <h3 className="mt-4 text-lg font-semibold text-gray-900">Email</h3>
                                <p className="mt-2 text-gray-600">contact@gcwm.com</p>
                            </div>
                            
                            <div className="text-center">
                                <div className="flex justify-center">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-600">
                                        <MapPin className="h-6 w-6 text-white" />
                                    </div>
                                </div>
                                <h3 className="mt-4 text-lg font-semibold text-gray-900">Office</h3>
                                <p className="mt-2 text-gray-600">123 Green Street, Eco City, EC 12345</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Footer */}
                <footer className="px-6 lg:px-8 py-12 bg-white border-t border-gray-200">
                    <div className="mx-auto max-w-7xl">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-600">
                                    <Recycle className="h-4 w-4 text-white" />
                                </div>
                                <div>
                                    <p className="font-semibold text-gray-900">Garbage Collection and Waste Management</p>
                                    <p className="text-xs text-gray-600">Making cities cleaner, one collection at a time</p>
                                </div>
                            </div>
                            <p className="text-sm text-gray-600">
                                © 2024 GCWM. All rights reserved.
                            </p>
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
}