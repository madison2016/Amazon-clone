import React, { useState, useEffect } from "react";
import axios from "../../config/axios";
import { NavLink, useParams, useNavigate } from "react-router-dom";
import swal from 'sweetalert';

import Validation from "../../Validation";
import "bootstrap/dist/css/bootstrap.min.css";
import hasExpires from "../../config/verifTokenValidity";

function EditProduct(){

    // pour tester la validite du token
    let currentUser = JSON.parse(localStorage.getItem("loggedUser")); 
    let tokenIsValid = hasExpires(JSON.parse(localStorage.getItem("Expires_at")));

    const navigate = useNavigate();

    // initialisation du parametre a transmettre (id)
    const { id } = useParams();
    
    const [loading, setLoading] = useState(true);

    const [errors, setErrors] = useState({});

    const [productValue, setProductValue] = useState({});
    const [familyProduct, setFamilyProduct] = useState([]);
    const [storeList, setStoreList] = useState([]);

    const [picture, setPicture] = useState({});
    const [photoProduit, setPhotoProduit] = useState();

    const productHandle = (e) => {
        e.persist();

        setProductValue({ ...productValue, [e.target.name]: e.target.value });
    }

    // gestion des images
    const productImageHandle = (e) => {

        if(e.target.files && e.target.files.length > 0){
            setPhotoProduit({ image: e.target.files[0] });
            setPicture(e.target.files[0]);
        }
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
                            
            // requete pour recuperer toutes les categorie de la bd
            axios.get('/api/show-category', {headers: { 'Accept': 'application/json', 'Content-Type': 'application/json'} }).then(res => {
                
                if(res.data.status === 200) {
                    setFamilyProduct(res.data.categories);
                }
            });

            // requete pour recuperer toutes les boutique du vendeur connecte
            axios.get('/api/show-shop', {headers: { 'Accept': 'application/json', 'Content-Type': 'application/json'} }).then(res => {
                
                if(res.data.status === 200) {
                    setStoreList(res.data.stores);
                }
            });

            // requete pour charger le produit selectionne
            axios.get(`/api/edit-product/${id}`).then(res => {
                            
                if(res.data.status === 200){
                    
                    // on charge la boutique dans la variable d'etat                    
                    setProductValue(res.data.product);
                    
                    // set category image
                    setPicture({ image: res.data.product.image });
                    
                    // on arrete l'affichage du loading
                    setLoading(false);                    
                }
            }).catch(error => {                 
                // gestion des erreurs                    
                if(error.status === 404){
                    // Error 404 = Product not found
                    swal("Error", "Produit introuvable.", "error");

                    navigate("/produit/view-product");
                }
                
                if(error.status === 401){
                    // erreur 401 = Unauthenticate
                    swal("Error", "Votre session expiree, reconnectez-vous.", "error");

                    navigate("/login");
                }else{
                    // erreur 406 = champs requis
                    swal("Error", `Erreur ${error.status}: ${error.message}`, "error");
                }
            });
        });
    },[id]);


    const UpdateProduct = (e, id) =>{

        e.preventDefault();

        // validation des champs de saisie
        setErrors(Validation(productValue));

        if(Object.keys(Validation(productValue)).length === 0){
            
            // make request first to sanctum/csrf-cookie
            axios.get('/sanctum/csrf-cookie').then(() => {
                
                const payload = {
                    boutique_id: productValue.store === undefined ? productValue.boutique_id : productValue.store,
                    categorie_id: productValue.category_product === undefined ? productValue.categorie_id : productValue.category_product,                    
                    name: productValue.name,
                    selling_price: productValue.selling_price,
                    unit_price: productValue.unit_price,
                    packing_unit: productValue.packing_unit,                    
                    nature: productValue.etat === undefined ? productValue.nature : productValue.etat,
                    stock_quantity: productValue.stock_quantity,
                    alert_level: productValue.stock_alert === undefined ? productValue.alert_level : productValue.stock_alert,
                    description: productValue.details === undefined ? productValue.description : productValue.details
                };
                
                // traitement de l'image
                if(picture.length > 0){
                    payload.image = picture.image;
                 }else if(productValue.image){
                    payload.image = productValue.image;
                 }else{
                    setPicture({image: ""});
                 }
                  
                // requete pour enregistrer le produit dans la bd
                axios.post(`/api/update-product/${id}`, payload, {headers: { 'Content-Type': 'multipart/form-data' } }).then(res => {
                     
                    if(res.data.status === 200) {
                        swal("Succes", res.data.message, "success");

                        setLoading(false);

                        navigate("/produit/view-product");
                    }

                    if(res.data.status === 406){
                        swal("Error", res.data.error,"error");
                    }
                }).catch(error => {
                    // Quelque chose n'a pas marche
                    swal("Error", `Erreur ${error.status}: ${error.message}`, "error");                   
                });
            });
        }else{
            // erreur dans le format des donnees saisies
            swal("Error", errors, "error");
        }
    }

    if(loading){
        return <h2>Chargement de l'article a editer...</h2>
    }

    return (
        <div className="py-4">
            <div className="container-md">
                <div className="row">
                    <h3 className="bg-body-tertiary text-center" style={{margin:"3% 0", padding:"2% 0"}}>
                        Modifier un produit
                        <NavLink to={"/produit/view-product"} className="btn btn-warning btn-sm float-end">Afficher vos produits</NavLink>
                    </h3>

                    <ul className="nav nav-tabs" id="myTab" role="tablist">
                        <li className="nav-item col-sm-6" role="presentation">
                            <button className="nav-link active" id="description-tab" data-bs-toggle="tab" data-bs-target="#description-tab-pane" type="button" role="tab" aria-controls="description-tab-pane" aria-selected="true">Description</button>
                        </li>

                        <li className="nav-item col-sm-6" role="presentation">
                            <button className="nav-link" id="stock-tab" data-bs-toggle="tab" data-bs-target="#stock-tab-pane" type="button" role="tab" aria-controls="stock-tab-pane" aria-selected="false">Stock & details</button>
                        </li>
                    </ul>

                    <div className="tab-content table-bordered table-striped" id="myTabContent">
                        <div className="tab-pane fade show active" id="description-tab-pane" role="tabpanel" aria-labelledby="description-tab" tabIndex="0">
                            <div className="card" style={{border:"none", marginTop:"2%"}}>
                                <div className="card-body">
                                    <div className="row">
                                        <div className="col-md-8">
                                            <div className="col-md-8">
                                                <div className="form-group mb-3">
                                                    <label style={{fontWeight:"bold", display:"flex"}}>boutique</label>
                                                    <select className="form-control" name="store" onChange={ e => productHandle(e) } value={productValue.boutique_id}>
                                                        <option value="0">Selectionner votre boutique</option>
                                                        {
                                                            storeList.map((boutique) => {
                                                                return (
                                                                    <option value={boutique.id} key={boutique.id}>{boutique.name}</option>
                                                                )
                                                            })
                                                        }
                                                    </select>
                                                    {errors.boutique_id && <p style={{color:"red", marginBottom:"0", textAlign:"left"}}>{errors.boutique_id}</p>}                                                                                       
                                                </div>
                                            </div>

                                            <div className="col-md-8">
                                                <div className="form-group mb-3">
                                                    <label style={{fontWeight:"bold", display:"flex"}}>Categorie</label>
                                                    <select className="form-control" name="category_product" onChange={ e => productHandle(e) } value={productValue.categorie_id}>
                                                        <option value="0">Selectionner une categorie</option>
                                                        {
                                                            familyProduct.map((item) => {
                                                                return (
                                                                    <option value={item.id} key={item.id}>{item.name}</option>
                                                                )
                                                            })
                                                        }
                                                    </select>                                        
                                                    {errors.categorie_id && <p style={{color:"red", marginBottom:"0", textAlign:"left"}}>{errors.categorie_id}</p>}
                                                </div>
                                            </div>

                                            <div className="col-md-12">
                                                <div className="form-group mb-3">
                                                    <label style={{fontWeight:"bold", display:"flex"}}>Designation</label>
                                                    <input type="text" className="form-control" name="name" onChange={ e => productHandle(e) } value={productValue.name}/>
                                                    {errors.name && <p style={{color:"red", marginBottom:"0", textAlign:"left"}}>{errors.name}</p>}                
                                                </div>
                                            </div>

                                            <div className="row" style={{padding:"1%"}}>
                                                <div className="col-md-5" style={{marginRight:"16%"}}>                                                
                                                    <div className="form-group mb-3">
                                                        <label style={{fontWeight:"bold", display:"flex"}}>Prix unitaire (FCFA)</label>
                                                        <input type="number" className="form-control" name="unit_price" onChange={ e => productHandle(e) } value={productValue.unit_price}/>
                                                        {errors.unit_price && <p style={{color:"red", marginBottom:"0", textAlign:"left"}}>{errors.unit_price}</p>}                
                                                    </div>
                                                </div>

                                                <div className="col-md-5">
                                                    <div className="form-group mb-3">
                                                        <label style={{fontWeight:"bold", display:"flex"}}>Prix de vente (FCFA)</label>
                                                        <input type="number" className="form-control" name="selling_price" onChange={ e => productHandle(e) } value={productValue.selling_price}/>
                                                        {errors.selling_price && <p style={{color:"red", marginBottom:"0", textAlign:"left"}}>{errors.selling_price}</p>}                
                                                    </div>
                                                </div>
                                            </div>                                            
                                        </div>

                                        <div className="col-md-4">
                                            <div className="col-md-12 text-center">
                                                <div className="form-group mb-3">
                                                    <label style={{fontWeight:"bold", display:"flex"}}>Photo</label>
                                                    <input type="file" className="form-control" name="image" accept="image/*" onChange={ e => productImageHandle(e) } />                                                    
                                                    {picture.length > 0 ? (<img src={URL.createObjectURL(picture.image)} style={{display:"inline-flex", width:"256px", height:"256px", marginTop:"2%", border:"1px solid silver", borderRadius:"5px"}}/>) : (<img src={`http://localhost:8000/${productValue.image}`} style={{display:"inline-flex", width:"256px", height:"256px", marginTop:"2%", border:"1px solid silver", borderRadius:"5px"}}/>)}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>                            
                        </div>

                        <div className="tab-pane fade" id="stock-tab-pane" role="tabpanel" aria-labelledby="stock-tab" tabIndex="0">
                            <div className="card" style={{border:"none", marginTop:"2%"}}>
                                <div className="card-body">
                                    <div className="row">
                                        <div className="col-md-4">
                                            <div className="col-md-12" style={{marginRight:"5%"}}>
                                                <div className="form-group mb-3">
                                                    <label style={{fontWeight:"bold", display:"flex"}}>Unité emballage</label>
                                                    <select className="form-control" name="packing_unit" onChange={ e => productHandle(e) } value={productValue.packing_unit}>
                                                        <option value="boite">Boite</option>
                                                        <option value="caisse">Caisse</option>
                                                        <option value="carton">Carton</option>
                                                        <option value="etuis">Etuis</option>                                                        
                                                        <option value="paquet">Paquet</option>
                                                        <option value="pochette">pochette</option>
                                                    </select>                                                                                       
                                                </div>
                                            </div>
                                            
                                            <div className="col-md-12">
                                                <div className="form-group mb-3">
                                                    <label style={{fontWeight:"bold", display:"flex"}}>Etat</label>
                                                    <select className="form-control" name="etat" onChange={ e => productHandle(e) } value={productValue.nature}>
                                                        <option value="neuf">Neuf</option>
                                                        <option value="occasion">Occasion</option>
                                                        <option value="reconditionne">Reconditionné</option>
                                                    </select>
                                                </div>
                                            </div>

                                            <div className="row" style={{padding:"1%"}}>
                                                <div className="col-md-5" style={{marginRight:"15%"}}>
                                                    <div className="form-group mb-3">
                                                        <label style={{fontWeight:"bold", display:"flex"}}>Quantité en stock</label>
                                                        <input type="number" min={0} className="form-control" name="stock_quantity" onChange={ e => productHandle(e) } value={productValue.stock_quantity}/>
                                                        {errors.stock_quantity && <p style={{color:"red", marginBottom:"0", textAlign:"left"}}>{errors.stock_quantity}</p>}                
                                                    </div>
                                                </div>

                                                <div className="col-md-5">                                                
                                                    <div className="form-group mb-3">
                                                        <label style={{fontWeight:"bold", display:"flex"}}>Stock alerte</label>
                                                        <input type="number" min={0} className="form-control" name="stock_alert" onChange={ e => productHandle(e) } value={productValue.alert_level}/>
                                                        {errors.stock_alert && <p style={{color:"red", marginBottom:"0", textAlign:"left"}}>{errors.stock_alert}</p>}                
                                                    </div>
                                                </div>
                                            </div>                                            
                                        </div>

                                        <div className="col-md-8">
                                            <div className="col-md-12">
                                                <div className="form-group mb-3">
                                                    <label style={{fontWeight:"bold", display:"flex"}}>Description detaillée</label>
                                                    <textarea className="form-control" rows={15} style={{resize:"none"}} name="details" onChange={ e => productHandle(e) } defaultValue={productValue.description}></textarea>
                                                    {errors.details && <p style={{color:"red", marginBottom:"0", textAlign:"left"}}>{errors.details}</p>}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>                        
                    </div>
                    <div className="col-md-12">
                        <div className="form-group text-end" style={{marginTop:"1%"}}>
                            <button type="submit" className="btn btn-primary col-sm-2 float-right" onClick={(e) => UpdateProduct(e, productValue.id)}>Ajouter</button>
                        </div>
                    </div>
                </div>
            </div>        
        </div>
    )

}

export default EditProduct;