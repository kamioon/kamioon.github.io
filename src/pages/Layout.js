import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import {Outlet} from "react-router-dom";

const Layout = () => {
    return (
        <div className='page'>
            <Navbar name="Kamran Azari"/>
            <div className='container'>
                <Outlet/>
            </div>
            <Footer/>
        </div>
    )
};

export default Layout;
