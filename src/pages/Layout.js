import Navbar from "../components/Navbar";
import {Outlet} from "react-router-dom";
import {HelmetProvider} from "react-helmet-async";

const Layout = () => {
    return (
        <HelmetProvider>
            <Navbar name="Kamran Azari"/>
            <div className='container'>
                <Outlet/>
            </div>
        </HelmetProvider>
    )
};

export default Layout;
