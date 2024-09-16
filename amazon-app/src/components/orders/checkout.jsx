import React, { useState, useEffect } from "react";
import { useParams, useNavigate, NavLink } from "react-router-dom";
import axios from "../config/axios";
import hasExpires from "../config/verifTokenValidity";
import swal from 'sweetalert';
import ListPays from "../config/listPays.json";
import Validation from "../Validation";

import "bootstrap/dist/css/bootstrap.min.css";


function Checkout(){

    // pour tester la validite du token
    let currentUser = JSON.parse(localStorage.getItem("loggedUser")); 
    let tokenIsValid = hasExpires(JSON.parse(localStorage.getItem("Expires_at")));

    var totalCartPrice = 0;
    var totalShopping = 0;
    var numberArticle = 0;

    const navigate = useNavigate();

    const [loading, setLoading] = useState();
    const [errors, setErrors] = useState([]);
    const [tvaValue, setTvaValue] = useState([]);
    const [cart, setCart] = useState([]);
    const [ordersInput, setOrdersInput] = useState({
        name: currentUser.name,
        email: currentUser.email,
        phone: "",
        phone2: "",
        zip_code: "",                    
        adresse: "...",

        pays: "0",
    });

    const orderInputHandle = (e) => {
        e.persist();

        setOrdersInput({ ...ordersInput, [e.target.name]: e.target.value });
    }

    useEffect(() => {

        // le token est t-il valide ?
        if(tokenIsValid === false){
            navigate("/");
            swal("Warning", "Authentifiez-vous pour consulter votre panier", "warning");
        }else{

            // requete pour recuperer la TVA
            axios.get(`/api/get-tva`).then(res => {
                if(res.data.status === 200) {
                    setTvaValue(res.data.tva);
                }
            });

            // requete pour charger le produit selectionne
            axios.get(`/api/view-cartshop`, { headers: { 'Accept': 'application/json' } }).then(res => {
                                    
                if(res.data.status === 200) {                    
                    
                    // on charge les produits du panier
                    setCart(res.data.cartshop);
                }else if(res.data.status === 401){
                    navigate("/");
                    swal("Warning", res.data.message, "warning");
                }

                setLoading(false);
                
            }).catch(error => {

                // quelque chose n'a pas marche lors de l'envoie de la requete
                setErrors(error.response.data.errors);
                swal("Error", `Code: ${error.status} Message: ${error.message}`, "error");

            });
        }
    },[tokenIsValid]);

    const SubmitOrder = (e) => {

        e.preventDefault();

        setErrors(Validation(ordersInput));

        if(Object.keys(Validation(ordersInput)).length === 0){

            // make request first to sanctum/csrf-cookie
            axios.get('/sanctum/csrf-cookie').then(() => {

                const payload = {
                    name: ordersInput.name,
                    email: ordersInput.email,
                    phone: ordersInput.phone,
                    phone2: ordersInput.phone2 !== undefined ? ordersInput.phone2 : "",
                    zip_code: ordersInput.zip_code,                    
                    adresse: ordersInput.adresse,
                    pays: ordersInput.pays,
                    payment_mode: "cod",
                    payment_id: ""

                };                    
                  
                // requete pour enregistrer la commande dans la bd
                axios.post('/api/place-order', payload, {headers: { 'Accept': 'application/json' } }).then(res => {
                    console.log(res.data); 
                    if(res.data.status === 200) {

                        swal("Order", res.data.message, "success");
                        navigate("/payment-mode")
                    }else if(res.data.status === 422){

                        swal("Erreur saisie", res.data.message, "error");
                        setErrors(res.data.error);
                    }
                    
                    setOrdersInput([]);

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

    if(loading){
        return <h1>Chargement de votre panier d'achats...</h1>
    }else{
        var checkout_HTML = "";

        if(cart.length > 1){
             checkout_HTML = <>
                                <div className="col-md-12">
                                <h3 className="bg-body-secondary text-left text-danger" style={{margin:"1.5% 0", padding:"1%", color:"black"}}>Recapitulatif de vos achats</h3>
                                </div>
                                <div className="col-md-5">                                
                                    <div className="card">
                                        <div className="card-header">
                                            <h4>Votre identite</h4>
                                        </div>

                                        <div className="card-body">
                                            <div className="row">
                                                <div className="col-md-12">
                                                    <div className="form-group mb-3">
                                                        <label style={{fontWeight:"bold", display:"flex"}}>Nom</label>
                                                        <input type="text" name="name" className="form-control" onChange={e=>orderInputHandle(e)} value={ordersInput.name} />
                                                        {errors.name && <p style={{color:"red", marginBottom:"0", textAlign:"left"}}>{errors.name}</p>}
                                                    </div>
                                                </div>

                                                <div className="col-md-12 mb-3">
                                                    <div className="form-group">
                                                        <label style={{fontWeight:"bold", display:"flex"}}>Email</label>
                                                        <input type="email" name="email" className="form-control" onChange={e=>orderInputHandle(e)} value={ordersInput.email} />
                                                        {errors.email && <p style={{color:"red", marginBottom:"0", textAlign:"left"}}>{errors.email}</p>}
                                                    </div>
                                                </div>

                                                <div className="col-md-6">
                                                    <div className="form-group mb-3">
                                                        <label style={{fontWeight:"bold", display:"flex"}}>Nº telephone</label>
                                                        <input type="tel" className="form-control" name="phone" placeholder="+(237)699999999" onChange={e=>orderInputHandle(e)} value={ordersInput.phone} />
                                                        {errors.phone && <p style={{color:"red", marginBottom:"0", textAlign:"left"}}>{errors.phone}</p>}
                                                    </div>
                                                </div>

                                                <div className="col-md-6">
                                                    <div className="form-group mb-3">
                                                        <label style={{fontWeight:"bold", display:"flex"}}>Nº telephone</label>                                            
                                                        <input type="tel" className="form-control" name="phone2" placeholder="+(237)699999999" onChange={e=>orderInputHandle(e)} value={ordersInput.phone2} />
                                                    </div>
                                                </div>

                                                <div className="col-md-6">
                                                    <div className="form-group mb-3">
                                                        <label style={{fontWeight:"bold", display:"flex"}}>Pays</label>
                                                        <select className="form-control" name="pays" onChange={ e => orderInputHandle(e) } value={ordersInput.pays}>
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

                                                <div className="col-md-6">
                                                    <div className="form-group mb-3">
                                                        <label style={{fontWeight:"bold", display:"flex"}}>Boite Postale</label>
                                                        <input type="text" className="form-control" name="zip_code" onChange={ e => orderInputHandle(e) } value={ordersInput.zip_code}/>
                                                        {errors.zip_code && <p style={{color:"red", marginBottom:"0", textAlign:"left"}}>{errors.zip_code}</p>}
                                                    </div>
                                                </div>

                                                <div className="col-md-12 mb-3">
                                                    <div className="form-group">
                                                        <label style={{fontWeight:"bold", display:"flex"}}>Adresse</label>
                                                        <textarea name="adresse" rows="4" style={{resize:"none"}} className="form-control" onChange={e=>orderInputHandle(e)} defaultValue="..."></textarea>
                                                        {errors.adresse && <p style={{color:"red", marginBottom:"0", textAlign:"left"}}>{errors.adresse}</p>}
                                                    </div>
                                                </div>

                                                <div className="col-md-12">
                                                    <div className="form-group text-end" style={{marginTop:"1%"}}>
                                                        <button type="submit" className="btn btn-primary col-sm-4 float-right" onClick={SubmitOrder}>Passer la commande</button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="col-md-7">
                                    <table className="table table-striped table-bordered">
                                        <thead className="bg-secondary" style={{borderBottom:"1px solid #000"}}>
                                            <tr>
                                                <th width="60%">Produit</th>
                                                <th width="5%" className="text-center">Quantite</th>
                                                <th width="20%" className="text-center">Prix unitaire (FCFA)</th>                                        
                                                <th width="20%" className="text-center">Montant (FCFA)</th>
                                            </tr>
                                        </thead>                                

                                        <tbody>
                                            {
                                                cart.map((item) =>{
                                                    totalCartPrice += item.selling_price * item.stock_quantity;

                                                    return(
                                                        <tr key={item.id} style={{lineHeight:"1em"}}>
                                                            <td style={{textTransform:"uppercase"}}>{item.designation}</td>
                                                            <td className="text-center">{item.stock_quantity}</td>
                                                            <td className="text-center">{new Intl.NumberFormat().format(item.selling_price)}</td>
                                                            <td className="text-right">{new Intl.NumberFormat().format(item.selling_price * item.stock_quantity)}</td>
                                                        </tr>
                                                    )
                                                })
                                            }
                                        </tbody>

                                        <tfoot>
                                            <tr >
                                                <td className="text-end fw-bold m-2" colSpan="2">MONTANT HT</td>
                                                <td className="text-end fw-bold" colSpan="2">{new Intl.NumberFormat().format(totalCartPrice.toFixed(2))}</td>
                                            </tr>
                                            <tr >
                                                <td className="text-end fw-bold m-2" colSpan="2">TVA ({tvaValue.taux}%)</td>
                                                <td className="text-end fw-bold" colSpan="2">{new Intl.NumberFormat().format((totalCartPrice * tvaValue.taux/100).toFixed(2))}</td>
                                            </tr>
                                            <tr>
                                                <td className="text-end fw-bold" colSpan="2">TOTAL TTC</td>
                                                <td className="text-end fw-bold" colSpan="2">{new Intl.NumberFormat().format(((totalCartPrice * tvaValue.taux/100)+totalCartPrice).toFixed(2))}</td>
                                            </tr>
                                        </tfoot>                    
                                    </table>
                                </div>
                            </>

        }else{
            checkout_HTML = <div>
                                <div className="card card-body py-5 text-center shadow-sm">
                                    <h4>Votre panier est vide.</h4>
                                </div>
                            </div>
        }
    }

    return (
        <div>
            <div className="py-4">
                <div className="container-fluid">
                    <div className="row p-2">
                        {checkout_HTML}
                    </div>                    
                </div>
            </div>
        </div>
    )

}

export default Checkout;