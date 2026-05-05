import React from "react";
import {Helmet} from "react-helmet";
import {Link} from "react-router-dom";

class Blogs extends React.Component {
    render() {
        return (
            <div id="blog" className="blog">
                <Helmet>
                    <title>Kamran Azari - Blog</title>
                    <meta
                        name="description"
                        content="Blog posts by Kamran Azari on software, hardware, and side projects."
                    />
                </Helmet>
                <h1>Blog</h1>
                <p>
                    <Link to="/blogs/departure-countdown">Building a Smart Train Departure Countdown Display with ESP32</Link>
                    <br/>
                    <small>May 5, 2025</small>
                    <br/>
                    A wall-mounted MAX7219 dot-matrix display on an ESP32-S3 that counts down to when you need to leave — not when the train departs.
                </p>
            </div>
        )
    }
}

export default Blogs;
