export default function formatDate(date_value){

    var myDate  = new Date(date_value);
    var Jour = myDate.getDate();
    var Mois = myDate.getMonth() + 1; //Month from 0 to 11
    var Annee = myDate.getFullYear();

    return ((Jour < 10 ? "0"+Jour : Jour)+"/"+(Mois < 10 ? "0"+Mois : Mois)+"/"+Annee);
}