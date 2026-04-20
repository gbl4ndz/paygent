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
        Schema::table('leave_requests', function (Blueprint $table) {
            $table->foreignId('manager_reviewed_by')->nullable()->constrained('users')->nullOnDelete()->after('review_notes');
            $table->timestamp('manager_reviewed_at')->nullable()->after('manager_reviewed_by');
            $table->text('manager_review_notes')->nullable()->after('manager_reviewed_at');
        });
    }

    public function down(): void
    {
        Schema::table('leave_requests', function (Blueprint $table) {
            $table->dropConstrainedForeignId('manager_reviewed_by');
            $table->dropColumn(['manager_reviewed_at', 'manager_review_notes']);
        });
    }
};
