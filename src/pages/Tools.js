import yamlIr from "../images/yaml_ir.jpg"
import diffrank from "../images/diffrank_com.jpg"
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
                        <h4>Diffrank</h4>
                        <p>This is an SEO Keyword research tool with a huge database!</p>
                        <p>visit <a className="target_blank" target="_blank" href="https://diffrank.com" rel="noreferrer">diffrank.com</a></p>
                    </div>
                    <div className="col-5">
                        <img className='img-responsive' src={diffrank} alt="diffrank.com"/>
                    </div>
                </div>
                {/*<div className="row">*/}
                {/*    <div className="col-5">*/}
                {/*        <h4>Gitihost</h4>*/}
                {/*        <p>It's a tools for find your fit domain name</p>*/}
                {/*        <p>visit <a className="target_blank" href="https://gitihost.com">gitihost.com</a></p>*/}
                {/*    </div>*/}
                {/*    <div className="col-5">*/}
                {/*        <img className='img-responsive' src={yamlIr} alt="Yaml.ir"/>*/}
                {/*    </div>*/}
                {/*</div>*/}
                {/*<div className="row">*/}
                {/*    <div className="col-5">*/}
                {/*        <h4>MaInja</h4>*/}
                {/*        <p>Online business directory for Iranians abroad.</p>*/}
                {/*    </div>*/}
                {/*    <div className="col-5">*/}
                {/*        <img className='img-responsive' src={yamlIr} alt="Yaml.ir"/>*/}
                {/*    </div>*/}
                {/*</div>*/}
            </div>
        )
    }
}

export default Tools;
