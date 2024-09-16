import React, {useEffect, useState} from "react";
import axios from "../config/axios";
import { NavLink, useParams, useNavigate } from "react-router-dom";
import swal from 'sweetalert';
import Validation from "../Validation";
import hasExpires from "../config/verifTokenValidity";
import formatDate from "../config/formatDate";

import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/customStyle.css";

function AddPaymentMode(){

    // pour tester la validite du token
    let currentUser = JSON.parse(localStorage.getItem("loggedUser")); 
    let tokenIsValid = hasExpires(JSON.parse(localStorage.getItem("Expires_at")));
      
    const [loading, setLoading] = useState(true);
    const [errors, setErrors] = useState([]);

    const [bankAccountValues, setBankAccountValues] = useState({
        bic: "",
        iban: "",
        nom_titulaire: ""
    });
    const [creditCardValues, setCreditCardValues] = useState({
        card_model: "0",
        card_number: "",
        nom_porteur: "",
        date_expires: "",
        code_securite: ""
    });

    const {id} = useParams();

    const navigate = useNavigate();

    const bankAccountHandle = (e) => {
        e.persist();

        setBankAccountValues({ ...bankAccountValues, [e.target.name]: e.target.value });
    }

    const creditCardHandle = (e) => {
        e.persist();

        setCreditCardValues({ ...creditCardValues, [e.target.name]: e.target.value });
    }

    useEffect((e) => {
        // le token est t-il toujours valide ?
        if(tokenIsValid === false){
            navigate("/login");
        }

    },[tokenIsValid]);

    const addPaymentMode = (e, id, scope) => {

        e.preventDefault();

        setLoading(true);
        console.log(creditCardValues.date_expires);
        let url_action = "";
        let payload = [];

        if(scope === "bank account"){
            url_action = "/api/add-user-bank-account";
            setErrors(Validation(bankAccountValues));

            payload = {
                code_bic: bankAccountValues.bic,
                code_iban: bankAccountValues.iban,
                nom_titulaire: bankAccountValues.nom_titulaire
            };

        }else{
            url_action = "/api/add-user-credit-card";
            setErrors(Validation(creditCardValues));

            payload = {
                card_model: creditCardValues.card_model,
                num_card: creditCardValues.card_number,
                nom_porteur: creditCardValues.nom_porteur,
                expires_date: creditCardValues.date_expires,
                code_securite: creditCardValues.code_securite
            };
        }

        if(Object.keys(errors).length === 0){
            
            // make request first to sanctum/csrf-cookie
            axios.get('/sanctum/csrf-cookie').then(() => {
                 
                // requete pour enregistrer le profil dans la bd
                axios.post(url_action, payload, {headers: { 'Content-Type': 'application/json' } }).then(res => {
                     console.log(res);    
                    if(res.data.status === 200) {
                        swal("Succes", res.data.message, "success");

                        setLoading(false);

                        if(scope==="bank account"){
                            setBankAccountValues({
                                bic: "",
                                iban: "",
                                nom_titulaire: ""
                            });
                        }else{
                            setCreditCardValues({
                                card_model: "0",
                                card_number: "",
                                nom_porteur: "",
                                date_expires: "",
                                code_securite: ""
                            });
                        }                        
                        
                        //navigate(`/view-profil/${id}`);
                    }

                    if(res.data.status === 401){
                        swal("Error", res.data.message,"error");
                    }

                    if(res.data.status === 422){
                        swal("Error", res.data.message,"error");
                    }
                }).catch(error => {
                    // Autre erreurs
                    swal("Error", error.message, "error");                   
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
                    <h2 className="p-2 mb-5 mt-0 bg-secondary text-white" style={{margin:"3% 0"}}>
                        Mode de paiement

                        <NavLink className="btn btn-warning btn-sm float-end" to="/">Retour à l'accueil</NavLink>
                    </h2>

                    <div className="row">
                        <div className="col-md-6">
                            <div className="card mb-3">
                                <div className="row g-0">
                                    <div className="col-md-4">
                                        <img src="/uploads/bank-account-paiement2.jpeg" className="img-fluid rounded-start" alt="..."/>
                                    </div>
                                    
                                    <div className="col-md-8">                                    
                                        <div className="card-body">
                                            <h5 className="card-title pb-4 text-primary text-center" style={{marginBottom:"5em", borderColor:"red"}}>Ajouter un compte bancaire</h5>
                                            <div className="row">
                                                <div className="col-md-6">
                                                    <div className="form-group mb-3">
                                                        <label style={{fontWeight:"bold", display:"flex"}}>BIC  (Swift-Code)</label>
                                                        <input type="text" className="form-control" name="bic" onChange={ e => bankAccountHandle(e) } value={bankAccountValues.bic} />
                                                        {errors.bic && <p style={{color:"red", marginBottom:"0", textAlign:"left"}}>{errors.bic}</p>}                
                                                    </div>
                                                </div>

                                                <div className="col-md-12">
                                                    <div className="form-group mb-3">
                                                        <label style={{fontWeight:"bold", display:"flex"}}>IBAN</label>
                                                        <input type="text" className="form-control" name="iban" onChange={ e => bankAccountHandle(e) } value={bankAccountValues.iban} />
                                                        {errors.nom && <p style={{color:"red", marginBottom:"0", textAlign:"left"}}>{errors.nom}</p>}                
                                                    </div>
                                                </div>

                                                <div className="col-md-12">
                                                    <div className="form-group mb-3">
                                                        <label style={{fontWeight:"bold", display:"flex"}}>Nom du titulaire</label>
                                                        <input type="text" className="form-control" name="nom_titulaire" onChange={ e => bankAccountHandle(e) } value={bankAccountValues.nom_titulaire} />
                                                        {errors.nom_titulaire && <p style={{color:"red", marginBottom:"0", textAlign:"left"}}>{errors.nom_titulaire}</p>}                
                                                    </div>                                        
                                                </div>                                                            
                                            </div>
                                            <hr/>
                                            <button type="button" onClick={(e)=>addPaymentMode(e, currentUser.id, "bank account")} className="btn btn-primary col-sm-4 mb-2 float-end">Ajouter</button>
                                        </div>                                        
                                    </div>                    
                                </div>
                            </div>                            
                        </div>

                        <div className="col-md-6">
                            <div className="card mb-3">
                                <div className="row g-0">
                                    <div className="col-md-4">
                                        <img src="/uploads/cb-paiement2.jpeg" className="img-fluid rounded-start" alt="..."/>
                                    </div>
                                    
                                    <div className="col-md-8">                                    
                                        <div className="card-body">
                                            <h5 className="card-title pb-4 text-primary text-center">Ajouter une carte bancaire</h5>
                                            <div className="row">
                                                <div className="col-md-12">
                                                    <div className="form-group mb-3">
                                                        <label style={{fontWeight:"bold", display:"flex"}}>Modèle</label>
                                                        <select className="form-control" name="card_model" onChange={ e => creditCardHandle(e) } value={creditCardValues.card_model}>
                                                            <option value="0">Selectionnez le modèle</option><option value="american express">American Express</option><option value="atm card">ATM Card</option><option value="atos private label">Atos Private Label</option><option value="aura">Aura</option><option value="bank card">Bank Card</option><option value="bp fuel card">BP Fuel Card</option><option value="cabal">Cabal</option><option value="carnet">Carnet</option><option value="china union pay">china Union Pay</option><option value="chjones fuel card">Chjones Fuel Card</option><option value="cirrus">Cirrus</option><option value="dankort">Dankort</option><option value="dinacard">Dinacard</option><option value="diners club international">Diners Club International</option><option value="discover">Discover</option><option value="duet">Duet</option><option value="eftpos">Eftpos</option><option value="elo">Elo</option><option value="euroshell fuel card">Euroshel Fuel Card</option><option value="fuel card">Fuel Card</option><option value="ge capital">GE Capital</option><option value="hipercard">Hipercard</option><option value="hrg store card">HRG Store Card</option><option value="jcb">JCB</option><option value="local brand">Local Brand</option><option value="local card">Local Card</option><option value="loyalty card">Loyalty Card</option><option value="lukoil fuel card">Lukoil Fuel Card</option><option value="mada">Mada</option><option value="maestro">Maestro</option><option value="mastercard">Mastercard</option><option value="newday">Newday</option><option value="nspk mir">NSPK MIR</option><option value="ourocard">Ourocard</option><option value="phh fuel card">PHH Fuel Card</option><option value="private label">Private Label</option><option value="rbs gift card">RBS Gift Card</option><option value="red fuel card">Red Fuel Card</option><option value="red liquid fuel card">Red Liquid Fuel Card</option><option value="rupay">Rupay</option><option value="sbercard">Sbercard</option><option value="sodexo">Sodexo</option><option value="star rewarks">Star Rewarks</option><option value="troy">Troy</option><option value="uatp">UATP</option><option value="uk fuel card">UK Fuel Card</option><option value="union pay">Union Pay</option><option value="visa">VISA</option><option value="visa dankort">VISA DANKORT</option><option value="vpay">vPay</option>
                                                        </select>
                                                        {errors.card_model && <p style={{color:"red", marginBottom:"0", textAlign:"left"}}>{errors.card_model}</p>}
                                                    </div>
                                                </div>

                                                <div className="col-md-12">
                                                    <div className="form-group mb-3">
                                                        <label style={{fontWeight:"bold", display:"flex"}}>Numéro de carte</label>
                                                        <input type="text" className="form-control" name="card_number" onChange={ e => creditCardHandle(e) } value={creditCardValues.card_number} />
                                                        {errors.card_number && <p style={{color:"red", marginBottom:"0", textAlign:"left"}}>{errors.card_number}</p>}
                                                    </div>
                                                </div>

                                                <div className="col-md-12">
                                                    <div className="form-group mb-3">
                                                        <label style={{fontWeight:"bold", display:"flex"}}>Nom porteur</label>
                                                        <input type="text" className="form-control" name="nom_porteur" onChange={ e => creditCardHandle(e) } value={creditCardValues.nom_porteur} />
                                                        {errors.nom_porteur && <p style={{color:"red", marginBottom:"0", textAlign:"left"}}>{errors.nom_porteur}</p>}                
                                                    </div>
                                                </div>

                                                <div className="col-md-8">
                                                    <div className="form-group mb-3">
                                                        <label style={{fontWeight:"bold", display:"flex"}}>Date expiration</label>
                                                        <input type="month" className="form-control" name="date_expires" onChange={ e => creditCardHandle(e) } value={creditCardValues.date_expires} />
                                                        {errors.date_expires && <p style={{color:"red", marginBottom:"0", textAlign:"left"}}>{errors.date_expires}</p>}                
                                                    </div>                                        
                                                </div>

                                                <div className="col-md-4">
                                                    <div className="form-group mb-3">
                                                        <label style={{fontWeight:"bold", display:"flex"}}>Code sécurité</label>
                                                        <input type="number" className="form-control" name="code_securite" onChange={ e => creditCardHandle(e) } value={creditCardValues.code_securite} />
                                                        {errors.date_expires && <p style={{color:"red", marginBottom:"0", textAlign:"left"}}>{errors.date_expires}</p>}                
                                                    </div>                                        
                                                </div>                                                            
                                            </div>
                                            <hr/>
                                            <button type="button" onClick={(e)=>addPaymentMode(e, currentUser.id, "credit card")} className="btn btn-primary col-sm-4 mb-2 float-end">Ajouter</button>
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

export default AddPaymentMode