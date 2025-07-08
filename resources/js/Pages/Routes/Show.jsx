import React, { useState, useEffect } from 'react';
import { Head, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DataTable } from "@/components/ui/data-table";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
    ArrowLeft, 
    MapPin, 
    Users, 
    Calendar, 
    Clock,
    Route as RouteIcon,
    BarChart3,
    MoreHorizontal,
    Eye,
    Edit,
    UserMinus
} from "lucide-react";
import { useAuthStore, useRouteStore } from '@/stores';
import { toast, Toaster } from 'sonner';
import RouteScheduleManager from '@/Components/Routes/RouteScheduleManager';
import RouteAssignmentManager from '@/Components/Routes/RouteAssignmentManager';

export default function Show({ auth, api_token, routeId }) {
    const [assignments, setAssignments] = useState([]);
    const [loading, setLoading] = useState(true);

    // Zustand stores
    const { setAuth, token, isAuthenticated } = useAuthStore();
    const { 
        selectedRoute: route, 
        routeCustomers,
        isLoading,
        fetchRoute, 
        fetchRouteCustomers,
        removeCustomerFromRoute,
        updateRouteSchedule,
        fetchRouteAssignments,
        createRouteAssignment,
        updateRouteAssignment,
        deleteRouteAssignment,
        error, 
        clearError 
    } = useRouteStore();

    const customers = routeCustomers[routeId] || [];

    // Customer table columns
    const customerColumns = React.useMemo(
        () => [
            {
                accessorKey: 'customer_number',
                header: 'Customer #',
                cell: ({ row }) => (
                    <div className="font-medium text-xs sm:text-sm">{row.getValue('customer_number')}</div>
                ),
            },
            {
                accessorKey: 'name',
                header: 'Name',
                cell: ({ row }) => {
                    const firstName = row.original.first_name || '';
                    const lastName = row.original.last_name || '';
                    const fullName = `${firstName} ${lastName}`.trim();
                    return (
                        <div className="text-xs sm:text-sm font-medium truncate max-w-24 sm:max-w-none" title={fullName}>
                            {fullName}
                        </div>
                    );
                },
            },
            {
                accessorKey: 'phone',
                header: 'Phone',
                cell: ({ row }) => (
                    <div className="font-mono text-xs sm:text-sm">{row.getValue('phone')}</div>
                ),
            },
            {
                accessorKey: 'area',
                header: 'Area',
                cell: ({ row }) => (
                    <div className="text-xs sm:text-sm truncate max-w-20 sm:max-w-none">{row.getValue('area')}</div>
                ),
            },
            {
                accessorKey: 'status',
                header: 'Status',
                cell: ({ row }) => {
                    const status = row.getValue('status');
                    const statusColors = {
                        active: 'bg-green-100 text-green-800',
                        inactive: 'bg-gray-100 text-gray-800',
                        suspended: 'bg-red-100 text-red-800',
                    };
                    return (
                        <Badge 
                            variant="secondary" 
                            className={`text-xs py-0 px-1 sm:px-2 ${statusColors[status] || 'bg-gray-100 text-gray-800'}`}
                        >
                            <span className="capitalize">{status}</span>
                        </Badge>
                    );
                },
            },
            {
                id: 'actions',
                header: 'Actions',
                cell: ({ row }) => {
                    const customer = row.original;
                    return (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0">
                                    <span className="sr-only">Open menu</span>
                                    <MoreHorizontal className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem asChild>
                                    <Link href={`/customers/${customer.id}`} className="flex items-center">
                                        <Eye className="mr-2 h-4 w-4" />
                                        View Details
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => console.log('Edit customer:', customer.id)}>
                                    <Edit className="mr-2 h-4 w-4" />
                                    Edit Customer
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem 
                                    onClick={() => handleRemoveFromRoute(customer.id)}
                                    className="text-red-600 focus:text-red-600"
                                >
                                    <UserMinus className="mr-2 h-4 w-4" />
                                    Remove from Route
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    );
                },
            },
        ],
        []
    );

    // Initialize auth store with props
    useEffect(() => {
        if (auth.user && api_token && !isAuthenticated) {
            setAuth(auth.user, api_token);
        }
    }, [auth.user, api_token, isAuthenticated, setAuth]);

    // Fetch route, customers and assignments data
    useEffect(() => {
        const loadData = async () => {
            if (isAuthenticated && token && auth.user?.role === 'admin' && routeId) {
                try {
                    setLoading(true);
                    const routeData = await fetchRoute(routeId);
                    await fetchRouteCustomers(routeId);
                    // Use route_assignments from the route data
                    setAssignments(routeData?.route_assignments || []);
                } catch (error) {
                    console.error('Error loading route data:', error);
                    toast.error('Failed to load route data');
                } finally {
                    setLoading(false);
                }
            }
        };

        loadData();
    }, [isAuthenticated, token, routeId, fetchRoute, fetchRouteCustomers, fetchRouteAssignments]);

    // Show error toast when error state changes
    useEffect(() => {
        if (error) {
            toast.error(error);
            clearError();
        }
    }, [error, clearError]);

    const handleRemoveFromRoute = async (customerId) => {
        if (window.confirm('Are you sure you want to remove this customer from the route?')) {
            try {
                await removeCustomerFromRoute(routeId, customerId);
                toast.success('Customer removed from route successfully');
            } catch (error) {
                console.error('Error removing customer:', error);
            }
        }
    };

    const handleScheduleUpdate = async (scheduleData) => {
        try {
            await updateRouteSchedule(routeId, scheduleData);
            toast.success('Schedule updated successfully');
        } catch (error) {
            console.error('Error updating schedule:', error);
            throw error;
        }
    };

    const handleAssignmentCreate = async (assignmentData) => {
        try {
            const newAssignment = await createRouteAssignment(assignmentData);
            setAssignments(prev => [...prev, newAssignment]);
            return newAssignment;
        } catch (error) {
            console.error('Error creating assignment:', error);
            throw error;
        }
    };

    const handleAssignmentUpdate = async (assignmentId, assignmentData) => {
        try {
            const updatedAssignment = await updateRouteAssignment(assignmentId, assignmentData);
            setAssignments(prev => 
                prev.map(assignment => 
                    assignment.id === assignmentId ? updatedAssignment : assignment
                )
            );
            return updatedAssignment;
        } catch (error) {
            console.error('Error updating assignment:', error);
            throw error;
        }
    };

    const handleAssignmentDelete = async (assignmentId) => {
        try {
            await deleteRouteAssignment(assignmentId);
            setAssignments(prev => prev.filter(assignment => assignment.id !== assignmentId));
        } catch (error) {
            console.error('Error deleting assignment:', error);
            throw error;
        }
    };

    // Show access denied if user is not admin
    if (auth.user?.role !== 'admin') {
        return (
            <AuthenticatedLayout
                user={auth.user}
                header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Route Details</h2>}
            >
                <Head title="Route Details" />
                <div className="py-4 sm:py-8">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <Card className="w-full">
                            <CardContent className="p-4 sm:p-6">
                                <div className="text-center">
                                    <h3 className="text-lg font-medium text-red-600">Access Denied</h3>
                                    <p className="mt-2 text-sm text-gray-600">
                                        You need admin privileges to access route details.
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </AuthenticatedLayout>
        );
    }

    if (loading || !route) {
        return (
            <AuthenticatedLayout
                user={auth.user}
                header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Route Details</h2>}
            >
                <Head title="Route Details" />
                <div className="py-4 sm:py-8">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex items-center justify-center h-64">
                            <div className="text-center">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                                <p className="text-gray-600">Loading route details...</p>
                            </div>
                        </div>
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
                    <Link href="/routes">
                        <Button variant="ghost" size="sm">
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Back to Routes
                        </Button>
                    </Link>
                    <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                        Route Details: {route.name}
                    </h2>
                </div>
            }
        >
            <Head title={`Route: ${route.name}`} />
            
            <div className="py-2 sm:py-8">
                <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8 space-y-6">
                    {/* Route Header Info */}
                    <Card>
                        <CardHeader>
                            <div className="flex items-start justify-between">
                                <div>
                                    <CardTitle className="flex items-center gap-2">
                                        <RouteIcon className="h-6 w-6" />
                                        {route.name}
                                    </CardTitle>
                                    <CardDescription className="mt-1">
                                        Code: {route.route_code}
                                    </CardDescription>
                                </div>
                                <Badge 
                                    variant={route.status === 'active' ? 'default' : 'secondary'}
                                    className="capitalize"
                                >
                                    {route.status}
                                </Badge>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                <div className="flex items-center gap-3">
                                    <MapPin className="h-5 w-5 text-gray-500" />
                                    <div>
                                        <p className="text-sm font-medium">Areas Covered</p>
                                        <p className="text-sm text-gray-600">
                                            {Array.isArray(route.areas_covered) 
                                                ? route.areas_covered.join(', ')
                                                : route.areas_covered
                                            }
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Users className="h-5 w-5 text-gray-500" />
                                    <div>
                                        <p className="text-sm font-medium">Customers</p>
                                        <p className="text-sm text-gray-600">
                                            {customers.length} / {route.max_customers}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Clock className="h-5 w-5 text-gray-500" />
                                    <div>
                                        <p className="text-sm font-medium">Schedule</p>
                                        <p className="text-sm text-gray-600">
                                            {route.start_time} - {route.end_time}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Calendar className="h-5 w-5 text-gray-500" />
                                    <div>
                                        <p className="text-sm font-medium">Collection Days</p>
                                        <div className="flex flex-wrap gap-1 mt-1">
                                            {route.collection_days?.slice(0, 3).map((day) => (
                                                <Badge key={day} variant="outline" className="text-xs capitalize">
                                                    {day.substring(0, 3)}
                                                </Badge>
                                            ))}
                                            {route.collection_days?.length > 3 && (
                                                <Badge variant="outline" className="text-xs">
                                                    +{route.collection_days.length - 3}
                                                </Badge>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {route.description && (
                                <div className="mt-4 pt-4 border-t">
                                    <p className="text-sm text-gray-600">{route.description}</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Tabbed Content */}
                    <Tabs defaultValue="schedule" className="w-full">
                        <TabsList className="grid w-full grid-cols-4">
                            <TabsTrigger value="schedule">Schedule</TabsTrigger>
                            <TabsTrigger value="assignments">Assignments</TabsTrigger>
                            <TabsTrigger value="customers">Customers</TabsTrigger>
                            <TabsTrigger value="analytics">Analytics</TabsTrigger>
                        </TabsList>

                        <TabsContent value="schedule" className="space-y-6">
                            <RouteScheduleManager 
                                route={route}
                                onScheduleUpdate={handleScheduleUpdate}
                            />
                        </TabsContent>

                        <TabsContent value="assignments" className="space-y-6">
                            <RouteAssignmentManager 
                                route={route}
                                assignments={assignments}
                                onAssignmentCreate={handleAssignmentCreate}
                                onAssignmentUpdate={handleAssignmentUpdate}
                                onAssignmentDelete={handleAssignmentDelete}
                            />
                        </TabsContent>

                        <TabsContent value="customers" className="space-y-6">
                            <Card className="w-full overflow-hidden">
                                <CardHeader className="pb-4">
                                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                        <div className="min-w-0">
                                            <CardTitle className="text-xl sm:text-2xl font-bold truncate">
                                                Route Customers ({customers.length})
                                            </CardTitle>
                                            <CardDescription className="text-sm sm:text-base">
                                                Customers assigned to this route
                                            </CardDescription>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="p-2 sm:p-6">
                                    <DataTable 
                                        columns={customerColumns} 
                                        data={customers} 
                                        isLoading={isLoading}
                                        pageSize={10}
                                    />
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="analytics" className="space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <BarChart3 className="h-5 w-5" />
                                        Route Analytics
                                    </CardTitle>
                                    <CardDescription>
                                        Performance metrics and insights
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-center py-8">
                                        <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                        <p className="text-gray-600">Analytics dashboard coming soon</p>
                                    </div>
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