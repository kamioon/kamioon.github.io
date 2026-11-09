import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import {Outlet, useLocation} from "react-router-dom";

const Layout = () => {
    const {pathname} = useLocation();
    // The About page has a full-width scene that runs up behind the navbar.
    const scene = pathname.startsWith('/about');
    return (
        <div className={scene ? 'page page--scene' : 'page'}>
            <Navbar name="Kamran Azari"/>
            <div className='container'>
                <Outlet/>
            </div>
            <Footer/>
        </div>
    )
};

export default Layout;
