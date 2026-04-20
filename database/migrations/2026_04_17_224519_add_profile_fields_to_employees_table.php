<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('employees', function (Blueprint $table) {
            // Personal
            $table->string('middle_name')->nullable()->after('first_name');
            $table->string('gender')->nullable()->after('last_name');
            $table->string('civil_status')->nullable()->after('gender');
            $table->date('birthdate')->nullable()->after('civil_status');
            $table->string('nationality')->nullable()->after('birthdate');
            $table->text('address')->nullable()->after('nationality');
            $table->string('city')->nullable()->after('address');
            $table->string('province')->nullable()->after('city');
            $table->string('zip_code')->nullable()->after('province');

            // Contact
            $table->string('alternative_phone')->nullable()->after('phone');
            $table->string('personal_email')->nullable()->after('alternative_phone');

            // Bank
            $table->string('bank_name')->nullable()->after('personal_email');
            $table->string('bank_account_number')->nullable()->after('bank_name');
            $table->string('bank_account_name')->nullable()->after('bank_account_number');

            // Emergency contact
            $table->string('emergency_contact_name')->nullable()->after('bank_account_name');
            $table->string('emergency_contact_relationship')->nullable()->after('emergency_contact_name');
            $table->string('emergency_contact_phone')->nullable()->after('emergency_contact_relationship');
            $table->text('emergency_contact_address')->nullable()->after('emergency_contact_phone');
        });
    }

    public function down(): void
    {
        Schema::table('employees', function (Blueprint $table) {
            $table->dropColumn([
                'middle_name', 'gender', 'civil_status', 'birthdate', 'nationality',
                'address', 'city', 'province', 'zip_code',
                'alternative_phone', 'personal_email',
                'bank_name', 'bank_account_number', 'bank_account_name',
                'emergency_contact_name', 'emergency_contact_relationship',
                'emergency_contact_phone', 'emergency_contact_address',
            ]);
        });
    }
};
