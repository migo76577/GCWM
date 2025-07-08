import React, { useState, useEffect } from 'react';
import { Head, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { toast, Toaster } from 'sonner';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuthStore, useRouteStore } from '@/stores';
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import InputError from '@/Components/InputError';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable } from "@/components/ui/data-table";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Trash2, Eye, Edit, Users, MapPin } from "lucide-react";

const routeSchema = z.object({
    route_code: z.string()
        .min(1, 'Route code is required')
        .max(50, 'Route code must not exceed 50 characters'),
    name: z.string()
        .min(1, 'Route name is required')
        .max(255, 'Route name must not exceed 255 characters'),
    description: z.string()
        .max(500, 'Description must not exceed 500 characters')
        .optional()
        .or(z.literal('')),
    areas_covered: z.string()
        .min(1, 'Areas covered is required'),
    collection_days: z.array(z.string())
        .min(1, 'At least one collection day is required'),
    start_time: z.string()
        .min(1, 'Start time is required'),
    end_time: z.string()
        .min(1, 'End time is required'),
    max_customers: z.number()
        .min(1, 'Maximum customers must be at least 1')
        .or(z.string().regex(/^\d+$/, 'Must be a valid number').transform(Number)),
});

const daysOfWeek = [
    { value: 'monday', label: 'Monday' },
    { value: 'tuesday', label: 'Tuesday' },
    { value: 'wednesday', label: 'Wednesday' },
    { value: 'thursday', label: 'Thursday' },
    { value: 'friday', label: 'Friday' },
    { value: 'saturday', label: 'Saturday' },
    { value: 'sunday', label: 'Sunday' },
];

