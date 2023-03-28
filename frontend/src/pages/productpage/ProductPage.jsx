import './ProductPage.css'
import { useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faMinus, faAngleLeft, faAngleRight } from '@fortawesome/free-solid-svg-icons'

import Product from '../../components/product/Product'
import Header from '../../components/header/Header'
import { motion, AnimatePresence } from 'framer-motion'

const ProductPage = ({ dispatch }) => {

    const { name } = useParams()

    const [_name, setName] = useState()
    const [price, setPrice] = useState()
    const [sizes, setSizes] = useState([])
    const [color, setColor] = useState([])
    const [collection, setCollection] = useState()
    const [availableQuantity, setAvailableQuantity] = useState()
    const [quantityObj, setQuantityObj] = useState({})
    const [quantity, setQuantity] = useState(1)
    const [url, setUrl] = useState([])

    const [currentImage, setCurrentImage] = useState(0)

    const [notification, setNotification] = useState(false)

    const [products, setProducts] = useState([])

    const [selectedSize, setSelectedSize] = useState()
    const [selectedColor, setSelectedColor] = useState()

    const handlePlus = () => {
      if (typeof quantity === 'number' && quantity < availableQuantity) {
        setQuantity(quantity + 1)
      }
    }

    const handleMinus = () =>  {
      if (typeof quantity === 'number' && quantity < availableQuantity && quantity > 1) {
        setQuantity(quantity - 1)
      }
      else {
        setQuantity(1)
      }
    }

    const handleQuantity = e => {

      if (typeof e.target.value !== 'number') {
        for (var i = 0; i < sizes.length; i++) {
          if (selectedSize === sizes[i]) {
            setAvailableQuantity(sizes[i])
          }
        }
        setQuantity(1)
      }

      if (typeof e.target.value === 'number' && e.target.value > availableQuantity) {
        setQuantity(availableQuantity)
      }

      if (typeof e.target.value === 'number' && e.target.value < 1) {
        setQuantity(1)
      }

    }

    const handleCart = () => {

      if (!selectedSize || !selectedColor) {
        alert("Color size")
        return
      }

      const cart = {
        quantity: quantity,
        name: name,
        color: selectedColor,
        size: selectedSize,
        price: price
      }

      if (localStorage.getItem('cart')) {
        const storedItems = JSON.parse(localStorage.getItem('cart'))
        storedItems.push(cart)
        localStorage.setItem('cart', JSON.stringify(storedItems))
      }

      else {
        const cartArray = new Array()
        cartArray.push(cart)
        localStorage.setItem('cart', JSON.stringify(cartArray))
      }

      window.dispatchEvent( new Event('storage') )

      setNotification(true)

      const interval = setInterval(() => {
        setNotification(false)
        clearInterval(interval)
      }, 3000)

    }

    const handleImageChange = (up) => {
      if (up === true && currentImage < url.length - 1) {
        setCurrentImage(currentImage + 1)
      }
      else if (up !== true && currentImage > 0) {
        setCurrentImage(currentImage - 1)
      }
    }

    useEffect(() => {

      if (!name) {
        window.location.href="/"
      }

      axios.get(`http://178.148.119.105:5000/product/${name}`)
      .then(res => {
        if (res.data.status === 'ok') {
          setName(res.data.name)
          setPrice(res.data.price)
          setSizes(res.data.sizes)
          setColor(res.data.color)
          setQuantityObj(res.data.quantity)
          setUrl(res.data.url)
          setProducts(res.data.similar_products)

          setSelectedSize(Object.keys(res.data.sizes)[0])
          setSelectedColor(res.data.color[0])

        }
        else {
          window.location.replace("/404")
        }
      })

    }, [])

    const Notification = () => {
      return (
          <motion.div 
            className="notification"
            initial={{ opacity: 0 }}
            animate={{opacity: 1}}
            exit={{ opacity: 0 }}
            >
            <img src={url[currentImage]}></img>
            <div className="notification-text">
              <h1>Item added to cart</h1>
              <a href="/cart">CART</a>
              <button onClick={() => {
                setNotification(false)
                }}>Keep shopping</button>
            </div>
          </motion.div>
      )
    }

  return (
    <>
      <Header />
        <div className="pp-container">
          <AnimatePresence>{notification ? <Notification /> : null}</AnimatePresence>
          <div className="pp-left">
            <div className="pp-left-img-container">
              <button onClick={() => handleImageChange(false)} className="pp-prev-img"><FontAwesomeIcon icon={faAngleLeft}/></button>
              <img className="pp-img" src={url[currentImage]}></img>
              <button onClick={() => handleImageChange(true)} className="pp-next-img"><FontAwesomeIcon icon={faAngleRight}/></button>
            </div>
          </div>
          <div className="pp-right">
            <h1>{name}</h1>
            <div className="pp-price">${price} USD</div>
            <div className="pp-sizes">
              <h1>Size</h1>

              {sizes.map(size => 
                <button className="size-btn" 
                onClick={() => {
                  setSelectedSize(size)
                  setAvailableQuantity(quantityObj[(Object.keys(quantityObj).filter(element => element == selectedSize + "/" + selectedColor)).toString()])
                  setQuantity(1)
                }}
                style={size === selectedSize ? {border: '0.2vh solid #666666'} : {border: '0.2vh solid #c5c5c5'}}>
                  {size}</button>)}

            </div>
            <div className="pp-colors">
              <h1>Color {collection}</h1>

              {color.map(clr => 
                <button className="color-btn" 
                onClick={() => {
                  setSelectedColor(clr)
                  setAvailableQuantity(quantityObj[(Object.keys(quantityObj).filter(element => element == selectedSize + "/" + selectedColor)).toString()])
                  setQuantity(1)

                }}
                style={clr === selectedColor ? {border: '0.2vh solid #666666'} : {border: '0.2vh solid #c5c5c5'}}>
                  {clr}</button>)}

            </div>
            <div className="pp-quantity">
              <h1>Quantity</h1>
              <button className="quantity-btn" onClick={handlePlus}><FontAwesomeIcon icon={faPlus}/></button>
              <input className="quantity-input" value={quantity} onChange={e => handleQuantity(e)}></input>
              <button className="quantity-btn" onClick={handleMinus}><FontAwesomeIcon icon={faMinus}/></button>
            </div>
            <div className="cb-container">
              <button className="purchase-btn" onClick={handleCart}>Add to Cart</button>
            </div>
          </div>
        </div>
        <div className="pp-other">
          <h1 className="pp-other-title">You may also like</h1>
            <div className="other-products">
              {products ? products.map(({name, sizes, price, url}) => 
                <Product 
                  link={`/products/${name}`} 
                  price={price} 
                  sizes={sizes}
                  img={url[0]}
                  name={name}/>) : null}
            </div>
        </div>
    </>
  )
}

export default ProductPage