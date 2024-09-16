<?php

namespace App\Http\Controllers;

use App\Models\Profile;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\File;
use Exception;

class ProfileController extends Controller{

    public function index(){

        // utilisateur connecte
        $user = Auth::user();

        // user profile
        $profile = DB::table('profiles')
                                ->join('users', 'profiles.user_id', '=', 'users.id')
                                ->select('profiles.*', 'users.name as pseudo', 'users.email as email', 'users.password as secret')
                                ->first();

        // utilisateur est t-il connecte ?
        if($profile){
            
            return response()->json([
                "status"=> 200,
                "profile" => $profile
            ]);
        }else{
            return response()->json([
                "status"=> 404,
                "message" => "Profil introuvable."
            ]);
        }        
    }

    public function getProfile(){

        // utilisateur connecte
        $user = Auth::user();

        // user profile
        $profile = DB::table('profiles')
                                ->join('users', 'profiles.user_id', '=', 'users.id')
                                ->where("profiles.user_id", "=", $user->id)
                                ->select('profiles.*', 'users.name as pseudo', 'users.email as email', 'users.password as secret')
                                ->first();

        // utilisateur est t-il connecte ?
        if($profile){
            
            return response()->json([
                "status"=> 200,
                "profile" => $profile
            ]);
        }else{
            return response()->json([
                "status"=> 404,
                "message" => "Vous devez complement les informations de votre profil."
            ]);
        }        
    }

    public function store(Request $request){

        // utilisateur connecte
        $user = Auth::user();

        // user profile
        $user_infos = User::where('id', $user->id)->first();

        // utilisateur est t-il connecte ?
        if($user_infos){

            // validation des donnees envoyees
            $request->validate([
                "nom" => "required|unique:profiles,nom",
                "image" => "required|image|mimes:jpeg,png,jpg,gif,svg|max:2048",
                "sexe" => "required",
                "date_naissance" => "required|date",
                "phone" => "required|min:10"
            ]);
            

            try {                

                // ------------------ PROFILE SAVE -----------------
                $profile = new Profile();
                $profile->user_id = $user_infos->id;
                $profile->nom = $request->nom;
                $profile->prenom = $request->prenom;
                $profile->date_naissance = $request->date_naissance;
                $profile->sexe = $request->sexe;                
                $profile->phone = $request->phone;
                $profile->phone2 = $request->phone2;
                $profile->adresse = $request->adresse;
                $profile->pays = $request->pays;

                $profile->created_at = now();

                // -------------- IMAGE UPLOAD ---------------
                if($request->hasFile("image")){

                    $file = $request->file("image");
                    $extension =  $file->getClientOriginalExtension();

                    $filename = str_replace(" ","_",$request->nom).".".$extension;

                    // check if image already exists
                    $filename = "uploads/avatar/".$filename;

                    if(File::exists($filename)){

                        // delete the old image
                        File::delete($filename);
                    }

                    // then move the image to database
                    $file->move("uploads/avatar/", $filename);
                    $profile->photo = $filename;
                }
                
                $profile->save();

                return response()->json([
                    "status"=> 200,
                    "message" => $profile->nom." créer avec succès."
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
                "message" => "Vous devez au préalable, vous connecter."
            ]);    
        }
    }

    public function update(Request $request, $id){

        // utilisateur connecte
        $user = Auth::user();

        // validation des donnees envoyees
        $request->validate([
            "nom" => "required",
            "sexe" => "required",
            "date_naissance" => "required|date",
            "phone" => "required|min:10"
        ]);
        

        try {                

            // ------------------ PROFILE SAVE -----------------
            $profile = Profile::find($id);

            $profile->user_id = $user->id;
            $profile->nom = $request->nom;
            $profile->prenom = $request->prenom;
            $profile->date_naissance = $request->date_naissance;
            $profile->sexe = $request->sexe;                
            $profile->phone = $request->phone;
            $profile->phone2 = $request->phone2;
            $profile->adresse = $request->adresse;
            $profile->pays = $request->pays;
            $profile->ville = $request->ville;

            $profile->updated_at = now();

            // -------------- IMAGE UPLOAD ---------------
            if($request->hasFile("image")){

                $file = $request->file("image");
                $extension =  $file->getClientOriginalExtension();

                $filename = str_replace(" ","_",$request->nom).".".$extension;

                // check if image already exists
                $filename = "uploads/avatar/".$filename;

                if(File::exists($filename)){

                    // delete the old image
                    File::delete($filename);
                }

                // then move the image to database
                $file->move("uploads/avatar/", $filename);
                $profile->photo = $filename;
            }
            
            $profile->save();

            return response()->json([
                "status"=> 200,
                "message" => "Le profil de ". $profile->nom." a été mis à jour avec succès."
            ]);

        } catch (Exception $e) {
            return response()->json([
                "status"=> $e->getCode(),
                "message" => $e->getMessage()
            ]);
        }
    }
}
