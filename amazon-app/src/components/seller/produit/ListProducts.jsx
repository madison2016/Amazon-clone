import React, { useState, useEffect, useContext } from "react";
import axios from "../../config/axios";
import { NavLink, useParams, useNavigate } from "react-router-dom";
import swal from 'sweetalert';

import Pagination from "../../pagination";
import "bootstrap/dist/css/bootstrap.min.css";
import "../../styles/customStyle.css";
import { ProductsContext } from "../../../Hooks/ProductsContext";

const ProductList = () => {
    // on initialise le context
    const [productTabs, setProductTabs] = useContext(ProductsContext);
    
    const [dataProduct, setDataProduct] = useState([]);
    const [errors, setErrors] = useState();
    const [loading, setLoading] = useState(true); 
    
    const navigate = useNavigate();

    useEffect(() => {
        
        // requete pour rechercher les produits dans la bd
        axios.post('/api/find-products', productTabs, {headers: { 'Accept': 'application/json' } }).then(res => {
                
            if(res.data.status === 200) {
                
                // on stocke le resultat de la recherche
                setDataProduct(res.data.produits);
                setLoading(false);

            }else if(res.data.status === 404){
                
                // Pas de produit trouve
                swal("Erreur saisie", res.data.message, "error");
            }
        });

    }, [productTabs]);

    const handleEvent = (e) => {
        if (e.type === "mousedown") {
               this.setState({ message: "Mouse Down"});
        }else {
            this.setState({ message: "Mouse Up"});
        }
    }

    // Pagination settings
    const [productPerPage] = useState(25);
    const [currentPage, setCurrentPage] = useState(1);

    const indexOfLastPost = currentPage * productPerPage;
    const indexOfFirstPost = indexOfLastPost - productPerPage;
    const currentProduct = dataProduct.slice(indexOfFirstPost, indexOfLastPost);
    const howManyPages = Math.ceil(dataProduct.length/productPerPage);

    if(loading){
        return <h2>Chargement de la page...</h2>
    }else{
        var label_category = "";
        var viewproduct_HTMLTABLE = "";

        if(currentProduct.length > 0){
            viewproduct_HTMLTABLE =
                <div className="container-fluid border-0" style={{paddingBottom:"1%"}}> 
                    <h2 style={{width:"98.9%", padding:"1% .5%", margin:"1%", border:"none", textAlign:"center", textTransform:"uppercase"}}>Notre catalogue de produits</h2>
                    
                    <div className="row row-cols-1 row-cols-md-3 g-3 border-0" style={{marginBottom:"2%"}}>
                        {
                            currentProduct.map((item, i) => {

                                if(i === 0 || currentProduct[i].category !== currentProduct[i-1].category){
                                    label_category = <h3 className="bg-gradient-light text-start text-bg-warning w-100" style={{padding:"2% 1%"}}>{currentProduct[i].category}</h3>
                                }else{
                                    label_category = null
                                }                                

                                return (
                                    <>
                                        {label_category}
                                        <NavLink key={item.id} to={`/produit/show-product/${item.id}`} style={{textDecoration:"none"}}>
                                            <div className="col">
                                                <div className="card h-100">
                                                    <div className="card-header">
                                                        <img src={`http://127.0.0.1:8000/${item.image}`} className="card-img-top" alt={item.name} style={{width:"100%", height:"128px"}}/>
                                                    </div>                                            

                                                    <div className="card-body">
                                                        <h5 className="card-title" style={{fontFamily:"Bodoni 72", fontSize:"1em", fontWeight:"bold"}}>{item.name}</h5>
                                                        <p className="card-text" style={{fontFamily:"Bodoni 72", fontSize:"1.3em", color:"#AD1F1E"}}><strong>{new Intl.NumberFormat().format(item.unit_price)}</strong> <sup>FCFA</sup></p>
                                                    </div>

                                                    <div className="card-footer">
                                                        <span style={{textAlign:"center", display:"inline-block", width:"100%"}}>vendu par: </span>
                                                        <span className="card-title text-danger" style={{textTransform:"uppercase", fontWeight:"bold"}}>{item.shop}</span>                                                    
                                                    </div>
                                                </div>
                                            </div>
                                        </NavLink>
                                    </>
                                )
                            })
                        }                                                    
                    </div>
                    <Pagination pages={ howManyPages } setCurrentPage={ setCurrentPage }/>
                </div>
        }else{
            // Aucun produit trouve
            viewproduct_HTMLTABLE =
                <div className="container-fluid w-100">
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

export default ProductList;