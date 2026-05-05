import yamlIr from "../images/yaml_ir.jpg"
import diffrank from "../images/diffrank_com.jpg"
import departureCountdown from "../images/departure_countdown.jpg"
import React from "react";
import {Helmet} from "react-helmet";

class Tools extends React.Component {
    render() {
        return (
            <div id="tools" className="tools">
                <Helmet>
                    <title>Kamran Azari - Tools</title>
                    <meta
                        name="description"
                        content="Some online cool tools or project"
                    />;
                </Helmet>
                <h1>Tools</h1>
                <div className="row">
                    <div className="col-5">
                        <h4>JSON to YAML/YAML to JSON</h4>
                        <p>It's a simple online free tool for converting YAML to JSON or JSON to YAML.</p>
                        <p>visit <a className="target_blank" target="_blank" href="https://yaml.ir" rel="noreferrer">yaml.ir</a></p>
                    </div>
                    <div className="col-5">
                        <img className='img-responsive' src={yamlIr} alt="Yaml.ir"/>
                    </div>
                </div>
                <div className="row">
                    <div className="col-5">
                        <h4>Departure Countdown</h4>
                        <p>It's a small IoT device that shows live train departure countdowns, so you know exactly when to leave home.</p>
                        <p>visit <a className="target_blank" target="_blank" href="https://kamran.azari.info/departure-countdown/" rel="noreferrer">kamran.azari.info/departure-countdown</a></p>
                    </div>
                    <div className="col-5">
                        <img className='img-responsive' src={departureCountdown} alt="Departure Countdown"/>
                    </div>
                </div>

                <hr/>
                <h5>Old projects</h5>
                <div className="row" style={{opacity: 0.45, filter: "grayscale(100%)", fontSize: "0.85rem"}}>
                    <div className="col-5">
                        <h6>Diffrank</h6>
                        <p>This is an SEO Keyword research tool with a huge database!</p>
                        <p>visit <a className="target_blank" target="_blank" href="https://diffrank.com" rel="noreferrer">diffrank.com</a></p>
                    </div>
                    <div className="col-5">
                        <img className='img-responsive' src={diffrank} alt="diffrank.com" style={{maxWidth: "70%"}}/>
                    </div>
                </div>
            </div>
        )
    }
}

export default Tools;
