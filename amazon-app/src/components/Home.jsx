//on commence par importer React ainsi que les hocks utiles
import React,  { useEffect, useState } from "react";
import { ProductsContext } from "../Hooks/ProductsContext";
import ProductList from "./seller/produit/ListProducts";
import FrontEndNavBar from "./FrontEnd/NavBar";
import Footer from "./FrontEnd/Footer";
import "./landing.css";


function Home() {

    const [productTabs, setProductTabs] = useState([]);    
    
    return (
        <ProductsContext.Provider value={[productTabs, setProductTabs]}>
            <div className="wrapper">
                <div id="content-wrapper" className="d-flex flex-column">
                    <div id="content">
                        <div className="container-fluid">
                            <div className="justify-content-md-center">
                                <FrontEndNavBar/>
                            </div>

                            <div className="row">
                                <ProductList/>
                            </div>
                        </div>                        
                    </div>                    
                </div>

                <div className="sticky-footer bg-white">
                    <Footer/>
                </div>
            </div>
        </ProductsContext.Provider>        
    );
}

export default Home;
