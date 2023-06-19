import React from "react";
import {Helmet} from "react-helmet";

class Blogs extends React.Component {
    render() {
        return (
            <div id="blog" className="blog">

                <Helmet>
                    <title>Kamran Azari - Blog Posts</title>
                    <meta
                        name="description"
                        content="latest blog posts of me"
                    />
                    ;
                </Helmet>
                <p>
                    There are no posts available :(
                </p>
            </div>
        )
    }
}

export default Blogs;
