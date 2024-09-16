import React, {useEffect, useState} from "react";
import axios from "../config/axios";
import { NavLink, useParams, useNavigate } from "react-router-dom";
import swal from 'sweetalert';
import Validation from "../Validation";
import hasExpires from "../config/verifTokenValidity";
import ListPays from "../config/listPays.json";
import formatDate from "../config/formatDate";

import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/customStyle.css";


function ViewProfile() {

    // pour tester la validite du token
    let currentUser = JSON.parse(localStorage.getItem("loggedUser")); 
    let tokenIsValid = hasExpires(JSON.parse(localStorage.getItem("Expires_at")));
      
    const [loading, setLoading] = useState(true);
    const [errors, setErrors] = useState([]);

    const [picture, setPicture] = useState();
    const [photoProfile, setPhotoProfile] = useState();

    const [profileValues, setProfileValues] = useState([]);

    const {id} = useParams();

    const navigate = useNavigate();

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

    useEffect(() => {

        // le token est t-il toujours valide ?
        if(tokenIsValid === false){
            
            navigate("/login");
        }else{              
                  
            // requete pour recuperer les infos du compte
            axios.get("/api/get-profile").then(res => {
                
                if(res.data.status === 200) {
                    
                    setProfileValues(res.data.profile);
                    
                }else if(res.data.status === 404){

                    swal("Warning", res.data.message, "warning");
                    navigate(`/add-profile/${id}`);
                }
            }).catch(error => {
                // Autre erreur
                swal("Error", `Erreur ${error.status}: ${error.message}`, "error");                    
            });
        }

    },[tokenIsValid]);

    var countryName = [];

    const UpdateProfile = (e) => {

        e.preventDefault();

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
                    adresse: profileValues.adresse
                };
                
                // traitement de l'image
                if(picture){
                    payload.image = picture.image;
                 }else if(profileValues.image){
                    payload.image = profileValues.image;
                 }else{
                    setPicture({image: "/uploads/icone-photo2.png"});
                 }
                 console.log(payload.image); 
                // requete pour enregistrer le profil dans la bd
                axios.post(`/api/update-profile/${profileValues.id}`, payload, {headers: { 'Content-Type': 'multipart/form-data' } }).then(res => {
                     
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
    }
    
    
    return (
        <div className="py-4">
            <div className="container-md">
                <div className="row">
                    <h2 className="p-2 mb-5 mt-0 bg-secondary" style={{margin:"3% 0"}}>
                        <NavLink to={`#`} className="btn btn-link-light btn-lg col-3 active text-white">Informations personnelles</NavLink>
                        <NavLink to={`/edit-params/${currentUser.id}`} className="btn btn-link-light btn-lg col-3 text-white">Paramètres de Sécurité</NavLink>
                        <NavLink to={`/view-portfolio/${currentUser.id}`} className="btn btn-link-light btn-lg col-3 text-white">Portefeuille</NavLink>
                        <NavLink to={`/view-abonnement/${currentUser.id}`} className="btn btn-link-light btn-lg col-3 text-white">Abonnements</NavLink>
                    </h2>

                    <div className="row">
                        <h2 className="bg-bg-light w-100 text-dark-50 text-center mb-2" style={{paddingBottom:"1%"}}>Votre profil</h2>

                        <div className="col-md-3 p-1 text-center">
                            <img src={profileValues.photo !== ''? `http://127.0.0.1:8000/${profileValues.photo}`:`/uploads/icone-photo2.png`} alt={profileValues.nom} style={{border:"1px solid grey", borderRadius:"50%", width:"70%", height:"17em", marginTop:"1.5%"}} />
                        </div>

                        <div className="col-md-9" style={{border:"none", padding:"1%"}}>
                            <div className="row">
                                <div className="col-sm-6 border-end">
                                    <div className="card" style={{border:"none"}}>
                                        <div className="card-body">
                                            <h5 className="card-title mb-2">
                                                <strong>Noms</strong>: <span style={{display:"inline", width:"fit-content", textTransform:"uppercase", fontSize:".95em"}}>{profileValues.prenom} {profileValues.nom}</span>
                                            </h5>

                                            <h5 className="card-title mb-2">
                                                <strong>Sexe</strong>: {profileValues.sexe === "m"? "Masculin":"Feminin"}
                                            </h5>

                                            <h5 className="card-title mb-2">
                                                <strong>Date naissance</strong>: {formatDate(profileValues.date_naissance)}
                                            </h5>
                                        </div>
                                    </div>
                                </div>
                    
                                <div className="col-sm-6 p-2">
                                    <div className="card" style={{border:"none"}}>
                                        <div className="card-body">
                                            <h5 className="card-title mb-2">
                                                {
                                                    ListPays.map((pays,i) =>{
                                                        if(ListPays[i].code === profileValues.pays){
                                                            countryName = <>{pays.name}</>
                                                        }
                                                    })
                                                }
                                                <strong>Pays</strong>: <span style={{display:"inline", width:"fit-content", textTransform:"uppercase"}}>{countryName}</span>
                                            </h5>

                                            <h5 className="card-title mb-2">
                                                <strong>Ville</strong>: {profileValues.ville}
                                            </h5>

                                            <h5 className="card-title mb-2">
                                                <strong>Telephone</strong>: <span className="col-md-12" style={{display:"inline", width:"fit-content", fontSize:".85em"}}>
                                                    {profileValues.phone} {profileValues.phone2 !== null? "  "+profileValues.phone2:""}
                                                </span>
                                            </h5>

                                            <h5 className="card-title mb-2">
                                                <strong>Adresse</strong>: {profileValues.adresse}
                                            </h5>                                        
                                        </div>
                                    </div>
                                </div>                                
                            </div>                                                                                   
                        </div>
                    </div>
                    <div className="col-md-12">
                        <div className="form-group text-end" style={{marginTop:"1%"}}>
                        <NavLink className="btn btn-link float-end" to="/">Retour à l'accueil</NavLink>                            
                            <button type="button" className="btn btn-primary col-sm-2 float-right" data-bs-toggle="modal" data-bs-target="#staticBackdrop">Mettre a jour</button>
                        </div>

                        <div className="modal fade" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                            <div className="modal-dialog modal-xl modal-dialog-centered">
                                <div className="modal-content">
                                    <div className="modal-header">
                                        <h1 className="modal-title fs-5" id="staticBackdropLabel">Mise a jour du profil de <span className="text-capitalize" style={{fontWeight:"bold"}}>{profileValues.prenom + " " + profileValues.nom}</span></h1>
                                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                    </div>

                                    <div className="modal-body">
                                        <div className="row">
                                            <div className="col-md-6">
                                                <div className="card" style={{border:"none", marginTop:"2%"}}>
                                                    <div className="card-body">
                                                        <div className="row">
                                                            <div className="col-md-6">
                                                                <div className="form-group mb-3">
                                                                    <label style={{fontWeight:"bold", display:"flex"}}>Prénoms</label>
                                                                    <input type="text" className="form-control" name="prenom" onChange={ e => profileHandle(e) } value={profileValues.prenom} />
                                                                    {errors.prenom && <p style={{color:"red", marginBottom:"0", textAlign:"left"}}>{errors.prenom}</p>}                
                                                                </div>
                                                            </div>

                                                            <div className="col-md-6">
                                                                <div className="form-group mb-3">
                                                                    <label style={{fontWeight:"bold", display:"flex"}}>Noms</label>
                                                                    <input type="text" className="form-control" name="nom" onChange={ e => profileHandle(e) } value={profileValues.nom} />
                                                                    {errors.nom && <p style={{color:"red", marginBottom:"0", textAlign:"left"}}>{errors.nom}</p>}                
                                                                </div>
                                                            </div>

                                                            <div className="col-md-6">
                                                                <div className="form-group mb-3">
                                                                    <label style={{fontWeight:"bold", display:"flex"}}>Date de naissance</label>
                                                                    <input type="date" className="form-control" name="date_naissance" onChange={ e => profileHandle(e) } value={profileValues.date_naissance} />
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
                                                                    <input type="text" className="form-control" name="ville" onChange={ e => profileHandle(e) } value={profileValues.ville} />
                                                                    {errors.ville && <p style={{color:"red", marginBottom:"0", textAlign:"left"}}>{errors.ville}</p>}                
                                                                </div>                                        
                                                            </div>

                                                            <div className="col-md-12 text-center">                                        
                                                                <div className="form-group mb-3">
                                                                    <label style={{fontWeight:"bold", display:"flex"}}>Photo</label>
                                                                    <input type="file" className="form-control" name="image" accept="image/*" onChange={ e => profileImageHandle(e) } />
                                                                    <img src={profileValues.photo !== ''? `http://127.0.0.1:8000/${profileValues.photo}`:`http://127.0.0.1:8000/icone-photo.png`} alt={profileValues.nom} style={{borderRadius:"50%", width:"50%", height:"15em", marginTop:"1.5%"}} />
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
                                                                    <input type="tel" className="form-control" name="phone" onChange={ e => profileHandle(e) } value={profileValues.phone}/>
                                                                    {errors.phone && <p style={{color:"red", marginBottom:"0", textAlign:"left"}}>{errors.phone}</p>}                
                                                                </div>                                        
                                                            </div>

                                                            <div className="col-md-6">
                                                                <div className="form-group mb-3">
                                                                    <label style={{fontWeight:"bold", display:"flex"}}>Phone 2</label>
                                                                    <input type="tel" className="form-control" name="phone2" onChange={ e => profileHandle(e) } value={profileValues.phone2 !== null ? profileValues.phone2 : undefined} placeholder="+(237)699999999"/>
                                                                    {errors.phone2 && <p style={{color:"red", marginBottom:"0", textAlign:"left"}}>{errors.phone2}</p>}                
                                                                </div>                                        
                                                            </div>

                                                            <div className="col-md-12">
                                                                <div className="form-group mb-3">
                                                                    <label style={{fontWeight:"bold", display:"flex"}}>Adresse</label>
                                                                    <textarea rows={5} style={{resize:"none"}} className="form-control" name="adresse" onChange={ e => profileHandle(e) } value={profileValues.adresse}></textarea>                
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>                                                                                
                                    </div>
                                    <div className="modal-footer">                                        
                                        <button type="button" className="btn btn-primary col-md-2" data-bs-dismiss="modal" onClick={UpdateProfile}>Modifier</button>
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
export default ViewProfile;