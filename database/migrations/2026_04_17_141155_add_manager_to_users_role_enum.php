<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // SQLite stores enums as CHECK constraints; we must recreate the column.
        // Drop the old check and re-add as a plain string (validated in app layer).
        DB::statement('PRAGMA foreign_keys = OFF');

        DB::statement("
            CREATE TABLE users_new AS SELECT * FROM users
        ");

        DB::statement('DROP TABLE users');

        DB::statement("
            CREATE TABLE users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name VARCHAR(255) NOT NULL,
                email VARCHAR(255) NOT NULL UNIQUE,
                email_verified_at TIMESTAMP NULL,
                password VARCHAR(255) NOT NULL,
                remember_token VARCHAR(100) NULL,
                created_at TIMESTAMP NULL,
                updated_at TIMESTAMP NULL,
                company_id INTEGER NULL REFERENCES companies(id) ON DELETE SET NULL,
                employee_id INTEGER NULL REFERENCES employees(id) ON DELETE SET NULL,
                role VARCHAR(255) NOT NULL DEFAULT 'admin'
                    CHECK(role IN ('admin','hr','manager','employee'))
            )
        ");

        DB::statement('INSERT INTO users SELECT * FROM users_new');
        DB::statement('DROP TABLE users_new');
        DB::statement('PRAGMA foreign_keys = ON');
    }

    public function down(): void
    {
        DB::statement('PRAGMA foreign_keys = OFF');
        DB::statement("CREATE TABLE users_new AS SELECT * FROM users");
        DB::statement('DROP TABLE users');
        DB::statement("
            CREATE TABLE users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name VARCHAR(255) NOT NULL,
                email VARCHAR(255) NOT NULL UNIQUE,
                email_verified_at TIMESTAMP NULL,
                password VARCHAR(255) NOT NULL,
                remember_token VARCHAR(100) NULL,
                created_at TIMESTAMP NULL,
                updated_at TIMESTAMP NULL,
                company_id INTEGER NULL REFERENCES companies(id) ON DELETE SET NULL,
                employee_id INTEGER NULL REFERENCES employees(id) ON DELETE SET NULL,
                role VARCHAR(255) NOT NULL DEFAULT 'admin'
                    CHECK(role IN ('admin','hr','employee'))
            )
        ");
        DB::statement('INSERT INTO users SELECT * FROM users_new');
        DB::statement('DROP TABLE users_new');
        DB::statement('PRAGMA foreign_keys = ON');
    }
};
