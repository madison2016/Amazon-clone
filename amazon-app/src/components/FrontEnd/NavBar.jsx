import React, { useEffect, useState, useContext } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import axios from "../config/axios";
import hasExpires from "../config/verifTokenValidity";
import swal from "sweetalert";
import "bootstrap/dist/css/bootstrap.min.css";
import { IMAGES } from "../../configurations/amazon_images";

import "../styles/customStyle.css";
import { ProductsContext } from "../../Hooks/ProductsContext";


function FrontEndNavBar(){

    // pour tester la validite du token     
    let tokenIsValid = hasExpires(JSON.parse(localStorage.getItem("Expires_at")));

    // on initialise le context
    const [productTabs, setProductTabs] = useContext(ProductsContext);

    const [categorie, setCategorie] = useState([]);    
    const [produit, setProduit] = useState({
        categorie_prod: "0",
        designation: ""
    });

    const navigate = useNavigate();

    // on charge les categories de produits
    useEffect(()=>{

        axios.get(`/api/get-category`).then(res => {
            if(res.data.status === 200) {
                setCategorie(res.data.category);
           }
       });
    },[]);

    const produitInputHandle = (e) => {
        e.persist();

        setProduit({ ...produit, [e.target.name]: e.target.value });
    };

    // recherche d'un produit
    const handleSubmit = (e) => {

        e.preventDefault();

        setProductTabs({
            category_id: produit.categorie_prod,
            produit_name: produit.designation
        });
    };

    // deconnexion
    const logoutSubmit = (e) => {

        e.preventDefault();
        
        // requete pour recuperer toutes les categorie de la bd
        axios.post('/api/logout').then(res => {
            
            if(res.data.status === 200) {
                // on vide les localstorage
                localStorage.removeItem("loggedUser");
                localStorage.removeItem("Token");
                localStorage.setItem("Expires_at", JSON.stringify(res.data.expires_token));                    

                swal("Success", res.data.message, "success");
                navigate("/");
            }
        });
    };

    var welcomeUser = "";
    var currentUserAdresse = [];

    if(tokenIsValid){
        // on charge la variable localstorage de l'utilisateur
        let currentUser = JSON.parse(localStorage.getItem("loggedUser"));
        currentUserAdresse = JSON.parse(localStorage.getItem("user_adresse"));

        welcomeUser = 
            <li className="nav-item dropdown" style={{width:"15%"}}>
                    <NavLink className="nav-link dropdown-toggle" to="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                        Bonjour, <strong>{currentUser.name}</strong>
                        <br/>
                        Compte et listes
                    </NavLink>

                <ul className="dropdown-menu" style={{width:"25em", border:"1px solid #000", padding:"1% .5%"}}>
                    <li>
                        <NavLink className="btn btn-link" to={`/view-profile/${currentUser.id}`}>Gerer votre profil</NavLink>                                
                    </li>                                
                
                    <li><NavLink className="btn btn-link" to={`/view-user-account/${currentUser.id}`}>Votre Compte</NavLink></li>
                    <li><NavLink className="btn btn-link" to="#">Vos commandes</NavLink></li>
                    <li><NavLink className="btn btn-link" to={`/view-payment-mode/${currentUser.id}`}>Vos modes de paiement</NavLink></li>
                    <li><NavLink className="btn btn-link" to="#">Adhesions et abonnements</NavLink></li>                                
                    <li><button type="button" className="btn btn-link text-black" onClick={logoutSubmit}>Deconnexion</button></li>
                </ul>
            </li>
    }else{
        welcomeUser = 
            <li className="nav-item dropdown" style={{width:"15%"}}>
                <NavLink className="nav-link dropdown-toggle" to="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                    Bonjour, <strong>Identifiez-vous</strong>
                    <br/>
                    Compte et listes
                </NavLink>

                <ul className="dropdown-menu" style={{width:"25em", border:"1px solid #000", padding:"1% .5%"}}>
                    <li>
                        <div className="auth-connexion text-center" style={{marginTop:"1%"}}>
                            <NavLink className="btn btn-warning btn-sm" to="/login" style={{width:"50%", color:"#000"}}>
                                Identifiez-vous
                            </NavLink>
                            <br/><br/>
                            <small className="text-secondary" style={{marginTop:"2%", display:"inline-flex"}}>Nouveau client ? <NavLink to="/signup">commencer ici</NavLink></small>
                        </div>
                    </li>
                </ul>
            </li>
    }


    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
            <div className="container-fluid">
                <NavLink className="navbar-brand w-15" to="/">
                    <img src={IMAGES.amazonLogo} alt="logo" style={{width:"256px", height:"64px"}}/>
                </NavLink>

                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse" id="navbarNavDropdown">
                    <ul className="navbar-nav" style={{width:"98%"}}>
                        <li className="nav-item" style={{width:"15%"}}>
                            <NavLink className="nav-link active w-95" aria-current="page" to="#"><span className="text-white">{tokenIsValid? "Livrer à "+ currentUserAdresse.nom + " " + currentUserAdresse.adresse:"Votre adresse de livraison"}</span></NavLink>
                        </li>

                        <li className="nav-link w-95" style={{width:"59%"}}>
                            <div className="input-group mb-3" style={{width:"100%"}}>
                                <select name="categorie_prod" className="form-select btn-secondary w-25" id="inputGroupSelect01" style={{display:"inline-flex", minWidth:"10%", height:"3.15em"}} onChange={ e => produitInputHandle(e) } value={produit.categorie_prod}>
                                    <option value="0">Nos catégories</option>
                                    {
                                        categorie.map((item) => {

                                            return (
                                                <option key={item.id} value={item.id}>{item.name}</option>
                                            )
                                        })
                                    }
                                </select>
                                <input className="form-control p-4" type="search" name="designation" aria-label="default input example" style={{width:"60%", height:"3.15em"}} onChange={ e => produitInputHandle(e) } value={produit.designation}/>
                                <button type="submit" className="btn btn-warning" style={{backgroundColor:"#F3A847", width:"12%", height:"3.15em"}} onClick={handleSubmit}></button>
                            </div>
                        </li>                        

                        {welcomeUser}

                        <li className="nav-item"  style={{width:"13%"}}>
                            <NavLink className="nav-link" to="#">Retours et commandes</NavLink>
                        </li>

                        <li className="nav-item" style={{width:"15%"}}>
                            <NavLink className="nav-link active w-95" aria-current="page" to="#">Devenir vendeur</NavLink>
                        </li>

                        <li className="nav-item" style={{width:"13%"}}>
                            <NavLink className="nav-link" to="/cart-shopping">Votre Panier</NavLink>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    )
}
export default FrontEndNavBar;