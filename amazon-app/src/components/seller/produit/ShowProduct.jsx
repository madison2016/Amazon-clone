import React, { useState, useEffect } from "react";
import { useParams, useNavigate, NavLink } from "react-router-dom";
import axios from "../../config/axios";
import hasExpires from "../../config/verifTokenValidity";
import swal from 'sweetalert';

import "bootstrap/dist/css/bootstrap.min.css";


function ShowProduct () { 

    // initialisation de la classe Basket
    //let basket = new Basket();
    //let currentBasket = JSON.parse(localStorage.getItem("basket"));

    // pour tester la validite du token
    let currentUser = JSON.parse(localStorage.getItem("loggedUser")); 
    let tokenIsValid = hasExpires(JSON.parse(localStorage.getItem("Expires_at"))); 

    const [ loading, setLoading ] = useState(true);
    const [ errors, setErrors ] = useState([]);
    const [ message, setMessage ] = useState([]);
    const [ detailsProduit, setDetailsProduit ] = useState();
    const [quantity, setQuantity] = useState(1);

    // initialisation de la navigation entre les pages
    const navigate = useNavigate();

    // id produit passe en parametre
    const {id} = useParams();

    useEffect(() => {        
        
        // requete pour charger le produit selectionne
        axios.get(`/api/show-product/${id}`, { headers: { 'Accept': 'application/json' } }).then(res => {
                        
            if(res.data.status === 200) {                    
                
                // on charge les categories dans la variable d'etat
                setDetailsProduit(res.data.result);
            }

            setLoading(false);
            
        }).catch(error => {

            // quelque chose n'a pas marche lors de l'envoie de la requete
            setErrors(error.response.data.errors);
            swal("Error", `Code: ${error.status} Message: ${error.message}`, "error");

         });

    },[id]);

    // decrementer la quantite
    const handleDecrement = () => {
        if(quantity > 1){
            setQuantity(prevCount => prevCount - 1);        // decrementer jusq'a 1
        }        
    }

    // incrementer la quantite
    const handleIncrement = () => {
        if((detailsProduit.stock_quantity - quantity) > detailsProduit.alert_level){
            setQuantity(prevCount => prevCount + 1);    // incrementer jusqu'a stock alert
        }        
    }

    // ajouter au panier
    const submitAddToCart = (e) =>{

        e.preventDefault();

        if(tokenIsValid === false){
            navigate("/login");
        }else{
            // make request first to sanctum/csrf-cookie
            axios.get('/sanctum/csrf-cookie').then(() => {
                        
                // initialisation de la variable destinee a contenir le produit du panier
                const payload  = {
                    "product_id": detailsProduit.id,
                    "product_name": detailsProduit.name,
                    "product_price": detailsProduit.selling_price,
                    "product_image": detailsProduit.image,
                    "product_quantity": quantity
                };
                console.log(payload);
                // requete pour ajouter la ligne au panier
                axios.post("/api/add-cartshop", payload, {headers: { 'Accept': 'application/json' } }).then(res => {
                                
                    if(res.data.status === 201) {
                        
                        swal("Success", res.data.message, "success");
                    }
                    
                    if(res.data.status === 409){
                        swal("Warning", res.data.message, "warning");
                    }
                    
                    if(res.data.status === 404){
                        swal("Warning", res.data.message, "warning");
                    }

                    setLoading(false);            
                }).catch(error => {

                    if(error.response) {
                        if (error.response.data.message) {
                            setMessage(error.response.data.message);
                        }
                        if (error.response.data.errors) {
                            setErrors(error.response.data.errors);
                        }
                    }
                    // quelque chose n'a pas marche lors de l'envoie de la requete
                    setErrors(error.response.data.errors);
                    swal("Error", errors, "error");
        
                 });

            });
        }
    }

    if(loading){
        return <h1>Chargement de l'article...</h1>
    }else{

        var available_stock = "";

        if(detailsProduit.stock_quantity > detailsProduit.alert_level){

            available_stock = 
                <div>
                    <label className="btn-sm btn-success px-4 mt-2">En stock</label>

                    <div className="row">
                        <div className="col-md-3 mt-3">
                            <div className="input-group">
                                <button type="button" onClick={handleDecrement} className="input-group-text col-sm-2">-</button>
                                <div className="form-control text-center" style={{height:"2.5em"}}>{quantity}</div>
                                <button type="button" onClick={handleIncrement} className="input-group-text col-sm-2">+</button>
                            </div>
                        </div>

                        <div className="col-md-3 mt-3">
                            <button type="button" onClick={submitAddToCart} className="btn btn-primary w-100">Ajouter au Panier</button>
                        </div>
                    </div>
                </div>
        }else{
            available_stock = 
                <div>
                    <label className="btn-sm btn-danger px-4 mt-2">Stock insuffisant</label>
                </div>
        }        
    }
    
    return(
        <div>
            <div className="py-4">
                <div className="container-md">
                    <div className="row">

                        <div className="col-md-4 border-end">
                            <img src={`http://localhost:8000/${detailsProduit.image}`} className="w-100"/>
                        </div>

                        <div className="col-md-8">
                            <h4 style={{fontSize:"2em", fontWeight:"bold"}}>
                                {detailsProduit.name}
                            </h4>
                            <p className="text-justify">{detailsProduit.description}</p>

                            <div className="mb-1">
                                Prix de vente: <span style={{color:"#EB7018", fontSize:"1.7em"}}>{new Intl.NumberFormat().format(detailsProduit.selling_price)} <sup>Frs CFA</sup></span> 
                            </div>

                            <div>
                                {available_stock}
                                <br/>
                                <NavLink className="btn btn-link" to="/">Retour au catalogue</NavLink>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default ShowProduct;