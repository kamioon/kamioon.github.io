import React from "react"
import {Link} from "react-router-dom";
import Seo, {PERSON} from "../components/Seo";

class Home extends React.Component {
    render() {
        return (
            <div className='home' id='home'>
                <Seo
                    title="Kamran Azari"
                    description="Personal website and blog of Kamran Azari, a software developer based in the Netherlands, writing about software, IoT and side projects."
                    path="/"
                    jsonLd={PERSON}
                />
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
