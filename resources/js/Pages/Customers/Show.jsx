import React, { useState, useEffect } from 'react';
import { Head, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { toast, Toaster } from 'sonner';
import { useAuthStore } from '@/stores/authStore';
import { useCustomerStore } from '@/stores/customerStore';
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
} from "lucide-react";

export default function Show({ auth, api_token, customer: initialCustomer }) {
    const [customer, setCustomer] = useState(initialCustomer);
    
    // Zustand stores
    const { setAuth, token, isAuthenticated } = useAuthStore();
    const { 
        error, 
        approveCustomerRegistration,
        clearError 
    } = useCustomerStore();

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

    const handleApproveRegistration = async () => {
        if (window.confirm('Are you sure you want to approve this customer registration?')) {
            try {
                await approveCustomerRegistration(customer.id);
                setCustomer(prev => ({
                    ...prev,
                    registration_status: 'approved',
                    status: 'active'
                }));
                toast.success('Customer registration approved successfully');
            } catch (error) {
                console.error('Error approving customer:', error);
            }
        }
    };

    const getStatusColor = (status) => {
        const colors = {
            pending: 'bg-yellow-100 text-yellow-800',
            approved: 'bg-green-100 text-green-800',
            rejected: 'bg-red-100 text-red-800',
            active: 'bg-green-100 text-green-800',
            inactive: 'bg-gray-100 text-gray-800',
            suspended: 'bg-red-100 text-red-800',
        };
        return colors[status] || 'bg-gray-100 text-gray-800';
    };

    const getStatusIcon = (status) => {
        const icons = {
            pending: <Clock className="h-4 w-4" />,
            approved: <CheckCircle className="h-4 w-4" />,
            rejected: <AlertCircle className="h-4 w-4" />,
            active: <CheckCircle className="h-4 w-4" />,
            inactive: <AlertCircle className="h-4 w-4" />,
            suspended: <AlertCircle className="h-4 w-4" />,
        };
        return icons[status] || <AlertCircle className="h-4 w-4" />;
    };

    // Show access denied if user is not admin
    if (auth.user?.role !== 'admin') {
        return (
            <AuthenticatedLayout
                user={auth.user}
                header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Customer Details</h2>}
            >
                <Head title="Customer Details" />
                <div className="py-4 sm:py-8">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <Card className="w-full">
                            <CardContent className="p-4 sm:p-6">
                                <div className="text-center">
                                    <h3 className="text-lg font-medium text-red-600">Access Denied</h3>
                                    <p className="mt-2 text-sm text-gray-600">
                                        You need admin privileges to view customer details.
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
                    <Link href="/customers">
                        <Button variant="ghost" size="sm">
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Back to Customers
                        </Button>
                    </Link>
                    <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                        Customer Details
                    </h2>
                </div>
            }
        >
            <Head title={`Customer - ${customer.first_name} ${customer.last_name}`} />
            
            <div className="py-4 sm:py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
                    
                    {/* Customer Header */}
                    <Card>
                        <CardHeader>
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                <div className="flex items-center gap-4">
                                    <div className="h-16 w-16 rounded-full bg-gray-100 flex items-center justify-center">
                                        <User className="h-8 w-8 text-gray-600" />
                                    </div>
                                    <div>
                                        <CardTitle className="text-2xl">
                                            {customer.first_name} {customer.last_name}
                                        </CardTitle>
                                        <CardDescription className="flex items-center gap-2 mt-1">
                                            <span className="font-mono">{customer.customer_number}</span>
                                            <Separator orientation="vertical" className="h-4" />
                                            <span>{customer.user?.email}</span>
                                        </CardDescription>
                                    </div>
                                </div>
                                <div className="flex flex-col sm:flex-row gap-2">
                                    <Badge className={`capitalize ${getStatusColor(customer.registration_status)}`}>
                                        {getStatusIcon(customer.registration_status)}
                                        <span className="ml-1">
                                            {customer.registration_status?.replace('_', ' ')}
                                        </span>
                                    </Badge>
                                    <Badge className={`capitalize ${getStatusColor(customer.status)}`}>
                                        {getStatusIcon(customer.status)}
                                        <span className="ml-1">
                                            {customer.status?.replace('_', ' ')}
                                        </span>
                                    </Badge>
                                    {customer.registration_status === 'pending' && (
                                        <Button onClick={handleApproveRegistration} size="sm">
                                            <CheckCircle className="h-4 w-4 mr-2" />
                                            Approve Registration
                                        </Button>
                                    )}
                                    <Button variant="outline" size="sm">
                                        <Edit className="h-4 w-4 mr-2" />
                                        Edit Customer
                                    </Button>
                                </div>
                            </div>
                        </CardHeader>
                    </Card>

                    {/* Customer Details Tabs */}
                    <Tabs defaultValue="details" className="w-full">
                        <TabsList className="grid w-full grid-cols-5">
                            <TabsTrigger value="details">Details</TabsTrigger>
                            <TabsTrigger value="billing">Billing</TabsTrigger>
                            <TabsTrigger value="collections">Collections</TabsTrigger>
                            <TabsTrigger value="complaints">Complaints</TabsTrigger>
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
                                                <p className="text-sm text-gray-600">{customer.user?.email}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <Phone className="h-4 w-4 text-gray-500" />
                                            <div>
                                                <p className="text-sm font-medium">Primary Phone</p>
                                                <p className="text-sm text-gray-600">{customer.phone}</p>
                                            </div>
                                        </div>
                                        {customer.alternative_phone && (
                                            <div className="flex items-center gap-3">
                                                <Phone className="h-4 w-4 text-gray-500" />
                                                <div>
                                                    <p className="text-sm font-medium">Alternative Phone</p>
                                                    <p className="text-sm text-gray-600">{customer.alternative_phone}</p>
                                                </div>
                                            </div>
                                        )}
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
                                            <p className="text-sm font-medium">Full Address</p>
                                            <p className="text-sm text-gray-600">{customer.address}</p>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <p className="text-sm font-medium">City</p>
                                                <p className="text-sm text-gray-600">{customer.city}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium">Area</p>
                                                <p className="text-sm text-gray-600">{customer.area}</p>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <p className="text-sm font-medium">Latitude</p>
                                                <p className="text-sm text-gray-600 font-mono">{customer.latitude}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium">Longitude</p>
                                                <p className="text-sm text-gray-600 font-mono">{customer.longitude}</p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Registration Information */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <Calendar className="h-5 w-5" />
                                            Registration Information
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div>
                                            <p className="text-sm font-medium">Registration Date</p>
                                            <p className="text-sm text-gray-600">
                                                {new Date(customer.created_at).toLocaleDateString()}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium">Registration Fee</p>
                                            <p className="text-sm text-gray-600">
                                                ${parseFloat(customer.registration_fee || 0).toFixed(2)}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium">Payment Status</p>
                                            <Badge variant={customer.registration_paid ? "default" : "secondary"}>
                                                {customer.registration_paid ? "Paid" : "Pending"}
                                            </Badge>
                                        </div>
                                        {customer.registration_paid_at && (
                                            <div>
                                                <p className="text-sm font-medium">Payment Date</p>
                                                <p className="text-sm text-gray-600">
                                                    {new Date(customer.registration_paid_at).toLocaleDateString()}
                                                </p>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>

                                {/* Notes */}
                                {customer.notes && (
                                    <Card>
                                        <CardHeader>
                                            <CardTitle className="flex items-center gap-2">
                                                <FileText className="h-5 w-5" />
                                                Notes
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <p className="text-sm text-gray-600">{customer.notes}</p>
                                        </CardContent>
                                    </Card>
                                )}
                            </div>
                        </TabsContent>

                        <TabsContent value="billing">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <CreditCard className="h-5 w-5" />
                                        Billing Information
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-gray-600">Billing information will be displayed here.</p>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="collections">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Truck className="h-5 w-5" />
                                        Collection History
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-gray-600">Collection history will be displayed here.</p>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="complaints">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <AlertCircle className="h-5 w-5" />
                                        Complaints
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-gray-600">Customer complaints will be displayed here.</p>
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
                                    <p className="text-gray-600">Customer activity log will be displayed here.</p>
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