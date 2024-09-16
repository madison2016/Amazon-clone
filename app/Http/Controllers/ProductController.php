<?php

namespace App\Http\Controllers;

use App\Models\Categorie;
use App\Models\Shop;
use App\Models\Product;
use Spatie\Permission\Models\Role;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\File;
use App\Models\User;
use Exception;

class ProductController extends Controller {
    /**
     * Display a listing of the resource.
     */
    public function index(){
        
        $products = Product::orderBy("categorie_id")->get();

        if($products){
            
            return response()->json([
                "status" => 200,
                "produits" => $products
            ]);
        }else{

            return response()->json([
                "status" => 404,
                "message" => "Aucun article trouve"
            ]);
        }
    }

    public function getSingle($id){
        
        $product = Product::where("id", $id)
                            ->where("status", "1")
                            ->first();

        if($product){
            
            return response()->json([
                "status" => 200,
                "result" => $product
            ]);
        }else{

            return response()->json([
                "status" => 404,
                "message" => "Produit introuvable."
            ]);
        }
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
                "name" => "required|unique:produits,name",
                "image" => "required|image|mimes:jpeg,png,jpg,gif,svg|max:2048",
                "selling_price" => "required|numeric|min:100",
                "unit_price" => "required|numeric|min:100"
            ]);
            

            try {                

                // ------------------ PRODUCT SAVE -----------------
                $produit = new Product();

                $produit->name = $request->name;
                $produit->packing_unit = $request->packing_unit;
                $produit->nature = $request->nature;                
                $produit->description = $request->description;

                $produit->selling_price = $request->selling_price;
                $produit->unit_price = $request->unit_price;
                $produit->stock_quantity = $request->stock_quantity;
                $produit->alert_level = $request->alert_level;
                $produit->boutique_id = $request->boutique_id;
                $produit->categorie_id = $request->categorie_id;

                $produit->status = "1";
                $produit->created_at = now();

                // -------------- IMAGE UPLOAD ---------------
                if($request->hasFile("image")){

                    $file = $request->file("image");
                    $extension =  $file->getClientOriginalExtension();

                    $filename = str_replace(" ","_",$request->name).".".$extension;

                    // check if image already exists
                    $filename = "uploads/product/".$filename;

                    if(File::exists($filename)){

                        // delete the old image
                        File::delete($filename);
                    }

                    // then move the image to database
                    $file->move("uploads/product/", $filename);
                    $produit->image = $filename;
                }
                
                $produit->save();

                return response()->json([
                    "status"=> 200,
                    "message" => $produit->name." ajoute avec succes."
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
                "message" => "Vous devez au prealable, vous connecter."
            ]);    
        }
    }

    /**
     * Display the specified resource.
     */
    public function show()
    {
        $produits = DB::table('produits')
                    ->join('categories', 'produits.categorie_id', '=', 'categories.id')
                    ->join('boutiques', 'produits.boutique_id', '=', 'boutiques.id')
                    ->select('produits.*', 'categories.name as category', 'boutiques.name as shop')
                    ->get();

        if($produits){

            return response()->json([
                "status"=> 200,
                "products" => $produits
            ]);
        }else{

            return response()->json([
                "status"=> 404,
                "message" => "Products no found."
            ]);
        }
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit($id)
    {
        // utilisateur connecte
        $user = Auth::user();

        // user profile
        $user_infos = User::where('id', $user->id)->first();

        // utilisateur connecte a t-il un compte admin/Seller ?
        if($user_infos->hasAnyRole(['Admin', 'Seller'])){

            $produit = Product::find($id);

            if($produit){
                
                return response()->json([
                    "status"=> 200,
                    "product" => $produit
                ]);
            }else{
                return response()->json([
                    "status"=> 404,
                    "message" => "Categorie introuvable."
                ]);
            } 
        }else{
            return response()->json([
                "status"=> 401,
                "message" => "Vous devez au prealable, vous connecter."
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
                "selling_price" => "required|numeric|min:100",
                "unit_price" => "required|numeric|min:100",
                "stock_quantity" => "required|numeric|min:10",
                "alert_level" => "required|numeric|min:10"
            ]);            

            try {                

                // ------------------ PRODUCT UPDATE -----------------
                
                $produit = Product::find($id);

                // -------------- IMAGE UPLOAD ---------------
                if($request->hasFile("image")){

                    // delete image from store folder
                    if(file_exists($request->image)){
                        unlink($request->image);
                    }

                    $file = $request->file("image");
                    $extension =  $file->getClientOriginalExtension();

                    $filename = str_replace(" ","_",$request->name).".".$extension;
                    
                    $file->move("uploads/product/", $filename);
                    $produit->image = "uploads/product/".$filename;
                }
                
                $produit->name = $request->name;
                $produit->packing_unit = $request->packing_unit;
                $produit->nature = $request->nature;                
                $produit->description = $request->description;

                $produit->selling_price = $request->selling_price;
                $produit->unit_price = $request->unit_price;
                $produit->stock_quantity = $request->stock_quantity;
                $produit->alert_level = $request->alert_level;
                $produit->boutique_id = $request->boutique_id;
                $produit->categorie_id = $request->categorie_id;
                
                $produit->updated_at = now();

                $produit->update();

                return response()->json([
                    "status"=> 200,
                    "message" => $produit->name." mis a jour avec succes."
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

        $produit = Product::find($id);
        
        if($produit){            
            
            // utilisateur connecte = Admin (droit de suppression)
            if($user_infos->hasExactRoles(['Admin', 'Guest', 'Customer', 'Seller'])){

                // -------------- DELETE IMAGE FROM PUBLIC FOLDER ---------------
                $filename = $produit->image;

                if(File::exists($filename)){
                    // delete image
                    File::delete($filename);
                }
                // on supprime le produit
                $produit->delete();
            }
            
            if($user_infos->hasExactRoles('Seller')){

                // on modifie son statut de visibilite du produit
                $produit->status = "0";

                $produit->update();         
            }
            
            return response()->json([
                "status"=> 200,
                "message" => "Produit supprimee avec success du catalogue."
            ]);

        }else{
            // Product not found
            return response()->json([
                "status"=> 404,
                "message" => "Produit a supprimer introuvable."
            ]);
        }
    }

    /**
     * Show the form for creating a new resource.
     */
    public function foundProduct(Request $request){
        
        // on a specifie les params de recherche
        if($request->category_id != null){
            //$num = 1;
            // on a specifie une categorie et la designation du produit
            if(!empty($request->produit_name)){

                $produits = DB::table('produits')
                        ->join('categories', 'produits.categorie_id', '=', 'categories.id')
                        ->join('boutiques', 'produits.boutique_id', '=', 'boutiques.id')
                        ->select('produits.*', 'categories.name as category', 'boutiques.name as shop')
                        ->where('categories.id', '=', $request->category_id)
                        ->where('produits.name', 'LIKE', '%'.$request->produit_name.'%')
                        ->orderBy('produits.categorie_id')
                        ->orderBy('produits.name')
                        ->get();
                        
                        
            }else{

                // par defaut on liste tous les produits attaches a la categorie specifiee
                $produits = DB::table('produits')
                        ->join('categories', 'produits.categorie_id', '=', 'categories.id')
                        ->join('boutiques', 'produits.boutique_id', '=', 'boutiques.id')
                        ->select('produits.*', 'categories.name as category', 'boutiques.name as shop')
                        ->where('categories.id', '=', $request->category_id)
                        ->orderBy('produits.categorie_id')
                        ->orderBy('produits.name')
                        ->get();
            } 

        }else{      // chargement par defaut
            
            $produits = DB::table('produits')
                        ->join('categories', 'produits.categorie_id', '=', 'categories.id')
                        ->join('boutiques', 'produits.boutique_id', '=', 'boutiques.id')
                        ->select('produits.*', 'categories.name as category', 'boutiques.name as shop')
                        ->orderBy('produits.categorie_id')
                        ->orderBy('produits.name')
                        ->get();
        }

        if($produits){

            return response()->json([
                "status"=> 200,
                "produits" => $produits
            ]); 
        }else{
            
            // Product not found
            return response()->json([
                "status"=> 404,
                "message" => "Aucun produit ne correspondant a vos criteres de recherche."
            ]);
        }
    }

}
