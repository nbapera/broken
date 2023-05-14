import { useState } from 'react'
import Header from '../../components/header/Header'
import './Contact.css'
import axios from 'axios'

const Contact = () => {

    const [email, setEmail] = useState("")
    const [name, setName] = useState("")
    const [message, setMessage] = useState("")

    const handleSubmit = () => {

        if (!name || !email || !message) {return}

        axios.post(`https://bkneg.site/contact`, { name, email, message })
        .then(res => {
          if (res.data.status === 'ok') {
            window.location.href="/"
          }
        })
    }

  return (
    <div>
        <Header />
        <div className="contact-cnt">
            <h1>Contact</h1>
            <input onChange={(e) => setName(e.target.value)} value={name} placeholder="Name"></input>
            <input onChange={(e) => setEmail(e.target.value)} value={email} placeholder="Email"></input>
            <textarea onChange={(e) => setMessage(e.target.value)} value={message} placeholder="Your inquiry"></textarea>
            <input onClick={() => console.log('a')} placeholder="Submit" className="input-button" type="submit"></input>
        </div>
    </div>
  )
}

export default Contact