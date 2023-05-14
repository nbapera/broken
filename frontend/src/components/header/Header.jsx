import './Header.css'
import SRCE from './SRCE.png'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser, faBagShopping, faBell, faBars, faX } from '@fortawesome/free-solid-svg-icons'
import { faTiktok, faInstagram, faYoutube } from '@fortawesome/free-brands-svg-icons'
import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import axios from 'axios'

import all_img from './all_img.jpeg'
import rings from './rings.jpeg'
import fragrance from './fragrance.jpeg'
import faq_img from './faq_img.jpeg'
import contact_img from './contact_img.jpeg'
import sizeguide_dm from './sizeguide_dm.jpeg'

const fadeIn = {
    hidden: {
      opacity: 0,
    },
    visible: {
      opacity: 1,
      transition: {
        duration: sessionStorage.getItem('loaded') ? 3 : 1,  
        delay: 0
      },
    },
    exit: {
      opacity: 0,
    },
  };

const Header = ({ fade }) => {

    const [showCollection, setShowCollection] = useState(false)
    const [showAbout, setShowAbout] = useState(false)

    const [hamburger, setHamburger] = useState(false)

    const [cartCount, setCartCount] = useState(localStorage.getItem('cart') ? JSON.parse(localStorage.getItem('cart')).length : 0)


    const [collections, setCollections] = useState([])

    useEffect(() => {
        axios.get('https://bkneg.site/collections')
        .then(res => {
            if (res.data.status === 'ok') {
                setCollections(res.data.collections)
            }
        })
    }, [])

    useEffect(() => {
        window.onstorage = () => {
            setCartCount(localStorage.getItem('cart') ? JSON.parse(localStorage.getItem('cart')).length : 0)
        }
    }, [])

    useEffect(() => {
        var htmlTags = document.getElementsByTagName("html")
  
        if (hamburger) {
          for(var i=0; i < htmlTags.length; i++) {
            htmlTags[i].style.overflowY = "hidden";
          }
        }
  
        else {
          for(var i=0; i < htmlTags.length; i++) {
            htmlTags[i].style.overflowY = "scroll";
          }
        }
      }, [hamburger]);

    const handleColletion = () => {
        setShowAbout(false)
        setShowCollection(true)
    }

    const handleAbout = () => {
        setShowCollection(false)
        setShowAbout(true)
    }

    const handleHome = () => {
        setShowAbout(false)
        setShowCollection(false)
    }

    const Collections = ({ onMouseOver, onMouseOut }) => {

        return (
                <motion.div
                className="collections" 
                onMouseOver={onMouseOver} 
                onMouseOut={onMouseOut}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}>
                    <div className="about-flex">
                        <div className="about-left">
                            <nav>
                                <ul>
                                    <li><a href="/collection/All">ALL</a></li>


                                    {collections.map(collection =>
                                    <li><a href={`/collection/${collection.name}`}>{collection.name}</a></li>
                                    )}

                                </ul>
                            </nav>
                        </div>
                        <div className="about-right">
                            <a href={`/collection/All`} className="about-img-container">
                                <img className="about-img" src={all_img}></img>
                                <div className="about-text">All</div>
                            </a>
                            {collections[1] && collections[2] ? 
                            <><a href={`/collection/${collections[1].name}`} className="about-img-container">
                                <img className="about-img" src={rings}></img>
                                <div className="about-text">{/*collections[1] ? collections[1].name : null*/}</div>
                            </a>
                            <a href={`/collection/${collections[2].name}`} className="about-img-container">
                                <img className="about-img" src={fragrance}></img>
                                <div className="about-text">{collections[2] ? collections[2].name : null}</div>
                            </a></> : null}
                        </div>
                    </div>
                </motion.div>
        )
    }
    
    const About = ({ onMouseOver, onMouseOut }) => {
        return (
            
                <motion.div 
                    className="about"
                    onMouseOver={onMouseOver} 
                    onMouseOut={onMouseOut}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}>
                    <div className="about-flex">
                        <div className="about-left">
                            <nav>
                                <ul>
                                    <li><a href="/faq">FAQ'S</a></li>
                                    <li><a href="/contact">CONTACT</a></li>
                                    <li><a href="/sizeguide">SIZE GUIDE</a></li>
                                </ul>
                            </nav>
                        </div>
                        <div className="about-right">
                            <a href="/faq" className="about-img-container">
                                <img className="about-img" src={faq_img}></img>
                                <div className="about-text">FAQ'S</div>
                            </a>
                            <a href="/"  className="about-img-container">
                                <img className="about-img" src={contact_img}></img>
                                <div className="about-text">CONTACT</div>
                            </a>
                            <a href="/sizeguide" className="about-img-container">
                                <img className="about-img" src={sizeguide_dm}></img>
                                <div className="about-text">SIZE GUIDE</div>
                            </a>
                        </div>
                    </div>
                </motion.div>
        )
    }

    const Hamburger = () => {
        return (
            <div className="hamburger-container" onClick={() => setHamburger(false)} >
                <motion.div onClick={e => e.stopPropagation()} className="hamburger" initial={{ width: 0 }} animate={{ width: '50%' }}>
                    <div className="hamburger-top">
                        <FontAwesomeIcon onClick={() => setHamburger(false)} style={{marginRight: 10, fontSize: 20}} icon={faX} />
                    </div>
                    <div className="hamburger-mid">
                        <a href="/">Home</a>
                        <a href="/collection/All" style={{marginTop: 35}}>Collections</a>
                        <div className="hamburger-inside">
                            {collections.map(collection =>
                                <a href={`/collection/${collection.name}`}>{collection.name}</a>
                            )}
                        </div>
                        <a href="#" style={{marginTop: 35}}>About</a>
                        <div className="hamburger-inside">
                            <a href="/faq">FAQ</a>
                            <a href="/contact">CONTACT</a>
                            <a href="/sizeguide">SIZE GUIDE</a>
                        </div>
                    </div>
                    <div className="hamburger-bottom">
                        <a href="/" target="_blank"><FontAwesomeIcon icon={faTiktok} className="" /></a>
                        <a href="/" target="_blank"><FontAwesomeIcon icon={faInstagram} className="" /></a>
                        <a href="/" target="_blank"><FontAwesomeIcon icon={faYoutube} className="" /></a>
                    </div>
                </motion.div>
            </div>
        )
    }
    

  return (
    <>
        {hamburger ? <Hamburger /> : null}
        <header>
            <motion.div
                variants={fade}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="header-top">
                <div className="header-socials">
                    <a href="/" target="_blank"><FontAwesomeIcon icon={faTiktok} className="header-top-icon" /></a>
                    <a href="/" target="_blank"><FontAwesomeIcon icon={faInstagram} className="header-top-icon" /></a>
                    <a href="/" target="_blank"><FontAwesomeIcon icon={faYoutube} className="header-top-icon" /></a>
                </div>
                <div className="header-top-sale">NEW WINTER COLLECTION SALE</div>
                <div className="header-right"></div>
            </motion.div>
            <div
                className="header-bottom">
                <motion.nav
                    variants={fade}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="header-bottom-nav">
                    <ul>
                        <li><a onMouseOver={handleHome} href="/">Home</a></li>
                        <li><a onMouseOver={handleColletion} href="/collection/All">Collections</a></li>
                        <li><a onMouseOver={handleAbout} href="#">About</a></li>
                        <li><button className="header-hamburger" onClick={() => setHamburger(true)}><FontAwesomeIcon icon={faBars} /></button></li>
                    </ul>
                </motion.nav>
                <a href="/" style={{cursor: 'pointer'}}><img src={SRCE}></img></a>
                <motion.div
                    variants={fade}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="header-icons">
                    <a href={localStorage.token ? "/account" : "/account/login"}><FontAwesomeIcon icon={faUser} className="header-icon" /></a>
                    <div>
                        <div className="header-notify">{cartCount}</div>
                        <a href="/cart"><FontAwesomeIcon icon={faBagShopping} className="header-icon" /></a>
                    </div>
                    <a className="header-bell"><FontAwesomeIcon icon={faBell} className="header-icon" /></a>
                </motion.div>
            </div>
            {showCollection ? <Collections onMouseOver={() => setShowCollection(true)} onMouseOut={() => setShowCollection(false)}/> : null}
            {showAbout ? <About onMouseOver={() => setShowAbout(true)} onMouseOut={() => setShowAbout(false)}/> : null}
        </header>
    </>
  )
}

export default Header