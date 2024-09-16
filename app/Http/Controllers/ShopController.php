<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\Shop;
use App\Models\User;
use App\Models\Role;
use Exception;

class ShopController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        // utilisateur connecte
        $user = Auth::user();

        // user profile
        $user_infos = User::where('id', $user->id)->first();

        // utilisateur connecte a t-il un compte admin/Seller ?
        if($user_infos->hasAnyRole(['Admin', 'Seller'])){

            if($user_infos->hasRole("Admin")){
                $shop = Shop::all();
            }

            if($user_infos->hasExactRoles("Seller")){
                $shop = Shop::where("user_id", $user->id)->get();
            }

            return response()->json([
                "status"=> 200,
                "shops" => $shop
            ]);
        }
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request){
        
        // utilisateur connecte
        $user = Auth::user();

        // user profile
        $user_infos = User::where('id', $user->id)->first();

        // utilisateur connecte a t-il un compte admin/Seller ?
        if($user_infos->hasAnyRole(['Admin', 'Seller'])){

            // validation des donnees envoyees
            $request->validate([
                "name" => "required|unique:boutiques,name",
                "email" => "required|email",
                "phone" => "required|min:10"
            ]);
            

            try {                

                // ------------------ SHOP SAVE -----------------
                $shop = new Shop();

                $shop->user_id = $user_infos->id;
                $shop->name = $request->name;                
                $shop->email = $request->email;
                $shop->phone = $request->phone;
                $shop->phone2 = $request->phone2;
                $shop->site_web = $request->site_web;
                $shop->zip_code = $request->zip_code;
                $shop->pays = $request->pays;
                $shop->adresse = $request->adresse;
                $shop->status = "0";
                $shop->created_at = now();
                
                $shop->save();

                return response()->json([
                    "status"=> 200,
                    "message" => " creer avec succes."
                ]);

            } catch (Exception $e) {
                return response()->json([
                    "status"=> 406,
                    "error" => $e
                ]);
            }
        }else{

            return response()->json([
                "status"=> 401,
                "user"=>$request,
                "message" => "Vous devez au prealable, vous connecter."
            ]);    
        }
    }

    /**
     * Display the specified resource.
     */
    public function show()
    {
        // utilisateur connecte
        $user = Auth::user();

        $stores = Shop::where("user_id", $user->id)->get();

        if($stores){

            return response()->json([
                "status"=> 200,
                "stores" => $stores
            ]);
        }else{

            return response()->json([
                "status"=> 404,
                "message" => "Aucune boutique pour ".$user->name
            ]);
        }
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit($id){

        // utilisateur connecte
        $user = Auth::user();

        // user profile
        $user_infos = User::where('id', $user->id)->first();

        // utilisateur connecte a t-il un compte admin/Seller ?
        if($user_infos->hasAnyRole(['Admin', 'Seller'])){

            $shop = Shop::find($id);

            if($shop){
                
                return response()->json([
                    "status"=> 200,
                    "shop" => $shop
                ]);
            }else{
                return response()->json([
                    "status"=> 404,
                    "message" => "Boutique introuvable."
                ]);
            } 
        }else{
            return response()->json([
                "status"=> 401,
                "message" => "Votre session a expiree, reconnectez-vous."
            ]);    
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        // utilisateur connecte
        $user = Auth::user();

        // user profile
        $user_infos = User::where('id', $user->id)->first();

        // utilisateur connecte a t-il un compte admin/Seller ?
        if($user_infos->hasAnyRole(['Admin', 'Seller'])){

            // validation des donnees envoyees
            $request->validate([
                "name" => "required",
                "email" => "required|email",
                "phone" => "required|min:10"
            ]);            

            try {              

                // ------------------ CATEGORIE UPDATE -----------------
                
                $shop = Shop::find($id);                
                
                $shop->user_id = $user_infos->id;
                $shop->name = $request->name;                
                $shop->email = $request->email;
                $shop->phone = $request->phone;
                $shop->phone2 = $request->phone2;
                $shop->site_web = $request->site_web;
                $shop->zip_code = $request->zip_code;
                $shop->pays = $request->pays;
                $shop->adresse = $request->adresse;
                $shop->updated_at = now();

                $shop->update();

                return response()->json([
                    "status"=> 200,
                    "message" => $shop->name." mis a jour avec succes."
                ]);
            } catch (Exception $e) {
                
                // echec de mise a jour
                return response()->json([
                    "status"=> $e->getCode(),     
                    "message" => $e->getMessage()            
                ]);
            }
        }else{
            return response()->json([
                "status"=> 401,
                "message" => "Votre session a expire. Reconnectez-vous."
            ]);    
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        // utilisateur connecte
        $user = Auth("sanctum")->user();

        // user profile
        $user_infos = User::where('id', $user->id)->first();

        // utilisateur connecte a t-il un compte admin/Seller ?
        if($user_infos->hasAnyRole(['Admin', 'Seller'])){

            $shop = Shop::find($id);

            if($user_infos->hasRole("Admin")){
                // suppression de la boutique de la BD par l'admin
                $message = "Boutique supprimee";
                $shop->delete();
            }

            if($user_infos->hasExactRoles("Seller")){
                // on change le status de la boutique 
                $message = "Boutique fermee";
                $shop->status = "2";  // status 0=pending/1=open/2=close
                $shop->update();
            }

            return response()->json([
                "status"=> 200,
                "message" => $message
            ]);
        }else{
            return response()->json([
                "status"=> 403,
                "message" => "Vous n'etes pas autorise a acceder a cette ressource."
            ]);
        }
    }
}
