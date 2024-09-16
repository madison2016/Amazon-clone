import React, { useEffect, useState } from "react";
import { NavLink, Navigate, useNavigate } from "react-router-dom";
import axios from "../../config/axios";
import ListPays from "../../config/listPays.json";

import swal from 'sweetalert';
import Validation from "../../Validation";

import "bootstrap/dist/css/bootstrap.min.css";
import hasExpires from "../../config/verifTokenValidity";


function AddStore() {
    // pour tester la validite du token
    let currentUser = JSON.parse(localStorage.getItem("loggedUser")); 
    let tokenIsValid = hasExpires(JSON.parse(localStorage.getItem("Expires_at"))); 

    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [isSelected, setIsSelected] = useState([]);
    const [errors, setErrors] = useState({});
    const [ShopInput, setShopInput] = useState({
        name: "",
        email: "",
        phone: "",
        phone2: "",
        site_web: "",
        zip_code: "",                    
        adresse: "",

        pays: "0",
    });
    

    const shopHandle = (e) => {
        e.persist();

        setShopInput({ ...ShopInput, [e.target.name]: e.target.value });
    }

    useEffect((e)=>{

        if(tokenIsValid === false){
            navigate("/login");
        }
    }, [tokenIsValid]);


    const SubmitShop = (e) => {

        e.preventDefault();       
        
        setErrors(Validation(ShopInput));    
        
        if(Object.keys(Validation(ShopInput)).length === 0){
            // make request first to sanctum/csrf-cookie
            axios.get('/sanctum/csrf-cookie').then(() => {

                const payload = {
                    name: ShopInput.name,
                    email: ShopInput.email,
                    phone: ShopInput.phone,
                    phone2: ShopInput.phone2 !== undefined ? ShopInput.phone2 : "",
                    site_web: ShopInput.site_web,
                    zip_code: ShopInput.zip_code,                    
                    adresse: ShopInput.adresse,
                    pays: ShopInput.pays

                };                    
                  
                // requete pour enregistrer la categorie dans la bd
                axios.post('/api/add-shop', payload, {headers: { 'Accept': 'application/json' } }).then(res => {
                    //console.log(res.data); 
                    if(res.data.status === 200) {
                        swal("Succes", res.data.message, "success");
                    }
                    
                    setShopInput({
                        name: "",
                        email: "",
                        phone: "",
                        phone2: "",
                        site_web: "",
                        zip_code: "",                    
                        adresse: "",
                        pays: "0",
                    });
                }).catch(error => {
                    // Erreur detectee pendant l'ajout dans la BD
                    swal("Error", `Erreur ${error.status}: ${error.message}`, "error");                    
                });
            });
        }else{
            // erreur dans le format des donnees saisies
            swal("Error", "Certains champs sont incorrects", "error");
        }
    }

    return (
        <div className="py-4">
            <div className="container">
                <div className="row">
                    <h3 style={{margin:"3% 0"}}>
                        Creation de boutique en ligne
                        <NavLink to={`/view-user-account/${currentUser.id}`} className="btn btn-warning btn-sm float-end">Afficher vos boutiques</NavLink>
                    </h3>
                    
                    <div className="col-md-7">
                        <div className="card">                           

                            <div className="card-body">
                                <div className="row" style={{border:"none"}}>
                                    <div className="col-md-12">
                                        <div className="form-group mb-3">
                                            <label style={{fontWeight:"bold", display:"flex"}}>Nom</label>
                                            <input type="text" className="form-control" name="name" onChange={ e => shopHandle(e) } value={ShopInput.name}/>
                                            {errors.name && <p style={{color:"red", marginBottom:"0", textAlign:"left"}}>{errors.name}</p>}
                                        </div>
                                    </div>

                                    <div className="col-md-12">
                                        <div className="form-group mb-3">
                                            <label style={{fontWeight:"bold", display:"flex"}}>Email</label>
                                            <input type="email" className="form-control" name="email" onChange={ e => shopHandle(e) } value={ShopInput.email}/>
                                            {errors.email && <p style={{color:"red", marginBottom:"0", textAlign:"left"}}>{errors.email}</p>}
                                        </div>
                                    </div>

                                    <div className="col-md-6">
                                        <div className="form-group mb-3">
                                            <label style={{fontWeight:"bold", display:"flex"}}>Phone</label>
                                            <input type="tel" className="form-control" name="phone" onChange={ e => shopHandle(e) } value={ShopInput.phone} placeholder="+(237)699999999" />
                                            {errors.phone && <p style={{color:"red", marginBottom:"0", textAlign:"left"}}>{errors.phone}</p>}
                                        </div>
                                    </div>

                                    <div className="col-md-6">
                                        <div className="form-group mb-3">
                                            <label style={{fontWeight:"bold", display:"flex"}}>Phone2</label>                                            
                                            <input type="tel" className="form-control" name="phone2" onChange={ e => shopHandle(e) } value={ShopInput.phone2} placeholder="+(237)699999999" />
                                        </div>
                                    </div>

                                    <div className="col-md-12">
                                        <div className="form-group mb-3">
                                            <label style={{fontWeight:"bold", display:"flex"}}>Site web</label>
                                            <input type="text" className="form-control" name="site_web" onChange={ e => shopHandle(e) } value={ShopInput.site_web}/>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="col-md-5">
                        <div className="card">
                            <div className="card-body">
                                <div className="col-md-12">
                                    <div className="form-group mb-3">
                                        <label style={{fontWeight:"bold", display:"flex"}}>Boite Postale</label>
                                        <input type="text" className="form-control" name="zip_code" onChange={ e => shopHandle(e) } value={ShopInput.zip_code}/>                                       
                                        {errors.zip_code && <p style={{color:"red", marginBottom:"0", textAlign:"left"}}>{errors.zip_code}</p>}
                                    </div>
                                </div>

                                <div className="col-md-12">
                                    <div className="form-group mb-3">
                                        <label style={{fontWeight:"bold", display:"flex"}}>Pays</label>
                                        <select className="form-control" name="pays" onChange={ e => shopHandle(e) } value={ShopInput.pays}>
                                            <option value="0">Selectionner votre pays</option>
                                            {
                                                ListPays.map((pays)=>{
                                                    return (
                                                        <option key={pays.code} value={pays.code}>{pays.name}</option>
                                                    )
                                                })
                                            }
                                        </select>                                        
                                        {errors.pays && <p style={{color:"red", marginBottom:"0", textAlign:"left"}}>{errors.pays}</p>}
                                    </div>
                                </div>

                                <div className="col-md-12">
                                    <div className="form-group mb-3">
                                        <label style={{fontWeight:"bold", display:"flex"}}>Adresse</label>
                                        <textarea rows={5} style={{resize:"none"}} className="form-control" name="adresse" onChange={ e => shopHandle(e) } value={ShopInput.adresse}></textarea>                
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-12">
                        <div className="form-group text-end" style={{marginTop:"1%"}}>
                            <button type="submit" className="btn btn-primary col-sm-3 float-right" onClick={SubmitShop}>Ajouter</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AddStore;