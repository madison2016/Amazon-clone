<?php

namespace App\Http\Controllers;

use App\Models\Role;
use App\Models\Categorie;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\File;
use App\Models\User;
use Exception;

class CategorieController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(){

        // utilisateur connecte
        $user = Auth::user();

        // user profile
        $user_infos = User::where('id', $user->id)->first();

        // utilisateur connecte a t-il un compte admin/Seller ?
        if($user_infos->hasAnyRole(['Admin', 'Seller'])){

            $category = Categorie::all();

            if($category){
                return response()->json([
                    "status"=> 200,
                    "category" => $category
                ]);
            }else{

                return response()->json([
                    "status"=> 404,
                    "message" => "Aucune categorie enregistree"
                ]);
            }
        }else{
            return response()->json([
                "status"=> 401,
                "message" => "Vous devez au prealable, vous connecter."
            ]);
        }        
    }

    public function getCategory(){

        $category = Categorie::orderBy("name")->get();

            if($category){
                return response()->json([
                    "status"=> 200,
                    "category" => $category
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
                "name" => "required|unique:categories,name",
                "slug" => "required|max:150",
                "image" => "required|image|mimes:jpeg,png,jpg,gif,svg|max:2048",
                "frais_expedition" => "required|numeric"
            ]);
            

            try {                

                // ------------------ CATEGORIE SAVE -----------------
                $categorie = new Categorie();

                $categorie->name = $request->name;
                $categorie->slug = $request->slug;
                $categorie->frais_expedition = $request->frais_expedition;
                $categorie->description = $request->description;
                $categorie->available = $request->status == true ? "1" : "0";

                $categorie->meta_title = $request->meta_title;
                $categorie->meta_keywords = $request->meta_keywords;
                $categorie->meta_description = $request->meta_description;

                // -------------- IMAGE UPLOAD ---------------
                if($request->hasFile("image")){

                    $file = $request->file("image");
                    $extension =  $file->getClientOriginalExtension();

                    $filename = str_replace(" ","_",$request->name).".".$extension;

                    // check if image already exists
                    $path = "uploads/category/".$filename;

                    if(File::exists($path)){

                        // delete the old image
                        File::delete($path);
                    }

                    // then move the image to database
                    $file->move("uploads/category/", $filename);
                    $categorie->image = $path;
                }
                
                $categorie->save();

                return response()->json([
                    "status"=> 200,
                    "message" => $categorie->name." ajoute avec succes."
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
    public function show(){

        $category = Categorie::all();

        if($category){
            return response()->json([
                "status"=> 200,
                "categories" => $category
            ]);
        }else{

            return response()->json([
                "status"=> 404,
                "message" => "Aucune categorie enregistree"
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

            $categorie = Categorie::find($id);

            if($categorie){
                
                return response()->json([
                    "status"=> 200,
                    "category" => $categorie
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
    public function update(Request $request, $id){
        
        // utilisateur connecte
        $user = Auth::user();

        // user profile
        $user_infos = User::where('id', $user->id)->first();

        // utilisateur connecte a t-il un compte admin/Seller ?
        if($user_infos->hasAnyRole(['Admin', 'Seller'])){

            // validation des donnees envoyees
            $request->validate([
                "name" => "required",
                "slug" => "required|max:150",                
                "frais_expedition" => "required|numeric"
            ]);
            

            try {                

                // ------------------ CATEGORIE UPDATE -----------------
                
                $category = Categorie::find($id);
              

                // -------------- IMAGE UPLOAD ---------------
                if($request->hasFile("image")){

                    // delete image from store folder
                    if(file_exists($category->image)){
                        unlink($category->image);
                    }

                    $file = $request->file("image");
                    $extension =  $file->getClientOriginalExtension();

                    $filename = str_replace(" ","_",$request->name).".".$extension;
                    
                    $file->move("uploads/category/", $filename);
                    $category->image = "uploads/category/".$filename;
                }
                
                $category->name = $request->name;
                $category->slug = $request->slug;
                $category->frais_expedition = $request->frais_expedition;
                $category->description = $request->description;

                $category->available = $request->available;
                $category->meta_title = $request->meta_title == null ? "" : $request->meta_title;
                $category->meta_keywords = $request->meta_keywords == null ? "" : $request->meta_keywords;
                $category->meta_description = $request->meta_description == null ? "" : $request->meta_description;

                $category->update();

                return response()->json([
                    "status"=> 200,
                    "message" => $category->name." mis a jour avec succes."
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
                "message" => "Vous devez au prealable, vous connecter."
            ]);    
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id){

        // utilisateur connecte
        $user = Auth("sanctum")->user();

        // user profile
        $user_infos = User::where('id', $user->id)->first();

        // utilisateur connecte a t-il un compte admin/Seller ?
        if($user_infos->hasAnyRole(['Admin', 'Seller'])){

            $categorie = Categorie::find($id);

            if($categorie){
                // suppression de la categorie de la BD
                $categorie->delete();

                return response()->json([
                    "status"=> 200,
                    "message" => "Categorie supprimee avec success."
                ]);
            }else{
                return response()->json([
                    "status"=> 404,
                    "message" => "La suppression a echoue, reessayez plutard."
                ]);
            } 
        }else{
            return response()->json([
                "status"=> 401,
                "message" => "Vous devez au prealable, vous connecter."
            ]);    
        }
    }
}
