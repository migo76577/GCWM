import React, { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Plus, Edit, Trash2, Users } from 'lucide-react';
import { 
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { 
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

const availableFields = [
    { key: 'first_name', label: 'First Name' },
    { key: 'last_name', label: 'Last Name' },
    { key: 'phone', label: 'Phone' },
    { key: 'alternative_phone', label: 'Alternative Phone' },
    { key: 'address', label: 'Address' },
    { key: 'city', label: 'City' },
    { key: 'area', label: 'Area' },
    { key: 'notes', label: 'Notes' }
];

export default function Index({ auth, categories }) {
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);

    const { data, setData, post, put, delete: destroy, processing, errors, reset } = useForm({
        name: '',
        description: '',
        required_fields: ['first_name', 'last_name', 'phone', 'address', 'city', 'area'],
        optional_fields: ['alternative_phone', 'notes'],
        is_active: true,
        registration_fee: 0,
        monthly_charge: 0,
        payment_terms: 'end_of_month',
        send_sms_reminders: true
    });

    const handleCreate = (e) => {
        e.preventDefault();
        post(route('customer-categories.store'), {
            onSuccess: () => {
                reset();
                setIsCreateOpen(false);
            }
        });
    };

    const handleEdit = (category) => {
        setEditingCategory(category);
        setData({
            name: category.name,
            description: category.description || '',
            required_fields: category.required_fields || [],
            optional_fields: category.optional_fields || [],
            is_active: category.is_active,
            registration_fee: category.registration_fee || 0,
            monthly_charge: category.monthly_charge || 0,
            payment_terms: category.payment_terms || 'end_of_month',
            send_sms_reminders: category.send_sms_reminders !== undefined ? category.send_sms_reminders : true
        });
    };

    const handleUpdate = (e) => {
        e.preventDefault();
        put(route('customer-categories.update', editingCategory.id), {
            onSuccess: () => {
                reset();
                setEditingCategory(null);
            }
        });
    };

    const handleDelete = (category) => {
        destroy(route('customer-categories.destroy', category.id));
    };

    const toggleFieldInArray = (field, arrayName) => {
        const currentArray = data[arrayName];
        const otherArrayName = arrayName === 'required_fields' ? 'optional_fields' : 'required_fields';
        const otherArray = data[otherArrayName];

        if (currentArray.includes(field)) {
            // Remove from current array
            setData(arrayName, currentArray.filter(f => f !== field));
        } else {
            // Add to current array and remove from other array
            setData({
                ...data,
                [arrayName]: [...currentArray, field],
                [otherArrayName]: otherArray.filter(f => f !== field)
            });
        }
    };

    const CategoryForm = ({ onSubmit }) => (
        <div className="flex flex-col h-[60vh]">
            <ScrollArea className="flex-1 pr-4">
                <form onSubmit={onSubmit} className="space-y-4">
                    <div>
                        <Label htmlFor="name">Name</Label>
                        <Input
                            id="name"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            className={errors.name ? 'border-red-500' : ''}
                        />
                        {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                    </div>

                    <div>
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                            id="description"
                            value={data.description}
                            onChange={(e) => setData('description', e.target.value)}
                            rows={2}
                        />
                    </div>

                    <div>
                        <Label>Required Fields</Label>
                        <div className="grid grid-cols-2 gap-2 mt-2">
                            {availableFields.map(field => (
                                <div key={field.key} className="flex items-center space-x-2">
                                    <input
                                        type="checkbox"
                                        id={`required_${field.key}`}
                                        checked={data.required_fields.includes(field.key)}
                                        onChange={() => toggleFieldInArray(field.key, 'required_fields')}
                                        className="rounded"
                                    />
                                    <Label htmlFor={`required_${field.key}`} className="text-sm">
                                        {field.label}
                                    </Label>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div>
                        <Label>Optional Fields</Label>
                        <div className="grid grid-cols-2 gap-2 mt-2">
                            {availableFields.map(field => (
                                <div key={field.key} className="flex items-center space-x-2">
                                    <input
                                        type="checkbox"
                                        id={`optional_${field.key}`}
                                        checked={data.optional_fields.includes(field.key)}
                                        onChange={() => toggleFieldInArray(field.key, 'optional_fields')}
                                        className="rounded"
                                    />
                                    <Label htmlFor={`optional_${field.key}`} className="text-sm">
                                        {field.label}
                                    </Label>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="registration_fee">Registration Fee (KES)</Label>
                            <Input
                                id="registration_fee"
                                type="number"
                                step="0.01"
                                min="0"
                                value={data.registration_fee || ''}
                                onChange={(e) => setData('registration_fee', e.target.value)}
                                onBlur={(e) => {
                                    // Ensure we have a valid number when user finishes editing
                                    const value = parseFloat(e.target.value) || 0;
                                    setData('registration_fee', value);
                                }}
                                placeholder="0.00"
                            />
                        </div>
                        <div>
                            <Label htmlFor="monthly_charge">Monthly Charge (KES)</Label>
                            <Input
                                id="monthly_charge"
                                type="number"
                                step="0.01"
                                min="0"
                                value={data.monthly_charge || ''}
                                onChange={(e) => setData('monthly_charge', e.target.value)}
                                onBlur={(e) => {
                                    // Ensure we have a valid number when user finishes editing
                                    const value = parseFloat(e.target.value) || 0;
                                    setData('monthly_charge', value);
                                }}
                                placeholder="0.00"
                            />
                        </div>
                    </div>

                    <div>
                        <Label htmlFor="payment_terms">Payment Terms</Label>
                        <Select
                            value={data.payment_terms}
                            onValueChange={(value) => setData('payment_terms', value)}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select payment terms" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="end_of_month">End of Month</SelectItem>
                                <SelectItem value="upfront">Upfront Payment</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="flex items-center space-x-2">
                        <Switch
                            id="send_sms_reminders"
                            checked={data.send_sms_reminders}
                            onCheckedChange={(checked) => setData('send_sms_reminders', checked)}
                        />
                        <Label htmlFor="send_sms_reminders">Send SMS Reminders</Label>
                    </div>

                    <div className="flex items-center space-x-2">
                        <Switch
                            id="is_active"
                            checked={data.is_active}
                            onCheckedChange={(checked) => setData('is_active', checked)}
                        />
                        <Label htmlFor="is_active">Active</Label>
                    </div>
                </form>
            </ScrollArea>
            
            <div className="flex justify-end space-x-2 pt-4 border-t mt-4">
                <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                        reset();
                        setIsCreateOpen(false);
                        setEditingCategory(null);
                    }}
                >
                    Cancel
                </Button>
                <Button 
                    onClick={(e) => {
                        e.preventDefault();
                        onSubmit(e);
                    }} 
                    disabled={processing}
                >
                    {processing ? 'Saving...' : (editingCategory ? 'Update' : 'Create')}
                </Button>
            </div>
        </div>
    );

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex justify-between items-center">
                    <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                        Customer Categories
                    </h2>
                    <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                        <DialogTrigger asChild>
                            <Button>
                                <Plus className="h-4 w-4 mr-2" />
                                Add Category
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl max-h-[80vh]">
                            <DialogHeader>
                                <DialogTitle>Create Customer Category</DialogTitle>
                                <DialogDescription>
                                    Define a new customer category with specific field requirements.
                                </DialogDescription>
                            </DialogHeader>
                            <CategoryForm onSubmit={handleCreate} />
                        </DialogContent>
                    </Dialog>
                </div>
            }
        >
            <Head title="Customer Categories" />

            <div className="p-4 sm:p-6 space-y-6 pt-6 sm:pt-8">
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <div className="mb-8 pr-20 sm:pr-24 md:pr-0">
                        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Customer Categories</h1>
                        <p className="text-gray-600 mt-2">Manage customer types and their billing configurations</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {categories.map((category) => (
                            <Card key={category.id} className="relative">
                                <CardHeader className="pb-3">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <CardTitle className="flex items-center gap-2">
                                                {category.name}
                                                {!category.is_active && (
                                                    <Badge variant="secondary">Inactive</Badge>
                                                )}
                                            </CardTitle>
                                            <CardDescription className="mt-1">
                                                {category.description}
                                            </CardDescription>
                                        </div>
                                        <div className="flex space-x-2">
                                            <Dialog open={editingCategory?.id === category.id} 
                                                   onOpenChange={(open) => !open && setEditingCategory(null)}>
                                                <DialogTrigger asChild>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => handleEdit(category)}
                                                    >
                                                        <Edit className="h-4 w-4" />
                                                    </Button>
                                                </DialogTrigger>
                                                <DialogContent className="max-w-2xl max-h-[80vh]">
                                                    <DialogHeader>
                                                        <DialogTitle>Edit Customer Category</DialogTitle>
                                                        <DialogDescription>
                                                            Modify the customer category settings.
                                                        </DialogDescription>
                                                    </DialogHeader>
                                                    <CategoryForm onSubmit={handleUpdate} />
                                                </DialogContent>
                                            </Dialog>

                                            <AlertDialog>
                                                <AlertDialogTrigger asChild>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="text-red-600 hover:text-red-900"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </AlertDialogTrigger>
                                                <AlertDialogContent>
                                                    <AlertDialogHeader>
                                                        <AlertDialogTitle>Delete Category</AlertDialogTitle>
                                                        <AlertDialogDescription>
                                                            Are you sure you want to delete "{category.name}"? 
                                                            This action cannot be undone.
                                                            {category.customers_count > 0 && (
                                                                <span className="block mt-2 text-red-600 font-medium">
                                                                    This category has {category.customers_count} customers 
                                                                    and cannot be deleted.
                                                                </span>
                                                            )}
                                                        </AlertDialogDescription>
                                                    </AlertDialogHeader>
                                                    <AlertDialogFooter>
                                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                        <AlertDialogAction
                                                            onClick={() => handleDelete(category)}
                                                            disabled={category.customers_count > 0}
                                                            className="bg-red-600 hover:bg-red-700"
                                                        >
                                                            Delete
                                                        </AlertDialogAction>
                                                    </AlertDialogFooter>
                                                </AlertDialogContent>
                                            </AlertDialog>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-3">
                                        <div className="flex items-center text-sm text-gray-600">
                                            <Users className="h-4 w-4 mr-2" />
                                            {category.customers_count} customers
                                        </div>

                                        <div>
                                            <p className="text-sm font-medium text-gray-900 mb-2">Required Fields:</p>
                                            <div className="flex flex-wrap gap-1">
                                                {category.required_fields?.map(field => (
                                                    <Badge key={field} variant="default" className="text-xs">
                                                        {availableFields.find(f => f.key === field)?.label || field}
                                                    </Badge>
                                                ))}
                                            </div>
                                        </div>

                                        {category.optional_fields?.length > 0 && (
                                            <div>
                                                <p className="text-sm font-medium text-gray-900 mb-2">Optional Fields:</p>
                                                <div className="flex flex-wrap gap-1">
                                                    {category.optional_fields.map(field => (
                                                        <Badge key={field} variant="outline" className="text-xs">
                                                            {availableFields.find(f => f.key === field)?.label || field}
                                                        </Badge>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        <div className="border-t pt-3 mt-3">
                                            <div className="grid grid-cols-2 gap-2 text-sm">
                                                <div>
                                                    <span className="font-medium text-gray-900">Registration Fee:</span>
                                                    <span className="ml-1 text-green-600">KES {category.registration_fee?.toLocaleString() || '0'}</span>
                                                </div>
                                                <div>
                                                    <span className="font-medium text-gray-900">Monthly:</span>
                                                    <span className="ml-1 text-green-600">KES {category.monthly_charge?.toLocaleString() || '0'}</span>
                                                </div>
                                            </div>
                                            <div className="mt-2 flex items-center justify-between text-xs">
                                                <Badge variant={category.payment_terms === 'upfront' ? 'default' : 'secondary'}>
                                                    {category.payment_terms === 'upfront' ? 'Upfront Payment' : 'End of Month'}
                                                </Badge>
                                                {category.send_sms_reminders && (
                                                    <Badge variant="outline" className="text-green-600">
                                                        SMS Reminders
                                                    </Badge>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    {categories.length === 0 && (
                        <Card className="text-center py-12">
                            <CardContent>
                                <p className="text-gray-500 mb-4">No customer categories found.</p>
                                <Button onClick={() => setIsCreateOpen(true)}>
                                    <Plus className="h-4 w-4 mr-2" />
                                    Create Your First Category
                                </Button>
                            </CardContent>
                        </Card>
                    )}
                    </div>
                </div>
        </AuthenticatedLayout>
    );
}