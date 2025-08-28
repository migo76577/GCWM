import React, { useState, useEffect } from 'react';
import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { toast, Toaster } from 'sonner';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { vehicleSchema } from '@/schemas/vehicleSchema';
import vehicleService from '@/services/vehicleService';
import { useAuthStore } from '@/stores/authStore';
import { useVehicleStore } from '@/stores/vehicleStore';
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

export default function Index({ auth, api_token }) {
    const [open, setOpen] = useState(false);

    // Zustand stores
    const { setAuth, token, isAuthenticated, user: authUser } = useAuthStore();
    const { 
        vehicles, 
        isLoading, 
        error, 
        fetchVehicles, 
        addVehicle, 
        deleteVehicle,
        clearError 
    } = useVehicleStore();

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        reset,
        control,
        formState: { errors, isSubmitting }
    } = useForm({
        resolver: zodResolver(vehicleSchema),
        defaultValues: {
            vehicle_number: '',
            license_plate: '',
            make: '',
            model: '',
            year: '',
            vehicle_type: 'truck',
            capacity_kg: '',
            status: 'active',
            notes: ''
        }
    });

    const columns = React.useMemo(
        () => [
            {
                accessorKey: 'vehicle_number',
                header: 'Vehicle #',
                cell: ({ row }) => (
                    <div className="font-medium">{row.getValue('vehicle_number')}</div>
                ),
            },
            {
                accessorKey: 'license_plate',
                header: 'Reg No.',
                cell: ({ row }) => (
                    <div className="font-mono text-xs sm:text-sm">{row.getValue('license_plate')}</div>
                ),
            },
            // {
            //     accessorKey: 'make',
            //     header: 'Make',
            //     cell: ({ row }) => (
            //         <div className="truncate max-w-12 sm:max-w-none text-xs sm:text-sm">{row.getValue('make')}</div>
            //     ),
            // },
            {
                accessorKey: 'model',
                header: 'Model',
                cell: ({ row }) => (
                    <div className="truncate max-w-12 sm:max-w-none text-xs sm:text-sm">{row.getValue('model')}</div>
                ),
            },
            {
                accessorKey: 'year',
                header: 'Year',
                cell: ({ row }) => (
                    <div className="text-xs sm:text-sm">{row.getValue('year')}</div>
                ),
            },
            {
                accessorKey: 'vehicle_type',
                header: 'Type',
                cell: ({ row }) => {
                    const type = row.getValue('vehicle_type');
                    return (
                        <Badge variant="outline" className="capitalize text-xs py-0 px-1 sm:px-2">
                            {type?.charAt(0).toUpperCase()}<span className="hidden sm:inline">{type?.slice(1).replace('_', ' ')}</span>
                        </Badge>
                    );
                },
            },
            {
                accessorKey: 'capacity_kg',
                header: 'Cap.',
                cell: ({ row }) => {
                    const capacity = row.getValue('capacity_kg');
                    const value = capacity ? parseFloat(capacity) : 0;
                    return (
                        <div className="text-xs sm:text-sm">
                            {capacity ? (
                                <>
                                    <span className="sm:hidden">{value >= 1000 ? `${(value/1000).toFixed(0)}t` : `${value}kg`}</span>
                                    <span className="hidden sm:inline">{value.toLocaleString()} kg</span>
                                </>
                            ) : 'N/A'}
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
                        maintenance: 'bg-yellow-100 text-yellow-800',
                        out_of_service: 'bg-red-100 text-red-800',
                        inactive: 'bg-gray-100 text-gray-800',
                    };
                    const statusShort = {
                        active: 'A',
                        maintenance: 'M',
                        out_of_service: 'O',
                        inactive: 'I',
                    };
                    return (
                        <Badge 
                            variant="secondary" 
                            className={`text-xs py-0 px-1 sm:px-2 ${statusColors[status] || 'bg-gray-100 text-gray-800'}`}
                            title={status?.replace('_', ' ')}
                        >
                            <span className="sm:hidden">{statusShort[status] || status?.charAt(0)?.toUpperCase()}</span>
                            <span className="hidden sm:inline capitalize">{status?.replace('_', ' ')}</span>
                        </Badge>
                    );
                },
            },
            {
                id: 'actions',
                header: 'Actions',
                cell: ({ row }) => {
                    const vehicle = row.original;
                    return (
                        <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDelete(vehicle.id)}
                            className="text-xs px-1 sm:px-3 py-1 h-auto"
                        >
                            <span className="hidden sm:inline">Delete</span>
                            <span className="sm:hidden">×</span>
                        </Button>
                    );
                },
            },
        ],
        []
    );


    // Log initial state for debugging
    useEffect(() => {
        console.log('🚀 Vehicles page loaded', { 
            propsUser: auth.user?.name, 
            propsToken: !!api_token,
            storeUser: authUser?.name,
            storeToken: !!token,
            storeAuth: isAuthenticated
        });
    }, []);

    // Fetch vehicles when auth is ready
    useEffect(() => {
        if (isAuthenticated && token && auth.user?.role === 'admin') {
            console.log('🔄 Auth is ready, fetching vehicles', {
                hasToken: !!token,
                tokenPreview: token?.substring(0, 10) + '...',
                isAuth: isAuthenticated
            });
            fetchVehicles();
        }
    }, [isAuthenticated, token, fetchVehicles]);

    // Show error toast when error state changes
    useEffect(() => {
        if (error) {
            toast.error(error);
            clearError();
        }
    }, [error, clearError]);

    const onSubmit = async (data) => {
        try {
            await addVehicle(data);
            setOpen(false);
            reset();
            toast.success('Vehicle added successfully');
        } catch (error) {
            console.error('Error adding vehicle:', error);
            // Error will be handled by the error useEffect above
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this vehicle?')) {
            try {
                await deleteVehicle(id);
                toast.success('Vehicle deleted successfully');
            } catch (error) {
                console.error('Error deleting vehicle:', error);
                // Error will be handled by the error useEffect above
            }
        }
    };

    // Show access denied if user is not admin
    if (auth.user?.role !== 'admin') {
        return (
            <AuthenticatedLayout
                user={auth.user}
                header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Vehicles</h2>}
            >
                <Head title="Vehicles" />
                <div className="py-12">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <Card className="w-full">
                            <CardContent className="p-4 sm:p-6">
                                <div className="text-center">
                                    <h3 className="text-lg font-medium text-red-600">Access Denied</h3>
                                    <p className="mt-2 text-sm text-gray-600">
                                        You need admin privileges to access vehicle management.
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
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Vehicles</h2>}
        >
            <Head title="Vehicles" />
            

            <div className="p-4 sm:p-6 space-y-6 pt-6 sm:pt-8">
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <div className="mb-8 pr-20 sm:pr-24 md:pr-0">
                        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Vehicles</h1>
                        <p className="text-gray-600 mt-2">Manage your fleet of waste collection vehicles</p>
                    </div>

                    <Card className="w-full overflow-hidden">
                        <CardHeader className="pb-4">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                <div className="min-w-0">
                                </div>
                                <Dialog open={open} onOpenChange={setOpen}>
                                    <DialogTrigger asChild>
                                        <Button>Add Vehicle</Button>
                                    </DialogTrigger>
                                    <DialogContent className="sm:max-w-[600px] max-h-[90vh]">
                                        <DialogHeader>
                                            <DialogTitle>Add New Vehicle</DialogTitle>
                                        </DialogHeader>
                                        <ScrollArea className="h-[calc(90vh-8rem)]">
                                            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pr-4">
                                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                                    <div className="space-y-2">
                                                        <Label htmlFor="vehicle_number">Vehicle Number</Label>
                                                        <Input
                                                            id="vehicle_number"
                                                            {...register('vehicle_number')}
                                                        />
                                                        {errors.vehicle_number && (
                                                            <InputError message={errors.vehicle_number.message} />
                                                        )}
                                                    </div>

                                                    <div className="space-y-2">
                                                        <Label htmlFor="license_plate">License Plate</Label>
                                                        <Input
                                                            id="license_plate"
                                                            {...register('license_plate')}
                                                        />
                                                        {errors.license_plate && (
                                                            <InputError message={errors.license_plate.message} />
                                                        )}
                                                    </div>

                                                    <div className="space-y-2">
                                                        <Label htmlFor="make">Make</Label>
                                                        <Input
                                                            id="make"
                                                            {...register('make')}
                                                        />
                                                        {errors.make && (
                                                            <InputError message={errors.make.message} />
                                                        )}
                                                    </div>

                                                    <div className="space-y-2">
                                                        <Label htmlFor="model">Model</Label>
                                                        <Input
                                                            id="model"
                                                            {...register('model')}
                                                        />
                                                        {errors.model && (
                                                            <InputError message={errors.model.message} />
                                                        )}
                                                    </div>

                                                    <div className="space-y-2">
                                                        <Label htmlFor="year">Year</Label>
                                                        <Input
                                                            id="year"
                                                            type="number"
                                                            {...register('year')}
                                                        />
                                                        {errors.year && (
                                                            <InputError message={errors.year.message} />
                                                        )}
                                                    </div>

                                                    <div className="space-y-2">
                                                        <Label htmlFor="vehicle_type">Vehicle Type</Label>
                                                        <Controller
                                                            name="vehicle_type"
                                                            control={control}
                                                            render={({ field }) => (
                                                                <Select value={field.value} onValueChange={field.onChange}>
                                                                    <SelectTrigger>
                                                                        <SelectValue placeholder="Select vehicle type" />
                                                                    </SelectTrigger>
                                                                    <SelectContent>
                                                                        <SelectItem value="truck">Truck</SelectItem>
                                                                        <SelectItem value="van">Van</SelectItem>
                                                                        <SelectItem value="pickup">Pickup</SelectItem>
                                                                    </SelectContent>
                                                                </Select>
                                                            )}
                                                        />
                                                        {errors.vehicle_type && (
                                                            <InputError message={errors.vehicle_type.message} />
                                                        )}
                                                    </div>

                                                    <div className="space-y-2">
                                                        <Label htmlFor="capacity_kg">Capacity (kg)</Label>
                                                        <Input
                                                            id="capacity_kg"
                                                            type="number"
                                                            step="0.01"
                                                            {...register('capacity_kg')}
                                                        />
                                                        {errors.capacity_kg && (
                                                            <InputError message={errors.capacity_kg.message} />
                                                        )}
                                                    </div>

                                                    <div className="space-y-2">
                                                        <Label htmlFor="status">Status</Label>
                                                        <Controller
                                                            name="status"
                                                            control={control}
                                                            render={({ field }) => (
                                                                <Select value={field.value} onValueChange={field.onChange}>
                                                                    <SelectTrigger>
                                                                        <SelectValue placeholder="Select status" />
                                                                    </SelectTrigger>
                                                                    <SelectContent>
                                                                        <SelectItem value="active">Active</SelectItem>
                                                                        <SelectItem value="maintenance">Maintenance</SelectItem>
                                                                        <SelectItem value="inactive">Inactive</SelectItem>
                                                                    </SelectContent>
                                                                </Select>
                                                            )}
                                                        />
                                                        {errors.status && (
                                                            <InputError message={errors.status.message} />
                                                        )}
                                                    </div>

                                                    <div className="space-y-2 sm:col-span-3">
                                                        <Label htmlFor="notes">Notes</Label>
                                                        <Textarea
                                                            id="notes"
                                                            rows={3}
                                                            {...register('notes')}
                                                        />
                                                        {errors.notes && (
                                                            <InputError message={errors.notes.message} />
                                                        )}
                                                    </div>
                                                </div>

                                                <div className="flex justify-end space-x-2">
                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                        onClick={() => setOpen(false)}
                                                        disabled={isSubmitting}
                                                    >
                                                        Cancel
                                                    </Button>
                                                    <Button type="submit" disabled={isSubmitting}>
                                                        {isSubmitting ? 'Saving...' : 'Save Vehicle'}
                                                    </Button>
                                                </div>
                                            </form>
                                        </ScrollArea>
                                    </DialogContent>
                                </Dialog>
                            </div>
                        </CardHeader>
                        <CardContent className="p-2 sm:p-6">
                            <DataTable 
                                columns={columns} 
                                data={vehicles} 
                                isLoading={isLoading}
                                pageSize={10}
                            />
                        </CardContent>
                    </Card>
                </div>
            </div>
            <Toaster position="top-right" expand={true} richColors />
        </AuthenticatedLayout>
    );
} 