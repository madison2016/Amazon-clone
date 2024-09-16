<?php

namespace App\Http\Controllers;

//use App\Models\Profile;
use App\Models\Role;
use App\Models\User;
use DateTime;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    public function index(){

        $users =  User::all();

        return response()->json([
            "status_code" => 0,
            "message" => "ok",
            "results" => $users
        ], 200);

    }

    // to subscribe
    public function register(Request $request){

        //validation des donnees
        $request->validate([
            "name" => "required",
            "email" => "required|unique:users,email",
            "password" => "required|confirmed|min:8",
        ]);

        try {
            // traitement des donnees
            //-------------- 1- ENREGISTREMENT D'UN NOUVEL UTILISATEUR -----------------
            $user = new User();
            $user->name = $request->name;
            $user->email = $request->email;
            $user->password = Hash::make($request->password, ['rounds' => 12]);
            $user->save();

            // on recupere l'id correspondant au role <<customer>>
            $role = Role::where('name', 'Customer')->first();

            // on assigne le role au nouvel utilisateur
            $user->assignRole($role->id);
            
            // redirection vers login
            return response()->json([
                "status_code" => 0,
                "user" => $user,
                "message" => "Votre compte a ete cree avec succes. Un email de verification via l'adresse specifiee pour valider votre compte."
            ], 200);
        } catch (Exception $e) {

            return response()->json([
                "status"=> $e->getCode(),     
                "message" => $e->getMessage()            
            ]);
        }
    }

    public function login(Request $request){

        //validation des donnees
        $request->validate([
            "email" => "required|email|exists:users,email",
            "password" => "required",
        ]);

        // recuperer les infos de l'utilisateur s'il existe
        $user = User::where("email", $request->email)->first();

        if($user){
            if(Hash::check($request->password, $user->password)){
                $expires_at = new DateTime();
                $expires_at->modify("+120 minute");

                // creer un jeton/token                
                $token = $user->createToken("auth_token", ['*'], $expires_at)->plainTextToken;

                // recuperer l'adresse de l'utilisateur
                $adresse = User::find($user->id)->profile;
                
                // connexion reussie
                return response()->json([
                    "status" => 200,
                    "message" => "Connexion reussie",
                    "user" => $user,
                    "role_name" => $user->getRoleNames(),
                    "access_token" => $token,
                    "expires_token" => $expires_at,
                    "user_adresse" => $adresse
                ]);

            }else{
                return response()->json([
                    'status' => 401,
                    'message' => 'Mot de passe incorrect'
                ]);
            }
        }else{
            return response()->json([
                'status' => 404,
                'message' => 'Compte inexistant'
            ]);
        }
    }

    public function logout(){

        //on recupere l'utilisateur connecte
        $user = Auth::user();
        $user->tokens()->delete();

        // on invalide le token
        $expires_at = new DateTime();
        $expires_at->modify("-2880 minutes");        

        // deconnexion reussie
        return response()->json([
            "status" => 200,
            "message" => "Deconnexion reussie, veuillez rafraichir votre page.",
            "expires_token" => $expires_at
        ]);
    }

    public function updateUsername(Request $request, $id){

        //validation des donnees
        $request->validate([
            "name" => "required"
        ]);

        try {
            // traitement des donnees
            $user = User::find($id);            

            if(!$user){

                return response()->json([
                    "status" => 404,
                    "message" => "Compte utilisateur inexistant.",
                ]);
            }else{

                $user->name = $request->name;
                $user->updated_at = now();
                $user->save(); 
    
                return response()->json([
                    "status" => 200,
                    "message" => "Nom d'utilisateur modifié avec succes."
                ]);
            }            
        } catch (Exception $e) {

            // echec de mise a jour
            return response()->json([
                "status"=> $e->getCode(),     
                "message" => $e->getMessage()            
            ]);
        }
    }

    public function updateEmail(Request $request, $id){

        //validation des donnees
        $request->validate([
            "email" => "required|email"
        ]);

        try {
            // traitement des donnees
            $user = User::find($id);            

            if(!$user){

                return response()->json([
                    "status" => 404,
                    "message" => "Compte utilisateur inexistant.",
                ]);
            }else{

                $user->email = $request->email;
                $user->updated_at = now();
                $user->save(); 
    
                return response()->json([
                    "status" => 200,
                    "message" => "Adresse email modifiée avec succes."
                ]);
            }            
        } catch (Exception $e) {

            // echec de mise a jour
            return response()->json([
                "status"=> $e->getCode(),     
                "message" => $e->getMessage()            
            ]);
        }
    }

    public function updatePassword(Request $request, $id){

        //validation des donnees
        $request->validate([
            "password" => "required|confirmed|min:8"
        ]);

        try {
            // traitement des donnees
            $user = User::find($id);            

            if(!$user){

                return response()->json([
                    "status" => 404,
                    "message" => "Compte utilisateur inexistant.",
                ]);
            }else{

                $user->password = Hash::make($request->password, ['rounds' => 12]);
                $user->updated_at = now();
                $user->save(); 
    
                return response()->json([
                    "status" => 200,
                    "message" => "Mot de passe reinitialisé modifié avec succes."
                ]);
            }            
        } catch (Exception $e) {

            // echec de mise a jour
            return response()->json([
                "status"=> $e->getCode(),     
                "message" => $e->getMessage()                            
            ]);
        }
    }

    public function show($id){

        try {
            // traitement des donnees
            $user = User::find($id);

            if(!$user){
                return response()->json([
                    "status_code" => 0,
                    "message" => "Utilisateur inexistant.",
                ], 404);
            }

            return response()->json([
                "status_code" => 1,
                "user" => $user
            ], 200);
        } catch (Exception $e) {

            return response()->json([
                "status"=> $e->getCode(),     
                "message" => $e->getMessage()            
            ]);
        }
    }

    public function getUserAccount(){

        $user = Auth::user();

        $account_found = User::find($user->id);

        if(!$account_found){

            return response()->json([
                "status" => 404,
                "message" => "Compte utilisateur inexistant",
            ]);
        }else{

            // user roles
            $user_roles = DB::table('model_has_roles')
                ->join('roles', 'model_has_roles.role_id', '=', 'roles.id')
                ->where("model_has_roles.model_id", "=", $user->id)
                ->select('roles.*')
                ->get();

            return response()->json([
                "status" => 200,
                "user_account" => $account_found,
                "user_roles" => $user_roles,
                "id" => $user->id
            ]);
        }
        
    }

    public function edit($id){

        try {
            // traitement des donnees
            $user = User::find($id)->get();

            if(!$user){
                return response()->json([
                    "status_code" => 0,
                    "message" => "Utilisateur inexistant.",
                ], 404);
            }

            return response()->json([
                "status_code" => 1,
                "user" => $user
            ], 200);
        } catch (Exception $e) {

            return response()->json([
                "status"=> $e->getCode(),     
                "message" => $e->getMessage()            
            ]);
        }
    }

    public function destroy($id){

        try {
            // traitement des donnees
            $user = User::find($id)->get();

            if(!$user){
                return response()->json([
                    "status_code" => 0,
                    "message" => "Utilisateur inexistant.",
                ], 404);
            }

            $user->delete();

            return response()->json([
                "status_code" => 1,
                "message" => "Utilisateur supprime avec succes.",
            ]);
        } catch (Exception $e) {

            return response()->json([
                "status"=> $e->getCode(),     
                "message" => $e->getMessage()            
            ]);
        }
    }
}
