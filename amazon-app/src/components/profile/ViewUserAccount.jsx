import React, {useEffect, useState} from "react";
import axios from "../config/axios";
import { NavLink, useParams, useNavigate } from "react-router-dom";
import swal from 'sweetalert';
import Validation from "../Validation";
import hasExpires from "../config/verifTokenValidity";
import ListPays from "../config/listPays.json";
import formatDate from "../config/formatDate";
import Pagination from "../pagination";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/customStyle.css";


function ViewUseraccount(){

    // pour tester la validite du token
    let currentUser = JSON.parse(localStorage.getItem("loggedUser")); 
    let tokenIsValid = hasExpires(JSON.parse(localStorage.getItem("Expires_at")));
      
    const [currentPage, setCurrentPage] = useState(1);
    const [shopPerPage] = useState(3);
    const [loading, setLoading] = useState(true);
    const [errors, setErrors] = useState([]);
    const [accountValues, setAccountValues] = useState([]);
    const [roleValues, setRoleValues] = useState([]);
    const [shopValues, setShopValues] = useState([]);
    const navigate = useNavigate();

    // le token est t-il valide ?
    useEffect(()=>{

        if(tokenIsValid === false){
            navigate("/login");
        }else{

            // requete pour recuperer toutes les boutique du vendeur connecte
            axios.get(`/api/show-shop/`, { headers: { 'Accept': 'application/json'} }).then(res => {
                
                if(res.data.status === 200) {
                    setShopValues(res.data.stores);
                }
            });

            // requete pour les infos du compte utilisateur
            axios.get(`/api/account-user`).then(res => {
                            
                if(res.data.status === 200){
                    
                    // on charge les infos du compte utilisateur                    
                    setAccountValues(res.data.user_account);

                    setRoleValues(res.data.user_roles);
                    
                    // on arrete l'affichage du loading
                    setLoading(false);                    
                }
            }).catch(error => {                 
                // gestion des erreurs                    
                if(error.status === 404){
                    // Error 404 = Product not found
                    swal("Error", "Informations du compte introuvables.", "error");
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
        }
    },[tokenIsValid]);

    // Get current shop if seller role    
    const indexOfLastShop = currentPage * shopPerPage;
    const indexOfFirstShop = indexOfLastShop - shopPerPage;
    const listShop = shopValues.slice(indexOfFirstShop, indexOfLastShop);
    const howManyPages = Math.ceil(shopValues.length/shopPerPage);

    if(loading){

        return <h2>Patientez, chargement des boutiques en cours...</h2>
    }else{
        var shopToDisplay = "";
        console.log(shopValues);
        if(listShop.length > 0){
            shopToDisplay = <>
                                <table className="table table-bordered table-striped w-100">
                                    <thead>
                                        <tr>
                                            <th colSpan={4}>
                                                <h4>
                                                    Vos boutiques
                                                    <NavLink to="/shop/add-shop" className="btn btn-primary btn-sm float-end">Ajouter une boutique</NavLink>
                                                </h4>
                                            </th>
                                        </tr>
                                        <tr>
                                            <th colSpan={2} style={{backgroundColor:"#f8f8f8", verticalAlign:"middle", textAlign:"center"}}>Details</th>
                                            <th colSpan={2} style={{backgroundColor:"#f8f8f8", verticalAlign:"middle", textAlign:"center"}}>Actions</th>
                                        </tr>
                                    </thead>

                                    <tfoot>
                                        <tr><td colSpan={4}></td></tr>
                                    </tfoot>

                                    <tbody>
                                        { 
                                            listShop.map((item) => {
                                                return (
                                                    <tr key={item.id}>
                                                        <td colSpan={2} style={{width:"70%", verticalAlign:"middle"}}>
                                                            <span className="shop-name" style={{display:"flex", fontSize:"1.5em", textTransform:"uppercase"}}>{item.name}</span>
                                                            <hr/>                                                
                                                            <span className="shop-adresse content-text-justify" style={{display:"flex", marginTop:".5%"}}>Adresse: {item.adresse}</span>
                                                            <span className="shop-phone" style={{display:"flex"}}>Téléphone: {item.phone}</span>
                                                            <span className="shop-site-web" style={{display:"flex"}}>Site web: <NavLink to={`${item.site_web}`}>{item.site_web}</NavLink></span>
                                                        </td>

                                                        <td style={{width:"13%", verticalAlign:"middle"}}> 
                                                            <NavLink to={`/shop/edit-shop/${item.id}`} className="btn btn-info btn-sm-4" style={{display:"inline-block", width:"100%"}}>Editer</NavLink>
                                                        </td>
                                                        <td style={{width:"13%", verticalAlign:"middle"}}> 
                                                            <button onClick={(e)=>deleteShop(e, item.id)} className="btn btn-danger btn-sm-4">Supprimer</button>
                                                        </td>
                                                    </tr>
                                                )
                                            })
                                        }
                                    </tbody>
                                </table>
                                <Pagination pages={ howManyPages } setCurrentPage={ setCurrentPage }/>
                            </>
                            
        }else{
            shopToDisplay = <div className="col-md-12 mt-fluid bg-warning">
                                <h4>Aucune boutique enregistree</h4>                    
                            </div>
        }
    }

    return(
        <div className="py-4">
            <div className="container-md">
                <div className="row">
                    <h2 className="p-2 mb-5 mt-0 bg-secondary text-white" style={{margin:"3% 0"}}>
                        Votre compte

                        <NavLink className="btn btn-warning btn-sm float-end" to="/">Retour à l'accueil</NavLink>
                    </h2>

                    <div className="col-md-4">
                        <div className="col-sm-12">
                            <div className="card" style={{border:"none"}}>
                                <div className="card-body">
                                    <h5 className="card-title mb-2">
                                        <strong>Login </strong>: <span style={{display:"inline", width:"fit-content", fontSize:".95em"}}>{accountValues.name}</span>
                                    </h5>

                                    <h5 className="card-title mb-2 mt-20">
                                        <strong>Profils</strong>:
                                        <ul>
                                            {
                                                roleValues.map((item, idx)=>{
                                                    return <li className="col-sm-12" key={idx} style={{listStyleType:"square"}}>{item.name}</li>
                                                })
                                            }
                                        </ul> 
                                    </h5>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="col-md-8">
                        {shopToDisplay}
                    </div>
                </div>                
            </div>            
        </div>
    )

}

export default ViewUseraccount;