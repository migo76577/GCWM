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
            
            <div className="py-4 sm:py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
                    
                    {/* Driver Header */}
                    <Card>
                        <CardHeader>
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                <div className="flex items-center gap-4">
                                    <div className="h-16 w-16 rounded-full bg-gray-100 flex items-center justify-center">
                                        <User className="h-8 w-8 text-gray-600" />
                                    </div>
                                    <div>
                                        <CardTitle className="text-2xl">
                                            {driver.first_name} {driver.last_name}
                                        </CardTitle>
                                        <CardDescription className="flex items-center gap-2 mt-1">
                                            <span className="font-mono">{driver.employee_number}</span>
                                            <Separator orientation="vertical" className="h-4" />
                                            <span>{driver.user?.email}</span>
                                        </CardDescription>
                                    </div>
                                </div>
                                <div className="flex flex-col sm:flex-row gap-2">
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
                        <TabsList className="grid w-full grid-cols-5">
                            <TabsTrigger value="details">Details</TabsTrigger>
                            <TabsTrigger value="routes">Routes</TabsTrigger>
                            <TabsTrigger value="performance">Performance</TabsTrigger>
                            <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
                            <TabsTrigger value="activity">Activity</TabsTrigger>
                        </TabsList>

                        <TabsContent value="details" className="space-y-6">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                {/* Contact Information */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <Phone className="h-5 w-5" />
                                            Contact Information
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="flex items-center gap-3">
                                            <Mail className="h-4 w-4 text-gray-500" />
                                            <div>
                                                <p className="text-sm font-medium">Email</p>
                                                <p className="text-sm text-gray-600">{driver.user?.email}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <Phone className="h-4 w-4 text-gray-500" />
                                            <div>
                                                <p className="text-sm font-medium">Phone Number</p>
                                                <p className="text-sm text-gray-600">{driver.phone}</p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Address Information */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <MapPin className="h-5 w-5" />
                                            Address Information
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div>
                                            <p className="text-sm font-medium">Address</p>
                                            <p className="text-sm text-gray-600">{driver.address || 'Not provided'}</p>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Employment Information */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <Briefcase className="h-5 w-5" />
                                            Employment Information
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div>
                                            <p className="text-sm font-medium">Employee Number</p>
                                            <p className="text-sm text-gray-600 font-mono">{driver.employee_number}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium">Hire Date</p>
                                            <p className="text-sm text-gray-600">
                                                {new Date(driver.hire_date).toLocaleDateString()}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium">Status</p>
                                            <Badge className={`capitalize ${getStatusColor(driver.status)}`}>
                                                {getStatusIcon(driver.status)}
                                                <span className="ml-1">
                                                    {driver.status?.replace('_', ' ')}
                                                </span>
                                            </Badge>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* License Information */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <IdCard className="h-5 w-5" />
                                            License Information
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div>
                                            <p className="text-sm font-medium">License Number</p>
                                            <p className="text-sm text-gray-600 font-mono">{driver.license_number}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium">License Expiry</p>
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
                                    </CardContent>
                                </Card>
                            </div>
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