export default function Index({ auth, api_token }) {
    const [open, setOpen] = useState(false);

    // Zustand stores
    const { setAuth, token, isAuthenticated } = useAuthStore();
    const { 
        routes, 
        isLoading, 
        error, 
        fetchRoutes, 
        addRoute, 
        deleteRoute,
        clearError 
    } = useRouteStore();

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        reset,
        control,
        formState: { errors, isSubmitting }
    } = useForm({
        resolver: zodResolver(routeSchema),
        defaultValues: {
            route_code: '',
            name: '',
            description: '',
            areas_covered: '',
            collection_days: [],
            start_time: '',
            end_time: '',
            max_customers: ''
        }
    });

    const columns = React.useMemo(
        () => [
            {
                accessorKey: 'route_code',
                header: 'Code',
                cell: ({ row }) => (
                    <div className="font-medium text-xs sm:text-sm">{row.getValue('route_code')}</div>
                ),
            },
            {
                accessorKey: 'name',
                header: 'Name',
                cell: ({ row }) => (
                    <div className="text-xs sm:text-sm font-medium max-w-32 sm:max-w-48 break-words" title={row.getValue('name')}>
                        {row.getValue('name')}
                    </div>
                ),
            },
            {
                accessorKey: 'areas_covered',
                header: 'Areas',
                cell: ({ row }) => {
                    const areas = row.getValue('areas_covered');
                    const areasArray = Array.isArray(areas) ? areas : [areas];
                    return (
                        <div className="text-xs sm:text-sm max-w-32 sm:max-w-48 break-words hyphens-auto leading-tight" title={areasArray.join(', ')}>
                            {areasArray.join(', ')}
                        </div>
                    );
                },
            },
            {
                accessorKey: 'collection_days',
                header: 'Days',
                cell: ({ row }) => {
                    const days = row.getValue('collection_days') || [];
                    const dayAbbr = {
                        monday: 'M', tuesday: 'T', wednesday: 'W', thursday: 'Th', 
                        friday: 'F', saturday: 'S', sunday: 'Su'
                    };
                    return (
                        <div className="flex flex-wrap gap-1 max-w-24 sm:max-w-32">
                            {days.slice(0, 2).map((day) => (
                                <Badge key={day} variant="outline" className="text-xs px-1">
                                    <span className="sm:hidden">{dayAbbr[day] || day.charAt(0).toUpperCase()}</span>
                                    <span className="hidden sm:inline capitalize">{day.substring(0, 3)}</span>
                                </Badge>
                            ))}
                            {days.length > 2 && (
                                <Badge variant="outline" className="text-xs px-1">
                                    +{days.length - 2}
                                </Badge>
                            )}
                        </div>
                    );
                },
            },
            {
                accessorKey: 'customers_count',
                header: 'Customers',
                cell: ({ row }) => {
                    const count = row.getValue('customers_count') || 0;
                    const maxCustomers = row.original.max_customers || 0;
                    return (
                        <div className="text-xs sm:text-sm">
                            <span className={count >= maxCustomers ? 'text-red-600 font-medium' : ''}>
                                {count}/{maxCustomers}
                            </span>
                        </div>
                    );
                },
            },
            {
                accessorKey: 'status',
                header: 'Status',
                cell: ({ row }) => {
                    const status = row.getValue('status');
                    const statusColors = {
                        active: 'bg-green-100 text-green-800',
                        inactive: 'bg-gray-100 text-gray-800',
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
                    const route = row.original;
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
                                    <Link href={`/routes/${route.id}`} className="flex items-center">
                                        <Eye className="mr-2 h-4 w-4" />
                                        View Details
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                    <Link href={`/routes/${route.id}`} className="flex items-center">
                                        <Users className="mr-2 h-4 w-4" />
                                        View Customers
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => console.log('Edit route:', route.id)}>
                                    <Edit className="mr-2 h-4 w-4" />
                                    Edit Route
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem 
                                    onClick={() => handleDelete(route.id)}
                                    className="text-red-600 focus:text-red-600"
                                >
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Delete Route
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

    // Fetch routes when auth is ready
    useEffect(() => {
        if (isAuthenticated && token && auth.user?.role === 'admin') {
            fetchRoutes();
        }
    }, [isAuthenticated, token, fetchRoutes]);

    // Show error toast when error state changes
    useEffect(() => {
        if (error) {
            toast.error(error);
            clearError();
        }
    }, [error, clearError]);

    const onSubmit = async (data) => {
        try {
            const routeData = {
                ...data,
                areas_covered: data.areas_covered.split(',').map(area => area.trim()),
                max_customers: parseInt(data.max_customers)
            };
            
            await addRoute(routeData);
            setOpen(false);
            reset();
            toast.success('Route added successfully');
        } catch (error) {
            console.error('Error adding route:', error);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this route?')) {
            try {
                await deleteRoute(id);
                toast.success('Route deleted successfully');
            } catch (error) {
                console.error('Error deleting route:', error);
            }
        }
    };

    // Show access denied if user is not admin
    if (auth.user?.role !== 'admin') {
        return (
            <AuthenticatedLayout
                user={auth.user}
                header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Routes</h2>}
            >
                <Head title="Routes" />
                <div className="py-4 sm:py-8">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <Card className="w-full">
                            <CardContent className="p-4 sm:p-6">
                                <div className="text-center">
                                    <h3 className="text-lg font-medium text-red-600">Access Denied</h3>
                                    <p className="mt-2 text-sm text-gray-600">
                                        You need admin privileges to access route management.
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
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Routes</h2>}
        >
            <Head title="Routes" />
            
            <div className="py-2 sm:py-8">
                <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
                    <Card className="w-full overflow-hidden min-w-0">
                        <CardHeader className="pb-4">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                <div className="min-w-0">
                                    <CardTitle className="text-xl sm:text-2xl font-bold truncate">Route Management</CardTitle>
                                    <CardDescription className="text-sm sm:text-base">
                                        Manage collection routes and their assignments
                                    </CardDescription>
                                </div>
                                <Dialog open={open} onOpenChange={setOpen}>
                                    <DialogTrigger asChild>
                                        <Button>Add Route</Button>
                                    </DialogTrigger>
                                    <DialogContent className="sm:max-w-[500px] max-h-[90vh]">
                                        <DialogHeader>
                                            <DialogTitle>Add New Route</DialogTitle>
                                        </DialogHeader>
                                        <ScrollArea className="h-[calc(90vh-8rem)]">
                                            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pr-4">
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                    <div className="space-y-2">
                                                        <Label htmlFor="route_code">Route Code</Label>
                                                        <Input
                                                            id="route_code"
                                                            {...register('route_code')}
                                                            placeholder="e.g., RT001"
                                                        />
                                                        {errors.route_code && (
                                                            <InputError message={errors.route_code.message} />
                                                        )}
                                                    </div>

                                                    <div className="space-y-2">
                                                        <Label htmlFor="name">Route Name</Label>
                                                        <Input
                                                            id="name"
                                                            {...register('name')}
                                                            placeholder="e.g., Downtown Route"
                                                        />
                                                        {errors.name && (
                                                            <InputError message={errors.name.message} />
                                                        )}
                                                    </div>

                                                    <div className="space-y-2 sm:col-span-2">
                                                        <Label htmlFor="description">Description (Optional)</Label>
                                                        <Textarea
                                                            id="description"
                                                            rows={2}
                                                            {...register('description')}
                                                            placeholder="Brief description of the route"
                                                        />
                                                        {errors.description && (
                                                            <InputError message={errors.description.message} />
                                                        )}
                                                    </div>

                                                    <div className="space-y-2 sm:col-span-2">
                                                        <Label htmlFor="areas_covered">Areas Covered</Label>
                                                        <Input
                                                            id="areas_covered"
                                                            {...register('areas_covered')}
                                                            placeholder="Enter areas separated by commas"
                                                        />
                                                        {errors.areas_covered && (
                                                            <InputError message={errors.areas_covered.message} />
                                                        )}
                                                    </div>

                                                    <div className="space-y-2 sm:col-span-2">
                                                        <Label>Collection Days</Label>
                                                        <Controller
                                                            name="collection_days"
                                                            control={control}
                                                            render={({ field }) => (
                                                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                                                    {daysOfWeek.map((day) => (
                                                                        <div key={day.value} className="flex items-center space-x-2">
                                                                            <Checkbox
                                                                                id={`day-${day.value}`}
                                                                                checked={field.value.includes(day.value)}
                                                                                onCheckedChange={(checked) => {
                                                                                    const currentValues = field.value || [];
                                                                                    if (checked) {
                                                                                        field.onChange([...currentValues, day.value]);
                                                                                    } else {
                                                                                        field.onChange(currentValues.filter(v => v !== day.value));
                                                                                    }
                                                                                }}
                                                                            />
                                                                            <Label 
                                                                                htmlFor={`day-${day.value}`} 
                                                                                className="text-sm font-normal cursor-pointer"
                                                                            >
                                                                                {day.label}
                                                                            </Label>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            )}
                                                        />
                                                        {errors.collection_days && (
                                                            <InputError message={errors.collection_days.message} />
                                                        )}
                                                    </div>

                                                    <div className="space-y-2">
                                                        <Label htmlFor="start_time">Start Time</Label>
                                                        <Input
                                                            id="start_time"
                                                            type="time"
                                                            {...register('start_time')}
                                                        />
                                                        {errors.start_time && (
                                                            <InputError message={errors.start_time.message} />
                                                        )}
                                                    </div>

                                                    <div className="space-y-2">
                                                        <Label htmlFor="end_time">End Time</Label>
                                                        <Input
                                                            id="end_time"
                                                            type="time"
                                                            {...register('end_time')}
                                                        />
                                                        {errors.end_time && (
                                                            <InputError message={errors.end_time.message} />
                                                        )}
                                                    </div>

                                                    <div className="space-y-2 sm:col-span-2">
                                                        <Label htmlFor="max_customers">Maximum Customers</Label>
                                                        <Input
                                                            id="max_customers"
                                                            type="number"
                                                            min="1"
                                                            {...register('max_customers')}
                                                            placeholder="e.g., 50"
                                                        />
                                                        {errors.max_customers && (
                                                            <InputError message={errors.max_customers.message} />
                                                        )}
                                                    </div>
                                                </div>

                                                <div className="flex justify-end space-x-2 pt-4">
                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                        onClick={() => setOpen(false)}
                                                        disabled={isSubmitting}
                                                    >
                                                        Cancel
                                                    </Button>
                                                    <Button type="submit" disabled={isSubmitting}>
                                                        {isSubmitting ? 'Saving...' : 'Save Route'}
                                                    </Button>
                                                </div>
                                            </form>
                                        </ScrollArea>
                                    </DialogContent>
                                </Dialog>
                            </div>
                        </CardHeader>
                        <CardContent className="p-2 sm:p-6 overflow-x-auto">
                            <div className="min-w-full">
                                <DataTable 
                                    columns={columns} 
                                    data={routes} 
                                    isLoading={isLoading}
                                    pageSize={10}
                                />
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
            <Toaster position="top-right" expand={true} richColors />
        </AuthenticatedLayout>
    );
}