import yamlIr from "../images/yaml_ir.jpg"

const Tools = () => {
    return (
        <div id="tools" className="tools">
            <h1>Tools</h1>
            <div className="row">
                <div className="col-5">
                    <h4>JSON to YAML/YAML to JSON</h4>
                    <p>It's a simple online free tools for convert YAML to JSON or JSON to YAML</p>
                    <p>visit <a className="target_blank" href="https://yaml.ir">yaml.ir</a></p>
                </div>
                <div className="col-5">
                    <img className='img-responsive' src={yamlIr} alt="Yaml.ir"/>
                </div>
            </div>
            <div className="row">
                <div className="col-5">
                    <h4>Gitihost</h4>
                    <p>It's a tools for find your fit domain name</p>
                    <p>visit <a className="target_blank" href="https://gitihost.com">gitihost.com</a></p>
                </div>
                <div className="col-5">
                    <img className='img-responsive' src={yamlIr} alt="Yaml.ir"/>
                </div>
            </div>
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
};

export default Tools;
