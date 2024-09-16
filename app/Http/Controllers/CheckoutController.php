<?php

namespace App\Http\Controllers;

use App\Models\CartShop;
use App\Models\Order;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Exception;

class CheckoutController extends Controller
{
    public function placeOrder(Request $request){

        $user = Auth::user();
        
        $user_infos = User::where('id', $user->id)->first();
        
        if($user_infos){

            // validation des donnees envoyees
            $request->validate([
                "name" => "required|min:5",
                "email" => "required|email",
                "phone" => "required|max:15"
            ]);

            
            try {

                // on enregistre la commande dans la bd
                $order = new Order();

                $order->user_id = $user_infos->id;
                $order->name = $request->name;
                $order->email = $request->email;
                $order->phone = $request->phone;
                $order->phone2 = $request->phone2;
                $order->pays = $request->pays;
                $order->adresse = $request->adresse;
                $order->boite_postale = $request->zip_code;

                $order->payment_mode = $request->payment_mode;
                $order->payment_id = $request->payment_id;
                
                $order->observations = $request->observations;
                $order->tracking_number = "com".rand(11111, 99999);
                $order->etat = "0";
                $order->created_at = now();

                $order->save();

                $cart = CartShop::where("user_id", $user_infos->id)->get();
                $orderitems = [];

                foreach($cart as $item){
                    $orderitems[] = [
                        "produit_id" => $item->produit_id,
                        "quantity" => $item->stock_quantity,
                        "selling_price" => $item->selling_price
                    ];
                }

                // on enregistre les produits de la commande
                $order->orderitems()->createMany($orderitems);

                // on supprime le panier du client
                CartShop::destroy($cart);
                
                return response()->json([
                    "status"=> 200,
                    "message" => "Commande ajoute avec success."
                ]);

            // on enregistre les articles de la commande
            } catch (Exception $e) {
                // something wrongs
                return response()->json([
                    "status"=> $e->getCode(),     
                    "message" => $e->getMessage()            
                ]);
            }
        }else{

            return response()->json([
                "status"=> 401,
                "message" => "Reconnectez-vous pour continuer."
            ]);
        }
    }
}
