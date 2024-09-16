import React, { useState, useEffect } from "react";
import { useParams, useNavigate, NavLink } from "react-router-dom";
import axios from "../config/axios";
import hasExpires from "../config/verifTokenValidity";
import swal from 'sweetalert';

import "bootstrap/dist/css/bootstrap.min.css";

function CartShop(){

    // pour tester la validite du token
    let currentUser = JSON.parse(localStorage.getItem("loggedUser")); 
    let tokenIsValid = hasExpires(JSON.parse(localStorage.getItem("Expires_at")));

    var totalCartPrice = 0;
    var totalShopping = 0;
    var numberArticle = 0;

    const [tvaValue, setTvaValue] = useState([]);
    const [cart, setCart] = useState([]);
    const [loading, setLoading] = useState(true);
    const [errors, setErrors] = useState();

    const navigate = useNavigate();

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

    const handleDecrement = (cart_id, art_id) => {
        setCart(cart =>
            cart.map((item)=>
                cart_id === item.id ? {...item, stock_quantity : item.stock_quantity - (item.stock_quantity > 1 ? 1 : 0)} : item 
            )
        );

        // update quantity (decrement stock)
        updateCartQuantity(cart_id, art_id, "dec");
    }

    const handleIncrement = (cart_id, art_id) => {
        setCart(cart =>
            cart.map((item)=>
                cart_id === item.id ? {...item, stock_quantity : item.stock_quantity + ((item.stock - item.stock_quantity) > item.nso ? 1 : 0)} : item 
            )
        );

        // update quantity (increment stock)
        updateCartQuantity(cart_id, art_id, "inc");
    }

    function updateCartQuantity(cart_id, art_id, scope){

        // mise a jour de la quantite
        axios.patch(`/api/cartshop-updatequantity/${cart_id}/${art_id}/${scope}`).then(res => {
                                                        
            if(res.data.status === 200) {                    
                swal("Success", res.data.message, "success");                
            }
            
        }).catch(error => {

            // quelque chose n'a pas marche lors de l'envoie de la requete
            setErrors(error.response.data.errors);
            swal("Error", `Code: ${error.status} Message: ${error.message}`, "error");

        });
    }

    const DeleteCartshopItem = (e, cart_id) => {

        e.preventDefault();

        const thisClicked = e.currentTarget;
        thisClicked.innerText = "Suppression...";

        axios.delete(`/api/delete-cart-item/${cart_id}`).then(res => {
            
            if(res.data.status === 200) {    

                swal("Success", res.data.message, "success"); 
                thisClicked.closest("tr").remove();

            }else if(res.data.status === 404){
                
                swal("Error", res.data.message, "error");
                thisClicked.innerText = "Supprimer";

            }else if(res.data.status === 401){

                swal("Warning", res.data.message, "warning");
                thisClicked.innerText = "Supprimer";

            }
        }).catch(error => {

            // quelque chose n'a pas marche lors de l'envoie de la requete
            setErrors(error.response.data.errors);
            swal("Error", `Code: ${error.status} Message: ${error.message}`, "error");

        });;
    }

    if(loading){
        return <h1>Chargement du panier d'achats...</h1>
    }else{
        var cart_HTML = "";

        if(cart.length > 0){
            cart_HTML = <div className="col-md-12">
                            <div className="table-responsive">
                                <h2 style={{margin:"2% .5%"}}>Votre panier</h2>
                                <table>
                                    <thead style={{borderBottom:"1px solid silver"}}>
                                        <tr>
                                            <th colSpan={2}>Details produit</th>
                                            <th className="text-center">Prix unitaire<br/>(FCFA)</th>
                                            <th className="text-center">Quantite</th>
                                            <th className="text-center">Montant<br/>(FCFA)</th>
                                            <th className="text-center">Action</th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {
                                            cart.map( (item)=>{
                                                totalCartPrice += item.selling_price * item.stock_quantity;                                            
                                                numberArticle += 1;
                                                return (
                                                    <tr key={item.id} style={{borderBottom:"1px dotted silver"}}>
                                                        <td className="text-center" style={{width:"10%", marginBottom:"1%", padding:"1%"}}>
                                                            <img src={`http://127.0.0.1:8000/${item.image}`} width="250px" height="128px"/>
                                                        </td>

                                                        <td style={{width:"30%", textTransform:"uppercase", fontWeight:"bold", paddingLeft:"1.5%"}}>{item.designation}</td>

                                                        <td width="15%" className="text-center">{item.selling_price}</td>
                                                        <td width="15%" className="text-center">
                                                            <div className="input-group m-2">
                                                                <button type="button" onClick={() => handleDecrement(item.id, item.produit_id)} className="input-group-text col-sm-2">-</button>
                                                                <div className="form-control text-center" style={{height:"2.5em", width:"fit-content"}}>{item.stock_quantity}</div>
                                                                <button type="button" onClick={() => handleIncrement(item.id, item.produit_id)} className="input-group-text col-sm-2">+</button>
                                                            </div>
                                                        </td>
                                                        <td width="15%" className="text-center">{new Intl.NumberFormat().format(item.selling_price * item.stock_quantity)}</td>
                                                        <td width="10%">
                                                            <button type="button" onClick={ (e) => DeleteCartshopItem(e, item.id) } className="btn btn-danger btn-sm">Supprimer</button>
                                                        </td>
                                                    </tr>
                                                )
                                            })
                                            
                                        }                                        
                                    </tbody>
                                </table>
                            </div>

                            <div className="col-md-7"></div>

                            <div className="col-md-5 float-end" style={{marginBottom:"1%"}}>
                                <div className="card card-body mt-3">
                                    <h5>
                                        Devises : <strong>XAF-BEAC</strong>
                                    </h5>
                                    <h4>
                                        Sous-total ({numberArticle} {parseInt(numberArticle) > 1 ? "articles" : "article"}) :
                                        <span className="float-end" style={{fontWeight:"bold"}}>{new Intl.NumberFormat().format(totalCartPrice.toFixed(2))}</span>
                                    </h4>

                                    <h4>
                                        TVA ({tvaValue.taux}%) :
                                        <span className="float-end" style={{fontWeight:"bold"}}>{new Intl.NumberFormat().format((totalCartPrice * tvaValue.taux/100).toFixed(2))}</span>
                                    </h4>

                                    <h4>
                                        Montant TTC :
                                        <span className="float-end" style={{fontWeight:"bold"}}>{new Intl.NumberFormat().format(((totalCartPrice * tvaValue.taux/100)+totalCartPrice).toFixed(2))}</span>
                                    </h4>
                                    <hr/>
                                    <NavLink to="/checkout" className="btn btn-primary w-50" style={{marginLeft:"25%"}}>Passer la commande</NavLink>
                                </div>
                            </div>                            
                        </div>
        }else{
            cart_HTML = <div>
                <div className="card card-body py-5 text-center shadow-sm">
                    <h4>Votre panier est vide.</h4>
                    <hr/>
                    <NavLink to="/" className="btn btn-link w-100 text-center">Retour a l'accueil</NavLink>
                </div>
            </div>
        }
    }


    return (
        <div>
            <div className="py-4">
                <div className="container-md">
                    <div className="row">
                        {cart_HTML}                                     
                    </div>                    
                </div>
            </div>
        </div>
    )

}
export default CartShop;