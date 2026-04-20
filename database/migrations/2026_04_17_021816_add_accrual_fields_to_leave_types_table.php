<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('leave_types', function (Blueprint $table) {
            $table->boolean('is_accrual_based')->default(false)->after('is_active');
            $table->decimal('accrual_per_month', 5, 2)->default(0)->after('is_accrual_based');
            $table->decimal('max_balance', 5, 2)->default(0)->after('accrual_per_month');
        });
    }

    public function down(): void
    {
        Schema::table('leave_types', function (Blueprint $table) {
            $table->dropColumn(['is_accrual_based', 'accrual_per_month', 'max_balance']);
        });
    }
};
