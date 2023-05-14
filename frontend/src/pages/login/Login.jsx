import './Login.css'
import axios from 'axios'
import { useState } from 'react'
import Header from '../../components/header/Header'

const Login = () => {

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const [emError, setEmError] = useState(false)
  const [pwError, setPwError] = useState(false)

  const [error, setError] = useState("")

  const handleSubmit = () => {

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

    if (!email || !password) {
      return
    }

    axios.post('https://bkneg.site/login', { email, password })
    .then(res => {
      if (res.data.status === 'ok') {
        localStorage.setItem('token', res.data.token)
        window.location.href = "/";
      }
      else {
        setError(res.data.error)
      }
    })

    setEmError(false)
    setPwError(false)

  }

  return (
    <>  
      <Header />
      <div className="login-container">
          <div className="login">
              <h1>Login</h1>
              {error ? <div className="error">{error}</div> : null}
              <div className="login-inputs">
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
              <a className="forgot-password" href="/account/reset">Forgot your password?</a>
              <div className="login-flex">
                  <button onClick={handleSubmit}>Sign in</button>
                  <a href="/account/register">Create account</a>
              </div>
          </div>
      </div>
    </>
  )
}

export default Login