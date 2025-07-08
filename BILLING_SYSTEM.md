# Billing System Documentation

## Overview
The GCWM billing system provides automated invoicing and SMS reminders based on customer categories. Each category has its own pricing structure and payment terms.

## Features

### 1. Category-Based Billing
- **Registration Fee**: One-time fee charged when customer is approved
- **Monthly Charge**: Recurring monthly service fee
- **Payment Terms**: Either "Upfront" or "End of Month"
- **SMS Reminders**: Configurable per category

### 2. Automatic Invoice Generation
- **Initial Invoice**: Registration fee + first month charge (when customer approved)
- **Monthly Invoices**: Generated on last day of each month
- **Smart Logic**: Skips monthly invoice for customers registered in the same month

### 3. SMS Reminder System
- **Collection Reminders**: Sent the evening before collection day
- **Payment Reminders**: For overdue invoices
- **Configurable**: Can be enabled/disabled per category

## Usage

### Setting Up Categories
1. Navigate to Customer Management → Customer Categories
2. Create/Edit categories with:
   - Name and description
   - Required/optional fields
   - Registration fee and monthly charge
   - Payment terms (upfront/end of month)
   - SMS reminder settings

### Customer Billing Flow
1. **Customer Registration**: Customer created with category assigned
2. **Approval**: When approved, initial invoice automatically created
3. **Monthly Billing**: Automated via command scheduler
4. **SMS Reminders**: Automated based on collection schedule

### Available Commands

#### Generate Monthly Bills
```bash
# Generate for current month
php artisan billing:generate-monthly

# Generate for specific month/year
php artisan billing:generate-monthly --month=12 --year=2024
```

#### Send SMS Reminders
```bash
# Send reminders for all routes (tomorrow's collections)
php artisan sms:collection-reminders

# Send for specific route
php artisan sms:collection-reminders --route=1

# Send for specific date
php artisan sms:collection-reminders --date="2024-12-25"
```

### Recommended Cron Schedule
Add to your crontab or task scheduler:

```bash
# Generate monthly invoices on last day of month at 11 PM
0 23 28-31 * * php artisan billing:generate-monthly

# Send collection reminders daily at 6 PM
0 18 * * * php artisan sms:collection-reminders

# Mark overdue invoices daily at midnight
0 0 * * * php artisan billing:generate-monthly
```

## Category Examples

### Residential Categories
- **Single Home**: KES 5,000 registration, KES 15,000/month, end-of-month payment
- **Estate**: KES 10,000 registration, KES 30,000/month, end-of-month payment

### Commercial Categories  
- **Small Business**: KES 7,500 registration, KES 25,000/month, upfront payment
- **Corporate**: KES 20,000 registration, KES 50,000/month, upfront payment

### Property Management
- **Agencies**: KES 15,000 registration, KES 40,000/month, upfront payment
- **Apartments**: KES 12,500 registration, KES 35,000/month, end-of-month payment

## SMS Integration
Currently logs SMS messages. To enable actual SMS sending:

1. Choose provider (Twilio, Africa's Talking, etc.)
2. Update `SmsService.php` with provider integration
3. Add provider credentials to `.env`
4. Test with small batch before full deployment

## Billing Reports
The system provides billing summaries including:
- Total pending amounts
- Monthly revenue
- Overdue invoice counts
- Customer payment statistics

Access via the billing commands or create custom dashboard widgets.

## Security Notes
- All billing operations are logged
- Invoice generation is idempotent (safe to run multiple times)
- Customer approval triggers are event-based for reliability
- SMS logs contain customer data - ensure proper log rotation

## Troubleshooting

### Common Issues
1. **Invoices not generated**: Check customer has category assigned
2. **SMS not sending**: Verify category has SMS reminders enabled
3. **Duplicate invoices**: System prevents this automatically
4. **Missing initial invoice**: Ensure customer is approved after category assignment

### Debug Commands
```bash
# Check billing summary
php artisan billing:generate-monthly --month=12 --year=2024

# View recent logs
tail -f storage/logs/laravel.log | grep -i "billing\|sms"
```

## Future Enhancements
- Payment gateway integration
- Email invoicing
- Customer payment portal
- Advanced reporting dashboard
- Multi-currency support