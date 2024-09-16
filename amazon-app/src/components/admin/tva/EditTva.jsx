import React, { useState, useEffect } from "react";
import axios from "../../config/axios";
import { NavLink, useParams, useNavigate } from "react-router-dom";
import swal from 'sweetalert';

import Validation from "../../Validation";
import "bootstrap/dist/css/bootstrap.min.css";
import hasExpires from "../../config/verifTokenValidity";

function EditTva() {

    // pour tester la validite du token
    let currentUser = JSON.parse(localStorage.getItem("loggedUser")); 
    let tokenIsValid = hasExpires(JSON.parse(localStorage.getItem("Expires_at")));

    const navigate = useNavigate();

    // initialisation du parametre a transmettre (id)
    const { id } = useParams();

    const [loading, setLoading] = useState();
    const [errors, setErrors] = useState([]);
    const [tvaValue, setTvaValue] = useState({
        name: "",
        taux: 1.1,
        details: "...",
    });

    const tvaHandle = (e) => {

        e.persist();

        setTvaValue({ ...tvaValue, [e.target.name]: e.target.value });
    }

    // le token est t-il valide ?
    useEffect(()=>{
        if(tokenIsValid === false){
            navigate("/login");
        }
    },[tokenIsValid]);

    useEffect(()=>{
        // make request first to sanctum/csrf-cookie
        axios.get('/sanctum/csrf-cookie').then(() => {                    
                            
            // requete pour charger la TVA selectionnée
            axios.get(`/api/edit-tva/${id}`).then(res => {
                            
                if(res.data.status === 200){
                    
                    // on charge la TVA dans la variable d'etat                    
                    setTvaValue(res.data.tva);                    
                   
                    setLoading(false);                    
                }else if(res.data.status === 404){

                    // Error 404 = TVA not found
                    swal("Erreur", res.data.message, "error");

                }else if(res.data.status === 401){
                    
                    // erreur 401 = Unauthenticate
                    swal("Erreur", res.data.message, "error");

                    navigate("/login");
                }

            }).catch(error => {

                // Autres erreurs
                swal("Error", `Erreur ${error.status}: ${error.message}`, "error");
            });
        });
    },[id]);

    const UpdateTva = (e, id) => {

        e.preventDefault();

        // validation des champs de saisie
        setErrors(Validation(tvaValue));        

        if(Object.keys(Validation(tvaValue)).length === 0){
            
            // make request first to sanctum/csrf-cookie
            axios.get('/sanctum/csrf-cookie').then(() => {
                
                const payload = {
                    name: tvaValue.name,
                    taux: tvaValue.taux,                    
                    details: tvaValue.details
                }; 
                  
                // requete pour enregistrer la tva dans la bd
                axios.patch(`/api/update-tva/${id}`, payload, {headers: { 'Accept': 'application/json' } }).then(res => {
                     
                    if(res.data.status === 200) {
                        swal("Succes", res.data.message, "success");                        

                        setTvaValue({
                            name: "",
                            taux: 1.1,                    
                            details: "..."
                        });

                        setLoading(false);

                        navigate("/admin/view-tva");
                    }else {
                        // somethings wrong when created procedure!
                        swal("Erreur", res.data.message, "error");
                    }
                });
            });
        }else{
            // erreur dans le format des donnees saisies
            swal("Erreur", errors, "error");
        }
    };

    return(
        <div className="py-4">
            <div className="container border-0">
                <div className="row border-0">
                    <h3 className="bg-body-secondary text-left" style={{margin:"3% 0", padding:"2% 1%", color:"black"}}>
                        Mise à jour de la TVA : <strong>{tvaValue.name}</strong>
                        <NavLink to={"/admin/view-tva"} className="btn btn-primary btn-sm float-end">Afficher vos TVA</NavLink>
                    </h3>
                    

                    <div className="col-md-12">

                        <div className="card">
                            <div className="card-body">
                                <div className="row" style={{border:"none"}}>
                                    <div className="col-md-6">
                                        <div className="form-group mb-3">
                                            <label style={{fontWeight:"bold", display:"flex"}}>Intitulé</label>
                                            <input className="form-control" type="text" name="name" onChange={ e => tvaHandle(e) } value={tvaValue.name}/>
                                            {errors.name && <p style={{color:"red", marginBottom:"0", textAlign:"left"}}>{errors.name}</p>}
                                        </div>
                                    </div>

                                    <div className="col-md-6">
                                        <div className="form-group mb-3">
                                            <label style={{fontWeight:"bold", display:"flex"}}>Taux (%)</label>
                                            <input className="form-control" type="number" name="taux" onChange={ e => tvaHandle(e) } value={tvaValue.taux}/>
                                            {errors.taux && <p style={{color:"red", marginBottom:"0", textAlign:"left"}}>{errors.taux}</p>}
                                        </div>
                                    </div>

                                    <div className="col-md-12">
                                        <div className="form-group mb-3">
                                            <label style={{fontWeight:"bold", display:"flex"}}>Details</label>
                                            <textarea rows="4" style={{resize:"none"}} name="details" className="form-control" onChange={ e => tvaHandle(e) } value={tvaValue.details}></textarea>
                                        </div>
                                    </div>

                                    <div className="col-md-12">
                                        <div className="form-group text-end">
                                        <button type="submit" className="btn btn-primary col-sm-3 float-right" onClick={ (e) => UpdateTva(e, tvaValue.id)}>Modifier</button>
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
export default EditTva;