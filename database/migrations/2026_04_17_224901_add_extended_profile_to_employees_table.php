<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('employees', function (Blueprint $table) {
            // Rename existing address → permanent address
            $table->renameColumn('address',  'permanent_address');
            $table->renameColumn('city',     'permanent_city');
            $table->renameColumn('province', 'permanent_province');
            $table->renameColumn('zip_code', 'permanent_zip_code');

            // Present address
            $table->text('present_address')->nullable()->after('permanent_zip_code');
            $table->string('present_city')->nullable()->after('present_address');
            $table->string('present_province')->nullable()->after('present_city');
            $table->string('present_zip_code')->nullable()->after('present_province');

            // Government IDs
            $table->string('sss_number')->nullable()->after('present_zip_code');
            $table->string('philhealth_number')->nullable()->after('sss_number');
            $table->string('pagibig_number')->nullable()->after('philhealth_number');
            $table->string('tin_number')->nullable()->after('pagibig_number');

            // Dependents stored as JSON array
            $table->json('dependents')->nullable()->after('tin_number');
        });
    }

    public function down(): void
    {
        Schema::table('employees', function (Blueprint $table) {
            $table->renameColumn('permanent_address',  'address');
            $table->renameColumn('permanent_city',     'city');
            $table->renameColumn('permanent_province', 'province');
            $table->renameColumn('permanent_zip_code', 'zip_code');

            $table->dropColumn([
                'present_address', 'present_city', 'present_province', 'present_zip_code',
                'sss_number', 'philhealth_number', 'pagibig_number', 'tin_number',
                'dependents',
            ]);
        });
    }
};
