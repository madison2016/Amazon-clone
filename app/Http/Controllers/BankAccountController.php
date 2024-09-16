<?php

namespace App\Http\Controllers;

use App\Models\BankAccount;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Exception;

class BankAccountController extends Controller
{
    public function store(Request $request){

        $user = Auth::user();

        // validation des donnees envoyees
        $request->validate([
            "code_bic" => "required",
            "code_iban" => "required|unique:user_bank_accounts,code_iban",
            "nom_titulaire" => "required"
        ]);
        

        try {                

            // ------------------ BANK ACCOUNT SAVE LOGIC -----------------
            $bank_account = new BankAccount();

            $bank_account->user_id = $user->id;
            $bank_account->code_bic = $request->code_bic;
            $bank_account->code_iban = $request->code_iban;
            $bank_account->nom_titulaire = $request->nom_titulaire;                
            $bank_account->created_at = now();
            
            $bank_account->save();

            return response()->json([
                "status"=> 200,
                "message" => "Mode de paiement ajoute avec succes."
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

        $bank_account = BankAccount::where("user_id", $user->id)->get();

        if($bank_account){

            return response()->json([
                "status" => 200,
                "bank_accounts" => $bank_account,
                "message" => "Compte bancaire existant."
            ]);            
        }else{

            return response()->json([
                "status" => 404,
                "message" => "Aucun compte bancaire pour cet utilisateur."
            ]);
        }
    }
}
