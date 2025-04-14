import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import injectContext from "./store/appContext.js";
import ScrollToTop from "./component/ScrollToTop.jsx";
import { BackendURL } from "./component/BackendURL.jsx";
import { Navbar } from "./component/Navbar.jsx";
import { Footer } from "./component/Footer.jsx";
import { Home } from "./pages/Home.jsx";
import { Error404 } from "./pages/Error404.jsx";
import Login from "./pages/Login.jsx";
import Profile from "./pages/Profile.jsx";
import { Order } from "./pages/Order.jsx";
import { Entities } from "./pages/Entities.jsx";
import { OrderCard } from "./component/order/OrderCard.jsx";

const Layout = () => {
    const basename = process.env.BASENAME || "";
    if (!process.env.BACKEND_URL || process.env.BACKEND_URL == "") return <BackendURL />;

    return (
        <div className="d-flex flex-column min-vh-100">
            <BrowserRouter basename={basename}>
                <ScrollToTop>
                    <Navbar />
                    <Routes>
                        <Route element={<Home />} path="/" />
                        <Route element={<Login />} path="/login" />
                        <Route element={<Profile />} path="/profile" />
                        <Route element={<Order />} path="/order" />
                        {/* quitar al terminar */}
                        <Route element={<OrderCard />} path="/orderNew" />
                        
                        <Route element={<Entities />} path="/entities" />
                        <Route element={<Error404 />} path="*" />
                    </Routes>
                    <Footer />
                </ScrollToTop>
            </BrowserRouter>
        </div>
    );
};

export default injectContext(Layout);

