import {Link} from "react-router-dom";
import {Helmet} from "react-helmet-async";

const NoPage = () => {
    return (
        <div>
            <Helmet>
                <title>Kamran Azari - Page not found</title>
                <meta name="robots" content="noindex"/>
            </Helmet>
            <h1>404</h1>
            <p>This page doesn't exist. [<Link to="/">Go home</Link>]</p>
        </div>
    );
};

export default NoPage;
