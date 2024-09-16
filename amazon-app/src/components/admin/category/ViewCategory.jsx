import React, { useState, useEffect } from "react";
import { NavLink, useParams, useNavigate } from "react-router-dom";
import axios from "../../config/axios";


import Pagination from "../../pagination";
import "bootstrap/dist/css/bootstrap.min.css";
import hasExpires from "../../config/verifTokenValidity";

function ViewCategory(){

    // pour tester la validite du token
    let currentUser = JSON.parse(localStorage.getItem("loggedUser")); 
    let tokenIsValid = hasExpires(JSON.parse(localStorage.getItem("Expires_at")));
    
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [categoryList, setCategoryList] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [categoryPerPage] = useState(10);

    // le token est t-il valide ?
    useEffect(()=>{
        if(tokenIsValid === false){
            navigate("/login");
        }
    },[tokenIsValid]);

    // N'effectue la fonction fetchCategoryData() qu'au chargement 
    useEffect(() => {
        
        // make request first to sanctum/csrf-cookie
        axios.get('/sanctum/csrf-cookie').then(() => {
            
            // requete pour charger les categories
            axios.get('/api/view-category', { headers: { 'Accept': 'application/json' } }).then(res => {
                 
                 if(res.data.status === 200) {                    
                    
                    // on charge les categories dans la variable d'etat                    
                    setCategoryList(res.data.category);
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
    const deleteCategory = (e, id) => {

        e.preventDefault();        

        const thisClicked = e.currentTarget;
        thisClicked.innerText = "Suppression...";

        // make request first to sanctum/csrf-cookie
        axios.get('/sanctum/csrf-cookie').then(() => {
            
            // requete pour supprimer une categorie
            axios.delete(`/api/delete-category/${id}`).then(res => {
                 
                 if(res.data.status === 200) { 
                    // la suppression a ete effectuee avec succes dans la BD
                    swal("Succes", res.data.message, "success");

                    const refreshData = categoryList.filter((item)=>{
                        return (
                            item.id !== id
                        )
                    });
                    
                    setCategoryList(refreshData);

                    setLoading(false);

                }
                
            }).catch(error => {
                
                if(error.status === 404){                    
                    // Error 404 = Category not found
                    swal("Error", "Aucune categorie n'est enregistree", "error");
                    navigate("/admin/dasboard");
                 }else{
                    // erreur 401 = Unauthenticate
                    swal("Error", "Session expiree, reconnectez-vous", "error");
                    navigate("/login");
                 }
             });
         });
    }

    // Get current category
    const indexOfLastPost = currentPage * categoryPerPage;
    const indexOfFirstPost = indexOfLastPost - categoryPerPage;
    const currentCategory = categoryList.slice(indexOfFirstPost, indexOfLastPost);
    const howManyPages = Math.ceil(categoryList.length/categoryPerPage);    

    if(loading){
        return <h2>Chargement des categories...</h2>
    }else{
        var viewcategory_HTMLTABLE = "";

        if(currentCategory.length > 0){
            viewcategory_HTMLTABLE =
                <div className="card">
                    <div className="card-header">
                        <h4>
                            Liste des categorie de produits
                            <NavLink to="/admin/add-category" className="btn btn-primary btn-sm float-end">Ajouter une categorie</NavLink>
                        </h4>
                    </div>

                    <div className="card-body">
                        <table className="table table-bordered table-striped">
                            <thead>
                                <tr>
                                    <th colSpan={2} style={{backgroundColor:"#f8f8f8", verticalAlign:"middle"}}>Details</th>
                                    <th colSpan={2} style={{backgroundColor:"#f8f8f8", verticalAlign:"middle"}}>Actions</th>
                                </tr>
                            </thead>

                            <tfoot>
                                <tr><td colSpan={4}></td></tr>
                            </tfoot>

                            <tbody>
                            { 
                                currentCategory.map((item) => {
                                    return (
                                        <tr key={item.id}>
                                            <td>
                                                <img src={`http://127.0.0.1:8000/${item.image}`} alt={item.name} style={{width:"128px", height:"128px"}}/>
                                            </td>
                                            <td>
                                                <span className="category-title" style={{display:"flex", fontSize:"1.5em"}}>{item.name}</span>
                                                <span className="category-slug btn btn-sm">{item.slug}</span>
                                                <span className="category-details content-text-justify" style={{display:"flex", marginTop:".5%", borderTop:"1px dotted silver"}}>{item.description}</span>
                                            </td>
                                            <td style={{width:"12%", verticalAlign:"middle"}}> 
                                                <NavLink to={`/admin/edit-category/${item.id}`} className="btn btn-info btn-sm-4" style={{display:"inline-block", width:"100%"}}>Editer</NavLink>
                                            </td>
                                            <td style={{width:"12%", verticalAlign:"middle"}}> 
                                                <button onClick={(e)=>deleteCategory(e, item.id)} className="btn btn-danger btn-sm-4">Supprimer</button>
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
                        <h4>Aucune categorie enregistree</h4>
                    </div>                    
                </div>
        }            
    }

    return (
        <div className="container px-4">
            <div className="card mt-4">                
                {viewcategory_HTMLTABLE}
            </div>
        </div>
    )


}

export default ViewCategory;