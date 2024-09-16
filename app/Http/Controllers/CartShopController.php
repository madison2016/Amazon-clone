<?php

namespace App\Http\Controllers;

use App\Models\CartShop;
use App\Models\Product;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class CartShopController extends Controller
{
    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $user = Auth::user();
        
        $user_infos = User::where('id', $user->id)->first();
        
        if($user_infos){

            $user_id = $user->id;
            $produit_id = $request->product_id;
            $produit_price = $request->product_price;
            $produit_image = $request->product_image;
            $produit_quantity = $request->product_quantity;

            $productFound = Product::where("id", $produit_id)->first();

            if($productFound){
                if(CartShop::where("produit_id", $produit_id)->where("user_id", $user_id)->exists()){
                    
                    return response()->json([
                        "status"=> 409,
                        "message" => $productFound->name." existe deja dans votre panier."
                    ]);
                }else{

                    $cartItem = new CartShop();

                    $cartItem->user_id = $user_id;
                    $cartItem->produit_id = $produit_id;
                    $cartItem->name = "Panier de ".$user->name;
                    $cartItem->image = $produit_image;
                    $cartItem->selling_price = $produit_price;
                    $cartItem->stock_quantity = $produit_quantity;
                    $cartItem->created_at = now();

                    $cartItem->save();

                    // decrement product stock
                    $productFound->stock_quantity = $productFound->stock_quantity - $produit_quantity;
                    $productFound->update();

                    return response()->json([
                        "status"=> 201,
                        "message" => $productFound->name." ajoute avec succes au panier."
                    ]);
                }                
            }else{

                return response()->json([
                    "status"=> 404,
                    "message" => "Produit introuvable."
                ]);
            }            
        }else{

            return response()->json([
                "status"=> 401,
                "message" => "Authentifiez-vous pour ajouter un produit au panier"
            ]);
        }
    }

    /**
     * Display the specified resource.
     */
    public function view(){

        $user = Auth::user();
        
        $user_infos = User::where('id', $user->id)->first();
        
        if($user_infos){
            //$cartItems = CartShop::where("user_id", $user_infos->id)->get();

            $cartItems = DB::table('cartshops')
                    ->join('produits', 'cartshops.produit_id', '=', 'produits.id')
                    ->select('cartshops.*', 'produits.name as designation', 'produits.stock_quantity as stock', 'produits.alert_level as nso')
                    ->get();

            return response()->json([
                "status"=> 200,
                "cartshop" => $cartItems
            ]);
        }else{
            return response()->json([
                "status"=> 401,
                "message" => "Authentifiez-vous pour consulter votre panier"
            ]);
        }
    }

    /**
     * Display the specified resource.
     */
    public function updatequantity($id, $prod_id, $scope){

        $user = Auth::user();
        
        $user_infos = User::where('id', $user->id)->first();
        
        if($user_infos){

            $cartItem = CartShop::where('id', $id)->where('user_id', $user_infos->id)->first();

            $produit = Product::where('id', $prod_id)->first();
        
            if($scope == "inc"){
                // incremente la quantite du panier
                $cartItem->stock_quantity += 1;

                // decremente le stock du produit
                $produit->stock_quantity -= 1; 
            }else{
                // decremente la quantite du panier
                $cartItem->stock_quantity -= 1;

                // incremente le stock du produit
                $produit->stock_quantity += 1;
            }

            // update cartshop product quantity
            $cartItem->update();

            // update product stock quantity
            $produit->update();

            return response()->json([
                "status"=> 200,
                "message" => "Quantite modifiee avec succes."
            ]);

        }else{

            return response()->json([
                "status"=> 401,
                "message" => "Authentifiez-vous pour continuer"
            ]);
        }
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function deleteCartitem($id){

        $user = Auth::user();
        
        $user_infos = User::where('id', $user->id)->first();
        
        if($user_infos){
            $cartItem = $cartItem = CartShop::where('id', $id)->where('user_id', $user_infos->id)->first();

            if($cartItem){
                // mouvementer le stock
                $produit = Product::where('id', $cartItem->produit_id)->first();
                $produit->stock_quantity += $cartItem->stock_quantity;
                $produit->update();
                
                // suppression de la ligne du panier
                $cartItem->delete();



                return response()->json([
                    "status"=> 200,
                    "message" => "Ligne panier supprimee avec success."
                ]);

            }else{

                return response()->json([
                    "status"=> 404,
                    "message" => "Ligne panier introuvable."
                ]);
            }

        }else{

            return response()->json([
                "status"=> 401,
                "message" => "Authentifiez-vous pour continuer"
            ]);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
