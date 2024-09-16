import React, { useEffect, useState } from "react";
import axios from "../config/axios";
import { NavLink, useParams, useNavigate } from "react-router-dom";
import swal from 'sweetalert';
import Validation from "../Validation";
import hasExpires from "../config/verifTokenValidity";
import ListPays from "../config/listPays.json";


import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/customStyle.css";

function AddProfile() {

    // pour tester la validite du token
    let currentUser = JSON.parse(localStorage.getItem("loggedUser")); 
    let tokenIsValid = hasExpires(JSON.parse(localStorage.getItem("Expires_at")));
      
    const [loading, setLoading] = useState(true);
    const [errors, setErrors] = useState([]);

    const [picture, setPicture] = useState();
    const [photoProfile, setPhotoProfile] = useState();

    const [profileValues, setProfileValues] = useState({
        prenom: "",
        nom: "",
        date_naissance: "9999-12-31",
        sexe: "0",                    
        pays: "0",
        ville: "",
        phone: "",
        phone2: "",
        adresse:"..."
    });

    const navigate =useNavigate();

    const profileHandle = (e) => {
        e.persist();

        setProfileValues({ ...profileValues, [e.target.name]: e.target.value });
    }

    // gestion des images
    const profileImageHandle = (e) => {

        if(e.target.files && e.target.files.length > 0){
            setPhotoProfile({ image: e.target.files[0] });
            setPicture(e.target.files[0]);
        }
    }

    useEffect((e) => {
        // le token est t-il toujours valide ?
        if(tokenIsValid === false){
            navigate("/login");
        }

    },[tokenIsValid]);

    const SubmitProfile = (e) => {
        e.preventDefault();

        if(loading){
            return <h2>Patientez...</h2>
        }

        // validation des champs de saisie
        setErrors(Validation(profileValues));        

        if(Object.keys(Validation(profileValues)).length === 0){
            
            // make request first to sanctum/csrf-cookie
            axios.get('/sanctum/csrf-cookie').then(() => {
                
                const payload = {
                    prenom: profileValues.prenom,
                    nom: profileValues.nom,
                    date_naissance: profileValues.date_naissance,
                    sexe: profileValues.sexe,                    
                    pays: profileValues.pays,
                    ville: profileValues.ville,
                    phone: profileValues.phone,
                    phone2: profileValues.phone2 !== undefined ? profileValues.phone2 : "" ,
                    adresse: profileValues.adresse,

                    image: photoProfile.image

                }; 
                  
                // requete pour enregistrer le profil dans la bd
                axios.post('/api/add-profile', payload, {headers: { 'Content-Type': 'multipart/form-data' } }).then(res => {
                     
                    if(res.data.status === 200) {
                        swal("Succes", res.data.message, "success");

                        setLoading(false);

                        //navigate("/view-profil");
                    }

                    if(res.data.status === 401){
                        swal("Error", res.data.message,"error");
                    }

                    if(res.data.status === 422){
                        swal("Error", res.data.message,"error");
                    }
                }).catch(error => {
                    // Autre erreurs
                    swal("Error", `Erreur ${error.status}: ${error.message}`, "error");                   
                });
            });
        }else{
            // erreur dans le format des donnees saisies
            swal("Error", errors, "error");
        }
    };

    return(
        <div className="py-4">
            <div className="container-md">
                <div className="row">
                    <h2 className="p-2 mb-5 mt-0 bg-secondary" style={{margin:"3% 0"}}>
                        <NavLink to={"#"} className="btn btn-link-light btn-lg col-3 active text-white">Informations personnelles</NavLink>
                        <NavLink to={`/edit-params/${currentUser.id}`} className="btn btn-link-light btn-lg col-3 text-white">Paramètres de Sécurité</NavLink>
                        <NavLink to={`/view-portfolio/${currentUser.id}`} className="btn btn-link-light btn-lg col-3 text-white">Portefeuille</NavLink>
                        <NavLink to={`/view-abonnement/${currentUser.id}`} className="btn btn-link-light btn-lg col-3 text-white">Abonnements</NavLink>
                    </h2>

                    <h2 className="bg-bg-light w-100 text-dark-50 text-center mb-2" style={{paddingBottom:"1%"}}>Compléter votre profil</h2>

                    <div className="col-md-6">
                        <div className="card" style={{border:"none", marginTop:"2%"}}>
                            <div className="card-body">
                                <div className="row">
                                    <div className="col-md-6">
                                        <div className="form-group mb-3">
                                            <label style={{fontWeight:"bold", display:"flex"}}>Prénoms</label>
                                            <input type="text" className="form-control" name="prenom" onChange={ e => profileHandle(e) } value={profileValues.prenom} placeholder="entrez votre prenom"/>
                                            {errors.prenom && <p style={{color:"red", marginBottom:"0", textAlign:"left"}}>{errors.prenom}</p>}                
                                        </div>
                                    </div>

                                    <div className="col-md-6">
                                        <div className="form-group mb-3">
                                            <label style={{fontWeight:"bold", display:"flex"}}>Noms</label>
                                            <input type="text" className="form-control" name="nom" onChange={ e => profileHandle(e) } value={profileValues.nom} placeholder="entrez votre nom"/>
                                            {errors.nom && <p style={{color:"red", marginBottom:"0", textAlign:"left"}}>{errors.nom}</p>}                
                                        </div>
                                    </div>

                                    <div className="col-md-6">
                                        <div className="form-group mb-3">
                                            <label style={{fontWeight:"bold", display:"flex"}}>Date de naissance</label>
                                            <input type="date" className="form-control" name="date_naissance" onChange={ e => profileHandle(e) } value={profileValues.date_naissance} placeholder="2023-12-05"/>
                                            {errors.date_naissance && <p style={{color:"red", marginBottom:"0", textAlign:"left"}}>{errors.date_naissance}</p>}                
                                        </div>                                        
                                    </div>

                                    <div className="col-md-6">
                                        <div className="form-group mb-3">
                                            <label style={{fontWeight:"bold", display:"flex"}}>Sexe</label>
                                            <select className="form-control" name="sexe" onChange={ e => profileHandle(e) } value={profileValues.sexe}>
                                                <option value="0">Selectionnez votre sexe</option>
                                                <option value="m">Masculin</option>
                                                <option value="f">Féminin</option>                                                        
                                            </select>
                                            {errors.sexe && <p style={{color:"red", marginBottom:"0", textAlign:"left"}}>{errors.sexe}</p>}                                                                                       
                                        </div>
                                    </div>

                                    <div className="col-md-6">
                                        <div className="form-group mb-3">
                                            <label style={{fontWeight:"bold", display:"flex"}}>Pays</label>
                                            <select className="form-control" name="pays" onChange={ e => profileHandle(e) } value={profileValues.pays}>
                                                <option value="0">Sélectionner votre pays</option>
                                                {
                                                    ListPays.map((pays, idx)=>{
                                                        return (
                                                            <option key={idx} value={pays.code}>{pays.name}</option>
                                                        )
                                                    })
                                                }
                                            </select>                                        
                                            {errors.pays && <p style={{color:"red", marginBottom:"0", textAlign:"left"}}>{errors.pays}</p>}
                                        </div>
                                    </div>

                                    <div className="col-md-6">
                                        <div className="form-group mb-3">
                                            <label style={{fontWeight:"bold", display:"flex"}}>Ville</label>
                                            <input type="text" className="form-control" name="ville" onChange={ e => profileHandle(e) } value={profileValues.ville} placeholder="entrez votre ville de residence"/>
                                            {errors.ville && <p style={{color:"red", marginBottom:"0", textAlign:"left"}}>{errors.ville}</p>}                
                                        </div>                                        
                                    </div>

                                    <div className="col-md-7 text-center">                                        
                                        <div className="form-group mb-3">
                                            <label style={{fontWeight:"bold", display:"flex"}}>Photo</label>
                                            <input type="file" className="form-control" name="image" accept="image/*" onChange={ e => profileImageHandle(e) } />
                                            {picture ? (<img src={URL.createObjectURL(picture)} style={{display:"inline-flex", width:"256px", height:"256px", marginTop:"2%", border:"1px solid silver", borderRadius:"50%"}}/>) : (<img src="/uploads/icone-photo2.png" style={{display:"inline-flex", width:"256px", height:"256px", marginTop:"2%", border:"1px solid silver", borderRadius:"50%"}}/>)}
                                        </div>                                        
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="col-md-6">
                        <div className="card" style={{border:"none", marginTop:"2%"}}>
                            <div className="card-body">
                                <div className="row">                                   

                                    <div className="col-md-6">
                                        <div className="form-group mb-3">
                                            <label style={{fontWeight:"bold", display:"flex"}}>Phone</label>
                                            <input type="tel" className="form-control" name="phone" onChange={ e => profileHandle(e) } value={profileValues.phone} placeholder="+(237)699999999"/>
                                            {errors.phone && <p style={{color:"red", marginBottom:"0", textAlign:"left"}}>{errors.phone}</p>}                
                                        </div>                                        
                                    </div>

                                    <div className="col-md-6">
                                        <div className="form-group mb-3">
                                            <label style={{fontWeight:"bold", display:"flex"}}>Phone 2</label>
                                            <input type="tel" className="form-control" name="phone2" onChange={ e => profileHandle(e) } value={profileValues.phone2} placeholder="+(237)699999999"/>
                                            {errors.phone2 && <p style={{color:"red", marginBottom:"0", textAlign:"left"}}>{errors.phone2}</p>}                
                                        </div>                                        
                                    </div>

                                    <div className="col-md-12">
                                        <div className="form-group mb-3">
                                            <label style={{fontWeight:"bold", display:"flex"}}>Adresse</label>
                                            <textarea rows={5} style={{resize:"none"}} className="form-control" name="adresse" onChange={ e => profileHandle(e) } value={profileValues.adresse} placeholder="..."></textarea>                
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="col-md-12">
                        <div className="form-group text-end" style={{marginTop:"1%"}}>
                            <button type="submit" className="btn btn-primary col-sm-2 float-right" onClick={SubmitProfile}>Créer</button>
                        </div>
                    </div>
                    
                </div>
            </div>
        </div>
    )

}
export default AddProfile;