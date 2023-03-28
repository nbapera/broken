import './Footer.css'
import brokentxdt from './brokentxdt.png'

const Footer = () => {
  return (
    <footer>
        <div className="footer-top">
            <nav>
                <ul>
                    <li><a href="/faq">faq</a></li>
                    <li><a href="/sizeguide">size guide</a></li>
                    <li><a href="/rax">returns &amp; exchanges</a></li>
                    <li><a href="/tos">terms &amp; conditions</a></li>
                    <li><a href="/pp">privacy policy</a></li>
                </ul>
            </nav>


        </div>
        <div className="footer-bottom">
          <div className="footer-copyright">© 2022 BROKEN.</div>
          <img src={brokentxdt}></img>
        </div>
    </footer>
  )
}

export default Footer