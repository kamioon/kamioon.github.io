import React from "react";
import Seo from "../components/Seo";
import {Link} from "react-router-dom";

class Blogs extends React.Component {
    render() {
        return (
            <div id="blog" className="blog">
                <Seo
                    title="Kamran Azari - Blog"
                    description="Blog posts by Kamran Azari on software, hardware, and side projects."
                    path="/blogs"
                />
                <h1>Blog</h1>
                <p className="post-item">
                    <Link to="/blogs/departure-timer">Departure Timer: a Chrome Extension That Tells You When to Leave for Your Train</Link>
                    <br/>
                    <small>November 2, 2026</small>
                    <br/>
                    A free, open source Chrome extension that shows the minutes left before you must leave for your next NS train.
                </p>
                <p className="post-item">
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
