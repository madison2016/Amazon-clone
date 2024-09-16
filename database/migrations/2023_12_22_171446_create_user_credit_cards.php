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
        Schema::create('user_credit_cards', function (Blueprint $table) {
            $table->id();
            $table->foreignId("user_id");
            $table->string("num_card", 25);
            $table->string("nom_titulaire", 100);
            $table->string("code_securite", 4);
            $table->timestamp("expires_date");
            $table->timestamps();
            $table->foreign('user_id')->references('id')->on('users')->cascadeOnDelete()->cascadeOnUpdate();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('user_credit_cards');
    }
};
