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
        Schema::table('user_credit_cards', function (Blueprint $table) {
            $table->dropColumn('expires_date');
            $table->string('date_expiration', 7)->after('code_securite')->nullable(false);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('user_credit_cards', function (Blueprint $table) {
            //
        });
    }
};
