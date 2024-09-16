export default function Validation(values) {
    
    // initialisation de la variable errors
    const errors = {};

    // definition du regex pattern de l'email
    //const email_pattern = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9-]{2,}[.][a-zA-Z]{2,4}$/;
    const email_pattern = /^[-A-Za-z0-9!#$%&'*+\/=?^_`{|}~]+(?:\.[-A-Za-z0-9!#$%&'*+\/=?^_`{|}~]+)*@(?:[A-Za-z0-9](?:[-A-Za-z0-9]*[A-Za-z0-9])?\.)+[A-Za-z0-9](?:[-A-Za-z0-9]*[A-Za-z0-9])?$/i;

    // definition du regex pattern du password
    // const password_pattern = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[a-zA-Z0-9]{8,}$/;
    //const password_pattern = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[-+!*$@%_])([-+!*$@%_\w]){8,}$/;
    const password_pattern = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[a-zA-Z0-9]{8,}$/;

    const phone_pattern = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,10}$/;
    //const phone_pattern = /^[\+]?\d{2,}?[(]?\d{2,}[)]?[-\s\.]?\d{2,}?[-\s\.]?\d{2,}[-\s\.]?\d{0,9}$/;

    if(typeof(values.name) !== "undefined"){
        if(values.name === ""){
            errors.name = "Nom requis.";
        }
    }

    if(typeof(values.nom) !== "undefined"){
        if(values.nom === ""){
            errors.nom = "Nom requis.";
        }
    }
    
    if(typeof(values.slug) !== "undefined"){
        if(values.slug === ""){
            errors.slug = "etiquette requise.";
        }
    }

    if(typeof(values.phone) !== "undefined"){
        if(values.phone === ""){
            errors.phone = "Telephone requis.";
        }else if(!phone_pattern.test(values.phone)){
            errors.phone = "Format incorrect du numero de telephone.";
        }
    }

    if(typeof(values.site_web) !== "undefined"){
        if(values.site_web === ""){
            errors.site_web = "Site web requis.";
        }
    }

    if(typeof(values.zip_code) !== "undefined"){
        if(values.zip_code === ""){
            errors.zip_code = "Boite postale requise.";
        }
    }

    if(typeof(values.adresse) !== "undefined"){
        if(values.adresse === ""){
            errors.adresse = "Adresse requise.";
        }
    }

    if(values.pays === "0"){
        errors.pays = "Pays requis.";
    }

    if(values.sexe === "0"){
        errors.sexe = "Sexe requis.";
    }

    if(values.taux < 1){
        errors.taux = "Le taux de la TVA doit etre superieur à 1%.";
    }

    if(values.selling_price < 100){
        errors.selling_price = "Le prix de vente doit etre superieur a 100 Frs.";
    }

    if(values.unit_price < 100){
        errors.unit_price = "Le prix unitaire doit etre superieur a 100 Frs.";
    }

    if(values.stock_quantity < 10){
        errors.stock_quantity = "Le stock doit etre superieur a 10 unites";
    }

    if(values.stock_alert < 10){
        errors.stock_alert = "Le niveau d'alerte doit etre superieur a 10 unites";
    }

    if(typeof(values.email) !== "undefined"){
        if(values.email === ""){
            errors.email = "Adresse email requise.";
        }else if(!email_pattern.test(values.email)){
            errors.email = "Format incorrect de l'adresse email";
        }
    }
    
    if(typeof(values.password) !== "undefined"){
        if(values.password === ""){
            errors.password = "Mot de passe requis.";
        }else if(!password_pattern.test(values.password)){        
            errors.password = "Format incorrect du mot de passe.";
        }
    }

    if(typeof(values.password) !== "undefined" ){
        if(values.password_confirmation){
            if(values.password_confirmation === "" || values.password !== values.password_confirmation){
                errors.password_confirmation = "Mots de passe non concordants.";
            }
        }
    }

    if(typeof(values.bic) !== "undefined"){
        if(values.bic === ""){
            errors.bic = "Code BIC requis.";
        }
    }

    if(typeof(values.iban) !== "undefined"){
        if(values.iban === ""){
            errors.iban = "Code IBAN requis.";
        }
    }

    if(typeof(values.nom_titulaire) !== "undefined"){
        if(values.nom_titulaire === ""){
            errors.nom_titulaire = "nom du titulaire du compte requis.";
        }
    }

    if(typeof(values.card_number) !== "undefined"){
        if(values.card_number === ""){
            errors.card_number = "Numero de la carte requis.";
        }
    }

    if(typeof(values.date_expires) !== "undefined"){
        if(values.date_expires === ""){
            errors.date_expires = "Date d'expiration de la carte requise.";
        }
    }

    if(typeof(values.nom_porteur) !== "undefined"){
        if(values.nom_porteur === ""){
            errors.nom_porteur = "Nom du porteur de la carte requis.";
        }
    }

    return errors;
}