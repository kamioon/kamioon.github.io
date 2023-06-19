import React from "react"
import {Link} from "react-router-dom";

class Home extends React.Component {
    componentDidMount() {
        document.title = "Kamran Azari - Welcome"
    }

    render() {
        return (
            <div className='home' id='home'>
                <h1>Kamran Azari</h1>
                <p>I'm a Software Developer Based in the Netherlands! <Link to="about">read more..</Link></p>
                <p>This is my personal website/blog and I've just created to share my thought and ideas with
                    you. [here] you can find me and contact me.
                </p>
                <hr/>
                <h2>Latest posts</h2>
                <div className='row post-list'>
                    <div>P1</div>
                </div>
                <div className='row post-list'>
                    <div>P2</div>
                </div>
            </div>
        )
    }
}

export default Home
