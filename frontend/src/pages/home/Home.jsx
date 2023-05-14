import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import Product from '../../components/product/Product'
import Header from '../../components/header/Header'
import Loader from '../../components/loader/Loader'
import axios from 'axios'
import './Home.css'

import home_img from './home_img.jpeg'

const fadeIn = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: {
      duration: 3,    
      delay: 4.5
    },
  },
  exit: {
    opacity: 0,
  },
};

const Banner = () => {
  return (
    <div className="home-banner">
      <div className="home-img">
      </div> 
    </div>
  )
}

const HomeSeller = ({ children }) => {
  return (
    <div className="home-sellers-container">
      <h1>BEST SELLERS</h1>
      <div className="home-sellers">
        {children}
      </div>
    </div>
  )
}

const Home = () => {

  const [products, setProducts] = useState()  
  const [loading, setLoading] = useState(sessionStorage.getItem('loaded') ? false : true)

  useEffect(() => {
    axios.get(`https://bkneg.site/featured-products`)
    .then(res => {
      if (res.data.status === 'ok') {
        if (res.data.product) {
          setProducts(res.data.product)
        }
      }
    })
  }, [])

  useEffect(() => {
    setInterval(() => {
      setLoading(false)
      sessionStorage.setItem('loaded', true)
    }, 4800)
  }, [])

  function preventScroll(e){
    e.preventDefault();
    e.stopPropagation();

    return false;
  } 

  useEffect(() => {
    var htmlTags = document.getElementsByTagName("html")

    if (loading) {
      for(var i=0; i < htmlTags.length; i++) {
        htmlTags[i].style.overflowY = "hidden";
      }
    }

    else {
      for(var i=0; i < htmlTags.length; i++) {
        htmlTags[i].style.overflowY = "scroll";
      }
    }
  }, [loading]);




  return (
    <>
      {loading ? <Loader /> : null}
      <Header fade={loading ? fadeIn : null} />
      <motion.div
        className="home"
        variants={loading ? fadeIn : null}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        <Banner />
        <HomeSeller>
          {products ? products.map(({name, sizes, price, url}) => 
          <Product 
            link={`/products/${name}`} 
            price={price} 
            sizes={sizes}
            img={url[0]}
            name={name}/>) : null}
        </HomeSeller>
        <div className="mission">
          <div className="mission-cnt">
            <h1>Mission and Vision</h1>
            <div>
              What began as an unwanted feeling, quickly transformed into an inspiration to embrace and encourage. We must embrace vulnerability within ourselves as much as we celebrate toughness. Being vulnerable is part of being human. We’re all broken one way or another.  Our mission is to connect and inspire you to pick yourself up and piece everything back together. 
              At the heart of everything we do lies the limitless love, acceptance and compassion. We aspire to connect with our community and spread comfort and warmth. With our insane obsession to detail and our untamed loyalty to our community … welcome to BROKEN.</div>
            </div>
        </div>
      </motion.div> 
    </>
  )

}

export default Home