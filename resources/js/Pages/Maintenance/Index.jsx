import React, { useState, useEffect } from 'react';
import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { toast, Toaster } from 'sonner';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
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
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Wrench, AlertTriangle, CheckCircle } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import * as z from 'zod';

const maintenanceSchema = z.object({
    vehicle_id: z.string().min(1, 'Vehicle is required'),
    maintenance_type: z.string().min(1, 'Maintenance type is required'),
    description: z.string().min(1, 'Description is required'),
    scheduled_date: z.date({
        required_error: 'Scheduled date is required',
    }),
    start_date: z.date().optional(),
    end_date: z.date().optional(),
    status: z.enum(['scheduled', 'in_progress', 'completed', 'cancelled']).optional(),
    cost: z.string().optional(),
    service_provider: z.string().optional(),
    notes: z.string().optional(),
});

export default function Index({ auth, api_token }) {
    const [open, setOpen] = useState(false);
    const [maintenances, setMaintenances] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const { token, isAuthenticated } = useAuthStore();
    const { vehicles, fetchVehicles } = useVehicleStore();

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        reset,
        control,
        formState: { errors, isSubmitting }
    } = useForm({
        resolver: zodResolver(maintenanceSchema),
        defaultValues: {
            vehicle_id: '',
            maintenance_type: '',
            description: '',
            status: 'scheduled',
            cost: '',
            service_provider: '',
            notes: ''
        }
    });

    const watchedDate = watch('scheduled_date');

    const fetchMaintenances = async () => {
        if (!token) return;
        
        setIsLoading(true);
        try {
            const response = await fetch('/api/v1/maintenances', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                }
            });
            
            if (!response.ok) throw new Error('Failed to fetch maintenances');
            
            const data = await response.json();
            setMaintenances(data.data || data);
        } catch (err) {
            console.error('Error fetching maintenances:', err);
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    const addMaintenance = async (data) => {
        if (!token) throw new Error('No authentication token');
        
        const payload = {
            ...data,
            scheduled_date: format(data.scheduled_date, 'yyyy-MM-dd'),
            cost: data.cost ? parseFloat(data.cost) : null,
        };

        const response = await fetch('/api/v1/maintenances', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to add maintenance');
        }

        return response.json();
    };

    const updateMaintenanceStatus = async (id, action, data = {}) => {
        if (!token) throw new Error('No authentication token');
        
        const response = await fetch(`/api/v1/maintenances/${id}/${action}`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || `Failed to ${action} maintenance`);
        }

        return response.json();
    };

    const columns = React.useMemo(
        () => [
            {
                accessorKey: 'vehicle.vehicle_number',
                header: 'Vehicle',
                cell: ({ row }) => (
                    <div className="font-medium">{row.original.vehicle?.vehicle_number}</div>
                ),
            },
            {
                accessorKey: 'maintenance_type',
                header: 'Type',
                cell: ({ row }) => (
                    <div className="capitalize">{row.getValue('maintenance_type')}</div>
                ),
            },
            {
                accessorKey: 'scheduled_date',
                header: 'Scheduled',
                cell: ({ row }) => (
                    <div className="text-sm">{format(new Date(row.getValue('scheduled_date')), 'MMM dd, yyyy')}</div>
                ),
            },
            {
                accessorKey: 'status',
                header: 'Status',
                cell: ({ row }) => {
                    const status = row.getValue('status');
                    const statusColors = {
                        scheduled: 'bg-blue-100 text-blue-800',
                        in_progress: 'bg-yellow-100 text-yellow-800',
                        completed: 'bg-green-100 text-green-800',
                        cancelled: 'bg-red-100 text-red-800',
                    };
                    
                    const StatusIcon = {
                        scheduled: CalendarIcon,
                        in_progress: Wrench,
                        completed: CheckCircle,
                        cancelled: AlertTriangle,
                    };
                    
                    const Icon = StatusIcon[status] || CalendarIcon;
                    
                    return (
                        <Badge 
                            variant="secondary" 
                            className={`text-xs py-1 px-2 ${statusColors[status] || 'bg-gray-100 text-gray-800'}`}
                        >
                            <Icon className="w-3 h-3 mr-1" />
                            <span className="capitalize">{status?.replace('_', ' ')}</span>
                        </Badge>
                    );
                },
            },
            {
                accessorKey: 'cost',
                header: 'Cost',
                cell: ({ row }) => {
                    const cost = row.getValue('cost');
                    return cost ? `$${parseFloat(cost).toLocaleString()}` : 'N/A';
                },
            },
            {
                id: 'actions',
                header: 'Actions',
                cell: ({ row }) => {
                    const maintenance = row.original;
                    return (
                        <div className="flex space-x-2">
                            {maintenance.status === 'scheduled' && (
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleStatusUpdate(maintenance.id, 'mark-in-progress')}
                                    className="text-xs px-2 py-1 h-auto"
                                >
                                    Start
                                </Button>
                            )}
                            {maintenance.status === 'in_progress' && (
                                <Button
                                    variant="default"
                                    size="sm"
                                    onClick={() => handleStatusUpdate(maintenance.id, 'mark-completed')}
                                    className="text-xs px-2 py-1 h-auto"
                                >
                                    Complete
                                </Button>
                            )}
                        </div>
                    );
                },
            },
        ],
        []
    );

    useEffect(() => {
        if (isAuthenticated && token && auth.user?.role === 'admin') {
            fetchVehicles();
            fetchMaintenances();
        }
    }, [isAuthenticated, token]);

    useEffect(() => {
        if (error) {
            toast.error(error);
            setError(null);
        }
    }, [error]);

    const onSubmit = async (data) => {
        try {
            await addMaintenance(data);
            setOpen(false);
            reset();
            toast.success('Maintenance scheduled successfully');
            fetchMaintenances();
        } catch (error) {
            console.error('Error adding maintenance:', error);
            setError(error.message);
        }
    };

    const handleStatusUpdate = async (id, action) => {
        try {
            await updateMaintenanceStatus(id, action);
            toast.success(`Maintenance ${action.replace('mark-', '').replace('-', ' ')} successfully`);
            fetchMaintenances();
        } catch (error) {
            console.error(`Error updating maintenance:`, error);
            setError(error.message);
        }
    };

    if (auth.user?.role !== 'admin') {
        return (
            <AuthenticatedLayout
                user={auth.user}
                header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Maintenance</h2>}
            >
                <Head title="Maintenance" />
                <div className="py-12">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <Card className="w-full">
                            <CardContent className="p-4 sm:p-6">
                                <div className="text-center">
                                    <h3 className="text-lg font-medium text-red-600">Access Denied</h3>
                                    <p className="mt-2 text-sm text-gray-600">
                                        You need admin privileges to access maintenance management.
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
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Maintenance</h2>}
        >
            <Head title="Maintenance" />

            <div className="p-4 sm:p-6 space-y-6 pt-6 sm:pt-8">
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <div className="mb-8 pr-20 sm:pr-24 md:pr-0">
                        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Vehicle Maintenance</h1>
                        <p className="text-gray-600 mt-2">Schedule and track maintenance for your vehicle fleet</p>
                    </div>

                    <Card className="w-full overflow-hidden">
                        <CardHeader className="pb-4">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                <div className="min-w-0">
                                </div>
                                <Dialog open={open} onOpenChange={setOpen}>
                                    <DialogTrigger asChild>
                                        <Button>
                                            <Wrench className="w-4 h-4 mr-2" />
                                            Schedule Maintenance
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent className="sm:max-w-[600px] max-h-[90vh]">
                                        <DialogHeader>
                                            <DialogTitle>Schedule Vehicle Maintenance</DialogTitle>
                                        </DialogHeader>
                                        <ScrollArea className="h-[calc(90vh-8rem)]">
                                            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pr-4">
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                    <div className="space-y-2">
                                                        <Label htmlFor="vehicle_id">Vehicle</Label>
                                                        <Controller
                                                            name="vehicle_id"
                                                            control={control}
                                                            render={({ field }) => (
                                                                <Select value={field.value} onValueChange={field.onChange}>
                                                                    <SelectTrigger>
                                                                        <SelectValue placeholder="Select vehicle" />
                                                                    </SelectTrigger>
                                                                    <SelectContent>
                                                                        {vehicles.map(vehicle => (
                                                                            <SelectItem key={vehicle.id} value={vehicle.id.toString()}>
                                                                                {vehicle.vehicle_number} - {vehicle.license_plate}
                                                                            </SelectItem>
                                                                        ))}
                                                                    </SelectContent>
                                                                </Select>
                                                            )}
                                                        />
                                                        {errors.vehicle_id && (
                                                            <InputError message={errors.vehicle_id.message} />
                                                        )}
                                                    </div>

                                                    <div className="space-y-2">
                                                        <Label htmlFor="maintenance_type">Maintenance Type</Label>
                                                        <Input
                                                            id="maintenance_type"
                                                            placeholder="e.g., Oil Change, Brake Service"
                                                            {...register('maintenance_type')}
                                                        />
                                                        {errors.maintenance_type && (
                                                            <InputError message={errors.maintenance_type.message} />
                                                        )}
                                                    </div>

                                                    <div className="space-y-2 sm:col-span-2">
                                                        <Label htmlFor="description">Description</Label>
                                                        <Textarea
                                                            id="description"
                                                            rows={3}
                                                            placeholder="Detailed description of maintenance work needed..."
                                                            {...register('description')}
                                                        />
                                                        {errors.description && (
                                                            <InputError message={errors.description.message} />
                                                        )}
                                                    </div>

                                                    <div className="space-y-2">
                                                        <Label>Scheduled Date</Label>
                                                        <Controller
                                                            name="scheduled_date"
                                                            control={control}
                                                            render={({ field }) => (
                                                                <Popover>
                                                                    <PopoverTrigger asChild>
                                                                        <Button
                                                                            variant="outline"
                                                                            className={cn(
                                                                                "w-full justify-start text-left font-normal",
                                                                                !field.value && "text-muted-foreground"
                                                                            )}
                                                                        >
                                                                            <CalendarIcon className="mr-2 h-4 w-4" />
                                                                            {field.value ? format(field.value, "PPP") : "Pick a date"}
                                                                        </Button>
                                                                    </PopoverTrigger>
                                                                    <PopoverContent className="w-auto p-0">
                                                                        <Calendar
                                                                            mode="single"
                                                                            selected={field.value}
                                                                            onSelect={field.onChange}
                                                                            disabled={(date) => date < new Date()}
                                                                            initialFocus
                                                                        />
                                                                    </PopoverContent>
                                                                </Popover>
                                                            )}
                                                        />
                                                        {errors.scheduled_date && (
                                                            <InputError message={errors.scheduled_date.message} />
                                                        )}
                                                    </div>

                                                    <div className="space-y-2">
                                                        <Label htmlFor="cost">Estimated Cost</Label>
                                                        <Input
                                                            id="cost"
                                                            type="number"
                                                            step="0.01"
                                                            placeholder="0.00"
                                                            {...register('cost')}
                                                        />
                                                        {errors.cost && (
                                                            <InputError message={errors.cost.message} />
                                                        )}
                                                    </div>

                                                    <div className="space-y-2 sm:col-span-2">
                                                        <Label htmlFor="service_provider">Service Provider</Label>
                                                        <Input
                                                            id="service_provider"
                                                            placeholder="Name of garage/service provider"
                                                            {...register('service_provider')}
                                                        />
                                                        {errors.service_provider && (
                                                            <InputError message={errors.service_provider.message} />
                                                        )}
                                                    </div>

                                                    <div className="space-y-2 sm:col-span-2">
                                                        <Label htmlFor="notes">Additional Notes</Label>
                                                        <Textarea
                                                            id="notes"
                                                            rows={2}
                                                            placeholder="Any additional notes..."
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
                                                        {isSubmitting ? 'Scheduling...' : 'Schedule Maintenance'}
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
                                data={maintenances} 
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