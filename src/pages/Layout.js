import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Sky from "../components/Sky";
import {Outlet} from "react-router-dom";

const Layout = () => {
    return (
        <div className="page">
            <Sky/>
            <Navbar name="Kamran Azari"/>
            <div className='container'>
                <Outlet/>
            </div>
            <Footer/>
        </div>
    )
};

export default Layout;
