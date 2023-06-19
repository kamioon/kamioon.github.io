import Navbar from "../components/Navbar";
import {Outlet} from "react-router-dom";
import Container from "react-bootstrap/Container";

const Layout = () => {
    return (
        <>
            <Navbar name="Kamran Azari"/>
            <Container>
                <Outlet/>
            </Container>
        </>
    )
};

export default Layout;
