import React, { useState, useEffect } from "react";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import axios from "../../config/axios";
import swal from 'sweetalert';

import Pagination from "../../pagination";
import "bootstrap/dist/css/bootstrap.min.css";
import hasExpires from "../../config/verifTokenValidity";

function ViewStore(){

    // pour tester la validite du token
    let currentUser = JSON.parse(localStorage.getItem("loggedUser")); 
    let tokenIsValid = hasExpires(JSON.parse(localStorage.getItem("Expires_at"))); 

    const [loading, setLoading] = useState(true);
    const [shopList, setShopList] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [shopPerPage] = useState(10);

    const navigate = useNavigate();

    // le token est t-il valide ?
    useEffect(()=>{
        if(tokenIsValid === false){
            navigate("/login");
        }
    },[tokenIsValid]);

    // N'effectue la fonction fetchShopData() qu'au chargement 
    useEffect(() => {

        // make request first to sanctum/csrf-cookie
        axios.get('/sanctum/csrf-cookie').then(() => {
                        
            // requete pour charger les categories
            axios.get('/api/view-shop', { headers: { 'Accept': 'application/json' } }).then(res => {
                
                if(res.data.status === 200) {                    
                    
                    // on charge les categories dans la variable d'etat                    
                    setShopList(res.data.shops);
                }
                // on arrete l'affichage du loading
                setLoading(false);
                
            }).catch(error => {
                console.log(error);
                if(error.response) {
                    if (error.response.data.message) {
                        setMessage(error.response.data.message);
                    }
                    if (error.response.data.errors) {
                        setErrors(error.response.data.errors);
                    }
                }
            });
        });

    }, []);

    // suppression d'une categorie
    const deleteShop = (e, id) => {

        e.preventDefault();

        const thisClicked = e.currentTarget;
        thisClicked.innerText = "Suppression...";

        // make request first to sanctum/csrf-cookie
        axios.get('/sanctum/csrf-cookie').then(() => {
            
            // requete pour charger les categories
            axios.delete(`/api/delete-shop/${id}`).then(res => {
                 
                 if(res.data.status === 200) {                     
                    swal("Succes", res.data.message, "success");

                    const refreshData = shopList.filter((item)=>{
                        return (
                            item.id !== id
                        )
                    });

                    setShopList(refreshData);                    

                    setLoading(false);
                }                
            }).catch(error => {
                
                if(error.status === 404){                    
                    // Error 404 = Shop not found
                    swal("Error", "Boutique introuvable", "error");
                    navigate("/shop/add-shop");
                 }
                 
                 if(error.status === 406){
                    // erreur 406 = Somethis wrong
                    swal("Error", "Impossible de supprimer la boutique. Reessayer plus tard.", "error");
                 }
                 
                 if(error.status === 401){
                    // erreur 401 = Unauthenticate
                    swal("Error", "Session expiree, reconnectez-vous", "error");
                    navigate("/login");
                 }

                 if(error.status === 500){
                    // erreur 401 = Unauthenticate
                    swal("Error", "Erreur serveur", "error");
                 }
             });
         });
    }

    // Get current shop
    const indexOfLastPost = currentPage * shopPerPage;
    const indexOfFirstPost = indexOfLastPost - shopPerPage;
    const currentShop = shopList.slice(indexOfFirstPost, indexOfLastPost);
    const howManyPages = Math.ceil(shopList.length/shopPerPage);    

    if(loading){
        return <h2>Chargement des boutiques...</h2>
    }else{
        var viewshop_HTMLTABLE = "";

        if(currentShop.length > 0){
            viewshop_HTMLTABLE =
                <div className="card">
                    <div className="card-header">
                        <h4>
                            Liste des boutiques ouvertes
                            <NavLink to="/shop/add-shop" className="btn btn-primary btn-sm float-end">Ajouter une boutique</NavLink>
                        </h4>
                    </div>

                    <div className="card-body">
                        <table className="table table-bordered table-striped">
                            <thead>
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
                                currentShop.map((item) => {
                                    return (
                                        <tr key={item.id}>
                                            <td style={{width:"27%", verticalAlign:"middle"}}>
                                                <span className="shop-name" style={{display:"flex", fontSize:"1.5em", textTransform:"uppercase"}}>{item.name}</span>                                                
                                            </td>
                                            <td>
                                                <span className="shop-phone" style={{display:"flex"}}>                                                
                                                    {item.phone}
                                                </span>
                                                <span className="shop-email" style={{display:"flex"}}>                                                    
                                                    {item.email}
                                                </span>
                                                <span className="shop-site-web" style={{display:"flex"}}>                                                
                                                    {item.site_web}
                                                </span>
                                                <hr/>
                                                <span className="shop-adresse content-text-justify" style={{display:"flex", marginTop:".5%"}}>                                                    
                                                    {item.adresse}
                                                </span>
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
                    </div>
                </div>
        }else{
            viewshop_HTMLTABLE = 
                <div className="card">
                    <div className="card-header mt-fluid bg-warning">
                        <h4>Aucune boutique enregistree</h4>
                    </div>                    
                </div>
        }            
    }

    return (
        <div className="container px-4">
            <div className="card mt-4">                
                {viewshop_HTMLTABLE}
            </div>
        </div>
    )


}

export default ViewStore;