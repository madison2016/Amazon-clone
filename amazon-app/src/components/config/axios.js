import Axios from "axios";


const axios = Axios.create({
    baseURL: "http://127.0.0.1:8000",
    xsrfCookieName: "XSRF-TOKEN",
    xsrfHeaderName: "XSRF-TOKEN",
    headers: {
        Accept: "application/json",
        Authorization: localStorage.getItem("Token")? "Bearer " + JSON.parse(localStorage.getItem("Token")) : `No Auth`
    }
    
});

//axios.interceptors.request.use(function (config){
    //const token = localStorage.getItem("Token");
    //config.headers.Authorization = token? `Bearer ${token}` : ``;

    //return config;
//});

axios.interceptors.response.use(null, (err) => {
    const error = {
        status: err.response?.status,
        origin: err,
        validation: {},
        message: null
    }

    switch(err.response?.status){
        case 422:
            for(let field in err.response.data.errors){
                err.validation[field] = err.response.data.errors[field][0];
            }
            break;

            case 403:
                error.message = "Action non authorisee."
                break;

            case 401:
                error.message = "Reconnectez-vous svp."
                break;

            case 500:
                    error.message = "Attention erreur serveur."
                    break;

            default:
            error.message = "Quelque chose n'a pas marche. Reessayez plutard."
    }

    
    return Promise.reject(error);
})

export default axios;