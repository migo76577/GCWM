import React, { useState, useEffect } from 'react';
import { Head, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { toast, Toaster } from 'sonner';
import { useAuthStore } from '@/stores/authStore';
import { useDriverStore } from '@/stores/driverStore';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    ArrowLeft,
    User,
    Phone,
    Mail,
    MapPin,
    Calendar,
    CreditCard,
    FileText,
    Truck,
    AlertCircle,
    CheckCircle,
    Clock,
    Edit,
    UserCheck,
    UserMinus,
    UserX,
    IdCard,
    CalendarIcon,
    Briefcase,
} from "lucide-react";

export default function Show({ auth, api_token, driver: initialDriver }) {
    const [driver, setDriver] = useState(initialDriver);
    
    // Zustand stores
    const { setAuth, token, isAuthenticated } = useAuthStore();
    const { 
        error, 
        updateDriver,
        toggleDriverStatus,
        clearError 
    } = useDriverStore();

    // Initialize auth store with props
    useEffect(() => {
        if (auth.user && api_token && !isAuthenticated) {
            setAuth(auth.user, api_token);
        }
    }, [auth.user, api_token, isAuthenticated, setAuth]);

    // Show error toast when error state changes
    useEffect(() => {
        if (error) {
            toast.error(error);
            clearError();
        }
    }, [error, clearError]);

    const handleStatusChange = async (newStatus) => {
        const action = newStatus === 'suspended' ? 'suspend' : 'activate';
        if (window.confirm(`Are you sure you want to ${action} this driver?`)) {
            try {
                await toggleDriverStatus(driver.id, newStatus);
                setDriver(prev => ({
                    ...prev,
                    status: newStatus
                }));
                const actionPast = newStatus === 'suspended' ? 'suspended' : 'activated';
                toast.success(`Driver ${actionPast} successfully`);
            } catch (error) {
                console.error('Error updating driver status:', error);
            }
        }
    };

    const getStatusColor = (status) => {
        const colors = {
            active: 'bg-green-100 text-green-800',
            inactive: 'bg-gray-100 text-gray-800',
            suspended: 'bg-red-100 text-red-800',
        };
        return colors[status] || 'bg-gray-100 text-gray-800';
    };

    const getStatusIcon = (status) => {
        const icons = {
            active: <UserCheck className="h-4 w-4" />,
            inactive: <UserX className="h-4 w-4" />,
            suspended: <UserMinus className="h-4 w-4" />,
        };
        return icons[status] || <AlertCircle className="h-4 w-4" />;
    };

    const isLicenseExpiringSoon = () => {
        if (!driver.license_expiry) return false;
        const today = new Date();
        const expiryDate = new Date(driver.license_expiry);
        const diffTime = expiryDate - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays <= 30 && diffDays >= 0;
    };

    const isLicenseExpired = () => {
        if (!driver.license_expiry) return false;
        const today = new Date();
        const expiryDate = new Date(driver.license_expiry);
        return expiryDate < today;
    };

    // Show access denied if user is not admin
    if (auth.user?.role !== 'admin') {
        return (
            <AuthenticatedLayout
                user={auth.user}
                header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Driver Details</h2>}
            >
                <Head title="Driver Details" />
                <div className="py-4 sm:py-8">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <Card className="w-full">
                            <CardContent className="p-4 sm:p-6">
                                <div className="text-center">
                                    <h3 className="text-lg font-medium text-red-600">Access Denied</h3>
                                    <p className="mt-2 text-sm text-gray-600">
                                        You need admin privileges to view driver details.
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </AuthenticatedLayout>
        );
    }

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex items-center gap-4">
                    <Link href="/drivers">
                        <Button variant="ghost" size="sm">
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Back to Drivers
                        </Button>
                    </Link>
                    <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                        Driver Details
                    </h2>
                </div>
            }
        >
            <Head title={`Driver - ${driver.first_name} ${driver.last_name}`} />
            
            <div className="py-3 sm:py-4 md:py-6 lg:py-8">
                <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 space-y-4 sm:space-y-6">
                    
                    {/* Driver Header */}
                    <Card>
                        <CardHeader className="pb-4 sm:pb-6">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
                                <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                                    <div className="h-12 w-12 sm:h-16 sm:w-16 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                                        <User className="h-6 w-6 sm:h-8 sm:w-8 text-gray-600" />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <CardTitle className="text-lg sm:text-xl md:text-2xl truncate">
                                            {driver.first_name} {driver.last_name}
                                        </CardTitle>
                                        <CardDescription className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 mt-1 text-xs sm:text-sm">
                                            <span className="font-mono">{driver.employee_number}</span>
                                            <Separator orientation="vertical" className="hidden sm:block h-4" />
                                            <span className="truncate">{driver.user?.email}</span>
                                        </CardDescription>
                                    </div>
                                </div>
                                <div className="flex flex-wrap gap-2 sm:flex-col lg:flex-row">
                                    <Badge className={`capitalize ${getStatusColor(driver.status)}`}>
                                        {getStatusIcon(driver.status)}
                                        <span className="ml-1">
                                            {driver.status?.replace('_', ' ')}
                                        </span>
                                    </Badge>
                                    {isLicenseExpired() && (
                                        <Badge className="bg-red-100 text-red-800">
                                            <AlertCircle className="h-4 w-4 mr-1" />
                                            License Expired
                                        </Badge>
                                    )}
                                    {!isLicenseExpired() && isLicenseExpiringSoon() && (
                                        <Badge className="bg-yellow-100 text-yellow-800">
                                            <AlertCircle className="h-4 w-4 mr-1" />
                                            License Expiring Soon
                                        </Badge>
                                    )}
                                    {driver.status === 'active' && (
                                        <Button 
                                            variant="outline" 
                                            size="sm"
                                            onClick={() => handleStatusChange('suspended')}
                                            className="text-yellow-600 hover:text-yellow-700"
                                        >
                                            <UserMinus className="h-4 w-4 mr-2" />
                                            Suspend
                                        </Button>
                                    )}
                                    {driver.status === 'suspended' && (
                                        <Button 
                                            variant="outline" 
                                            size="sm"
                                            onClick={() => handleStatusChange('active')}
                                            className="text-green-600 hover:text-green-700"
                                        >
                                            <UserCheck className="h-4 w-4 mr-2" />
                                            Activate
                                        </Button>
                                    )}
                                    <Button variant="outline" size="sm">
                                        <Edit className="h-4 w-4 mr-2" />
                                        Edit Driver
                                    </Button>
                                </div>
                            </div>
                        </CardHeader>
                    </Card>

                    {/* Driver Details Tabs */}
                    <Tabs defaultValue="details" className="w-full">
                        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 md:grid-cols-5 h-auto">
                            <TabsTrigger value="details" className="text-xs sm:text-sm py-2">Details</TabsTrigger>
                            <TabsTrigger value="routes" className="text-xs sm:text-sm py-2">Routes</TabsTrigger>
                            <TabsTrigger value="performance" className="text-xs sm:text-sm py-2">Performance</TabsTrigger>
                            <TabsTrigger value="maintenance" className="text-xs sm:text-sm py-2">Maintenance</TabsTrigger>
                            <TabsTrigger value="activity" className="text-xs sm:text-sm py-2 col-span-2 sm:col-span-1">Activity</TabsTrigger>
                        </TabsList>

                        <TabsContent value="details" className="space-y-6">
                            {/* Single Card with 2-Column Layout */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <User className="h-5 w-5" />
                                        Driver Details
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="p-4 sm:p-6">
                                    <div className="space-y-6 sm:space-y-8">
                                        {/* First Row: Contact Information & License Information */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
                                            {/* Contact Information */}
                                            <div>
                                                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                                    <Phone className="h-5 w-5" />
                                                    Contact Information
                                                </h3>
                                                <div className="space-y-3">
                                                    <div className="flex items-start gap-3">
                                                        <Mail className="h-4 w-4 text-gray-500 mt-0.5" />
                                                        <div>
                                                            <p className="text-sm font-medium text-gray-900">Email</p>
                                                            <p className="text-sm text-gray-600">{driver.user?.email}</p>
                                                        </div>
                                                    </div>
                                                    
                                                    <div className="flex items-start gap-3">
                                                        <Phone className="h-4 w-4 text-gray-500 mt-0.5" />
                                                        <div>
                                                            <p className="text-sm font-medium text-gray-900">Phone Number</p>
                                                            <p className="text-sm text-gray-600">{driver.phone}</p>
                                                        </div>
                                                    </div>

                                                    <div className="flex items-start gap-3">
                                                        <MapPin className="h-4 w-4 text-gray-500 mt-0.5" />
                                                        <div>
                                                            <p className="text-sm font-medium text-gray-900">Address</p>
                                                            <p className="text-sm text-gray-600">{driver.address || 'Not provided'}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* License Information */}
                                            <div>
                                                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                                    <IdCard className="h-5 w-5" />
                                                    License Information
                                                </h3>
                                                <div className="space-y-3">
                                                    <div className="flex items-start gap-3">
                                                        <FileText className="h-4 w-4 text-gray-500 mt-0.5" />
                                                        <div>
                                                            <p className="text-sm font-medium text-gray-900">License Number</p>
                                                            <p className="text-sm text-gray-600 font-mono">{driver.license_number}</p>
                                                        </div>
                                                    </div>
                                                    
                                                    <div className="flex items-start gap-3">
                                                        <CalendarIcon className="h-4 w-4 text-gray-500 mt-0.5" />
                                                        <div>
                                                            <p className="text-sm font-medium text-gray-900">License Expiry</p>
                                                            <div className="flex items-center gap-2">
                                                                <p className="text-sm text-gray-600">
                                                                    {new Date(driver.license_expiry).toLocaleDateString()}
                                                                </p>
                                                                {isLicenseExpired() && (
                                                                    <Badge variant="destructive">Expired</Badge>
                                                                )}
                                                                {!isLicenseExpired() && isLicenseExpiringSoon() && (
                                                                    <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                                                                        Expiring Soon
                                                                    </Badge>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Second Row: Employment Information & Performance Summary */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
                                            {/* Employment Information */}
                                            <div>
                                                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                                    <Briefcase className="h-5 w-5" />
                                                    Employment Information
                                                </h3>
                                                <div className="space-y-3">
                                                    <div className="flex items-start gap-3">
                                                        <IdCard className="h-4 w-4 text-gray-500 mt-0.5" />
                                                        <div>
                                                            <p className="text-sm font-medium text-gray-900">Employee Number</p>
                                                            <p className="text-sm text-gray-600 font-mono">{driver.employee_number}</p>
                                                        </div>
                                                    </div>
                                                    
                                                    <div className="flex items-start gap-3">
                                                        <Calendar className="h-4 w-4 text-gray-500 mt-0.5" />
                                                        <div>
                                                            <p className="text-sm font-medium text-gray-900">Hire Date</p>
                                                            <p className="text-sm text-gray-600">
                                                                {new Date(driver.hire_date).toLocaleDateString()}
                                                            </p>
                                                        </div>
                                                    </div>

                                                    <div className="flex items-start gap-3">
                                                        <CheckCircle className="h-4 w-4 text-gray-500 mt-0.5" />
                                                        <div>
                                                            <p className="text-sm font-medium text-gray-900">Employment Status</p>
                                                            <Badge className={`capitalize ${getStatusColor(driver.status)}`}>
                                                                {getStatusIcon(driver.status)}
                                                                <span className="ml-1">
                                                                    {driver.status?.replace('_', ' ')}
                                                                </span>
                                                            </Badge>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Performance Summary */}
                                            <div>
                                                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                                    <CheckCircle className="h-5 w-5" />
                                                    Performance Summary
                                                </h3>
                                                <div className="space-y-3">
                                                    <div className="flex items-start gap-3">
                                                        <Truck className="h-4 w-4 text-gray-500 mt-0.5" />
                                                        <div>
                                                            <p className="text-sm font-medium text-gray-900">Routes Completed</p>
                                                            <p className="text-sm text-gray-600">45 routes this month</p>
                                                        </div>
                                                    </div>
                                                    
                                                    <div className="flex items-start gap-3">
                                                        <Clock className="h-4 w-4 text-gray-500 mt-0.5" />
                                                        <div>
                                                            <p className="text-sm font-medium text-gray-900">On-Time Performance</p>
                                                            <p className="text-sm text-gray-600">94% on-time completion</p>
                                                        </div>
                                                    </div>

                                                    <div className="flex items-start gap-3">
                                                        <AlertCircle className="h-4 w-4 text-gray-500 mt-0.5" />
                                                        <div>
                                                            <p className="text-sm font-medium text-gray-900">Safety Record</p>
                                                            <p className="text-sm text-gray-600">No incidents reported</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Third Row: Recent Activity (spans full width) */}
                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                                <Calendar className="h-5 w-5" />
                                                Recent Activity
                                            </h3>
                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                                <div className="bg-gray-50 p-3 rounded-lg">
                                                    <p className="text-sm font-medium">Route RTLKN completed</p>
                                                    <p className="text-xs text-gray-500">2 hours ago</p>
                                                </div>
                                                <div className="bg-gray-50 p-3 rounded-lg">
                                                    <p className="text-sm font-medium">Started morning shift</p>
                                                    <p className="text-xs text-gray-500">6 hours ago</p>
                                                </div>
                                                <div className="bg-gray-50 p-3 rounded-lg">
                                                    <p className="text-sm font-medium">Vehicle inspection passed</p>
                                                    <p className="text-xs text-gray-500">Yesterday</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="routes">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Truck className="h-5 w-5" />
                                        Route Assignments
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-gray-600">Route assignments will be displayed here.</p>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="performance">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <CheckCircle className="h-5 w-5" />
                                        Performance Metrics
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-gray-600">Performance metrics will be displayed here.</p>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="maintenance">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <AlertCircle className="h-5 w-5" />
                                        Vehicle Maintenance
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-gray-600">Vehicle maintenance records will be displayed here.</p>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="activity">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Calendar className="h-5 w-5" />
                                        Activity Log
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-gray-600">Driver activity log will be displayed here.</p>
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
            <Toaster position="top-right" expand={true} richColors />
        </AuthenticatedLayout>
    );
}