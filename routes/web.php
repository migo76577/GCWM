<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\VehicleController;
use App\Http\Controllers\CustomerController;
use App\Http\Controllers\CustomerCategoryController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
    
    // Override the vehicles index route to use Inertia
    Route::get('/vehicles', [VehicleController::class, 'index'])->name('vehicles.index');
    Route::resource('vehicles', VehicleController::class)->except(['index'])->names([
        'create' => 'vehicles.create',
        'store' => 'vehicles.store',
        'show' => 'vehicles.show',
        'edit' => 'vehicles.edit',
        'update' => 'vehicles.update',
        'destroy' => 'vehicles.destroy'
    ]);
    
    // Override the customers index route to use Inertia
    Route::get('/customers', [CustomerController::class, 'index'])->name('customers.index');
    Route::get('/customers/{customer}', [CustomerController::class, 'show'])->name('customers.show');
    Route::resource('customers', CustomerController::class)->except(['index', 'show'])->names([
        'create' => 'customers.create',
        'store' => 'customers.store',
        'edit' => 'customers.edit',
        'update' => 'customers.update',
        'destroy' => 'customers.destroy'
    ]);
    
    // Customer Categories
    Route::get('/customer-categories', [CustomerCategoryController::class, 'index'])->name('customer-categories.index');
    Route::post('/customer-categories', [CustomerCategoryController::class, 'store'])->name('customer-categories.store');
    Route::put('/customer-categories/{customerCategory}', [CustomerCategoryController::class, 'update'])->name('customer-categories.update');
    Route::delete('/customer-categories/{customerCategory}', [CustomerCategoryController::class, 'destroy'])->name('customer-categories.destroy');
    
    // Routes management
    Route::get('/routes', function () {
        return Inertia::render('Routes/Index');
    })->name('routes.index');
    Route::get('/routes/{route}', function ($routeId) {
        return Inertia::render('Routes/Show', [
            'routeId' => $routeId
        ]);
    })->name('routes.show');
    
    // Drivers management
    Route::get('/drivers', function () {
        return Inertia::render('Drivers/Index');
    })->name('drivers.index');
    
    // Maintenance management
    Route::get('/maintenance', function () {
        return Inertia::render('Maintenance/Index');
    })->name('maintenance.index');
    Route::get('/drivers/{driver}', function ($driverId) {
        // You'll need to create a DriverController method for this
        // For now, returning mock data structure
        $driver = (object) [
            'id' => $driverId,
            'employee_number' => 'EMP001',
            'first_name' => 'John',
            'last_name' => 'Doe',
            'phone' => '+254712345678',
            'license_number' => 'DL123456',
            'license_expiry' => '2025-12-31',
            'hire_date' => '2024-01-01',
            'address' => '123 Main Street, Nairobi',
            'status' => 'active',
            'user' => (object) [
                'email' => 'john.doe@company.com'
            ]
        ];
        
        return Inertia::render('Drivers/Show', [
            'driver' => $driver
        ]);
    })->name('drivers.show');
});

require __DIR__.'/auth.php';
