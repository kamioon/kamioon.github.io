import {useLocation, useNavigate} from "react-router-dom";
import Truck from "./Truck";

// What the trailer says on each page (the default is the Persian word for truck).
const TAGLINES = [['/blogs', 'BLOG'], ['/tools', 'TOOLS'], ['/contact', 'SAY HELLO']];
const DEFAULT_TAGLINE = 'کامیون';

// The little truck at the bottom of every page: click it to honk, and it takes you to the About page, which has its
// own, bigger truck in the road scene.
export default function Footer() {
    const {pathname} = useLocation();
    const navigate = useNavigate();
    if (pathname.startsWith('/about')) return null;
    const match = TAGLINES.find(([path]) => pathname.startsWith(path));
    return (
        <footer className="truck-footer">
            <Truck tagline={match ? match[1] : DEFAULT_TAGLINE}
                   label="Honk the horn, then go to the About page"
                   afterHonk={() => {
                       navigate('/about');
                       window.scrollTo(0, 0);
                   }}/>
        </footer>
    );
}
