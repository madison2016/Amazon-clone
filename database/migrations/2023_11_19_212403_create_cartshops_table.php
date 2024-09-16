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
        Schema::create('cartshops', function (Blueprint $table) {
            $table->id();
            $table->foreignId("produit_id");
            $table->string("name", 255);
            $table->string("image", 255);
            $table->double("selling_price");
            $table->double("stock_quantity");
            $table->timestamps();
            $table->foreign('produit_id')->references('id')->on('produits')->cascadeOnDelete()->cascadeOnUpdate();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('cartshops');
    }
};
