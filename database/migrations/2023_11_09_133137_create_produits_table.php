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
        Schema::create('produits', function (Blueprint $table) {
            $table->id();
            $table->foreignId("boutique_id");
            $table->foreignId("categorie_id");
            $table->string("name", 255);            
            $table->string("packing_unit", 50);
            $table->string("nature", 50);
            $table->string("status", 1);
            $table->string("image", 255);            
            $table->longText("description");
            $table->double("selling_price")->default(10);
            $table->double("unit_price")->default(10);
            $table->double("stock_quantity")->default(5);            
            $table->double("alert_level")->default(10);
            $table->timestamps();
            $table->foreign('boutique_id')->references('id')->on('boutiques')->cascadeOnDelete()->cascadeOnUpdate();
            $table->foreign('categorie_id')->references('id')->on('categories')->cascadeOnDelete()->cascadeOnUpdate();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('produits');
    }
};
