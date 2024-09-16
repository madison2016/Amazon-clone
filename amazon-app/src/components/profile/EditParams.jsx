import React, { useEffect, useState } from "react";
import axios from "../config/axios";
import { NavLink, useParams, useNavigate } from "react-router-dom";
import swal from 'sweetalert';
import Validation from "../Validation";
import hasExpires from "../config/verifTokenValidity";
import ListPays from "../config/listPays.json";


import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/customStyle.css";

function EditParams() {

    // pour tester la validite du token
    let currentUser = JSON.parse(localStorage.getItem("loggedUser")); 
    let tokenIsValid = hasExpires(JSON.parse(localStorage.getItem("Expires_at")));
      
    const [loading, setLoading] = useState(true);
    const [errors, setErrors] = useState([]);
    const [securityParams, setSecurityParams] = useState([]);
    const [newSecurityParams, setNewSecurityParams] = useState([]);

    const {id} = useParams();

    const navigate =useNavigate();

    const securityParamsHandle = (e) => {
        e.persist();

        setNewSecurityParams({ ...newSecurityParams, [e.target.name]: e.target.value });
    }

    useEffect(() => {

        // le token est t-il toujours valide ?
        if(tokenIsValid === false){
            
            navigate("/login");
        }else{              
                  
            // requete pour recuperer les infos du compte
            axios.get("/api/get-profile").then(res => {
                
                if(res.data.status === 200) {
                    
                    setSecurityParams(res.data.profile);
                }else if(res.data.status === 404){

                    swal("Erreur", res.data.message, "error");
                }
            }).catch(error => {
                // Autre erreur
                swal("Error", `Erreur ${error.status}: ${error.message}`, "error");                    
            });
        }

    },[tokenIsValid]);


    const updateAccount = (e, action) => {

        e.preventDefault();

        let url_action = "";

        switch(action){

            case "pseudo":
                url_action = "/api/update-username/"+id;
                break;

            case "email":
                url_action = "/api/update-email/"+id;
                break;

            case "password":
                url_action = "/api/update-password/"+id;
                break;
        }

        // validation des champs de saisie
        setErrors(Validation(newSecurityParams));        
        console.log(errors);
        if(Object.keys(Validation(newSecurityParams)).length === 0){
            
            // make request first to sanctum/csrf-cookie
            axios.get('/sanctum/csrf-cookie').then(() => {
                
                const payload = {
                    name: newSecurityParams.name,
                    email: newSecurityParams.email,
                    password: newSecurityParams.password,
                    password_confirmation: newSecurityParams.password_confirmation
                }; 
                 
                // requete pour enregistrer le profil dans la bd
                axios.post(url_action, payload, {headers: { 'Content-Type': 'application/json' } }).then(res => {
                     console.log(res);    
                    if(res.data.status === 200) {
                        swal("Succes", res.data.message, "success");

                        setLoading(false);
                        navigate(`/view-profil/${id}`);
                    }

                    if(res.data.status === 401){
                        swal("Error", res.data.message,"error");
                    }

                    if(res.data.status === 422){
                        swal("Error", res.data.message,"error");
                    }
                }).catch(error => {
                    // Autre erreurs
                    console.log(error);
                    swal("Error", error.message, "error");                   
                });
            });
        }else{
            // erreur dans le format des donnees saisies
            swal("Error", errors, "error");
        }
    }

    
    return (
        <div className="py-4">
            <div className="container-md">
                <div className="row">
                    <h2 className="p-3 mb-5 mt-0 bg-secondary" style={{margin:"3% 0"}}>
                        <NavLink to={`/view-profile/${currentUser.id}`} className="btn btn-link-light btn-lg col-3 text-white">Informations personnelles</NavLink>
                        <NavLink to="#" className="btn btn-link-light btn-lg col-3 active text-white">Paramètres de Sécurité</NavLink>
                        <NavLink to={`/view-portfolio/${currentUser.id}`} className="btn btn-link-light btn-lg col-3 text-white">Portefeuille</NavLink>
                        <NavLink to={`/view-abonnement/${currentUser.id}`} className="btn btn-link-light btn-lg col-3 text-white">Abonnements</NavLink>
                    </h2>

                    <div className="row">
                    <h2 className="bg-bg-light w-100 text-dark-50 text-center mb-2" style={{paddingBottom:"1%"}}>Vos paramètres de sécurité</h2>
                        <div className="col-md-12 m-2" style={{border:"none", padding:"1%"}}>
                            <div className="row">
                                <div className="col-sm-4">
                                    <div className="card">
                                        <div className="card-body">
                                            <h5 className="card-title">Nom d'utilisateur</h5>
                                            <p className="card-text"><strong>{securityParams.pseudo}</strong></p>                                        
                                        </div>
                                        <div className="card-footer">
                                            <button type="button" className="btn btn-link" data-bs-toggle="modal" data-bs-target="#staticBackdrop-pseudo" data-bs-whatever="pseudo">Mettre a jour votre nom d'utilisateur</button>
                                        </div>
                                    </div>
                                </div>

                                <div className="col-sm-4">
                                    <div className="card">
                                        <div className="card-body">
                                            <h5 className="card-title">Email</h5>
                                            <p className="card-text"><strong>{securityParams.email}</strong></p>                                        
                                        </div>
                                        <div className="card-footer">
                                            <button type="button" className="btn btn-link" data-bs-toggle="modal" data-bs-target="#staticBackdrop-email" data-bs-whatever="email">Mettre a jour votre adresse email</button>
                                        </div>
                                    </div>
                                </div>

                                <div className="col-sm-4">
                                    <div className="card">
                                        <div className="card-body">
                                            <h5 className="card-title">Password</h5>
                                            <p className="card-text"><strong>******************</strong></p>                                        
                                        </div>
                                        <div className="card-footer">
                                            <button type="button" className="btn btn-link" data-bs-toggle="modal" data-bs-target="#staticBackdrop-secret" data-bs-whatever="secret">Reintialiser votre mot de passe</button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="modal fade" id="staticBackdrop-pseudo" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                                <div className="modal-dialog">
                                    <div className="modal-content">
                                        <div className="modal-header">
                                            <h1 className="modal-title fs-5" id="staticBackdropLabel">Mise à jour du nom d'utilisateur</h1>
                                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                        </div>

                                        <div className="modal-body">
                                            <div className="mb-3" id="pseudo">
                                                <label htmlFor="name" className="col-form-label">Pseudo:</label>
                                                <input type="text" name="name" className="form-control" onChange={ e => securityParamsHandle(e) } />
                                            </div>
                                        </div>

                                        <div className="modal-footer">
                                            <button type="button" className="btn btn-secondary col-sm-2" data-bs-dismiss="modal">Close</button>
                                            <button type="button" className="btn btn-primary col-sm-2" onClick={(e)=>updateAccount(e, "pseudo")}>Modifier</button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="modal fade" id="staticBackdrop-email" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                                <div className="modal-dialog">
                                    <div className="modal-content">
                                        <div className="modal-header">
                                            <h1 className="modal-title fs-5" id="staticBackdropLabel">Mise à jour de l'adresse email</h1>
                                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                        </div>

                                        <div className="modal-body">
                                            <div className="mb-3" id="pseudo">
                                                <label htmlFor="email" className="col-form-label">Email:</label>
                                                <input type="email" name="email" className="form-control" onChange={ e => securityParamsHandle(e) } />
                                            </div>
                                        </div>

                                        <div className="modal-footer">
                                            <button type="button" className="btn btn-secondary col-sm-2" data-bs-dismiss="modal">Close</button>
                                            <button type="button" className="btn btn-primary col-sm-2" onClick={(e)=>updateAccount(e, "email")}>Modifier</button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="modal fade" id="staticBackdrop-secret" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                                <div className="modal-dialog">
                                    <div className="modal-content">
                                        <div className="modal-header">
                                            <h1 className="modal-title fs-5" id="staticBackdropLabel">Mise à jour du mot de passe</h1>
                                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                        </div>

                                        <div className="mb-3" id="secret">
                                                <label htmlFor="password" className="col-form-label ml-4">mot de passe</label>
                                                <input type="password" name="password" className="form-control col-sm-11 ml-4" onChange={ e => securityParamsHandle(e) } />

                                                <label htmlFor="password_confirmation" className="col-form-label ml-4">Confirmation:</label>
                                                <input type="password" name="password_confirmation" className="form-control col-sm-11 ml-4" onChange={ e => securityParamsHandle(e) } />
                                            </div>

                                        <div className="modal-footer">
                                            <button type="button" className="btn btn-secondary col-sm-2" data-bs-dismiss="modal">Close</button>
                                            <button type="button" className="btn btn-primary col-sm-2" onClick={(e)=>updateAccount(e, "secret")}>Modifier</button>
                                        </div>
                                    </div>
                                </div>
                            </div>                                                        
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )

}
export default EditParams;