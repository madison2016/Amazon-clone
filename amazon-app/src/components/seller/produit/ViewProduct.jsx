import React, {useEffect, useState} from "react";
import { NavLink, useParams, useNavigate } from "react-router-dom";
import axios from "../../config/axios";


import Pagination from "../../pagination";
import "bootstrap/dist/css/bootstrap.min.css";
import hasExpires from "../../config/verifTokenValidity";
import swal from "sweetalert";

function ViewProduct(){

    // pour tester la validite du token
    let currentUser = JSON.parse(localStorage.getItem("loggedUser")); 
    let tokenIsValid = hasExpires(JSON.parse(localStorage.getItem("Expires_at"))); 

    const [errors, setErrors] = useState({});

    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [ProductList, setProductList] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [productPerPage] = useState(9);

    // le token est t-il valide ?
    useEffect(()=>{
        if(tokenIsValid === false){
            navigate("/login");
        }
    },[tokenIsValid]);

    // N'effectue ceci qu'au chargement 
    useEffect(() => {
        
        // make request first to sanctum/csrf-cookie
        axios.get('/sanctum/csrf-cookie').then(() => {
            
            // requete pour charger les categories
            axios.get('/api/view-product', { headers: { 'Accept': 'application/json' } }).then(res => {
                 
                if(res.data.status === 200) {                    
                    
                    // on charge les categories dans la variable d'etat                    
                    setProductList(res.data.produits);
                }

                if(res.data.status === 404){
                    // aucun produit trouve
                    swal("Error", res.data.message, "error");
                }
                // on arrete l'affichage du loading
                setLoading(false);
                
            }).catch(error => {

                // quelque chose n'a pas marche lors de l'envoie de la requete
                setErrors(error.response.data.errors);
                swal("Error", errors, "error");

             });
         });

    }, []);

    const deleteProduct = (e, id) => {

        e.preventDefault();

        const thisClicked = e.currentTarget;
        thisClicked.innerText = "Suppression...";

        // make request first to sanctum/csrf-cookie
        axios.get('/sanctum/csrf-cookie').then(() => {
            
            // requete pour supprimer (administrateur)/ changer le status de visibilite (seller) d'un produit
            axios.delete(`/api/delete-product/${id}`).then(res => {
                 
                 if(res.data.status === 200) { 
                    // suppression effectuee avec succes
                    swal("Succes", res.data.message, "success");

                    const refreshData = ProductList.filter((item)=>{
                        return (
                            item.id !== id
                        )
                    });
                    
                    setProductList(refreshData);
                    setLoading(false);
                    //thisClicked.innerText = "Supprimer";
                }
                
            }).catch(error => {
                
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
    }

    // Get current category
    const indexOfLastPost = currentPage * productPerPage;
    const indexOfFirstPost = indexOfLastPost - productPerPage;
    const currentProduct = ProductList.slice(indexOfFirstPost, indexOfLastPost);
    const howManyPages = Math.ceil(ProductList.length/productPerPage);

    if(loading){
        return <h1>Chargement des articles...</h1>
    }else{
        var viewproduct_HTMLTABLE = "";

        if(currentProduct.length > 0){

            viewproduct_HTMLTABLE =
                <div className="container-fluid border-0" style={{paddingBottom:"1%"}}> 
                    <h2 style={{width:"98.9%", padding:"1% .5%", margin:"1%", border:"none", textAlign:"center"}}>
                        Catalogue des produits
                        <NavLink to="/produit/add-product" className="btn btn-primary btn-sm float-end">Ajouter une produit</NavLink>
                    </h2>
                    <div className="row row-cols-1 row-cols-md-4 g-4 border-0" style={{marginBottom:"2%"}}>
                        {
                            currentProduct.map((item) => {                                
                                return (                                    
                                    <div className="col" key={item.id}>
                                        <div className="card h-100" style={{width:"18rem"}}>
                                            <div className="card-header">
                                                <img src={`http://127.0.0.1:8000/${item.image}`} className="card-img-top" alt={item.name} style={{width:"100%", height:"128px"}}/>
                                            </div>                                            

                                            <div className="card-body">
                                                <h5 className="card-title">{item.name}</h5>
                                                <p className="card-text" style={{fontFamily:"fantasy", fontSize:"1.3em"}}><strong>{new Intl.NumberFormat().format(item.unit_price)}</strong> <sup>FCFA</sup></p>
                                            </div>

                                            <div className="card-footer">
                                                <NavLink to={`/produit/edit-product/${item.id}`} className="btn btn-info btn-sm-2" style={{display:"inline-block", width:"42%", marginRight:"2%"}}>Editer</NavLink>
                                                <button onClick={(e)=>deleteProduct(e, item.id)} className="btn btn-danger btn-sm-2" style={{display:"inline-block", width:"auto"}}>Supprimer</button>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })
                        }                                                    
                    </div>
                    <Pagination pages={ howManyPages } setCurrentPage={ setCurrentPage }/>
                </div>
        }else{
            // Aucun produit trouve
            viewproduct_HTMLTABLE =
                <div className="container w-100">
                    <div className="card-header mt-fluid bg-warning">
                        <h4>Aucune produit trouve.</h4>
                    </div>                    
                </div>
        }
    }

    return (
        <div className="container px-4">
            <div className="card mt-4">                
                {viewproduct_HTMLTABLE}
            </div>
        </div>
    )

}

export default ViewProduct;