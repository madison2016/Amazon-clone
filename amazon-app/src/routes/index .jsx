import {createBrowserRouter} from "react-router-dom";
import Home from "../components/Home";

import SignUp from "../components/auth/SignUp";
import Login from "../components/auth/Login";
import MasterLayoutPage from "../layouts/admin/MasterLayout";

import AddTva from "../components/admin/tva/AddTva";
import ViewTva from "../components/admin/tva/ViewTva";
import EditTva from "../components/admin/tva/EditTva";

import ViewCategory from "../components/admin/category/ViewCategory";
import EditCategory from "../components/admin/category/EditCategory";
import AddCategory from "../components/admin/category/AddCategory";

import AddStore from "../components/seller/shop/AddShop";
import ViewStore from "../components/seller/shop/ViewShop";
import EditShop from "../components/seller/shop/EditShop";

import AddProduct from "../components/seller/produit/AddProduct";
import ViewProduct from "../components/seller/produit/ViewProduct";
import EditProduct from "../components/seller/produit/EditProduct";
import ShowProduct from "../components/seller/produit/ShowProduct";

import CartShop from "../components/orders/CartShop";
import Checkout from "../components/orders/checkout";
import PaymentMode from "../components/orders/paymentMode";
import AddProfile from "../components/profile/AddProfile";
import EditParams from "../components/profile/EditParams";
import ViewProfile from "../components/profile/ViewProfile";
import ViewPortfolio from "../components/portefeuille/ViewPortfolio";
import ViewAbonnement from "../components/abonnements/ViewAbonnements";
import ViewUseraccount from "../components/profile/ViewUserAccount";
import AddPaymentMode from "../components/portefeuille/AddPaymentMode";



const router = createBrowserRouter([
    {
        path: "/",
        element: <Home/>
    },
    {
        path:"/SignUp",
        element: <SignUp/>
    },
    {
        path:"/Login",
        element: <Login/>
    },
    {
        path:"/admin/add-tva",       
        element: <AddTva/>
    },
    {
        path:"/admin/view-tva",       
        element: <ViewTva/>
    },
    {
        path:"/admin/edit-tva/:id",       
        element: <EditTva/>
    },
    {
        path:"/admin/add-category",       
        element: <AddCategory/>
    },
    {
        path:"/admin/view-category",       
        element: <ViewCategory/>
    },
    {
        path:"/admin/edit-category/:id",       
        element: <EditCategory/>
    },
    {
        path:"/shop/add-shop",       
        element: <AddStore/>
    },
    {
        path:"/shop/view-shop",       
        element: <ViewStore/>
    },
    {
        path:"/shop/edit-shop/:id",       
        element: <EditShop/>
    },
    {
        path:"/produit/add-product",       
        element: <AddProduct/>
    },
    {
        path:"/produit/view-product",       
        element: <ViewProduct/>
    },
    {
        path:"/produit/edit-product/:id",       
        element: <EditProduct/>
    },
    {
        path:"/produit/show-product/:id",       
        element: <ShowProduct/>
    },
    {
        path:"/cart-shopping",       
        element: <CartShop/>
    },
    {
        path:"/checkout",       
        element: <Checkout/>
    },
    {
        path:"/payment-mode",       
        element: <PaymentMode/>
    },
    {
        path:"/add-profile/:id",       
        element: <AddProfile/>
    },
    {
        path:"/view-profile/:id",       
        element: <ViewProfile/>
    },
    {
        path:"/edit-params/:id",
        element: <EditParams/>
    },
    {
        path:"/view-portfolio/:id",
        element: <ViewPortfolio/>
    },
    {
        path:"/view-abonnement/:id",
        element: <ViewAbonnement/>
    },
    {
        path:"/view-user-account/:id",
        element: <ViewUseraccount/>
    },
    {
        path:"/view-payment-mode/:id",
        element: <AddPaymentMode/>
    }
])

export default router;
