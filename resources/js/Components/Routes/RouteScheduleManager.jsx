import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, Users, MapPin } from "lucide-react";
import InputError from '@/Components/InputError';

const scheduleSchema = z.object({
    collection_days: z.array(z.string())
        .min(1, 'At least one collection day is required'),
    start_time: z.string()
        .min(1, 'Start time is required'),
    end_time: z.string()
        .min(1, 'End time is required'),
    estimated_duration: z.number()
        .min(1, 'Estimated duration must be at least 1 hour')
        .max(24, 'Estimated duration cannot exceed 24 hours')
        .optional(),
    collection_frequency: z.enum(['daily', 'weekly', 'bi-weekly', 'monthly'])
        .optional()
        .default('weekly'),
});

const daysOfWeek = [
    { value: 'monday', label: 'Monday', short: 'Mon' },
    { value: 'tuesday', label: 'Tuesday', short: 'Tue' },
    { value: 'wednesday', label: 'Wednesday', short: 'Wed' },
    { value: 'thursday', label: 'Thursday', short: 'Thu' },
    { value: 'friday', label: 'Friday', short: 'Fri' },
    { value: 'saturday', label: 'Saturday', short: 'Sat' },
    { value: 'sunday', label: 'Sunday', short: 'Sun' },
];

const frequencyOptions = [
    { value: 'daily', label: 'Daily' },
    { value: 'weekly', label: 'Weekly' },
    { value: 'bi-weekly', label: 'Bi-Weekly' },
    { value: 'monthly', label: 'Monthly' },
];

