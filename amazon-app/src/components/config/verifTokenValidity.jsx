export default function hasExpires(expires_at){

    let dateJour = new Date();
    let dateToken = new Date(expires_at.date);
    let status = (dateJour.getTime() > dateToken.getTime())? false : true;
    

    //if(dateJour.getTime() > dateToken.getTime()){
        // redirection vers login pour reconnexion
        //status = false;
    //}else{
        //status = true;
    //}

    return status;
}