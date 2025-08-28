import React, { useState, useEffect } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    Users,
    Truck,
    UserCheck,
    Route,
    Trash2,
    AlertTriangle,
    TrendingUp,
    TrendingDown,
    Calendar,
    MapPin,
    CheckCircle,
    Clock,
    DollarSign,
    Activity,
    Wrench,
    FileText,
} from 'lucide-react';

export default function Dashboard({ auth }) {
    // Mock data - In real app, this would come from API calls
    const [stats, setStats] = useState({
        totalCustomers: 1247,
        totalDrivers: 45,
        totalVehicles: 28,
        activeRoutes: 12,
        vehiclesInMaintenance: 3,
        todayCollections: 89,
        pendingCollections: 12,
        totalComplaints: 23,
        resolvedComplaints: 18,
        avgCustomersPerRoute: 104,
        completionRate: 94,
        onTimeDelivery: 87,
        monthlyRevenue: 125000,
        fuelCost: 15600,
        maintenanceCost: 8900,
    });

    const statsCards = [
        {
            title: "Total Customers",
            value: stats.totalCustomers.toLocaleString(),
            icon: Users,
            trend: "+12%",
            trendUp: true,
            description: "Active customers",
            color: "text-blue-600 bg-blue-50"
        },
        {
            title: "Active Drivers",
            value: stats.totalDrivers,
            icon: UserCheck,
            trend: "+2",
            trendUp: true,
            description: "Drivers on duty today",
            color: "text-green-600 bg-green-50"
        },
        {
            title: "Fleet Size",
            value: stats.totalVehicles,
            icon: Truck,
            trend: "3 in maintenance",
            trendUp: false,
            description: "Total vehicles",
            color: "text-orange-600 bg-orange-50"
        },
        {
            title: "Active Routes",
            value: stats.activeRoutes,
            icon: Route,
            trend: "100% coverage",
            trendUp: true,
            description: "Routes operating today",
            color: "text-purple-600 bg-purple-50"
        },
        {
            title: "Today's Collections",
            value: stats.todayCollections,
            icon: CheckCircle,
            trend: `${stats.pendingCollections} pending`,
            trendUp: stats.pendingCollections < 15,
            description: "Collections completed",
            color: "text-emerald-600 bg-emerald-50"
        },
        {
            title: "Complaints",
            value: stats.totalComplaints,
            icon: AlertTriangle,
            trend: `${stats.resolvedComplaints} resolved`,
            trendUp: (stats.resolvedComplaints / stats.totalComplaints) > 0.7,
            description: "Active complaints",
            color: "text-red-600 bg-red-50"
        },
        {
            title: "Avg Customers/Route",
            value: stats.avgCustomersPerRoute,
            icon: MapPin,
            trend: "+8%",
            trendUp: true,
            description: "Route efficiency",
            color: "text-indigo-600 bg-indigo-50"
        },
        {
            title: "Completion Rate",
            value: `${stats.completionRate}%`,
            icon: Activity,
            trend: "+3%",
            trendUp: true,
            description: "Collection success rate",
            color: "text-teal-600 bg-teal-50"
        }
    ];

    const operationalMetrics = [
        {
            title: "On-Time Performance",
            value: `${stats.onTimeDelivery}%`,
            description: "Routes completed on schedule",
            icon: Clock,
            color: stats.onTimeDelivery > 85 ? "text-green-600" : "text-yellow-600"
        },
        {
            title: "Monthly Revenue",
            value: `$${stats.monthlyRevenue.toLocaleString()}`,
            description: "Revenue this month",
            icon: DollarSign,
            color: "text-green-600"
        },
        {
            title: "Vehicles in Maintenance",
            value: stats.vehiclesInMaintenance,
            description: "Currently under maintenance",
            icon: Wrench,
            color: "text-orange-600"
        },
        {
            title: "Fuel Costs",
            value: `$${stats.fuelCost.toLocaleString()}`,
            description: "Monthly fuel expenses",
            icon: Activity,
            color: "text-blue-600"
        }
    ];

    // Donut chart data (mock percentages)
    const routeStatusData = [
        { name: "Completed", value: 75, color: "text-green-600" },
        { name: "In Progress", value: 20, color: "text-yellow-600" },
        { name: "Pending", value: 5, color: "text-red-600" }
    ];

    const vehicleStatusData = [
        { name: "Active", value: 85, color: "text-green-600" },
        { name: "Maintenance", value: 11, color: "text-orange-600" },
        { name: "Out of Service", value: 4, color: "text-red-600" }
    ];

    const complaintsData = [
        { name: "Resolved", value: 78, color: "text-green-600" },
        { name: "In Progress", value: 17, color: "text-yellow-600" },
        { name: "New", value: 5, color: "text-red-600" }
    ];

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Dashboard" />

            <div className="p-4 sm:p-6 space-y-6 pt-6 sm:pt-8">
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <div className="mb-8 pr-20 sm:pr-24 md:pr-0">
                        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Dashboard</h1>
                        <p className="text-gray-600 mt-2">Overview of your waste management operations</p>
                    </div>

                    {/* Main Stats Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
                        {statsCards.map((stat, index) => (
                            <Card key={index} className="hover:shadow-lg transition-shadow">
                                <CardContent className="p-4 sm:p-6">
                                    <div className="flex items-center justify-between">
                                        <div className="flex-1">
                                            <p className="text-sm font-medium text-gray-600 mb-1">{stat.title}</p>
                                            <p className="text-2xl sm:text-3xl font-bold text-gray-900">{stat.value}</p>
                                            <p className="text-xs text-gray-500 mt-1">{stat.description}</p>
                                        </div>
                                        <div className={`p-3 rounded-full ${stat.color} flex-shrink-0`}>
                                            <stat.icon className="h-5 w-5 sm:h-6 sm:w-6" />
                                        </div>
                                    </div>
                                    <div className="flex items-center mt-4">
                                        {stat.trendUp ? (
                                            <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
                                        ) : (
                                            <TrendingDown className="h-4 w-4 text-red-600 mr-1" />
                                        )}
                                        <span className={`text-sm font-medium ${stat.trendUp ? 'text-green-600' : 'text-red-600'}`}>
                                            {stat.trend}
                                        </span>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    {/* Charts and Additional Metrics */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                        {/* Route Status Chart */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Route className="h-5 w-5" />
                                    Route Status
                                </CardTitle>
                                <CardDescription>Today's route completion status</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {routeStatusData.map((item, index) => (
                                        <div key={index} className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className={`w-4 h-4 rounded-full bg-current ${item.color}`}></div>
                                                <span className="text-sm font-medium">{item.name}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <div className="w-16 bg-gray-200 rounded-full h-2">
                                                    <div 
                                                        className={`h-2 rounded-full bg-current ${item.color}`}
                                                        style={{ width: `${item.value}%` }}
                                                    ></div>
                                                </div>
                                                <span className="text-sm font-semibold w-8">{item.value}%</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Vehicle Status Chart */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Truck className="h-5 w-5" />
                                    Fleet Status
                                </CardTitle>
                                <CardDescription>Current vehicle availability</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {vehicleStatusData.map((item, index) => (
                                        <div key={index} className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className={`w-4 h-4 rounded-full bg-current ${item.color}`}></div>
                                                <span className="text-sm font-medium">{item.name}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <div className="w-16 bg-gray-200 rounded-full h-2">
                                                    <div 
                                                        className={`h-2 rounded-full bg-current ${item.color}`}
                                                        style={{ width: `${item.value}%` }}
                                                    ></div>
                                                </div>
                                                <span className="text-sm font-semibold w-8">{item.value}%</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Complaints Status Chart */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <FileText className="h-5 w-5" />
                                    Complaints Status
                                </CardTitle>
                                <CardDescription>Customer complaint resolution</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {complaintsData.map((item, index) => (
                                        <div key={index} className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className={`w-4 h-4 rounded-full bg-current ${item.color}`}></div>
                                                <span className="text-sm font-medium">{item.name}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <div className="w-16 bg-gray-200 rounded-full h-2">
                                                    <div 
                                                        className={`h-2 rounded-full bg-current ${item.color}`}
                                                        style={{ width: `${item.value}%` }}
                                                    ></div>
                                                </div>
                                                <span className="text-sm font-semibold w-8">{item.value}%</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Operational Metrics */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                        {operationalMetrics.map((metric, index) => (
                            <Card key={index}>
                                <CardContent className="p-4 sm:p-6">
                                    <div className="flex items-center justify-between mb-4">
                                        <metric.icon className={`h-6 w-6 ${metric.color}`} />
                                        <Badge variant="secondary" className="text-xs">
                                            Today
                                        </Badge>
                                    </div>
                                    <div>
                                        <p className="text-2xl font-bold text-gray-900">{metric.value}</p>
                                        <p className="text-sm text-gray-600 mt-1">{metric.title}</p>
                                        <p className="text-xs text-gray-500 mt-1">{metric.description}</p>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    {/* Quick Actions or Recent Activity could go here */}
                    <Card className="mt-8">
                        <CardHeader>
                            <CardTitle>Quick Actions</CardTitle>
                            <CardDescription>Frequently used operations</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-center">
                                    <Users className="h-6 w-6 mx-auto mb-2 text-blue-600" />
                                    <span className="text-sm font-medium">Add Customer</span>
                                </button>
                                <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-center">
                                    <Route className="h-6 w-6 mx-auto mb-2 text-green-600" />
                                    <span className="text-sm font-medium">Create Route</span>
                                </button>
                                <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-center">
                                    <Wrench className="h-6 w-6 mx-auto mb-2 text-orange-600" />
                                    <span className="text-sm font-medium">Schedule Maintenance</span>
                                </button>
                                <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-center">
                                    <FileText className="h-6 w-6 mx-auto mb-2 text-purple-600" />
                                    <span className="text-sm font-medium">View Reports</span>
                                </button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