export default function RouteScheduleManager({ route, onScheduleUpdate, isEditing = false }) {
    const [editMode, setEditMode] = useState(isEditing);

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        control,
        reset,
        formState: { errors, isSubmitting }
    } = useForm({
        resolver: zodResolver(scheduleSchema),
        defaultValues: {
            collection_days: route?.collection_days || [],
            start_time: route?.start_time ? route.start_time.slice(0, 5) : '',
            end_time: route?.end_time ? route.end_time.slice(0, 5) : '',
            estimated_duration: route?.estimated_duration || 8,
            collection_frequency: route?.collection_frequency || 'weekly',
        }
    });

    const watchedValues = watch();

    useEffect(() => {
        if (route) {
            reset({
                collection_days: route.collection_days || [],
                start_time: route.start_time ? route.start_time.slice(0, 5) : '',
                end_time: route.end_time ? route.end_time.slice(0, 5) : '',
                estimated_duration: route.estimated_duration || 8,
                collection_frequency: route.collection_frequency || 'weekly',
            });
        }
    }, [route, reset]);

    const calculateEstimatedDuration = () => {
        const { start_time, end_time } = watchedValues;
        if (!start_time || !end_time) return null;

        const start = new Date(`2000-01-01T${start_time}`);
        const end = new Date(`2000-01-01T${end_time}`);
        
        if (end <= start) return null;
        
        const diffMs = end - start;
        const diffHours = diffMs / (1000 * 60 * 60);
        return Math.round(diffHours * 10) / 10; // Round to 1 decimal place
    };

    const estimatedDuration = calculateEstimatedDuration();

    const onSubmit = async (data) => {
        try {
            const scheduleData = {
                ...data,
                estimated_duration: estimatedDuration || data.estimated_duration,
            };
            
            await onScheduleUpdate(scheduleData);
            setEditMode(false);
        } catch (error) {
            console.error('Error updating schedule:', error);
        }
    };

    const handleCancel = () => {
        reset();
        setEditMode(false);
    };

    const getNextCollectionDates = (days, frequency = 'weekly', count = 5) => {
        const dates = [];
        const today = new Date();
        const dayMap = {
            sunday: 0, monday: 1, tuesday: 2, wednesday: 3,
            thursday: 4, friday: 5, saturday: 6
        };

        days.forEach(day => {
            const targetDay = dayMap[day];
            let nextDate = new Date(today);
            
            // Find next occurrence of this day
            const dayDiff = (targetDay - today.getDay() + 7) % 7;
            nextDate.setDate(today.getDate() + (dayDiff === 0 ? 7 : dayDiff));

            // Add multiple dates based on frequency
            for (let i = 0; i < count; i++) {
                dates.push(new Date(nextDate));
                switch (frequency) {
                    case 'daily':
                        nextDate.setDate(nextDate.getDate() + 1);
                        break;
                    case 'weekly':
                        nextDate.setDate(nextDate.getDate() + 7);
                        break;
                    case 'bi-weekly':
                        nextDate.setDate(nextDate.getDate() + 14);
                        break;
                    case 'monthly':
                        nextDate.setMonth(nextDate.getMonth() + 1);
                        break;
                }
            }
        });

        return dates.sort((a, b) => a - b).slice(0, count);
    };

    if (!editMode) {
        const nextDates = getNextCollectionDates(
            route?.collection_days || [], 
            route?.collection_frequency || 'weekly'
        );

        return (
            <Card>
                <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle className="flex items-center gap-2">
                                <Calendar className="h-5 w-5" />
                                Collection Schedule
                            </CardTitle>
                            <CardDescription>
                                Current collection schedule and upcoming dates
                            </CardDescription>
                        </div>
                        <Button variant="outline" onClick={() => setEditMode(true)}>
                            Edit Schedule
                        </Button>
                    </div>
                </CardHeader>
                <CardContent className="space-y-6">
                    {/* Collection Days */}
                    <div>
                        <Label className="text-sm font-medium">Collection Days</Label>
                        <div className="flex flex-wrap gap-2 mt-2">
                            {route?.collection_days?.map((day) => {
                                const dayInfo = daysOfWeek.find(d => d.value === day);
                                return (
                                    <Badge key={day} variant="secondary" className="capitalize">
                                        {dayInfo?.label || day}
                                    </Badge>
                                );
                            }) || <span className="text-sm text-gray-500">No days selected</span>}
                        </div>
                    </div>

                    {/* Time Schedule */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <Label className="text-sm font-medium flex items-center gap-2">
                                <Clock className="h-4 w-4" />
                                Start Time
                            </Label>
                            <div className="mt-1 text-lg font-medium">
                                {route?.start_time || 'Not set'}
                            </div>
                        </div>
                        <div>
                            <Label className="text-sm font-medium flex items-center gap-2">
                                <Clock className="h-4 w-4" />
                                End Time
                            </Label>
                            <div className="mt-1 text-lg font-medium">
                                {route?.end_time || 'Not set'}
                            </div>
                        </div>
                    </div>

                    {/* Schedule Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <Label className="text-sm font-medium">Frequency</Label>
                            <div className="mt-1 capitalize">
                                {route?.collection_frequency || 'Weekly'}
                            </div>
                        </div>
                        <div>
                            <Label className="text-sm font-medium">Estimated Duration</Label>
                            <div className="mt-1">
                                {route?.estimated_duration || estimatedDuration || 'N/A'} hours
                            </div>
                        </div>
                    </div>

                    {/* Upcoming Collection Dates */}
                    {nextDates.length > 0 && (
                        <div>
                            <Label className="text-sm font-medium">Next Collection Dates</Label>
                            <div className="mt-2 space-y-2">
                                {nextDates.map((date, index) => (
                                    <div key={index} className="flex items-center justify-between text-sm p-2 bg-gray-50 rounded">
                                        <span>{date.toLocaleDateString('en-US', { 
                                            weekday: 'long', 
                                            year: 'numeric', 
                                            month: 'long', 
                                            day: 'numeric' 
                                        })}</span>
                                        <span className="text-gray-500">
                                            {route?.start_time} - {route?.end_time}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Edit Collection Schedule
                </CardTitle>
                <CardDescription>
                    Configure the collection schedule for this route
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    {/* Collection Days */}
                    <div>
                        <Label className="text-base font-medium">Collection Days</Label>
                        <Controller
                            name="collection_days"
                            control={control}
                            render={({ field }) => (
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-3">
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

                    {/* Time Range */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="start_time">Start Time</Label>
                            <Input
                                id="start_time"
                                type="time"
                                {...register('start_time')}
                                className="mt-1"
                            />
                            {errors.start_time && (
                                <InputError message={errors.start_time.message} />
                            )}
                        </div>

                        <div>
                            <Label htmlFor="end_time">End Time</Label>
                            <Input
                                id="end_time"
                                type="time"
                                {...register('end_time')}
                                className="mt-1"
                            />
                            {errors.end_time && (
                                <InputError message={errors.end_time.message} />
                            )}
                        </div>
                    </div>

                    {/* Estimated Duration Display */}
                    {estimatedDuration && (
                        <div className="p-3 bg-blue-50 rounded-lg">
                            <div className="text-sm text-blue-700">
                                <strong>Estimated Duration:</strong> {estimatedDuration} hours
                            </div>
                        </div>
                    )}

                    {/* Collection Frequency */}
                    <div>
                        <Label htmlFor="collection_frequency">Collection Frequency</Label>
                        <Controller
                            name="collection_frequency"
                            control={control}
                            render={({ field }) => (
                                <select
                                    id="collection_frequency"
                                    {...field}
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                >
                                    {frequencyOptions.map((option) => (
                                        <option key={option.value} value={option.value}>
                                            {option.label}
                                        </option>
                                    ))}
                                </select>
                            )}
                        />
                        {errors.collection_frequency && (
                            <InputError message={errors.collection_frequency.message} />
                        )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-end space-x-3">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={handleCancel}
                            disabled={isSubmitting}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? 'Saving...' : 'Save Schedule'}
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}