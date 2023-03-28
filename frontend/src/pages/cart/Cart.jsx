import axios from 'axios'
import { useEffect, useState } from 'react'
import './Cart.css'
import Header from '../../components/header/Header'
import { motion } from 'framer-motion'

const Cart = () => {

  const [products, setProducts] = useState()
  const [items, setItems] = useState(localStorage.getItem('cart') ? JSON.parse(localStorage.getItem('cart')) : [])  

  const [checkoutDisabled, setCheckoutDisabled] = useState(false)

  const [subtotal, setSubtotal] = useState(0)

  useEffect(() => {
    axios.post("http://178.148.119.105:5000/cart", {items})
    .then(res => {
      if (res.data.status === 'ok') {
        setProducts(res.data.products)
      }
    })
  }, [])

  useEffect(() => {

    const sum = items.reduce((prev, item) => parseFloat(item.price) * parseFloat(item.quantity) + parseFloat(prev), 0);

    setSubtotal(sum)

  }, [items])


  const CartProduct = ({ name, size, color, quantity, img, price }) => {

    const handleRemove = () => {
      var cart = JSON.parse(localStorage.getItem('cart'))
      const index = cart.map(e => e.name).indexOf(name);
      cart.splice(index, 1);
      localStorage.setItem('cart', JSON.stringify(cart))
      setItems(localStorage.getItem('cart') ? JSON.parse(localStorage.getItem('cart')) : [])  
    }
  
    return (
      <motion.div
        className="cart-product"
        initial={{opacity: 0}}
        animate={{opacity: 1}}
        exit={{opactiy: 0}}
      >
        <div className="cp-flex">
          <img src={img} className="cp-img"></img>
          <div className="cp-content">
            <h1>{name}</h1>
            <div> {size} / {color} </div>
          </div>
        </div>
        <div className="cp-right">
          <div className="cp-qty">{quantity}</div>
          <div className="cp-price">${price * quantity} USD</div>
          <button onClick={handleRemove}>Remove</button>
        </div>
      </motion.div>
    )
  }


  return (
    <>  
      <Header />
      <div className="cart">
        <h1 className="cart-title">Shopping Cart</h1>
          <div className="cart-products">
            {items.map((item, index) => 
              <CartProduct
                name={item.name}
                price={item.price}
                color={item.color}
                size={item.size}
                quantity={item.quantity}
                img={products ? products[index].url[0] : null}
              />)}
          </div>
          <div className="cart-btn-container">
            <h1 className="cart-subtotal">Subtotal: ${subtotal} USD</h1>
            <a className="cart-checkout" href={subtotal === 0 ? "#" : "/checkout"} style={ subtotal === 0 ? {cursor: 'not-allowed'} : {cursor: 'pointer'}}>Checkout</a>
          </div>
      </div>
    </>
  )

}

export default Cart
