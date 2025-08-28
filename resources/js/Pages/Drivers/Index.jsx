import React, { useState, useEffect } from 'react';
import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { toast, Toaster } from 'sonner';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { driverSchema, driverUpdateSchema } from '@/schemas/driverSchema';
import { useAuthStore, useDriverStore } from '@/stores';
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
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable } from "@/components/ui/data-table";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { 
    MoreHorizontal, 
    Trash2, 
    Eye, 
    Edit, 
    Users, 
    UserPlus,
    UserCheck,
    UserX,
    UserMinus,
    CalendarIcon,
    Phone,
    MapPin,
    Clock,
    AlertTriangle
} from "lucide-react";

export default function Index({ auth, api_token }) {
    const [open, setOpen] = useState(false);
    const [editingDriver, setEditingDriver] = useState(null);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [driverToDelete, setDriverToDelete] = useState(null);
    const [licenseExpiryCalendarOpen, setLicenseExpiryCalendarOpen] = useState(false);
    const [hireDateCalendarOpen, setHireDateCalendarOpen] = useState(false);

    // Zustand stores
    const { setAuth, token, isAuthenticated } = useAuthStore();
    const { 
        drivers, 
        isLoading, 
        error, 
        fetchDrivers, 
        addDriver, 
        updateDriver,
        deleteDriver,
        toggleDriverStatus,
        getDriverStats,
        getDriversWithExpiringLicense,
        clearError 
    } = useDriverStore();

    const {
        register,
        handleSubmit,
        setValue,
        control,
        reset,
        formState: { errors, isSubmitting }
    } = useForm({
        resolver: zodResolver(editingDriver ? driverUpdateSchema : driverSchema),
        defaultValues: {
            name: '',
            email: '',
            password: '',
            password_confirmation: '',
            employee_number: '',
            first_name: '',
            last_name: '',
            phone: '',
            license_number: '',
            license_expiry: '',
            hire_date: new Date().toISOString().split('T')[0],
            address: '',
            status: 'active'
        }
    });

    const stats = getDriverStats();
    const driversWithExpiringLicense = getDriversWithExpiringLicense();

    const columns = React.useMemo(
        () => [
            {
                accessorKey: 'employee_number',
                header: 'Employee #',
                cell: ({ row }) => (
                    <div className="font-medium text-xs sm:text-sm">{row.getValue('employee_number')}</div>
                ),
            },
            {
                accessorKey: 'name',
                header: 'Name',
                cell: ({ row }) => {
                    const driver = row.original;
                    const fullName = `${driver.first_name} ${driver.last_name}`.trim();
                    return (
                        <div className="text-xs sm:text-sm font-medium max-w-32 sm:max-w-48 break-words" title={fullName}>
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
                accessorKey: 'hire_date',
                header: 'Hire Date',
                cell: ({ row }) => {
                    const hireDate = new Date(row.getValue('hire_date'));
                    return (
                        <div className="text-xs sm:text-sm">
                            {hireDate.toLocaleDateString()}
                        </div>
                    );
                },
            },
            {
                accessorKey: 'status',
                header: 'Status',
                cell: ({ row }) => {
                    const status = row.getValue('status');
                    const statusConfig = {
                        active: { 
                            color: 'bg-green-100 text-green-800', 
                            icon: UserCheck 
                        },
                        inactive: { 
                            color: 'bg-gray-100 text-gray-800', 
                            icon: UserX 
                        },
                        suspended: { 
                            color: 'bg-red-100 text-red-800', 
                            icon: UserMinus 
                        },
                    };
                    
                    const config = statusConfig[status] || statusConfig.inactive;
                    const Icon = config.icon;
                    
                    return (
                        <Badge 
                            variant="secondary" 
                            className={`text-xs py-0 px-1 sm:px-2 ${config.color}`}
                        >
                            <Icon className="h-3 w-3 mr-1" />
                            <span className="capitalize">{status}</span>
                        </Badge>
                    );
                },
            },
            {
                id: 'actions',
                header: 'Actions',
                cell: ({ row }) => {
                    const driver = row.original;
                    return (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0">
                                    <span className="sr-only">Open menu</span>
                                    <MoreHorizontal className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => handleViewDriver(driver)}>
                                    <Eye className="mr-2 h-4 w-4" />
                                    View Details
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleEditDriver(driver)}>
                                    <Edit className="mr-2 h-4 w-4" />
                                    Edit Driver
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem 
                                    onClick={() => handleStatusChange(driver, driver.status === 'suspended' ? 'active' : 'suspended')}
                                    className={driver.status === 'suspended' ? 'text-green-600 focus:text-green-600' : 'text-yellow-600 focus:text-yellow-600'}
                                >
                                    {driver.status === 'suspended' ? (
                                        <>
                                            <UserCheck className="mr-2 h-4 w-4" />
                                            Activate Driver
                                        </>
                                    ) : (
                                        <>
                                            <UserMinus className="mr-2 h-4 w-4" />
                                            Suspend Driver
                                        </>
                                    )}
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem 
                                    onClick={() => {
                                        setDriverToDelete(driver);
                                        setDeleteDialogOpen(true);
                                    }}
                                    className="text-red-600 focus:text-red-600"
                                >
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Delete Driver
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

    // Fetch drivers when auth is ready
    useEffect(() => {
        if (isAuthenticated && token && auth.user?.role === 'admin') {
            fetchDrivers();
        }
    }, [isAuthenticated, token, fetchDrivers]);

    // Show error toast when error state changes
    useEffect(() => {
        if (error) {
            toast.error(error);
            clearError();
        }
    }, [error, clearError]);

    const handleCreateDriver = () => {
        setEditingDriver(null);
        reset({
            name: '',
            email: '',
            password: '',
            password_confirmation: '',
            employee_number: '',
            first_name: '',
            last_name: '',
            phone: '',
            license_number: '',
            license_expiry: '',
            hire_date: new Date().toISOString().split('T')[0],
            address: '',
            status: 'active'
        });
        setOpen(true);
    };

    const handleEditDriver = (driver) => {
        setEditingDriver(driver);
        reset({
            employee_number: driver.employee_number,
            first_name: driver.first_name,
            last_name: driver.last_name,
            phone: driver.phone,
            license_number: driver.license_number,
            license_expiry: driver.license_expiry,
            hire_date: driver.hire_date,
            address: driver.address,
            status: driver.status
        });
        setOpen(true);
    };

    const handleViewDriver = (driver) => {
        window.location.href = `/drivers/${driver.id}`;
    };

    const onSubmit = async (data) => {
        try {
            if (editingDriver) {
                await updateDriver(editingDriver.id, data);
                toast.success('Driver updated successfully');
            } else {
                await addDriver(data);
                toast.success('Driver created successfully');
            }
            setOpen(false);
            reset();
        } catch (error) {
            console.error('Error saving driver:', error);
        }
    };

    const handleStatusChange = async (driver, newStatus) => {
        try {
            await toggleDriverStatus(driver.id, newStatus);
            const action = newStatus === 'suspended' ? 'suspended' : 'activated';
            toast.success(`Driver ${action} successfully`);
        } catch (error) {
            console.error('Error updating driver status:', error);
            toast.error('Failed to update driver status');
        }
    };

    const handleDelete = async () => {
        if (!driverToDelete) return;

        try {
            await deleteDriver(driverToDelete.id);
            toast.success('Driver deleted successfully');
            setDeleteDialogOpen(false);
            setDriverToDelete(null);
        } catch (error) {
            console.error('Error deleting driver:', error);
            toast.error('Failed to delete driver');
        }
    };

    // Show access denied if user is not admin
    if (auth.user?.role !== 'admin') {
        return (
            <AuthenticatedLayout
                user={auth.user}
                header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Drivers</h2>}
            >
                <Head title="Drivers" />
                <div className="py-4 sm:py-8">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <Card className="w-full">
                            <CardContent className="p-4 sm:p-6">
                                <div className="text-center">
                                    <h3 className="text-lg font-medium text-red-600">Access Denied</h3>
                                    <p className="mt-2 text-sm text-gray-600">
                                        You need admin privileges to access driver management.
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
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Drivers</h2>}
        >
            <Head title="Drivers" />
            
            <div className="p-4 sm:p-6 space-y-6 pt-6 sm:pt-8">
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <div className="mb-8 pr-20 sm:pr-24 md:pr-0">
                        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Drivers</h1>
                        <p className="text-gray-600 mt-2">Manage drivers and their assignments</p>
                    </div>

                    <div className="space-y-6">
                    {/* Stats Cards */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4">
                        <Card>
                            <CardContent className="p-3">
                                <div className="flex items-center">
                                    <Users className="h-6 w-6 text-blue-600" />
                                    <div className="ml-3">
                                        <p className="text-xs font-medium text-gray-600">Total Drivers</p>
                                        <p className="text-lg font-bold text-gray-900">{stats.total}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                        
                        <Card>
                            <CardContent className="p-3">
                                <div className="flex items-center">
                                    <UserCheck className="h-6 w-6 text-green-600" />
                                    <div className="ml-3">
                                        <p className="text-xs font-medium text-gray-600">Active Drivers</p>
                                        <p className="text-lg font-bold text-gray-900">{stats.active}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                        
                        <Card>
                            <CardContent className="p-3">
                                <div className="flex items-center">
                                    <UserMinus className="h-6 w-6 text-red-600" />
                                    <div className="ml-3">
                                        <p className="text-xs font-medium text-gray-600">Suspended</p>
                                        <p className="text-lg font-bold text-gray-900">{stats.suspended}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                        
                        <Card>
                            <CardContent className="p-3">
                                <div className="flex items-center">
                                    <AlertTriangle className="h-6 w-6 text-yellow-600" />
                                    <div className="ml-3">
                                        <p className="text-xs font-medium text-gray-600">License Expiring</p>
                                        <p className="text-lg font-bold text-gray-900">{stats.expiringLicense}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* License Expiring Alert */}
                    {driversWithExpiringLicense.length > 0 && (
                        <Card className="border-yellow-200 bg-yellow-50">
                            <CardHeader className="pb-3">
                                <CardTitle className="flex items-center gap-2 text-yellow-800">
                                    <AlertTriangle className="h-5 w-5" />
                                    License Expiry Alert
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-yellow-700 mb-3">
                                    {driversWithExpiringLicense.length} driver(s) have licenses expiring within 30 days:
                                </p>
                                <div className="space-y-1">
                                    {driversWithExpiringLicense.slice(0, 3).map((driver) => (
                                        <div key={driver.id} className="text-sm text-yellow-700">
                                            • {driver.first_name} {driver.last_name} - expires {new Date(driver.license_expiry).toLocaleDateString()}
                                        </div>
                                    ))}
                                    {driversWithExpiringLicense.length > 3 && (
                                        <div className="text-sm text-yellow-700">
                                            ... and {driversWithExpiringLicense.length - 3} more
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Main Table */}
                    <Card className="w-full overflow-hidden">
                        <CardHeader className="pb-3">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                                <div className="min-w-0">
                                </div>
                                <Dialog open={open} onOpenChange={setOpen}>
                                    <DialogTrigger asChild>
                                        <Button onClick={handleCreateDriver}>
                                            <UserPlus className="h-4 w-4 mr-2" />
                                            Add Driver
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent className="sm:max-w-[600px] max-h-[90vh]">
                                        <DialogHeader>
                                            <DialogTitle>
                                                {editingDriver ? 'Edit Driver' : 'Add New Driver'}
                                            </DialogTitle>
                                        </DialogHeader>
                                        <ScrollArea className="h-[calc(90vh-8rem)]">
                                            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pr-4">
                                                {!editingDriver && (
                                                    <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
                                                        <h4 className="font-medium text-sm text-gray-700">User Account Information</h4>
                                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                            <div className="space-y-2">
                                                                <Label htmlFor="name">Full Name</Label>
                                                                <Input
                                                                    id="name"
                                                                    {...register('name')}
                                                                    placeholder="e.g., John Doe"
                                                                />
                                                                {errors.name && (
                                                                    <InputError message={errors.name.message} />
                                                                )}
                                                            </div>

                                                            <div className="space-y-2">
                                                                <Label htmlFor="email">Email Address</Label>
                                                                <Input
                                                                    id="email"
                                                                    type="email"
                                                                    {...register('email')}
                                                                    placeholder="e.g., john.doe@company.com"
                                                                />
                                                                {errors.email && (
                                                                    <InputError message={errors.email.message} />
                                                                )}
                                                            </div>

                                                            <div className="space-y-2">
                                                                <Label htmlFor="password">Password</Label>
                                                                <Input
                                                                    id="password"
                                                                    type="password"
                                                                    {...register('password')}
                                                                    placeholder="Minimum 8 characters"
                                                                />
                                                                {errors.password && (
                                                                    <InputError message={errors.password.message} />
                                                                )}
                                                            </div>

                                                            <div className="space-y-2">
                                                                <Label htmlFor="password_confirmation">Confirm Password</Label>
                                                                <Input
                                                                    id="password_confirmation"
                                                                    type="password"
                                                                    {...register('password_confirmation')}
                                                                    placeholder="Confirm password"
                                                                />
                                                                {errors.password_confirmation && (
                                                                    <InputError message={errors.password_confirmation.message} />
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                                
                                                <div className="space-y-4">
                                                    <h4 className="font-medium text-sm text-gray-700">Driver Information</h4>
                                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                        <div className="space-y-2">
                                                            <Label htmlFor="employee_number">Employee Number</Label>
                                                            <Input
                                                                id="employee_number"
                                                                {...register('employee_number')}
                                                                placeholder="e.g., EMP001"
                                                                disabled={!!editingDriver}
                                                            />
                                                            {errors.employee_number && (
                                                                <InputError message={errors.employee_number.message} />
                                                            )}
                                                        </div>

                                                    <div className="space-y-2">
                                                        <Label htmlFor="status">Status</Label>
                                                        <Controller
                                                            name="status"
                                                            control={control}
                                                            render={({ field }) => (
                                                                <Select onValueChange={field.onChange} value={field.value}>
                                                                    <SelectTrigger>
                                                                        <SelectValue placeholder="Select status" />
                                                                    </SelectTrigger>
                                                                    <SelectContent>
                                                                        <SelectItem value="active">Active</SelectItem>
                                                                        <SelectItem value="inactive">Inactive</SelectItem>
                                                                        <SelectItem value="suspended">Suspended</SelectItem>
                                                                    </SelectContent>
                                                                </Select>
                                                            )}
                                                        />
                                                        {errors.status && (
                                                            <InputError message={errors.status.message} />
                                                        )}
                                                    </div>

                                                    <div className="space-y-2">
                                                        <Label htmlFor="first_name">First Name</Label>
                                                        <Input
                                                            id="first_name"
                                                            {...register('first_name')}
                                                            placeholder="e.g., John"
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
                                                            placeholder="e.g., Doe"
                                                        />
                                                        {errors.last_name && (
                                                            <InputError message={errors.last_name.message} />
                                                        )}
                                                    </div>

                                                    <div className="space-y-2">
                                                        <Label htmlFor="phone">Phone Number</Label>
                                                        <Input
                                                            id="phone"
                                                            {...register('phone')}
                                                            placeholder="e.g., +254712345678"
                                                        />
                                                        {errors.phone && (
                                                            <InputError message={errors.phone.message} />
                                                        )}
                                                    </div>

                                                    <div className="space-y-2">
                                                        <Label htmlFor="license_number">License Number</Label>
                                                        <Input
                                                            id="license_number"
                                                            {...register('license_number')}
                                                            placeholder="e.g., DL123456"
                                                        />
                                                        {errors.license_number && (
                                                            <InputError message={errors.license_number.message} />
                                                        )}
                                                    </div>

                                                    <div className="space-y-2">
                                                        <Label htmlFor="license_expiry">License Expiry Date</Label>
                                                        <Controller
                                                            name="license_expiry"
                                                            control={control}
                                                            render={({ field }) => (
                                                                <Popover open={licenseExpiryCalendarOpen} onOpenChange={setLicenseExpiryCalendarOpen}>
                                                                    <PopoverTrigger asChild>
                                                                        <Button
                                                                            variant="outline"
                                                                            className="w-full justify-start text-left font-normal"
                                                                        >
                                                                            <CalendarIcon className="mr-2 h-4 w-4" />
                                                                            {field.value ? format(new Date(field.value), "PPP") : "Pick a date"}
                                                                        </Button>
                                                                    </PopoverTrigger>
                                                                    <PopoverContent className="w-auto p-0">
                                                                        <Calendar
                                                                            mode="single"
                                                                            selected={field.value ? new Date(field.value) : undefined}
                                                                            onSelect={(date) => {
                                                                                field.onChange(date ? format(date, "yyyy-MM-dd") : "");
                                                                                setLicenseExpiryCalendarOpen(false);
                                                                            }}
                                                                            initialFocus
                                                                        />
                                                                    </PopoverContent>
                                                                </Popover>
                                                            )}
                                                        />
                                                        {errors.license_expiry && (
                                                            <InputError message={errors.license_expiry.message} />
                                                        )}
                                                    </div>

                                                    <div className="space-y-2">
                                                        <Label htmlFor="hire_date">Hire Date</Label>
                                                        <Controller
                                                            name="hire_date"
                                                            control={control}
                                                            render={({ field }) => (
                                                                <Popover open={hireDateCalendarOpen} onOpenChange={setHireDateCalendarOpen}>
                                                                    <PopoverTrigger asChild>
                                                                        <Button
                                                                            variant="outline"
                                                                            className="w-full justify-start text-left font-normal"
                                                                        >
                                                                            <CalendarIcon className="mr-2 h-4 w-4" />
                                                                            {field.value ? format(new Date(field.value), "PPP") : "Pick a date"}
                                                                        </Button>
                                                                    </PopoverTrigger>
                                                                    <PopoverContent className="w-auto p-0">
                                                                        <Calendar
                                                                            mode="single"
                                                                            selected={field.value ? new Date(field.value) : undefined}
                                                                            onSelect={(date) => {
                                                                                field.onChange(date ? format(date, "yyyy-MM-dd") : "");
                                                                                setHireDateCalendarOpen(false);
                                                                            }}
                                                                            initialFocus
                                                                        />
                                                                    </PopoverContent>
                                                                </Popover>
                                                            )}
                                                        />
                                                        {errors.hire_date && (
                                                            <InputError message={errors.hire_date.message} />
                                                        )}
                                                    </div>

                                                        <div className="space-y-2 sm:col-span-2">
                                                            <Label htmlFor="address">Address</Label>
                                                            <Input
                                                                id="address"
                                                                {...register('address')}
                                                                placeholder="Full address"
                                                            />
                                                            {errors.address && (
                                                                <InputError message={errors.address.message} />
                                                            )}
                                                        </div>
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
                                                        {isSubmitting ? 'Saving...' : editingDriver ? 'Update Driver' : 'Add Driver'}
                                                    </Button>
                                                </div>
                                            </form>
                                        </ScrollArea>
                                    </DialogContent>
                                </Dialog>
                            </div>
                        </CardHeader>
                        <CardContent className="p-1 sm:p-4 overflow-x-auto">
                            <div className="min-w-full">
                                <DataTable 
                                    columns={columns} 
                                    data={drivers || []} 
                                    isLoading={isLoading}
                                    pageSize={10}
                                />
                            </div>
                        </CardContent>
                    </Card>
                    </div>
                </div>
            </div>

            {/* Delete Confirmation Dialog */}
            <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the driver
                            <strong> {driverToDelete?.first_name} {driverToDelete?.last_name}</strong> 
                            and remove all associated data.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction 
                            onClick={handleDelete}
                            className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
                        >
                            Delete Driver
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            <Toaster position="top-right" expand={true} richColors />
        </AuthenticatedLayout>
    );
}