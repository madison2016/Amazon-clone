import React, { useState, useEffect } from "react";
import axios from "../../config/axios";
import { NavLink, useParams, useNavigate } from "react-router-dom";
import swal from 'sweetalert';

import Validation from "../../Validation.jsx";
import "bootstrap/dist/css/bootstrap.min.css";




function EditCategory(){

    const navigate = useNavigate();

    // initialisation du parametre a transmettre (id)
    const { id } = useParams();

    const [loading, setLoading] = useState(true);
    const [error, setErrors] = useState();
    const [picture, setPicture] = useState();
    const [isChecked, setIsChecked] = useState([]);
    const [CategoryInput, setCategoryInput] = useState({
        name: "",
        slug: "",
        frais_expedition: 10,
        description: "",
        meta_title: "",
        meta_keywords: "",
        meta_description: ""
    });

    const categoryHandle = (e) => {

        e.preventDefault();
        setCategoryInput({...CategoryInput, [e.target.name] : e.target.value });
    }

    // gestion du statut
    const handleCheckbox = (e) => {

        setIsChecked({...isChecked, [e.target.name] : e.target.checked});
    }

    // gestion des images
    const categoryImageHandle = (e) => {

        if(e.target.files && e.target.files.length > 0){
            setPicture({ image: e.target.files[0] });
        }
    }

    // N'execute cette fonction de chargement qu'au changement de parametre de categorie (id) 
    useEffect( (e) => {
        
        // make request first to sanctum/csrf-cookie
        axios.get('/sanctum/csrf-cookie').then(() => {
            
            // requete pour charger la categorie
            axios.get(`/api/edit-category/${id}`).then(res => {
                
                if(res.data.status === 200){
                    // on charge les categories dans la variable d'etat                    
                    setCategoryInput(res.data.category);
                    
                    // set category image
                    setPicture({ image: res.data.category.image });

                    // set category status                    
                    setIsChecked(res.data.category);
                    
                    // on arrete l'affichage du loading
                    setLoading(false);                    
                }
            }).catch(error => {
                 
                 if(error.status === 404){                    
                    // Error 404 = Category not found
                    swal("Error", "Categorie introuvable", "error");
                    navigate("/admin/view-category");
                 }else{
                    // erreur 401 = Unauthenticate
                    swal("Error", "Session expiree, reconnectez-vous", "error");
                    navigate("/login");
                 }
             });
         });

    }, [id]);

    // mise a jour de la categorie
    const UpdateCategory = (e, id) => {
        
        e.preventDefault();
        
        // make request first to sanctum/csrf-cookie
        axios.get('/sanctum/csrf-cookie').then(() => {
            
            const payload = {
                "name": CategoryInput.name,
                "slug": CategoryInput.slug,
                "frais_expedition": CategoryInput.frais_expedition,
                "description": CategoryInput.description,
                "meta_title": CategoryInput.meta_title,
                "meta_keywords": CategoryInput.meta_keywords,
                "meta_description": CategoryInput.meta_description,
                "available": isChecked.available ? "1" : "0"
             };

             if(picture.length > 0){
                payload.image = picture.image;
             }else if(CategoryInput.image){
                payload.image = CategoryInput.image;
             }else{
                setPicture({image: ""});
             }

            // requete pour recuperer la categorie dans la bd
            axios.post(`/api/update-category/${id}`, payload, {headers: { 'Accept': 'application/json', 'Content-Type': 'multipart/form-data' }}).then(res => {
                
                if(res.data.status === 200) {
                    swal("Succes", res.data.message, "success");
                    
                    setCategoryInput({
                        name: "",
                        slug: "",
                        frais_expedition: 10,
                        description: "",
                        meta_title: "",
                        meta_keywords: "",
                        meta_description: ""
                    });

                    //setPicture("Aucun fichier choisi");

                    navigate("/admin/view-category");
                }                
            }).catch(error => {

                if(error.status === 404){                    
                    // Error 404 = Category not found
                    swal("Error", "Categorie introuvable", "error");

                    navigate("/admin/view-category");
                 }else if(error.status === 401){
                    // erreur 401 = Unauthenticate
                    swal("Error", "Session expiree, reconnectez-vous", "error");

                    navigate("/login");
                 }else{
                    // autre erreur
                    swal("Error", error.message, "error");
                 }
             });
         });        
    }
    
    if(loading){
        return <h2>Chargement de la categorie a editer...</h2>
    }

    return (
        <div className="py-4">
            <div className="container">
                <div className="row">
                    <div className="col-md-12" style={{margin:"1.5% 0"}}>
                        <div className="card">
                            <div className="card-header">
                                <h3>
                                    Edition de la Categorie {""}
                                    <NavLink to="/admin/view-category" className="btn btn-warning btn-sm float-end">Afficher les categories</NavLink>
                                </h3>                                
                            </div>
                        </div>
                    </div>
                    
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
                                            <input type="text" className="form-control" name="name" onChange={ e => categoryHandle(e) } value={CategoryInput.name}/>
                                            <small className="text-danger"></small>
                                        </div>
                                    </div>

                                    <div className="col-md-12">
                                        <div className="form-group mb-3">
                                            <label style={{fontWeight:"bold", display:"flex"}}>Etiquette</label>
                                            <input type="text" className="form-control" name="slug" onChange={ e => categoryHandle(e) } value={CategoryInput.slug}/>
                                            <small className="text-danger"></small>
                                        </div>
                                    </div>

                                    <div className="col-md-6">
                                        <div className="form-group mb-3">
                                            <label style={{fontWeight:"bold", display:"flex"}}>Frais d'expedition</label>
                                            <input type="number" className="form-control" name="frais_expedition" onChange={ e => categoryHandle(e) } value={CategoryInput.frais_expedition}/>
                                            <small className="text-danger"></small>
                                        </div>
                                    </div>

                                    <div className="col-md-12">
                                        <div className="form-group mb-3">
                                            <label style={{fontWeight:"bold", display:"flex"}}>Image</label>
                                            <input type="file" className="form-control" name="image" accept="image/*" onChange={ e => categoryImageHandle(e) } />
                                            <img src={`http://127.0.0.1:8000/${CategoryInput.image}`} style={{display:"inline-flex", width:"128px", marginTop:"1.5%", border:"1px solid silver", borderRadius:"5px"}}/>
                                            <small className="text-danger"></small>
                                        </div>
                                    </div>

                                    <div className="col-md-12">
                                        <div className="form-group mb-3">
                                            <label style={{fontWeight:"bold", display:"flex"}}>Details</label>
                                            <textarea rows="4" style={{resize:"none"}} name="description" className="form-control" onChange={ e => categoryHandle(e) } value={CategoryInput.description}></textarea>
                                            <small className="text-danger"></small>
                                        </div>
                                    </div>

                                    <div className="col-md-12 text-start">
                                        <div className="form-group mb-3">
                                            <label style={{fontWeight:"bold", display:"flex"}}>Status</label>
                                            <input type="checkbox" className="statut" id="statut" name="available" onChange={handleCheckbox} defaultChecked={isChecked.available === "1" ? true : false} value={isChecked.available} /> Status 1=Show/0=Hidden
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
                                            <textarea rows="4" style={{resize:"none"}} name="meta_keywords" className="form-control"  onChange={ e => categoryHandle(e) } DefaultValue={CategoryInput.meta_keywords}></textarea>
                                            <small className="text-danger"></small>
                                        </div>
                                    </div>

                                    <div className="col-md-12">
                                        <div className="form-group mb-3">
                                            <label style={{fontWeight:"bold", display:"flex"}}>Meta-description</label>
                                            <textarea rows="4" style={{resize:"none"}} name="meta_description" className="form-control" onChange={ e => categoryHandle(e) } DefaultValue={CategoryInput.meta_description !== null? CategoryInput.meta_description : ``}></textarea>
                                            <small className="text-danger"></small>
                                        </div>
                                    </div>

                                    <div className="col-md-12">
                                        <div className="form-group text-end">
                                        <button type="submit" className="btn btn-primary col-sm-3 float-right" onClick={(e) => UpdateCategory(e, CategoryInput.id)}>Modifier</button>
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

export default EditCategory;