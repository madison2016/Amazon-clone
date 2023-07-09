<?php

use App\Http\Controllers\StoreController;
use App\Http\Controllers\BecomeSellerController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\UserProfileController;
use Illuminate\Foundation\Auth\EmailVerificationRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/
// test
Route::get('/test', function(){
    return ('test');
});

// inscription
Route::post('register', [UserController::class, 'register']);

// connexion
Route::post('login', [UserController::class, 'login']);

// Groupe de routes protegees (uniquement pour les utilisateurs authentifies)
Route::group(['middleware' => ['auth:sanctum']], function() {

    // deconnexion de l'utilisateur  
    Route::post('logout',   [UserController::class, 'logout']);

    // enregistrer informations de profil
    Route::post('/create_profil', [UserProfileController::class, 'create']);

    // mise a jour du profil
    Route::patch('/update_profil/{id}', [UserProfileController::class, 'update']);

    // detail du profil
    Route::get('/edit_profil/{id}', [UserProfileController::class, 'edit']);

    // delete profil
    Route::delete('/delete_profil/{id}', [UserProfileController::class, 'delete']);

    // verification email
    Route::get('/email/verify/{id}/{hash}', function (EmailVerificationRequest $request) {
        $request->fulfill();
        
        // on recupere les infos de l'utilisateur connecte
        $user = Auth::user();
    
        return response()->json([
            'message' => 'Votre email vient d\'etre verifie.',
            'datas' => $user
        ]);
    })->middleware(['auth', 'signed'])->name('verification.verify');

    // resend email for verification
    Route::post('/email/verification-notification', function (Request $request) {
        $request->user()->sendEmailVerificationNotification();
    
        return response()->json([
            'message' => 'Un nouveau email de verification vous a ete envoye'
        ]);
    })->middleware(['auth', 'throttle:6,1'])->name('verification.send');

    // devenir un vendeur 
    Route::post('/become_seller', [BecomeSellerController::class, 'createStore']);

    // creer un store pour un vendeur
    Route::post('/create_store', [StoreController::class, 'create']);

    // mise a jour du store (boutique)
    Route::patch('/update_store/{id}', [StoreController::class, 'update']);

    // fermeture du store (boutique) par son proprietaire
    Route::patch('/close_store/{id}', [StoreController::class, 'close']);

    // suppression du store (boutique) par l'administrateur
    Route::delete('/delete_store/{id}', [StoreController::class, 'delete']);

    // editer la liste des stores pour vendeur
    Route::get('/edit_store/{id}', [StoreController::class, 'edit']);

    // obtenir les infos de l'utilisateur connecte
    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    Route::get('/profile', function () {
        // Only verified users may access this route...
    })->middleware(['auth', 'verified']);
  });


