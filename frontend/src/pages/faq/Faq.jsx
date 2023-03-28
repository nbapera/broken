import Header from '../../components/header/Header'
import './Faq.css'

const Faq = () => {
  return (
    <>
        <Header />
        <div className="faq">
            <h1 className="faq-main-title">BROKEN FAQ'S</h1>
            <div className="faq-cnt">
                <h1 className="faq-title">Return policy?</h1>
                <div className="faq-text">We don’t allow returns just size exchange. If you would like to exchange size you will pay for the shipping cost. No international returns or size exchanges. Please double and triple check your size before making a purchase.</div>
            </div>
            <div className="faq-cnt">
                <h1 className="faq-title">Do you ship to the USA? </h1>
                <div className="faq-text">We are based in Egypt but we ship worldwide. </div>
            </div>
            <div className="faq-cnt">
                <h1 className="faq-title">How long do orders take to ship? </h1>
                <div className="faq-text">Please allow us 1-2 weeks to package your order. Local orders should take around 3-5 business days. International orders could take up to 3 weeks depending on your location.</div>
            </div>
        </div>
    </>
  )
}

export default Faq