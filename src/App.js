import './App.css';
import {Route, Routes} from "react-router-dom";
import Layout from "./pages/Layout";
import Home from "./pages/Home";
import Blogs from "./pages/Blogs";
import BlogDepartureCountdown from "./pages/BlogDepartureCountdown";
import Contact from "./pages/Contact";
import NoPage from "./pages/NoPage";
import About from "./pages/About";
import Tools from "./pages/Tools";

// Rendered in the browser by index.js and at build time by ssr.js, so keep it free of browser-only side effects.
export default function App() {
    return (
        <Routes>
            <Route path="/" element={<Layout/>}>
                <Route index element={<Home/>} title='Welcome'/>
                <Route path="/blogs" element={<Blogs/>} title='Blog Posts'/>
                <Route path="/blogs/departure-countdown" element={<BlogDepartureCountdown/>} title='Never Miss Your Train'/>
                <Route path="/contact" element={<Contact/>} title='Contact Me'/>
                <Route path="/about" element={<About/>} title='About Me'/>
                <Route path="/tools" element={<Tools/>} title='Tools'/>
                <Route path="*" element={<NoPage/>} title='Not found'/>
            </Route>
        </Routes>
    );
}
