import {Link} from "react-router-dom";

function TopNavbar(props) {
    return (
        <nav className="container">
            <ul>
                <li>
                    <a href="/">
                        <img src='/favicon-32x32.png' alt='Kamran'/>
                    </a>
                </li>
                <li>
                    <Link to="/blogs">Posts</Link>
                </li>
                <li>
                    <Link to="/tools">Tools</Link>
                </li>
                <li>
                    <Link to="/contact">Contact</Link>
                </li>
                <li>
                    <Link to="/about">About</Link>
                </li>
            </ul>
        </nav>
    );
}

export default TopNavbar;


