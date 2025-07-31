<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\CustomerController;
use App\Http\Controllers\Api\PlanController;
use App\Http\Controllers\Api\VehicleController;
use App\Http\Controllers\Api\DriverController;
use App\Http\Controllers\Api\RouteController as ApiRouteController;
use App\Http\Controllers\Api\CollectionController;
use App\Http\Controllers\Api\ComplaintController;
use App\Http\Controllers\Api\PaymentController;
use App\Http\Controllers\Api\ExpenseController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\InvoiceController;
use App\Http\Controllers\Api\ReportsController;
use App\Http\Controllers\Api\NotificationController;
use App\Http\Controllers\Api\SettingsController;
use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;

// Public routes
Route::prefix('v1')->group(function () {
    // Authentication
    Route::post('register', [AuthController::class, 'register']);
    Route::post('login', [AuthController::class, 'login']);
    Route::post('forgot-password', [AuthController::class, 'forgotPassword']);
    Route::post('reset-password', [AuthController::class, 'resetPassword']);
    
    // Public plans (for registration)
    Route::get('plans', [PlanController::class, 'index']);
    Route::get('plans/{plan}', [PlanController::class, 'show']);
});

// Protected routes
Route::prefix('v1')->middleware(['auth:sanctum'])->group(function () {
    // Authentication
    Route::post('logout', [AuthController::class, 'logout']);
    Route::get('me', [AuthController::class, 'me']);
    Route::put('profile', [AuthController::class, 'updateProfile']);
    Route::put('change-password', [AuthController::class, 'changePassword']);
    
    // Dashboard routes
    Route::get('dashboard/stats', [DashboardController::class, 'stats']);
    Route::get('dashboard/recent-activities', [DashboardController::class, 'recentActivities']);
    
    // Customer routes
    Route::apiResource('customers', CustomerController::class);
    Route::post('customers/{customer}/assign-route', [CustomerController::class, 'assignToRoute']);
    Route::post('customers/{customer}/approve-registration', [CustomerController::class, 'approveRegistration']);
    Route::get('customers/{customer}/collections', [CustomerController::class, 'collections']);
    Route::get('customers/{customer}/invoices', [CustomerController::class, 'invoices']);
    Route::get('customers/{customer}/payments', [CustomerController::class, 'payments']);
    Route::get('customers/{customer}/complaints', [CustomerController::class, 'complaints']);
    
    // Plans management (Admin only)
    Route::middleware('role:admin')->group(function () {
        Route::post('plans', [PlanController::class, 'store']);
        Route::put('plans/{plan}', [PlanController::class, 'update']);
        Route::delete('plans/{plan}', [PlanController::class, 'destroy']);
    });
    Route::post('plans/{plan}/subscribe', [PlanController::class, 'subscribe']);
    Route::post('customer-plans/{customerPlan}/cancel', [PlanController::class, 'cancelSubscription']);
    
    // Vehicle management (Admin only)
    Route::middleware('role:admin')->group(function () {
        Route::apiResource('vehicles', VehicleController::class);
    });
    
    // Driver management (Admin only)
    Route::middleware('role:admin')->group(function () {
        Route::apiResource('drivers', DriverController::class);
        Route::post('drivers/{driver}/toggle-status', [DriverController::class, 'toggleStatus']);
        Route::get('drivers/{driver}/performance', [DriverController::class, 'performance']);
    });
    
    // Driver specific routes
    Route::middleware('role:driver')->group(function () {
        Route::get('drivers/me/assignment', [DriverController::class, 'todayAssignment']);
        Route::get('drivers/me/route-customers', [DriverController::class, 'routeCustomers']);
        Route::post('drivers/me/start-route', [DriverController::class, 'startRoute']);
        Route::post('drivers/me/complete-route', [DriverController::class, 'completeRoute']);
    });
    
    // Route management (Admin only)
    Route::middleware('role:admin')->group(function () {
        Route::apiResource('routes', ApiRouteController::class);
        Route::post('routes/{route}/assign', [ApiRouteController::class, 'assignDriverAndVehicle']);
        Route::get('routes/{route}/customers', [ApiRouteController::class, 'customers']);
        Route::post('routes/{route}/optimize', [ApiRouteController::class, 'optimizeRoute']);
    });
    
    // Collections
    Route::apiResource('collections', CollectionController::class);
    Route::get('collections/{collection}/photos', [CollectionController::class, 'photos']);
    Route::post('collections/bulk-create', [CollectionController::class, 'bulkCreate']);
    
    // Invoices
    Route::apiResource('invoices', InvoiceController::class);
    Route::post('invoices/{invoice}/send', [InvoiceController::class, 'send']);
    Route::get('invoices/{invoice}/pdf', [InvoiceController::class, 'downloadPDF']);
    Route::post('invoices/generate-monthly', [InvoiceController::class, 'generateMonthlyInvoices']);
    
    // Payments
    Route::apiResource('payments', PaymentController::class);
    Route::post('payments/{payment}/confirm', [PaymentController::class, 'confirmPayment']);
    Route::post('payments/{payment}/refund', [PaymentController::class, 'refund']);
    Route::get('payments/methods', [PaymentController::class, 'paymentMethods']);
    
    // Complaints
    Route::apiResource('complaints', ComplaintController::class);
    Route::post('complaints/{complaint}/assign', [ComplaintController::class, 'assign']);
    Route::post('complaints/{complaint}/respond', [ComplaintController::class, 'respond']);
    Route::post('complaints/{complaint}/resolve', [ComplaintController::class, 'resolve']);
    Route::get('complaints/categories', [ComplaintController::class, 'categories']);
    
    // Expenses (Admin only)
    Route::middleware('role:admin')->group(function () {
        Route::apiResource('expenses', ExpenseController::class);
        Route::post('expenses/{expense}/approve', [ExpenseController::class, 'approve']);
        Route::post('expenses/{expense}/reject', [ExpenseController::class, 'reject']);
        Route::get('expenses/categories', [ExpenseController::class, 'categories']);
        Route::get('expenses/reports/monthly', [ExpenseController::class, 'monthlyReport']);
        Route::get('expenses/reports/category', [ExpenseController::class, 'categoryReport']);
    });
    
    // Reports (Admin only)
    Route::middleware('role:admin')->prefix('reports')->group(function () {
        Route::get('collections', [ReportsController::class, 'collectionsReport']);
        Route::get('revenue', [ReportsController::class, 'revenueReport']);
        Route::get('customers', [ReportsController::class, 'customersReport']);
        Route::get('routes-efficiency', [ReportsController::class, 'routeEfficiencyReport']);
        Route::get('driver-performance', [ReportsController::class, 'driverPerformanceReport']);
        Route::get('complaints-summary', [ReportsController::class, 'complaintsSummaryReport']);
    });
    
    // Notifications
    Route::get('notifications', [NotificationController::class, 'index']);
    Route::post('notifications/{notification}/mark-read', [NotificationController::class, 'markAsRead']);
    Route::post('notifications/mark-all-read', [NotificationController::class, 'markAllAsRead']);
    Route::delete('notifications/{notification}', [NotificationController::class, 'destroy']);
    
    // System settings (Admin only)
    Route::middleware('role:admin')->prefix('settings')->group(function () {
        Route::get('/', [SettingsController::class, 'index']);
        Route::put('/', [SettingsController::class, 'update']);
        Route::get('groups/{group}', [SettingsController::class, 'getByGroup']);
    });
});

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});