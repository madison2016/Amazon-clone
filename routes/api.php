<?php

//use App\Http\Controllers\BecomeSellerController;

use App\Http\Controllers\BankAccountController;
use App\Http\Controllers\CartShopController;
use App\Http\Controllers\CategorieController;
use App\Http\Controllers\CheckoutController;
use App\Http\Controllers\CreditCardController;
use App\Http\Controllers\ShopController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\TvaController;
use App\Http\Controllers\UserController;
use App\Models\Shop;
//use App\Http\Controllers\UserProfileController;
//use App\Models\UserProfile;
use Illuminate\Foundation\Auth\EmailVerificationRequest;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
//use Illuminate\Foundation\Auth\EmailVerificationRequest;
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

//*************************ROUTES FOR EVERYONE *********************** */


// test
Route::get('/test', function(){
    return ('test');
});

// inscription
Route::post('/register', [UserController::class, 'register']);

// login
Route::post('/login', [UserController::class, 'login']);

// afficher la liste des categories produit pour la page d'accueil
Route::get('/get-category', [CategorieController::class, 'getCategory']);

// afficher le catalogue produits sur la Home Page
Route::get('/show-products', [ProductController::class, 'show']);

// afficher le catalogue produits en fonction de criteres de recherche sur la Home Page 
Route::post('/find-products', [ProductController::class, 'foundProduct']);

// afficher le produit selectionne
Route::get('/show-product/{id}', [ProductController::class, 'getSingle']);




//********************** ROUTES FOR ONLY AUTHENTIFY USERS ******************************************************* */

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

// Protection de certaines routes
Route::get('/profile', function () {
    // Only verified users may access this route...
})->middleware(['auth', 'verified']);


//*************************ROUTES EXCLUSIVEMENT RESERVEES AUX UTILISATEURS AUTHENTIFIES *********************** */

Route::group(['middleware' => ['auth:sanctum']], function() {
    
//*********************** TVA ********************************* */

    // creer une tva
    Route::post('/add-tva', [TvaController::class, 'store']);

    // afficher la liste des tva
    Route::get('/view-tva', [TvaController::class, 'index']);

    // afficher la liste des tva
    Route::get('/edit-tva/{id}', [TvaController::class, 'edit']);

    // recuperer la tva pour facturation commande
    Route::get('/get-tva', [TvaController::class, 'getTva']);

    // supprimer une tva
    Route::patch('/update-tva/{id}', [TvaController::class, 'update']);

    // supprimer une tva
    Route::delete('/delete-tva/{id}', [TvaController::class, 'destroy']);



    //*********************** CATEGORY ********************************* */

    // creer une categorie produit
    Route::post('/add-category', [CategorieController::class, 'store']);
    
    // afficher la liste des categories produit
    Route::get('/view-category', [CategorieController::class, 'index']);    

    // afficher la liste des categories produit
    Route::get('/show-category', [CategorieController::class, 'show']);
           
    // afficher la liste des categories produit
    Route::get('/edit-category/{id}', [CategorieController::class, 'edit']);

    // mise a jour d'une categorie produit
    Route::post('/update-category/{id}', [CategorieController::class, 'update']);

    // Suppression d'une categorie
    Route::delete('/delete-category/{id}', [CategorieController::class, 'destroy']);


    //*********************** SHOP ********************************* */

    // creer une boutique
    Route::post('/add-shop', [ShopController::class, 'store']);

    // afficher la liste des boutiques
    Route::get('/view-shop', [ShopController::class, 'index']);

    // afficher la liste des boutiques
    Route::get('/show-shop', [ShopController::class, 'show']);

    // editer une boutique specifique
    Route::get('/edit-shop/{id}', [ShopController::class, 'edit']);

    // suppression d'une boutique
    Route::delete('/delete-shop/{id}', [ShopController::class, 'destroy']);

    // mise a jour d'une boutique
    Route::post('/update-shop/{id}', [ShopController::class, 'update']);

    //*********************** PRODUCTS ********************************* */

    // creer un produit
    Route::post('/add-product', [ProductController::class, 'store']);

    // creer un produit
    Route::get('/view-product', [ProductController::class, 'index']);

    // creer un produit
    Route::get('/edit-product/{id}', [ProductController::class, 'edit']);

    // modifier un produit
    Route::post('/update-product/{id}', [ProductController::class, 'update']);

    // supprimer un produit
    Route::delete('/delete-product/{id}', [ProductController::class, 'destroy']);


//************************** CART-SHOP ************************************** */


    // ajout d'un produit dans le panier
    Route::post('/add-cartshop', [CartShopController::class, 'store']);

    // ajout d'un produit dans le panier
    Route::get('/view-cartshop', [CartShopController::class, 'view']);

    // update cartshop quantity
    Route::patch('/cartshop-updatequantity/{cart_id}/{art_id}/{scope}', [CartShopController::class, 'updatequantity']);

    // supprimer une ligne du panier
    Route::delete('/delete-cart-item/{cart_id}', [CartShopController::class, 'deleteCartitem']);


    //************************** ORDERS ************************************** */

    // enregistre une commande
    Route::post('/place-order', [CheckoutController::class, 'placeOrder']);

    //************************** USERS ************************************** */

    // deconnexion de l'utilisateur
    Route::post('/logout', [UserController::class, 'logout']);

    // mise a jour du nom d'utilisateur
    Route::post('/update-username/{id}', [UserController::class, 'updateUsername']);

    // mise a jour du nom d'utilisateur
    Route::post('/update-email/{id}', [UserController::class, 'updateEmail']);

    // mise a jour du nom d'utilisateur
    Route::post('/update-password/{id}', [UserController::class, 'updatePassword']);

    // recuperer les infos du compte utilisateur
    Route::get('/account-user', [UserController::class, 'getUserAccount']);

    // enregistrer un profil utilisateur
    Route::post('/add-profile', [ProfileController::class, 'store']);

    // afficher un profil utilisateur
    Route::get('/get-profile', [ProfileController::class, 'getProfile']);

    // mise a jour du profil utilisateur
    Route::post('/update-profile/{id}', [ProfileController::class, 'update']);

    // ajout compte bancaire utilisateur
    Route::post('/add-user-bank-account', [BankAccountController::class, 'store']);

    // ajout carte de credit utilisateur
    Route::post('/add-user-credit-card', [CreditCardController::class, 'store']);

    // recuperer les cartes de credit utilisateur
    Route::get('/view-user-credit-card', [CreditCardController::class, 'index']);

    // recuperer les cartes de credit utilisateur
    Route::get('/view-user-bank-account', [BankAccountController::class, 'index']);

    

    
    

    //*************************EMAIL MANAGE ******************************************* */

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

    // obtenir les infos de l'utilisateur connecte
    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    Route::get('/profile', function () {
        // Only verified users may access this route...
    })->middleware(['auth', 'verified']);
  });


