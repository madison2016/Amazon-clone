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


function ViewPortfolio(){

    // pour tester la validite du token
    let currentUser = JSON.parse(localStorage.getItem("loggedUser")); 
    let tokenIsValid = hasExpires(JSON.parse(localStorage.getItem("Expires_at")));
      
    const [loading, setLoading] = useState(true);
    const [paymentMode, setPaymentMode] = useState(false);

    const [errors, setErrors] = useState([]);
    const [bankAccountValues, setBankAccountValues] = useState([]);
    const [creditCardValues, setCreditCardValues] = useState([]);
    
    const navigate = useNavigate();

    useEffect((e) => {
        // le token est t-il toujours valide ?
        if(tokenIsValid === false){
            navigate("/login");
        }else{
            
            // requete pour recuperer les eventuels comptes bancaires
            axios.get("/api/view-user-bank-account").then(res => {
                
                if(res.data.status === 200) {
                    
                    setBankAccountValues(res.data.bank_accounts);
                    setPaymentMode(true);
                    console.log(bankAccountValues);
                }else if(res.data.status === 404){

                    setErrors(res.data.message);
                }
            }).catch(error => {
                // Autre erreur
                //swal("Error", `Erreur ${error.status}: ${error.message}`, "error");                    
            });

            // requete pour recuperer les eventuelles cartes bancaires
            axios.get("/api/view-user-credit-card").then(res => {
                
                if(res.data.status === 200) {
                    
                    setCreditCardValues(res.data.credit_cards);
                    setPaymentMode(true);
                    
                }else if(res.data.status === 404){

                    setErrors(res.data.message);
                }

                setLoading(false);

            }).catch(error => {
                // Autre erreur
                //swal("Error", `Erreur ${error.status}: ${error.message}`, "error");                    
            });
        }

    },[tokenIsValid]);

    // suppression d'une compte bancaire
    const deleteCreditCard = (e, id) => {

    }

    // suppression d'une compte bancaire
    const deleteBankAccount = (e, id) => {

    }


    if(loading){

        return <h2>Chargement des modes de paiement en cours...</h2>
    }else{

        var card_label = "";
        var viewpayment_HTMLTABLE = "";
        var card_image = "";

        if(paymentMode){
            viewpayment_HTMLTABLE =

                <div className="card">
                    <div className="card-header">
                        <h2 className="text-left text-primary-emphasis">
                            Vos modes de paiement
                            <NavLink to={`/view-payment-mode/${currentUser.id}`} className="btn btn-primary btn-sm float-end">Ajouter un mode de paiement</NavLink>
                        </h2>
                    </div>

                    <div className="card-body">

                        <div className="col">
                            <table className="table table-bordered">
                                <thead>
                                    <tr>
                                        <th className="w-100 border-bottom-danger" colSpan={4} style={{backgroundColor:"#f8f8f8", verticalAlign:"middle", textAlign:"left", fontSize:"2em", fontWeight:"200"}}>Comptes bancaires</th>
                                    </tr>
                                </thead>

                                <tbody className="table-group-divider">
                                    { 
                                        bankAccountValues.map((item) => {
                                            return (
                                                <tr key={item.id}>
                                                    <td colSpan={2} style={{width:"78%", verticalAlign:"middle"}} className="align-middle">
                                                        <img src="/uploads/bank-account-paiement2.jpeg" className="img-fluid float-left" style={{width:"15%", height:"7em"}} alt="..."/>
                                                        <span className="code-bic" style={{display:"flex", fontSize:"1em", textTransform:"uppercase"}}>{item.code_bic}</span>
                                                        <span className="code-iban" style={{display:"flex", fontSize:"1.2em"}}>{item.code_iban}</span>
                                                        <span className="nom-titulaire" style={{display:"flex", fontSize:"1.3em", textTransform:"uppercase"}}>{item.nom_titulaire}</span>                                                
                                                    </td>
                                                    
                                                    <td style={{width:"11%", verticalAlign:"middle"}}> 
                                                        <NavLink to={`/shop/edit-shop/${item.id}`} className="btn btn-info btn-sm-4" style={{display:"inline-block", width:"100%"}}>Editer</NavLink>
                                                    </td>
                                                    <td style={{width:"11%", verticalAlign:"middle"}}> 
                                                        <button onClick={(e)=>deleteBankAccount(e, item.id)} className="btn btn-danger btn-sm-4">Supprimer</button>
                                                    </td>
                                                </tr>
                                            )
                                        })
                                    }
                                </tbody>
                            </table>
                        </div>

                        

                        <div className="container-fluid border-0" style={{paddingBottom:"1%", marginTop:"10%"}}> 
                            <h2 className="w-100 border-bottom-danger" style={{padding:".5%", margin:"1%", border:"none", textAlign:"left"}}>
                                Cartes de credit
                            </h2>
                    
                            <div className="row row-cols-1 row-cols-md-3 g-3 border-0" style={{marginBottom:"2%"}}>
                                {
                                    creditCardValues.map((item, i) => {

                                        switch(item.card_model){
                                            case "american express":
                                                card_image = "/uploads/americanexpresscard.png";
                                                break;

                                            case "discover":
                                                card_image = "/uploads/discovercard.png";
                                                break;

                                            case "matercard":
                                                card_image = "/uploads/mastercard.png";
                                                break;

                                            case "union pay":
                                                card_image = "/uploads/unionpaycard.png";
                                                break;

                                            case "visa":
                                                card_image = "/uploads/visacard.png";
                                                break;

                                            default:
                                                card_image = "/uploads/other-card.png";
                                        }                            

                                        return (
                                                
                                            <div className="col">
                                                <div className="card h-100">
                                                    <div className="card-header">
                                                        <img src={card_image} className="card-img-top" alt={item.nom_titulaire} style={{width:"100%", height:"10em"}}/>
                                                    </div>                                            

                                                    <div className="card-body">                                                    
                                                        <p className="card-text" style={{fontFamily:"Bodoni 72", fontSize:"1em"}}>
                                                            <label className="w-50 ml-1 -mr-1 text-left float-left">Numéro :</label>
                                                            <span className="w-50 font-weight-bold text-right">{item.num_card}</span>
                                                        </p>
                                                        <p className="card-text" style={{fontFamily:"Bodoni 72", fontSize:"1em"}}>
                                                            <label className="w-50 ml-1 -mr-1 text-left float-left">Expire le :</label>
                                                            <span className="w-50 font-weight-bold">{item.date_expiration}</span>
                                                        </p>
                                                        <p className="card-text" style={{fontFamily:"Bodoni 72", fontSize:".9em"}}>
                                                            <label className="w-50 ml-1 -mr-1 text-left float-left">Nom du porteur :</label>
                                                            <span className="w-50 font-weight-bold text-right text-danger-emphasis text-uppercase">{item.nom_titulaire}</span>
                                                        </p>
                                                    </div>

                                                    <div className="card-footer">
                                                        <NavLink className="bg-transparent justify-content-center align-middle" to="" style={{display:"inline-flex", width:"20%", height:"5em", padding:"2% 0 .5% 0", verticalAlign:"middle"}}>
                                                            <img src="/uploads/edit3-btn.png" title="Editer" alt="Supprimer" style={{display:"inline-flex", width:"90%", height:"100%"}}/>
                                                        </NavLink>

                                                        <button className="bg-transparent justify-content-center ml-1 border-0" onClick={(e)=>deleteCreditCard(e, item.id)} style={{display:"inline-flex", width:"20%", height:"5em", verticalAlign:"middle"}}>                                                            
                                                            <img src="/uploads/trash-btn.png" title="Supprimer" alt="Supprimer" style={{display:"inline-flex", width:"95%", height:"100%", transform:""}}/>
                                                        </button>                                                    
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    })
                                }                                                    
                            </div>                    
                </div>                    
                    </div>
                </div>
        }else{
            // Aucun mode de paiement
            viewpayment_HTMLTABLE =
                <div className="container-fluid w-100">
                    <div className="card-header mt-fluid bg-warning">
                        <h4>Aucun mode de paiement.</h4>
                    </div>                    
                </div>
        }
    }

    return (
        <div className="py-4">
            <div className="container-md">
                <div className="row">
                    <h2 className="p-2 mb-5 mt-0 bg-secondary" style={{margin:"3% 0"}}>
                        <NavLink to={`/view-profile/${currentUser.id}`} className="btn btn-link-light btn-lg col-3 text-white">Informations personnelles</NavLink>
                        <NavLink to={`/edit-params/${currentUser.id}`} className="btn btn-link-light btn-lg col-3 text-white">Paramètres de Sécurité</NavLink>
                        <NavLink to={"#"} className="btn btn-link-light btn-lg col-3 active text-white">Portefeuille</NavLink>
                        <NavLink to={`/view-abonnement/${currentUser.id}`} className="btn btn-link-light btn-lg col-3 text-white">Abonnements</NavLink>
                    </h2>

                    <div className="row">                    
                        <div className="col-md-12 p-1 text-center">                            
                            {viewpayment_HTMLTABLE}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )

}

export default ViewPortfolio;