import React from "react"
import {Link} from "react-router-dom";
import {Helmet} from "react-helmet";

class Home extends React.Component {
    render() {
        return (
            <div className='home' id='home'>
                <Helmet>
                    <title>Kamran Azari</title>
                    <meta
                        name="description"
                        content="This is a personal website. content about web development and programming or my experiences found in it."
                    />;
                </Helmet>
                <h1>Kamran Azari</h1>
                <p>I'm a Software Developer Based in the Netherlands! [<Link to="about">read more</Link>]</p>
                <p>This is my personal website/blog; I've just created it to share my thoughts and ideas with
                    you. you can find me and contact me [<Link to="contact">Here</Link>].
                </p>
                <hr/>
                {/*<h2>Latest posts</h2>*/}
                {/*<div className='row post-list'>*/}
                {/*    <div>P1</div>*/}
                {/*</div>*/}
                {/*<div className='row post-list'>*/}
                {/*    <div>P2</div>*/}
                {/*</div>*/}
            </div>
        )
    }
}

export default Home
