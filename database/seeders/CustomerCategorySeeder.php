<?php

namespace Database\Seeders;

use App\Models\CustomerCategory;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class CustomerCategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $categories = [
            [
                'name' => 'Residential Single Home',
                'description' => 'Individual residential properties with single households',
                'required_fields' => ['first_name', 'last_name', 'phone', 'address', 'city', 'area'],
                'optional_fields' => ['alternative_phone', 'notes'],
                'registration_fee' => 5000.00,
                'monthly_charge' => 15000.00,
                'payment_terms' => 'end_of_month',
                'send_sms_reminders' => true
            ],
            [
                'name' => 'Residential Estate',
                'description' => 'Large residential estates with multiple units or high-end properties',
                'required_fields' => ['first_name', 'last_name', 'phone', 'address', 'city', 'area', 'alternative_phone'],
                'optional_fields' => ['notes'],
                'registration_fee' => 10000.00,
                'monthly_charge' => 30000.00,
                'payment_terms' => 'end_of_month',
                'send_sms_reminders' => true
            ],
            [
                'name' => 'Small Business',
                'description' => 'Small commercial businesses requiring waste collection services',
                'required_fields' => ['first_name', 'last_name', 'phone', 'address', 'city', 'area', 'alternative_phone'],
                'optional_fields' => ['notes'],
                'registration_fee' => 7500.00,
                'monthly_charge' => 25000.00,
                'payment_terms' => 'upfront',
                'send_sms_reminders' => true
            ],
            [
                'name' => 'Corporate/Company',
                'description' => 'Large companies and corporate entities',
                'required_fields' => ['first_name', 'last_name', 'phone', 'address', 'city', 'area', 'alternative_phone'],
                'optional_fields' => ['notes'],
                'registration_fee' => 20000.00,
                'monthly_charge' => 50000.00,
                'payment_terms' => 'upfront',
                'send_sms_reminders' => true
            ],
            [
                'name' => 'Property Management Agency',
                'description' => 'Agencies managing multiple properties requiring coordinated services',
                'required_fields' => ['first_name', 'last_name', 'phone', 'address', 'city', 'area', 'alternative_phone'],
                'optional_fields' => ['notes'],
                'registration_fee' => 15000.00,
                'monthly_charge' => 40000.00,
                'payment_terms' => 'upfront',
                'send_sms_reminders' => true
            ],
            [
                'name' => 'Apartment Complex',
                'description' => 'Multi-unit residential buildings and apartment complexes',
                'required_fields' => ['first_name', 'last_name', 'phone', 'address', 'city', 'area', 'alternative_phone'],
                'optional_fields' => ['notes'],
                'registration_fee' => 12500.00,
                'monthly_charge' => 35000.00,
                'payment_terms' => 'end_of_month',
                'send_sms_reminders' => true
            ]
        ];

        foreach ($categories as $category) {
            CustomerCategory::updateOrCreate(
                ['name' => $category['name']], // Search criteria
                $category // Data to update/create
            );
        }
    }
}
