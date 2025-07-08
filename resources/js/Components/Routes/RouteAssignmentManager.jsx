import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DataTable } from "@/components/ui/data-table";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { 
    Users, 
    Truck, 
    Calendar as CalendarIcon, 
    Plus, 
    Edit, 
    Trash2,
    CheckCircle,
    XCircle,
    Clock
} from "lucide-react";
import { useVehicleStore, useDriverStore } from '@/stores';
import InputError from '@/Components/InputError';
import { toast } from 'sonner';

const assignmentSchema = z.object({
    vehicle_id: z.string().min(1, 'Vehicle is required'),
    driver_id: z.string().min(1, 'Driver is required'),
    assignment_date: z.string().min(1, 'Assignment date is required'),
    status: z.enum(['active', 'completed', 'cancelled']).default('active'),
    notes: z.string().optional(),
});

export default function RouteAssignmentManager({ route, assignments = [], onAssignmentCreate, onAssignmentUpdate, onAssignmentDelete }) {
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editingAssignment, setEditingAssignment] = useState(null);

    // Zustand stores
    const { 
        vehicles, 
        fetchVehicles, 
        getVehiclesByStatus 
    } = useVehicleStore();

    const { 
        drivers, 
        fetchDrivers, 
        getActiveDrivers 
    } = useDriverStore();

    const {
        register,
        handleSubmit,
        setValue,
        control,
        reset,
        formState: { errors, isSubmitting }
    } = useForm({
        resolver: zodResolver(assignmentSchema),
        defaultValues: {
            vehicle_id: '',
            driver_id: '',
            assignment_date: new Date().toISOString().split('T')[0],
            status: 'active',
            notes: ''
        }
    });

    useEffect(() => {
        fetchVehicles();
        fetchDrivers();
    }, [fetchVehicles, fetchDrivers]);

    const activeVehicles = getVehiclesByStatus('active');
    const activeDrivers = getActiveDrivers();

    const handleCreateAssignment = () => {
        setEditingAssignment(null);
        reset({
            vehicle_id: '',
            driver_id: '',
            assignment_date: new Date().toISOString().split('T')[0],
            status: 'active',
            notes: ''
        });
        setDialogOpen(true);
    };

    const handleEditAssignment = (assignment) => {
        setEditingAssignment(assignment);
        reset({
            vehicle_id: assignment.vehicle_id?.toString() || '',
            driver_id: assignment.driver_id?.toString() || '',
            assignment_date: assignment.assignment_date || '',
            status: assignment.status || 'active',
            notes: assignment.notes || ''
        });
        setDialogOpen(true);
    };

    const onSubmit = async (data) => {
        try {
            const assignmentData = {
                ...data,
                route_id: route.id,
                vehicle_id: parseInt(data.vehicle_id),
                driver_id: parseInt(data.driver_id),
            };

            if (editingAssignment) {
                await onAssignmentUpdate(editingAssignment.id, assignmentData);
                toast.success('Assignment updated successfully');
            } else {
                await onAssignmentCreate(assignmentData);
                toast.success('Assignment created successfully');
            }

            setDialogOpen(false);
            reset();
        } catch (error) {
            console.error('Error with assignment:', error);
            toast.error(error.message || 'Failed to save assignment');
        }
    };

    const handleDeleteAssignment = async (assignmentId) => {
        if (window.confirm('Are you sure you want to delete this assignment?')) {
            try {
                await onAssignmentDelete(assignmentId);
                toast.success('Assignment deleted successfully');
            } catch (error) {
                console.error('Error deleting assignment:', error);
                toast.error('Failed to delete assignment');
            }
        }
    };

    const getStatusBadge = (status) => {
        const statusConfig = {
            active: { variant: 'default', icon: Clock, color: 'bg-blue-100 text-blue-800' },
            completed: { variant: 'secondary', icon: CheckCircle, color: 'bg-green-100 text-green-800' },
            cancelled: { variant: 'destructive', icon: XCircle, color: 'bg-red-100 text-red-800' }
        };

        const config = statusConfig[status] || statusConfig.active;
        const Icon = config.icon;

        return (
            <Badge className={`${config.color} capitalize`}>
                <Icon className="h-3 w-3 mr-1" />
                {status}
            </Badge>
        );
    };

    const getVehicleName = (vehicleId) => {
        const vehicle = vehicles.find(v => v.id === vehicleId);
        return vehicle ? `${vehicle.vehicle_number} (${vehicle.license_plate})` : 'Unknown Vehicle';
    };

    const getDriverName = (driverId) => {
        const driver = drivers.find(d => d.id === driverId);
        return driver ? `${driver.first_name} ${driver.last_name}` : 'Unknown Driver';
    };

    const columns = [
        {
            accessorKey: 'assignment_date',
            header: 'Date',
            cell: ({ row }) => {
                const date = new Date(row.getValue('assignment_date'));
                return (
                    <div className="text-sm">
                        {date.toLocaleDateString()}
                    </div>
                );
            },
        },
        {
            accessorKey: 'vehicle_id',
            header: 'Vehicle',
            cell: ({ row }) => (
                <div className="text-sm font-medium">
                    {getVehicleName(row.getValue('vehicle_id'))}
                </div>
            ),
        },
        {
            accessorKey: 'driver_id',
            header: 'Driver',
            cell: ({ row }) => (
                <div className="text-sm font-medium">
                    {getDriverName(row.getValue('driver_id'))}
                </div>
            ),
        },
        {
            accessorKey: 'status',
            header: 'Status',
            cell: ({ row }) => getStatusBadge(row.getValue('status')),
        },
        {
            id: 'actions',
            header: 'Actions',
            cell: ({ row }) => {
                const assignment = row.original;
                return (
                    <div className="flex items-center gap-2">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditAssignment(assignment)}
                        >
                            <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteAssignment(assignment.id)}
                            className="text-red-600 hover:text-red-900"
                        >
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </div>
                );
            },
        },
    ];

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle className="flex items-center gap-2">
                            <Users className="h-5 w-5" />
                            Route Assignments
                        </CardTitle>
                        <CardDescription>
                            Manage vehicle and driver assignments for this route
                        </CardDescription>
                    </div>
                    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                        <DialogTrigger asChild>
                            <Button onClick={handleCreateAssignment}>
                                <Plus className="h-4 w-4 mr-2" />
                                New Assignment
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[500px]">
                            <DialogHeader>
                                <DialogTitle>
                                    {editingAssignment ? 'Edit Assignment' : 'Create New Assignment'}
                                </DialogTitle>
                            </DialogHeader>
                            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                                <div className="grid grid-cols-1 gap-4">
                                    <div>
                                        <Label htmlFor="assignment_date">Assignment Date</Label>
                                        <Controller
                                            name="assignment_date"
                                            control={control}
                                            render={({ field }) => (
                                                <Popover>
                                                    <PopoverTrigger asChild>
                                                        <Button
                                                            variant={"outline"}
                                                            className={cn(
                                                                "w-full justify-start text-left font-normal",
                                                                !field.value && "text-muted-foreground"
                                                            )}
                                                        >
                                                            <CalendarIcon className="mr-2 h-4 w-4" />
                                                            {field.value ? (
                                                                format(new Date(field.value), "PPP")
                                                            ) : (
                                                                <span>Pick a date</span>
                                                            )}
                                                        </Button>
                                                    </PopoverTrigger>
                                                    <PopoverContent className="w-auto p-0" align="start">
                                                        <Calendar
                                                            mode="single"
                                                            selected={field.value ? new Date(field.value) : undefined}
                                                            onSelect={(date) => {
                                                                field.onChange(date ? format(date, "yyyy-MM-dd") : "");
                                                            }}
                                                            disabled={(date) =>
                                                                date < new Date(new Date().setHours(0, 0, 0, 0))
                                                            }
                                                            initialFocus
                                                        />
                                                    </PopoverContent>
                                                </Popover>
                                            )}
                                        />
                                        {errors.assignment_date && (
                                            <InputError message={errors.assignment_date.message} />
                                        )}
                                    </div>

                                    <div>
                                        <Label htmlFor="vehicle_id">Vehicle</Label>
                                        <Controller
                                            name="vehicle_id"
                                            control={control}
                                            render={({ field }) => (
                                                <Select onValueChange={field.onChange} value={field.value}>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select a vehicle" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {activeVehicles.map((vehicle) => (
                                                            <SelectItem key={vehicle.id} value={vehicle.id.toString()}>
                                                                <div className="flex items-center gap-2">
                                                                    <Truck className="h-4 w-4" />
                                                                    {vehicle.vehicle_number} - {vehicle.license_plate}
                                                                    <span className="text-sm text-gray-500">
                                                                        ({vehicle.make} {vehicle.model})
                                                                    </span>
                                                                </div>
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

                                    <div>
                                        <Label htmlFor="driver_id">Driver</Label>
                                        <Controller
                                            name="driver_id"
                                            control={control}
                                            render={({ field }) => (
                                                <Select onValueChange={field.onChange} value={field.value}>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select a driver" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {activeDrivers.map((driver) => (
                                                            <SelectItem key={driver.id} value={driver.id.toString()}>
                                                                <div className="flex items-center gap-2">
                                                                    <Users className="h-4 w-4" />
                                                                    {driver.first_name} {driver.last_name}
                                                                    <span className="text-sm text-gray-500">
                                                                        ({driver.employee_number})
                                                                    </span>
                                                                </div>
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            )}
                                        />
                                        {errors.driver_id && (
                                            <InputError message={errors.driver_id.message} />
                                        )}
                                    </div>

                                    <div>
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
                                                        <SelectItem value="completed">Completed</SelectItem>
                                                        <SelectItem value="cancelled">Cancelled</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            )}
                                        />
                                        {errors.status && (
                                            <InputError message={errors.status.message} />
                                        )}
                                    </div>

                                    <div>
                                        <Label htmlFor="notes">Notes (Optional)</Label>
                                        <Textarea
                                            id="notes"
                                            rows={3}
                                            {...register('notes')}
                                            placeholder="Any additional notes for this assignment"
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
                                        onClick={() => setDialogOpen(false)}
                                        disabled={isSubmitting}
                                    >
                                        Cancel
                                    </Button>
                                    <Button type="submit" disabled={isSubmitting}>
                                        {isSubmitting ? 'Saving...' : editingAssignment ? 'Update Assignment' : 'Create Assignment'}
                                    </Button>
                                </div>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>
            </CardHeader>
            <CardContent>
                {assignments.length > 0 ? (
                    <DataTable 
                        columns={columns} 
                        data={assignments}
                        pageSize={10}
                    />
                ) : (
                    <div className="text-center py-8">
                        <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No assignments yet</h3>
                        <p className="text-gray-500 mb-4">
                            Create your first assignment to get started with route management.
                        </p>
                        <Button onClick={handleCreateAssignment}>
                            <Plus className="h-4 w-4 mr-2" />
                            Create First Assignment
                        </Button>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}