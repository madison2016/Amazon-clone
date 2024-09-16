import React from "react";

function Footer () {

    var dateJour = new Date();

    return (
        <footer className="bg-dark bg-gradient-dark text-white">
            <div className="container my-auto">
                <div className="copyright text-center my-auto">
                    <span>Copyright &copy; amazon-clone{dateJour.getFullYear()}</span>
                </div>
            </div>
        </footer>
    )
}

export default Footer;