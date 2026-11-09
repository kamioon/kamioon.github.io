import aboutImg from "../images/about-me.jpeg"
import React from "react";
import Seo, {PERSON, SITE_URL} from "../components/Seo";
import RoadTrip from "../components/RoadTrip";

class About extends React.Component {
    render() {
        return (
            <RoadTrip>
                <div id="about" className="about">
                    <Seo
                        title="Kamran Azari - About Me"
                        description="About Kamran Azari: a software developer in the Netherlands who has been building for the web since 2007, mostly with PHP, Python and Go."
                        path="/about"
                        type="profile"
                        jsonLd={{"@type": "ProfilePage", "mainEntity": {...PERSON, "image": SITE_URL + aboutImg}}}
                    />
                    <h1>About me</h1>
                    <img src={aboutImg} alt="Kamran Azari"/>
                    <p>
                        My name is <strong>Kamran Azari</strong>. I started web development in 2007. Now I'm a software
                        developer in the
                        Netherlands. During these years I have done various projects. Each of them had its own
                        characteristics. but usually, I've used PHP, Python, and Golang in most of them.
                    </p>
                    <p>
                        What is <a
                        href="https://twitter.com/kamioon" target="_blank" rel="nofollow noreferrer">Kamioon</a>? it comes
                        from my first name and the French/Persian word for trucks <a
                        href="https://fr.wikipedia.org/wiki/Camion" target="_blank"
                        rel="nofollow noreferrer">(کامیون)</a>, and I'm a big fan of Trucks! 🚚
                    </p>
                </div>
            </RoadTrip>
        )
    }
};

export default About;
