import Navbar from "../components/Navbar";
import {Outlet} from "react-router-dom";

const Layout = () => {
    return (
        <>
            <Navbar name="Kamran Azari"/>
            <div className='container'>
                <Outlet/>
            </div>
        </>
    )
};

export default Layout;
