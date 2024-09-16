import React, { useState } from "react";
import axios from "../../config/axios";
import { useNavigate } from "react-router-dom";
import swal from 'sweetalert';

import Validation from "../../Validation.jsx";
import "bootstrap/dist/css/bootstrap.min.css";




function AddCategory(){

    const [loading, setLoading] = useState(true);
    const [errors, setErrors] = useState({});
    const [picture, setPicture] = useState();
    const [CategoryInput, setCategoryInput] = useState({
        name: "",
        slug: "",
        frais_expedition: 10,
        description: "",
        status: false,
        meta_title: "",
        meta_keywords: "",
        meta_description: ""
    });

    const categoryHandle = (e) => {

        e.preventDefault();

        setCategoryInput({...CategoryInput, [e.target.name] : e.target.value });
    }

    // gestion des images
    const categoryImageHandle = (e) => {

        if(e.target.files && e.target.files.length > 0){
            setPicture({ image: e.target.files[0] });
        }
    }

    const SubmitCategory = (e) => {
        
        e.preventDefault();
        
        // make request first to sanctum/csrf-cookie
        axios.get('/sanctum/csrf-cookie').then(() => {

            const payload = {
                name: CategoryInput.name,
                slug: CategoryInput.slug,
                frais_expedition: CategoryInput.frais_expedition,
                status: CategoryInput.status,
                description: CategoryInput.description,

                meta_title: CategoryInput.meta_title,
                meta_keywords: CategoryInput.meta_keywords,
                meta_description: CategoryInput.meta_description,

                image: picture.image,
             };
             
            // requete pour enregistrer la categorie dans la bd
            axios.post('/api/add-category', payload, {headers: { 'Content-Type': 'multipart/form-data' } }).then(res => {
                
                 if(res.data.status === 200) {
                    swal("Succes", res.data.message, "success");

                    setCategoryInput({
                        name: "",
                        slug: "",
                        frais_expedition: 10,
                        description: "",
                        status: false,
                        meta_title: "",
                        meta_keywords: "",
                        meta_description: ""
                    });

                    setPicture("");
                }                
            }).catch(error => {
                
                if(error.status === 406){                    
                    // Error 404 = Category not found
                    swal("Error", "Impossible d'ajouter cette categorie. Ressayer plus tard.", "error");
                    navigate("/admin/view-category");
                 }else{
                    // erreur 401 = Unauthenticate
                    swal("Error", "Session expiree, reconnectez-vous", "error");
                    navigate("/login");
                 }
             });
         });        
    }    

    return (
        <div className="py-4">
            <div className="container">
                <div className="row">
                    <h3 style={{margin:"3% 0"}}>Ajout de Categories de Produits</h3>

                    <div className="col-md-7">
                        <div className="card">
                            <div className="card-header">
                                <h4>informations de base</h4>
                            </div>

                            <div className="card-body">
                                <div className="row" style={{border:"none"}}>
                                    <div className="col-md-12">
                                        <div className="form-group mb-3">
                                            <label style={{fontWeight:"bold", display:"flex"}}>Libelle</label>
                                            <input type="text" className="form-control" name="name" onChange={ e => categoryHandle(e) }/>
                                            {errors.name && <p style={{color:"red", marginBottom:"1%"}}>{errors.name}</p>}
                                        </div>
                                    </div>

                                    <div className="col-md-12">
                                        <div className="form-group mb-3">
                                            <label style={{fontWeight:"bold", display:"flex"}}>Etiquette</label>
                                            <input type="text" className="form-control" name="slug" onChange={ e => categoryHandle(e) }/>
                                            {errors.slug && <p style={{color:"red", marginBottom:"1%"}}>{errors.slug}</p>}
                                        </div>
                                    </div>

                                    <div className="col-md-6">
                                        <div className="form-group mb-3">
                                            <label style={{fontWeight:"bold", display:"flex"}}>Frais d'expedition</label>
                                            <input type="number" className="form-control" name="frais_expedition" onChange={ e => categoryHandle(e) } />
                                            <small className="text-danger"></small>
                                        </div>
                                    </div>

                                    <div className="col-md-12">
                                        <div className="form-group mb-3">
                                            <label style={{fontWeight:"bold", display:"flex"}}>Image</label>
                                            <input type="file" className="form-control" name="image" accept="image/*" onChange={ e => categoryImageHandle(e) } />
                                        </div>
                                    </div>

                                    <div className="col-md-12">
                                        <div className="form-group mb-3">
                                            <label style={{fontWeight:"bold", display:"flex"}}>Details</label>
                                            <textarea rows="4" style={{resize:"none"}} name="description" className="form-control" onChange={ e => categoryHandle(e) } value={CategoryInput.description}></textarea>
                                        </div>
                                    </div>

                                    <div className="col-md-12 text-start">
                                        <div className="form-group mb-3">
                                            <label style={{fontWeight:"bold", display:"flex"}}>Status</label>
                                            <input type="checkbox" className="status" id="status" name="status" onChange={ e => categoryHandle(e) } value={CategoryInput.status }/> Status 1=Show/0=Hidden
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="col-md-5">
                        <div className="card">
                            <div className="card-header">
                                <h4>Autres details</h4>
                            </div>

                            <div className="card-body">
                                <div className="row" style={{border:"none"}}>
                                    <div className="col-md-12">
                                        <div className="form-group mb-3">
                                            <label style={{fontWeight:"bold", display:"flex"}}>Meta-titre</label>
                                            <input className="form-control" type="text" name="meta_title" onChange={ e => categoryHandle(e) } value={CategoryInput.meta_title}/>
                                            <small className="text-danger"></small>
                                        </div>
                                    </div>

                                    <div className="col-md-12">
                                        <div className="form-group mb-3">
                                            <label style={{fontWeight:"bold", display:"flex"}}>Mots-cles</label>
                                            <textarea rows="2" style={{resize:"none"}} name="meta_keywords" className="form-control"  onChange={ e => categoryHandle(e) } value={CategoryInput.meta_keywords}></textarea>
                                            <small className="text-danger"></small>
                                        </div>
                                    </div>

                                    <div className="col-md-12">
                                        <div className="form-group mb-3">
                                            <label style={{fontWeight:"bold", display:"flex"}}>Meta-description</label>
                                            <textarea rows="4" style={{resize:"none"}} name="meta_description" className="form-control" onChange={ e => categoryHandle(e) } value={CategoryInput.meta_description}></textarea>
                                            <small className="text-danger"></small>
                                        </div>
                                    </div>

                                    <div className="col-md-12">
                                        <div className="form-group text-end">
                                        <button type="submit" className="btn btn-primary col-sm-3 float-right" onClick={SubmitCategory}>Ajouter</button>
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

export default AddCategory;