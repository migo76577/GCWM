import React, { useState, useEffect } from 'react';
import { Head, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { toast, Toaster } from 'sonner';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createCustomerSchema } from '@/schemas/customerSchema';
import { useAuthStore, useCustomerStore, useRouteStore } from '@/stores';
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
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, CheckCircle, Trash2, Eye, Edit, UserX, UserCheck } from "lucide-react";

// Helper function to convert text to proper case
const toProperCase = (str) => {
    if (!str) return '';
    return str.toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
};

export default function Index({ auth, api_token, categories = [] }) {
    const [open, setOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(null);

    // Zustand stores
    const { setAuth, token, isAuthenticated, user: authUser } = useAuthStore();
    const { 
        customers, 
        isLoading, 
        error, 
        fetchCustomers, 
        addCustomer, 
        updateCustomer,
        deleteCustomer,
        approveCustomerRegistration,
        clearError 
    } = useCustomerStore();
    const { routes, fetchRoutes: fetchRoutesData } = useRouteStore();

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        reset,
        control,
        formState: { errors, isSubmitting }
    } = useForm({
        resolver: zodResolver(createCustomerSchema),
        defaultValues: {
            customer_number: '',
            category_id: '',
            route_id: '',
            first_name: '',
            last_name: '',
            phone: '',
            alternative_phone: '',
            address: '',
            city: '',
            area: '',
            latitude: '',
            longitude: '',
            notes: ''
        }
    });

    const columns = React.useMemo(
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
                    const firstName = toProperCase(row.original.first_name || '');
                    const lastName = toProperCase(row.original.last_name || '');
                    const fullName = `${firstName} ${lastName}`.trim();
                    return (
                        <div className="text-xs sm:text-sm font-medium max-w-32 sm:max-w-48 break-words leading-tight" title={fullName}>
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
                accessorKey: 'city',
                header: 'City',
                cell: ({ row }) => (
                    <div className="text-xs sm:text-sm max-w-24 sm:max-w-32 break-words">
                        {toProperCase(row.getValue('city'))}
                    </div>
                ),
            },
            {
                accessorKey: 'area',
                header: 'Area',
                cell: ({ row }) => (
                    <div className="text-xs sm:text-sm max-w-20 sm:max-w-32 break-words leading-tight">
                        {toProperCase(row.getValue('area'))}
                    </div>
                ),
            },
            {
                accessorKey: 'registration_status',
                header: 'Reg. Status',
                cell: ({ row }) => {
                    const status = row.getValue('registration_status');
                    const statusColors = {
                        pending: 'bg-yellow-100 text-yellow-800',
                        approved: 'bg-green-100 text-green-800',
                        rejected: 'bg-red-100 text-red-800',
                    };
                    const statusShort = {
                        pending: 'P',
                        approved: 'A',
                        rejected: 'R',
                    };
                    return (
                        <Badge 
                            variant="secondary" 
                            className={`text-xs py-0 px-1 sm:px-2 ${statusColors[status] || 'bg-gray-100 text-gray-800'}`}
                            title={status}
                        >
                            <span className="sm:hidden">{statusShort[status] || status?.charAt(0)?.toUpperCase()}</span>
                            <span className="hidden sm:inline">{toProperCase(status)}</span>
                        </Badge>
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
                        suspended: 'bg-red-100 text-red-800',
                    };
                    const statusShort = {
                        active: 'A',
                        inactive: 'I',
                        suspended: 'S',
                    };
                    return (
                        <Badge 
                            variant="secondary" 
                            className={`text-xs py-0 px-1 sm:px-2 ${statusColors[status] || 'bg-gray-100 text-gray-800'}`}
                            title={status}
                        >
                            <span className="sm:hidden">{statusShort[status] || status?.charAt(0)?.toUpperCase()}</span>
                            <span className="hidden sm:inline">{toProperCase(status)}</span>
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
                                {customer.registration_status === 'pending' && (
                                    <>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem onClick={() => handleApprove(customer.id)}>
                                            <CheckCircle className="mr-2 h-4 w-4" />
                                            Approve Registration
                                        </DropdownMenuItem>
                                    </>
                                )}
                                {customer.status === 'active' && (
                                    <>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem 
                                            onClick={() => handleDeactivate(customer.id)}
                                            className="text-orange-600 focus:text-orange-600"
                                        >
                                            <UserX className="mr-2 h-4 w-4" />
                                            Deactivate Customer
                                        </DropdownMenuItem>
                                    </>
                                )}
                                {customer.status === 'inactive' && (
                                    <>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem 
                                            onClick={() => handleActivate(customer.id)}
                                            className="text-green-600 focus:text-green-600"
                                        >
                                            <UserCheck className="mr-2 h-4 w-4" />
                                            Activate Customer
                                        </DropdownMenuItem>
                                    </>
                                )}
                                <DropdownMenuSeparator />
                                <DropdownMenuItem 
                                    onClick={() => handleDelete(customer.id)}
                                    className="text-red-600 focus:text-red-600"
                                >
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Delete Customer
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

    // Fetch customers and routes when auth is ready
    useEffect(() => {
        if (isAuthenticated && token && auth.user?.role === 'admin') {
            fetchCustomers();
            fetchRoutesData();
        }
    }, [isAuthenticated, token, fetchCustomers, fetchRoutesData]);

    // Show error toast when error state changes
    useEffect(() => {
        if (error) {
            toast.error(error);
            clearError();
        }
    }, [error, clearError]);

    // Handle category change
    const handleCategoryChange = (categoryId) => {
        const category = categories.find(c => c.id.toString() === categoryId);
        setSelectedCategory(category);
        setValue('category_id', categoryId);
    };

    // Check if field should be shown based on selected category
    const shouldShowField = (fieldName) => {
        if (!selectedCategory) return true; // Show all fields if no category selected
        const requiredFields = selectedCategory.required_fields || [];
        const optionalFields = selectedCategory.optional_fields || [];
        return requiredFields.includes(fieldName) || optionalFields.includes(fieldName);
    };

    // Check if field is required based on selected category
    const isFieldRequired = (fieldName) => {
        if (!selectedCategory) return false;
        const requiredFields = selectedCategory.required_fields || [];
        return requiredFields.includes(fieldName);
    };

    const onSubmit = async (data) => {
        try {
            // Set the name field from first_name and last_name
            const customerData = {
                ...data,
                name: `${data.first_name} ${data.last_name}`.trim(),
                category_id: parseInt(data.category_id),
                route_id: parseInt(data.route_id)
            };
            
            await addCustomer(customerData);
            setOpen(false);
            reset();
            toast.success('Customer added successfully');
        } catch (error) {
            console.error('Error adding customer:', error);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this customer?')) {
            try {
                await deleteCustomer(id);
                toast.success('Customer deleted successfully');
            } catch (error) {
                console.error('Error deleting customer:', error);
            }
        }
    };

    const handleApprove = async (id) => {
        try {
            await approveCustomerRegistration(id);
            toast.success('Customer registration approved successfully');
        } catch (error) {
            console.error('Error approving customer:', error);
        }
    };

    const handleDeactivate = async (id) => {
        if (window.confirm('Are you sure you want to deactivate this customer?')) {
            try {
                await updateCustomer(id, { status: 'inactive' });
                toast.success('Customer deactivated successfully');
            } catch (error) {
                console.error('Error deactivating customer:', error);
            }
        }
    };

    const handleActivate = async (id) => {
        try {
            await updateCustomer(id, { status: 'active' });
            toast.success('Customer activated successfully');
        } catch (error) {
            console.error('Error activating customer:', error);
        }
    };

    // Show access denied if user is not admin
    if (auth.user?.role !== 'admin') {
        return (
            <AuthenticatedLayout
                user={auth.user}
                header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Customers</h2>}
            >
                <Head title="Customers" />
                <div className="py-4 sm:py-8">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <Card className="w-full">
                            <CardContent className="p-4 sm:p-6">
                                <div className="text-center">
                                    <h3 className="text-lg font-medium text-red-600">Access Denied</h3>
                                    <p className="mt-2 text-sm text-gray-600">
                                        You need admin privileges to access customer management.
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
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Customers</h2>}
        >
            <Head title="Customers" />
            
            <div className="py-2 sm:py-8">
                <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
                    <Card className="w-full overflow-hidden min-w-0">
                        <CardHeader className="pb-4">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                <div className="min-w-0">
                                    <CardTitle className="text-xl sm:text-2xl font-bold truncate">Customer Management</CardTitle>
                                    <CardDescription className="text-sm sm:text-base">
                                        Manage customer registrations and information
                                    </CardDescription>
                                </div>
                                <Dialog open={open} onOpenChange={setOpen}>
                                    <DialogTrigger asChild>
                                        <Button>Add Customer</Button>
                                    </DialogTrigger>
                                    <DialogContent className="sm:max-w-[500px] max-h-[90vh]">
                                        <DialogHeader>
                                            <DialogTitle>Add New Customer</DialogTitle>
                                        </DialogHeader>
                                        <ScrollArea className="h-[calc(90vh-8rem)]">
                                            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pr-4">
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                    <div className="space-y-2 sm:col-span-2">
                                                        <Label htmlFor="category_id">Customer Category</Label>
                                                        <Controller
                                                            name="category_id"
                                                            control={control}
                                                            render={({ field }) => (
                                                                <Select value={field.value} onValueChange={handleCategoryChange}>
                                                                    <SelectTrigger>
                                                                        <SelectValue placeholder="Select customer category" />
                                                                    </SelectTrigger>
                                                                    <SelectContent>
                                                                        {categories.map((category) => (
                                                                            <SelectItem key={category.id} value={category.id.toString()}>
                                                                                {category.name}
                                                                            </SelectItem>
                                                                        ))}
                                                                    </SelectContent>
                                                                </Select>
                                                            )}
                                                        />
                                                        {errors.category_id && (
                                                            <InputError message={errors.category_id.message} />
                                                        )}
                                                    </div>

                                                    <div className="space-y-2 sm:col-span-2">
                                                        <Label htmlFor="route_id">Select Route</Label>
                                                        <Controller
                                                            name="route_id"
                                                            control={control}
                                                            render={({ field }) => (
                                                                <Select value={field.value} onValueChange={field.onChange}>
                                                                    <SelectTrigger>
                                                                        <SelectValue placeholder="Select a route" />
                                                                    </SelectTrigger>
                                                                    <SelectContent>
                                                                        {routes.map((route) => (
                                                                            <SelectItem key={route.id} value={route.id.toString()}>
                                                                                {route.route_code} - {route.name}
                                                                            </SelectItem>
                                                                        ))}
                                                                    </SelectContent>
                                                                </Select>
                                                            )}
                                                        />
                                                        {errors.route_id && (
                                                            <InputError message={errors.route_id.message} />
                                                        )}
                                                    </div>

                                                    <div className="space-y-2">
                                                        <Label htmlFor="customer_number">Customer Number (Optional)</Label>
                                                        <Input
                                                            id="customer_number"
                                                            {...register('customer_number')}
                                                            placeholder="Auto-generated if empty"
                                                        />
                                                        {errors.customer_number && (
                                                            <InputError message={errors.customer_number.message} />
                                                        )}
                                                    </div>

                                                    <div className="space-y-2">
                                                        <Label htmlFor="first_name">First Name</Label>
                                                        <Input
                                                            id="first_name"
                                                            {...register('first_name')}
                                                        />
                                                        {errors.first_name && (
                                                            <InputError message={errors.first_name.message} />
                                                        )}
                                                    </div>

                                                    <div className="space-y-2">
                                                        <Label htmlFor="last_name">Last Name</Label>
                                                        <Input
                                                            id="last_name"
                                                            {...register('last_name')}
                                                        />
                                                        {errors.last_name && (
                                                            <InputError message={errors.last_name.message} />
                                                        )}
                                                    </div>

                                                    <div className="space-y-2">
                                                        <Label htmlFor="phone">Phone</Label>
                                                        <Input
                                                            id="phone"
                                                            {...register('phone')}
                                                        />
                                                        {errors.phone && (
                                                            <InputError message={errors.phone.message} />
                                                        )}
                                                    </div>

                                                    {shouldShowField('alternative_phone') && (
                                                        <div className="space-y-2 sm:col-span-2">
                                                            <Label htmlFor="alternative_phone">
                                                                Alternative Phone {isFieldRequired('alternative_phone') ? '' : '(Optional)'}
                                                            </Label>
                                                            <Input
                                                                id="alternative_phone"
                                                                {...register('alternative_phone')}
                                                            />
                                                            {errors.alternative_phone && (
                                                                <InputError message={errors.alternative_phone.message} />
                                                            )}
                                                        </div>
                                                    )}

                                                    <div className="space-y-2 sm:col-span-2">
                                                        <Label htmlFor="address">Address</Label>
                                                        <Textarea
                                                            id="address"
                                                            rows={3}
                                                            {...register('address')}
                                                        />
                                                        {errors.address && (
                                                            <InputError message={errors.address.message} />
                                                        )}
                                                    </div>

                                                    <div className="space-y-2">
                                                        <Label htmlFor="city">City</Label>
                                                        <Input
                                                            id="city"
                                                            {...register('city')}
                                                        />
                                                        {errors.city && (
                                                            <InputError message={errors.city.message} />
                                                        )}
                                                    </div>

                                                    <div className="space-y-2">
                                                        <Label htmlFor="area">Area/Neighborhood</Label>
                                                        <Input
                                                            id="area"
                                                            {...register('area')}
                                                        />
                                                        {errors.area && (
                                                            <InputError message={errors.area.message} />
                                                        )}
                                                    </div>

                                                    <div className="space-y-2">
                                                        <Label htmlFor="latitude">Latitude</Label>
                                                        <Input
                                                            id="latitude"
                                                            type="number"
                                                            step="any"
                                                            {...register('latitude')}
                                                        />
                                                        {errors.latitude && (
                                                            <InputError message={errors.latitude.message} />
                                                        )}
                                                    </div>

                                                    <div className="space-y-2">
                                                        <Label htmlFor="longitude">Longitude</Label>
                                                        <Input
                                                            id="longitude"
                                                            type="number"
                                                            step="any"
                                                            {...register('longitude')}
                                                        />
                                                        {errors.longitude && (
                                                            <InputError message={errors.longitude.message} />
                                                        )}
                                                    </div>

                                                    {shouldShowField('notes') && (
                                                        <div className="space-y-2 sm:col-span-2">
                                                            <Label htmlFor="notes">
                                                                Notes {isFieldRequired('notes') ? '' : '(Optional)'}
                                                            </Label>
                                                            <Textarea
                                                                id="notes"
                                                                rows={3}
                                                                {...register('notes')}
                                                            />
                                                            {errors.notes && (
                                                                <InputError message={errors.notes.message} />
                                                            )}
                                                        </div>
                                                    )}
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
                                                        {isSubmitting ? 'Saving...' : 'Save Customer'}
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
                                    data={customers} 
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