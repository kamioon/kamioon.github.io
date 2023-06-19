import aboutImg from "../images/about-me.jpeg"

const About = () => {
    return (
        <div id="about" className="about">
            <h1>About me</h1>
            <img src={aboutImg} alt="Kamran Azari"/>
            <p>
                My name is <strong>Kamran Azari</strong> as know <a
                href="https://twitter.com/kamioon" target="_blank" rel="nofollow noreferrer">Kamioon</a> (it comes from my
                firstname and persian word truck '<a
                href="https://fa.wikipedia.org/wiki/%DA%A9%D8%A7%D9%85%DB%8C%D9%88%D9%86" target="_blank"
                rel="nofollow noreferrer">کامیون</a>' as I'm
                fan of Truck! 🚚 ). I've started web developing since 2007. Now I'm a software developer in the
                Netherlands. I've been working on
                <br/>
                In 2008 I founded <a href="https://gitihost.com" target="_blank" rel="noreferrer">Gitihost</a> It
                was
                a
                Web Hosting
                service provider. In 2013 I joined <a href="https://fidibo.com" target="_blank"
                                                      rel="noreferrer">Fidibo</a> when it was a small startup and
                after
                while I 've decided to stop working on Gitihost. During these years I have done various projects.
                Each of them has its own characteristics and I used PHP, Python and Golang in most of them.
            </p>
        </div>
    )
};

export default About;
