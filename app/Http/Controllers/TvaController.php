<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Tva;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Exception;

class TvaController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $user = Auth::user();
        
        $user_infos = User::where('id', $user->id)->first();
        
        if($user_infos){

            $tva = Tva::all();

            if($tva){

                return response()->json([
                    "status"=> 200,
                    "message" => "TVA chargées avec succès",
                    "tva" => $tva
                ]);
            }else{
                return response()->json([
                    "status"=> 404,
                    "message" => "TVA introuvable"
                ]);
            }
        }else{
            return response()->json([
                "status"=> 401,
                "message" => "Reconnetez-vous, votre session a expiré."
            ]);
        }   
    }

    public function getTva()
    {
        $user = Auth::user();
        
        $user_infos = User::where('id', $user->id)->first();
        
        if($user_infos){

            $tva = Tva::first();

            if($tva){

                return response()->json([
                    "status"=> 200,
                    "message" => "TVA chargées avec succès",
                    "tva" => $tva
                ]);
            }else{
                return response()->json([
                    "status"=> 404,
                    "message" => "TVA introuvable"
                ]);
            }
        }else{
            return response()->json([
                "status"=> 401,
                "message" => "Reconnetez-vous, votre session a expiré."
            ]);
        }   
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request){
        
        $user = Auth::user();
        
        $user_infos = User::where('id', $user->id)->first();
        
        if($user_infos){
            // validation des donnees
            $request->validate([
                "name" => "required|unique:tva,name",
                "taux" => "required|decimal:2|min:1.1"
            ]);

            try {
                // traitement des donnees
                $tva = new Tva();

                $tva->name = $request->name;
                $tva->taux = $request->taux;
                $tva->details = $request->details;
                $tva->created_at = now();

                $tva->save();

                return response()->json([
                    "status"=> 200,
                    "message" => "TVA ajouté avec succès."
                ]);
                
            } catch (Exception $e) {
                return response()->json([
                    "status"=> $e->getCode(),     
                    "message" => $e->getMessage()            
                ]);
            }
        }else{
            return response()->json([
                "status"=> 401,
                "message" => "Reconnetez-vous, votre session a expiré."
            ]);
        }
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit($id)
    {
        $user = Auth::user();
        
        $user_infos = User::where('id', $user->id)->first();
        
        if($user_infos){

            $tva = Tva::find($id);

            if($tva){

                return response()->json([
                    "status"=> 200,
                    "tva" => $tva
                ]);
            }else{

                return response()->json([
                    "status"=> 404,
                    "message" => "TVA introuvable."
                ]);
            }
        }else{

            return response()->json([
                "status"=> 401,
                "message" => "Reconnetez-vous, votre session a expiré."
            ]);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $user = Auth::user();
        
        $user_infos = User::where('id', $user->id)->first();
        
        if($user_infos){

            // validation des donnees
            $request->validate([
                "name" => "required",
                "taux" => "required|decimal:2|min:1.1"
            ]);

            try {
                // traitement des donnees
                $tva = Tva::find($id);

                $tva->update([
                    'name' => $request->name,
                    'taux' => $request->taux,
                    'details' => $request->details,
                    'updated_at' => now()
                ]);

                return response()->json([
                    "status"=> 200,
                    "message" => "TVA modifiée avec succès."
                ]);

            } catch (Exception $e) {

                return response()->json([
                    "status"=> $e->getCode(),     
                    "message" => $e->getMessage()            
                ]);
            }
        }else{

            return response()->json([
                "status"=> 401,
                "message" => "Reconnetez-vous, votre session a expiré."
            ]);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id){

        $user = Auth::user();
        
        $user_infos = User::where('id', $user->id)->first();
        
        if($user_infos){
            $tva = Tva::find($id);

            if($tva){
                $tva->delete();

                return response()->json([
                    "status"=> 200,
                    "message" => "TVA supprimée avec success."
                ]);

            }else{

                return response()->json([
                    "status"=> 404,
                    "message" => "TVA introuvable."
                ]);
            }
        }else{

            return response()->json([
                "status"=> 401,
                "message" => "Reconnetez-vous, votre session a expiré."
            ]);
        }
    }
}
