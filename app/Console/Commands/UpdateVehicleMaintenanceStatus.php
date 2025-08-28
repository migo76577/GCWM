<?php

namespace App\Console\Commands;

use App\Models\Vehicle;
use App\Models\VehicleMaintenance;
use Illuminate\Console\Command;
use Carbon\Carbon;

class UpdateVehicleMaintenanceStatus extends Command
{
    protected $signature = 'vehicles:update-maintenance-status';
    protected $description = 'Update vehicle status based on maintenance schedules';

    public function handle()
    {
        $this->info('Updating vehicle maintenance statuses...');

        $vehicles = Vehicle::with('maintenances')->get();
        $updated = 0;

        foreach ($vehicles as $vehicle) {
            $previousStatus = $vehicle->status;
            $vehicle->updateMaintenanceStatus();
            
            if ($vehicle->status !== $previousStatus) {
                $updated++;
                $this->info("Vehicle {$vehicle->vehicle_number}: {$previousStatus} → {$vehicle->status}");
            }
        }

        // Also update maintenance records that should be marked as in_progress
        $scheduledMaintenances = VehicleMaintenance::where('status', 'scheduled')
            ->where('scheduled_date', '<=', Carbon::today())
            ->get();

        foreach ($scheduledMaintenances as $maintenance) {
            $maintenance->update(['status' => 'in_progress', 'start_date' => Carbon::today()]);
            $maintenance->vehicle->updateMaintenanceStatus();
            $this->info("Started maintenance for vehicle {$maintenance->vehicle->vehicle_number}");
        }

        $this->info("Updated {$updated} vehicle statuses and processed " . $scheduledMaintenances->count() . " scheduled maintenances.");
        
        return Command::SUCCESS;
    }
}
