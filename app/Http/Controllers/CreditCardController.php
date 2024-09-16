<?php

namespace App\Http\Controllers;

use App\Models\CreditCard;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Exception;

class CreditCardController extends Controller
{
    public function store(Request $request){

        $user = Auth::user();

        // validation des donnees envoyees
        $request->validate([
            "card_model" => "required",
            "num_card" => "required|unique:user_credit_cards,num_card",
            "nom_porteur" => "required",
            "code_securite" => "required|numeric|min:4",
        ]);
        

        try {                

            // ------------------ CREDIT CARD SAVE LOGIC -----------------
            $credit_card = new CreditCard();

            $credit_card->user_id = $user->id;
            $credit_card->card_model = $request->card_model;
            $credit_card->num_card = $request->num_card;
            $credit_card->date_expiration = $request->expires_date;
            $credit_card->code_securite = $request->code_securite;
            $credit_card->nom_titulaire = $request->nom_porteur;                
            $credit_card->created_at = now();
            
            $credit_card->save();

            return response()->json([
                "status"=> 200,
                "message" => "Carte de credit ajoutee avec succes."
            ]);

        } catch (Exception $e) {
            
            return response()->json([
                "status"=> $e->getCode(),
                "message" => $e->getMessage()
            ]);
        }
    }

    public function index(){

        $user = Auth::user();

        $credit_card = CreditCard::where("user_id", $user->id)->get();

        if($credit_card){

            return response()->json([
                "status" => 200,
                "credit_cards" => $credit_card,
                "message" => "Mode de paiement par cartes bancaires existant."
            ]);            
        }else{

            return response()->json([
                "status" => 404,
                "message" => "Aucune carte de paiement pour cet utilisateur."
            ]);
        }
    }
}
