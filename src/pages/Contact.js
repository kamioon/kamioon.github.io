import React from "react";
import {Helmet} from "react-helmet";

class Contact extends React.Component {
    render() {
        return (
            <div id="contact" className="contact">
                <Helmet>
                    <title>Kamran Azari - Contact Me</title>
                    <meta
                        name="description"
                        content="Find me here"
                    />;
                </Helmet>
                <h1>Contact me</h1>
                <p>
                    I would love to hear from you. Whether you have a question, suggestion, or just want to say hello.
                    Feel
                    free to reach out to me
                    using social networks like Twitter or Linkedin. </p>
                <hr/>
                <ul className="social-networks">
                    <li className="twitter"><a href="https://twitter.com/kamioon" target="_blank"
                                               rel="noreferrer">Twitter</a></li>
                    <li className="linkedin"><a href="https://www.linkedin.com/in/kamranazari/" target="_blank"
                                                rel="noreferrer">Linkedin</a></li>
                    <li className="github"><a href="https://github.com/kamioon" target="_blank"
                                              rel="noreferrer">Github</a>
                    </li>
                    <li className="stackoverflow"><a href="https://stackoverflow.com/users/7238282/kamran"
                                                     target="_blank"
                                                     rel="noreferrer">stackoverflow</a></li>
                </ul>
            </div>
        )
    }
};

export default Contact;
