import './Register.css'
import axios from 'axios'
import { useState } from 'react'
import Header from '../../components/header/Header'

const Register = () => {

  const [firstname, setFirstname] = useState("")
  const [lastname, setLastname] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const [fnError, setFnError] = useState(false)
  const [lnError, setLnError] = useState(false)
  const [emError, setEmError] = useState(false)
  const [pwError, setPwError] = useState(false)

  const [error, setError] = useState("")

  const handleSubmit = () => {


    if (!firstname) {
      setFnError(true)
    }
    else {
      setFnError(false)
    }

    if (!lastname) {
      setLnError(true)
    }
    else {
      setLnError(false)
    }

    if (!email) {
      setEmError(true)
    }
    else {
      setEmError(false)
    }

    if (!password) {
      setPwError(true)
    }
    else {
      setPwError(false)
    }

    if (!firstname || !lastname || !email || !password) {
      return
    }

    axios.post('http://178.148.119.105:5000/register', {firstname, lastname, email, password})
    .then(res => {
      if (res.data.status === 'ok') {
        localStorage.setItem('token', res.data.token)
        window.location.href = "/";
      }
      else {
        setError(res.data.error)
      }
    })

    setFnError(false)
    setLnError(false)
    setEmError(false)
    setPwError(false)

  }

  return (
    <>
      <Header />
      <div className="register-container">
          <div className="register">
              <h1>Create Account</h1>
              {error ? <div className="error">{error}</div> : null}
              <div className="register-inputs">
                  <label>First Name</label>
                  <input 
                    style={ fnError ? {borderBottom: '0.2vh solid #ff6060'} : {border: '0.1vh solid #c5c5c5'}} 
                    onChange={e => setFirstname(e.target.value)} 
                    value={firstname} 
                    placeholder="First Name">
                  </input>
                  <label>Last Name</label>
                  <input 
                    style={ lnError ? {borderBottom: '0.2vh solid #ff6060'} : {border: '0.1vh solid #c5c5c5'}} 
                    onChange={e => setLastname(e.target.value)} 
                    value={lastname} 
                    placeholder="Last Name">
                  </input>
                  <label>Email</label>
                  <input 
                    style={ emError ? {borderBottom: '0.2vh solid #ff6060'} : {border: '0.1vh solid #c5c5c5'}}
                    onChange={e => setEmail(e.target.value)} 
                    value={email} 
                    placeholder="Email">
                  </input>
                  <label>Password</label>
                  <input 
                    style={ pwError ? {borderBottom: '0.2vh solid #ff6060'} : {border: '0.1vh solid #c5c5c5'}}
                    onChange={e => setPassword(e.target.value)} 
                    value={password} 
                    type="password"
                    placeholder="Password">
                  </input>
              </div>
              <a className="forgot-password" href="/account/login">Already registered?</a>
              <div className="login-flex">
                  <button onClick={handleSubmit}>Create</button>
              </div>
          </div>
      </div>
    </>
  )
}

export default Register
