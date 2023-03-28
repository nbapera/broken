import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Header from '../../components/header/Header'
import axios from 'axios'
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";

import './Checkout.css'

const Checkout = () => {

    const [products, setProducts] = useState()

    const [items, setItems] = useState(localStorage.getItem('cart') ? JSON.parse(localStorage.getItem('cart')) : []) 

    const [stage, setStage] = useState(1)

    const [email, setEmail] = useState("")
    const [country, setCountry] = useState("")
    const [firstName, setFirstName] = useState("")
    const [lastName, setLastName] = useState("")
    const [address, setAddress] = useState("")
    const [apartment, setApartment] = useState("")
    const [city, setCity] = useState("")
    const [postalCode, setPostalCode] = useState("")
    const [phoneNumber, setPhoneNumber] = useState("")
    const [state, setState] = useState("")

    const [error, setError] = useState(false)

    const [subtotal, setSubtotal] = useState(0)

    const [building, setBuilding] = useState("")
    const [floor, setFloor] = useState("")

    const [link, setLink] = useState("")

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

      const continueToStage2 = () => {

        if (!email || !country || !apartment || !building || !floor || !firstName || !lastName || !phoneNumber || !postalCode || !state || !address) {
          setError(true)
          return
        }

        const billingData = {
          apartment: apartment.toString(),
          email: email.toString(),
          floor: floor.toString(),
          first_name: firstName.toString(),
          street: address.toString(),
          building: building.toString(),
          phone_number: phoneNumber.toString(),
          shipping_method: "PKG",
          postal_code: postalCode.toString(),
          city: city.toString(),
          country: "CR",
          last_name: lastName.toString(),
          state: state.toString()
        }

        console.log({ billingData })

        axios.post('http://178.148.119.105:5000/checkout', {amount: subtotal * 100 * 32.51, billing_data: billingData})
        .then(res => {
          setLink(res.data.link)
        })

        setStage(2)
      }

    const CartProduct = ({ name, size, color, quantity, img, price }) => {

        return (
          <motion.div className="checkout-product">
            <div className="co-flex">
              <img src={img} className="co-img"></img>
              <div className="co-content">
                <h1>{name}</h1>
                <div> {size} / {color} </div>
              </div>
            </div>
            <div className="co-right">
              <div className="co-qty">{quantity}</div>
              <div className="co-price">${price * quantity} USD</div>
            </div>
          </motion.div>
        )
      }

  return (
    <>
      <Header />
      <PayPalScriptProvider>
          
              {stage === 1 ? 
                <div className="checkout">
                  <div className="checkout-left">
                    <div className="checkout-input-cnt">
                        <label>Contact Information</label>
                        <br></br>
                        <input style={error && !email ? {border: '0.1vh solid #ff2424'} : {border: '0.1vh solid #d9d9d9'}} placeholder="Email" onChange={e => setEmail(e.target.value)} value={email}></input>
                    </div>
                    <div className="checkout-input-cnt">
                        <label>Shipping information</label>
                        <br></br>
                        <input style={error && !country ? {border: '0.1vh solid #ff2424'} : {border: '0.1vh solid #d9d9d9'}} placeholder="Country / Region" onChange={e => setCountry(e.target.value)} value={country}></input>
                    </div>
                    <div className="co-si">
                        <input style={error && !firstName ? {border: '0.1vh solid #ff2424'} : {border: '0.1vh solid #d9d9d9'}} placeholder="First Name" onChange={e => setFirstName(e.target.value)} value={firstName}></input>
                        <input style={error && !lastName ? {border: '0.1vh solid #ff2424'} : {border: '0.1vh solid #d9d9d9'}} placeholder="Last Name" onChange={e => setLastName(e.target.value)} value={lastName}></input>
                    </div>
                    <input style={error && !address ? {border: '0.1vh solid #ff2424'} : {border: '0.1vh solid #d9d9d9'}} placeholder="Address" onChange={e => setAddress(e.target.value)} value={address}></input>
                    <div className="co-si">
                      <input style={error && !phoneNumber ? {border: '0.1vh solid #ff2424'} : {border: '0.1vh solid #d9d9d9'}} placeholder="Phone Number" onChange={e => setPhoneNumber(e.target.value)} value={phoneNumber}></input>
                      <input style={error && !state ? {border: '0.1vh solid #ff2424'} : {border: '0.1vh solid #d9d9d9'}} placeholder="State" onChange={e => setState(e.target.value)} value={state}></input>
                    </div>
                    <div className="co-si">
                        <input style={error && !building ? {border: '0.1vh solid #ff2424'} : {border: '0.1vh solid #d9d9d9'}} placeholder="Building Number" onChange={e => setBuilding(e.target.value)} value={building}></input>
                        <input style={error && !floor ? {border: '0.1vh solid #ff2424'} : {border: '0.1vh solid #d9d9d9'}} placeholder="Floor" onChange={e => setFloor(e.target.value)} value={floor}></input>
                    </div>
                    <input style={error && !apartment ? {border: '0.1vh solid #ff2424'} : {border: '0.1vh solid #d9d9d9'}} placeholder="Apartment, suite, etc." onChange={e => setApartment(e.target.value)} value={apartment}></input>
                    <div className="co-si">
                        <input style={error && !city ? {border: '0.1vh solid #ff2424'} : {border: '0.1vh solid #d9d9d9'}} placeholder="City" onChange={e => setCity(e.target.value)} value={city}></input>
                        <input style={error && !postalCode ? {border: '0.1vh solid #ff2424'} : {border: '0.1vh solid #d9d9d9'}} placeholder="Postal Code" onChange={e => setPostalCode(e.target.value)} value={postalCode}></input>
                    </div>
                    <button className="checkout-btn" onClick={continueToStage2}>Continue to shipping</button>
                  </div>
                  <div className="checkout-right">
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
                </div>
              : stage === 2 ?
              <motion.div
                className="checkout-frame"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}>
                  <iframe src={link}></iframe> 
              </motion.div>
            : null}
      </PayPalScriptProvider>
    </>
  )
}

export default Checkout