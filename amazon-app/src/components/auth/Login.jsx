import React, { useState, useEffect} from "react";
import axios from "../config/axios";
import { useNavigate } from "react-router-dom";

import { useForm } from "react-hook-form";
import Validation from "../../components/Validation";
import swal from 'sweetalert';

import { IMAGES } from "../../configurations/amazon_images";
import "./index.css";

function Login(){

    // initialisation de la variable de recuperation des champs et son setter
    const [userField, setUserField] = useState({
        remember: false,
        password: "",
        email:""
    });

    // initialisation de la variable de traitement des erreurs axios
    const [errors, setErrors] = useState({});

    const [userAuth, setUserAuth] = useState();

    const navigate = useNavigate();

    // Recuperation des champs modifies (event sur les champs)
    const changeUserFieldHandle = (e) => {

        // recuperation des contenus des champs dans la variable setUserField
        setUserField({
            ...userField,
            [e.target.name]: e.target.value
        });
        
    }

    const onSubmitChange = async (e) => {
        
        // on empeche la soumission par defaut        
        e.preventDefault();

        setErrors(Validation(userField));
        
        if(Object.keys(Validation(userField)).length === 0){

            // make request first to sanctum/csrf-cookie
            await axios.get("/sanctum/csrf-cookie").then(() => {

                const payload = {
                    remember: userField.remember,
                    email: userField.email,
                    password: userField.password
                };

                axios.post("/api/login", payload).then(res => {
                    
                    if(res.data.status === 200){
                        // on stocke le contenu de la variable "response" dans le localstorage
                        localStorage.setItem("Token", JSON.stringify(res.data.access_token));
                        localStorage.setItem("Expires_at", JSON.stringify(res.data.expires_token));
                        localStorage.setItem("loggedUser", JSON.stringify(res.data.user));
                        localStorage.setItem("user_adresse", JSON.stringify(res.data.user_adresse));

                        // on charge les informations de l'utilisateur connecte
                        setUserAuth(res.data.user);

                        swal("Succes", res.data.message, "success");
                        
                        navigate("/");
                    }

                }).catch(error => {
                    console.log(error);

                    
                });
            });
        }        
    }

    return(
        <>
            <div className="container-fluid">
                <div className="row">
                    <div className="login">
                        <img className="hide-bg image" src={IMAGES.amazonLogoForPages} alt="logo" />

                        <div className="form-border">
                            <header>S'identifier</header>
                            <div className="form">
                                <form className="login-form">
                                    <div className="form-group">
                                        <label htmlFor="email">Email</label>
                                        <input type="email" name="email" placeholder="Entrer votre adresse email" onChange={ e => changeUserFieldHandle(e) }/>
                                        {errors.email && <p style={{color:"red", marginBottom:"1%"}}>{errors.email}</p>}
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="password">Mot de passe</label>
                                        <input type="password" name="password" placeholder="********" onChange={ e => changeUserFieldHandle(e) } />
                                        {errors.password && <p style={{color:"red"}}>{errors.password}</p>}
                                    </div>

                                    <div className="form-group" style={{textAlign:'center'}}>
                                        <br/>
                                        <button type="submit" className="btn btn-primary btn-sm col-5" onClick={e => onSubmitChange(e)}>S'authentifier</button>
                                    </div>

                                    <label className="special-label">
                                        <input type="checkbox" className="rememberMe" id="rememberMe" name="rememberMe" onChange={ e => changeUserFieldHandle(e) }/>
                                        <i className="a-icon a-icon-checkbox"></i>
                                        <span className="a-label a-checkbox-label">Rester connecté</span>
                                    </label>
                                </form>

                                <p className="legal-info">
                                    En passant votre commande, vous acceptez les <a href="#">conditions générales de vente</a> d'Amazon. Veuillez consulter notre <a href="#">Notice Protection de vos informations personnelles</a>, notre <a href="#">Notice cookies</a> et notre <a href="#">Notice Annonces publicitaires basées sur vos centres d’intérêt</a>.
                                </p>

                                <div className="divider"></div>

                                <p className="buyforwork">
                                    Vous achetez pour votre entreprise ?{" "}
                                    <a href="#">Acheter sur Amazon Business</a>
                                </p>

                                <div className="divider"></div> 

                                <p className="register">
                                    Nouveau ? <a href="#">Créer un compte</a>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
        
    );

}

export default Login;