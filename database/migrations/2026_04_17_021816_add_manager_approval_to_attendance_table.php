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
        Schema::table('attendance', function (Blueprint $table) {
            // Manager approval stage (between employee submit and HR approval)
            $table->foreignId('manager_approved_by')->nullable()->constrained('users')->nullOnDelete()->after('rejection_notes');
            $table->timestamp('manager_approved_at')->nullable()->after('manager_approved_by');
            $table->text('manager_rejection_notes')->nullable()->after('manager_approved_at');
        });
    }

    public function down(): void
    {
        Schema::table('attendance', function (Blueprint $table) {
            $table->dropConstrainedForeignId('manager_approved_by');
            $table->dropColumn(['manager_approved_at', 'manager_rejection_notes']);
        });
    }
};
