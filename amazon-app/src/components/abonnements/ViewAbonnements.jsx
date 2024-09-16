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


function ViewAbonnement(){

    // pour tester la validite du token
    let currentUser = JSON.parse(localStorage.getItem("loggedUser")); 
    let tokenIsValid = hasExpires(JSON.parse(localStorage.getItem("Expires_at")));
      
    const [loading, setLoading] = useState(true);
    const [errors, setErrors] = useState([]);

    return (
        <div className="py-4">
            <div className="container-md">
                <div className="row">
                    <h2 className="p-2 mb-5 mt-0 bg-secondary" style={{margin:"3% 0"}}>
                        <NavLink to={`/view-profile/${currentUser.id}`} className="btn btn-link-light btn-lg col-3 text-white">Informations personnelles</NavLink>
                        <NavLink to={`/edit-params/${currentUser.id}`} className="btn btn-link-light btn-lg col-3 text-white">Paramètres de Sécurité</NavLink>
                        <NavLink to={`/view-portfolio/${currentUser.id}`} className="btn btn-link-light btn-lg col-3 text-white">Portefeuille</NavLink>
                        <NavLink to={"#"} className="btn btn-link-light btn-lg col-3 active text-white">Abonnements</NavLink>
                    </h2>

                    <div className="row">
                        <h2 className="bg-bg-light w-100 text-dark-50 text-center mb-2" style={{paddingBottom:"1%"}}>Vos Abonnements</h2>
                    
                        <div className="col-md-12 p-1 text-center">

                        </div>
                    </div>
                </div>
            </div>
        </div>
    )

}

export default ViewAbonnement;