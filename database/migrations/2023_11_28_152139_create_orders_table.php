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
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->foreignId("user_id");
            $table->string("payment_id", 150);
            $table->string("name", 255);
            $table->string("email", 255);
            $table->string("phone", 15);
            $table->string("phone2", 15);
            $table->string("pays", 25);
            $table->string("boite_postale", 100);
            $table->string("adresse", 150);
            $table->string("payment_mode", 100);
            $table->string("etat", 1);
            $table->string("observations", 255);
            $table->double("tracking_number", 15);
            $table->timestamps();
            $table->foreign('user_id')->references('id')->on('users')->cascadeOnDelete()->cascadeOnUpdate();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};
