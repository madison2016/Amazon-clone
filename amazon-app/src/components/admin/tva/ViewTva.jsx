import React, { useState, useEffect } from "react";
import { NavLink, useParams, useNavigate } from "react-router-dom";
import axios from "../../config/axios";


import Pagination from "../../pagination";
import "bootstrap/dist/css/bootstrap.min.css";
import hasExpires from "../../config/verifTokenValidity";

function ViewTva() {

    // pour tester la validite du token
    let currentUser = JSON.parse(localStorage.getItem("loggedUser")); 
    let tokenIsValid = hasExpires(JSON.parse(localStorage.getItem("Expires_at")));
    
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [tvaList, setTvaList] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [tvaPerPage] = useState(10);

    // le token est t-il valide ?
    useEffect(()=>{

        if(tokenIsValid === false){
            navigate("/login");
        }else{
            // make request first to sanctum/csrf-cookie
            axios.get('/sanctum/csrf-cookie').then(() => {
                        
                // requete pour charger les categories
                axios.get('/api/view-tva').then(res => {
                    
                    if(res.data.status === 200) {                    
                        
                        // on charge les tva dans la variable d'etat                    
                        setTvaList(res.data.tva);
                        
                        setLoading(false);
                    }else if(es.data.status === 404){
                        // Erreur 404 (introuvable)
                        swal("Erreur", res.data.message, "error");
                    }
                });
            });
        }
    },[tokenIsValid]);

    // suppression d'une tva
    const deleteTva = (e, id) => {

        e.preventDefault();

        const thisClicked = e.currentTarget;
        thisClicked.innerText = "Suppression...";

        // make request first to sanctum/csrf-cookie
        axios.get('/sanctum/csrf-cookie').then(() => {
            
            // requete pour supprimer une tva
            axios.delete(`/api/delete-tva/${id}`).then(res => {
                 
                 if(res.data.status === 200) { 
                    // la suppression a ete effectuee avec succes dans la BD
                    swal("Succes", res.data.message, "success");

                    // on supprime la ligne
                    thisClicked.closest("tr").remove();
                }else if(error.status === 404){
                    // Error 404 tva not found
                    swal("Error", res.data.message, "error");

                    thisClicked.innerText = "Supprimer";
                 }else if(error.status === 401){

                    // erreur 401 = Unauthenticate
                    swal("Warning", res.data.message, "warning");

                    thisClicked.innerText = "Supprimer";
                 } 
                 
                 setLoading(false);
            });
         });
    }

    // Get current category
    const indexOfLastPost = currentPage * tvaPerPage;
    const indexOfFirstPost = indexOfLastPost - tvaPerPage;
    const currentTva = tvaList.slice(indexOfFirstPost, indexOfLastPost);
    const howManyPages = Math.ceil(tvaList.length/tvaPerPage);    

    if(loading){
        return <h2>Chargement des categories...</h2>
    }else{
        var viewtva_HTMLTABLE = "";

        if(currentTva.length > 0){
            viewtva_HTMLTABLE =
                <div className="card">
                    <div className="card-header">
                        <h4>
                            Liste des taux de TVA
                            <NavLink to="/admin/add-tva" className="btn btn-primary btn-sm float-end">Ajouter une TVA</NavLink>
                        </h4>
                    </div>

                    <div className="card-body">
                        <table className="table table-bordered table-striped">
                            <thead>
                                <tr>
                                    <th colSpan={3} style={{backgroundColor:"#f8f8f8", verticalAlign:"middle", textAlign:"center"}}>Description</th>
                                    <th colSpan={2} style={{backgroundColor:"#f8f8f8", verticalAlign:"middle", textAlign:"center"}}>Actions</th>
                                </tr>
                            </thead>

                            <tfoot>
                                <tr><td colSpan={5}></td></tr>
                            </tfoot>

                            <tbody>
                            { 
                                currentTva.map((item) => {
                                    return (
                                        <tr key={item.id}>
                                            <td className="text-center" style={{width:"10%", verticalAlign:"middle", fontWeight:"bold"}}>{item.name}</td>
                                            <td className="text-center" style={{width:"10%", verticalAlign:"middle"}}>{item.taux}%</td>
                                            <td className="text-justify-content-between" style={{width:"40%"}}>{item.details}</td>
                                            <td  className="text-center" style={{width:"10%", verticalAlign:"middle"}}> 
                                                <NavLink to={`/admin/edit-tva/${item.id}`} className="btn btn-info btn-sm-4" style={{display:"inline-block", width:"100%"}}>Editer</NavLink>
                                            </td>
                                            <td className="text-center" style={{width:"12%", verticalAlign:"middle"}}> 
                                                <button onClick={(e)=>deleteTva(e, item.id)} className="btn btn-danger btn-sm-4">Supprimer</button>
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
            viewcategory_HTMLTABLE = 
                <div className="card">
                    <div className="card-header mt-fluid bg-warning">
                        <h4>Aucune TVA enregistree</h4>
                    </div>                    
                </div>
        }            
    }

    return (
        <div className="container px-4">
            <div className="card mt-4">                
                {viewtva_HTMLTABLE}
            </div>
        </div>
    )

}
export default ViewTva;