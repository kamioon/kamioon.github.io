import ReactDOM from "react-dom/client";
import './App.css';
import {BrowserRouter, Route, Routes} from "react-router-dom";
import Layout from "./pages/Layout";
import Home from "./pages/Home";
import Blogs from "./pages/Blogs";
import Contact from "./pages/Contact";
import NoPage from "./pages/NoPage";
import About from "./pages/About";
import Tools from "./pages/Tools";
import TagManager from 'react-gtm-module'

const tagManagerArgs = {
    gtmId: 'G-PQRJTHGRK3'
}
TagManager.initialize(tagManagerArgs)
export default function App() {
    window.dataLayer.push({
        event: 'pageview'
    });
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Layout/>}>
                    <Route index element={<Home/>} title='Welcome'/>
                    <Route path="blogs" element={<Blogs/>} title='Blog Posts'/>
                    <Route path="contact" element={<Contact/>} title='Contact Me'/>
                    <Route path="about" element={<About/>} title='About Me'/>
                    <Route path="tools" element={<Tools/>} title='Tools'/>
                    <Route path="*" element={<NoPage/>} title='Not found'/>
                </Route>
            </Routes>
        </BrowserRouter>
    );
}
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App/>);
