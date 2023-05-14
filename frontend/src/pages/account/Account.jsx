import './Account.css'
import axios from 'axios'
import { useState, useEffect } from 'react'
import Header from '../../components/header/Header'

const Account = () => {

    const [name, setName] = useState("")
    const [email, setEmail] = useState("")

    const [verified, setVerified] = useState(false)

    const [current, setCurrent] = useState("")
    const [newPassword, setNewPassword] = useState("")

    const [error, setError] = useState("")

    const handleSubmit = () => {
        axios.post('https://bkneg.site/reset-password', {current, newPassword}, {headers: {'Authorization': localStorage.token}})
        .then(res => {
            if (res.data.status === 'ok') {
                localStorage.setItem('token', res.data.token)
                window.location.reload()
            }
            else {
                setError(res.data.error)
            }
        })
    }

    const handleLogout = () => {
        localStorage.removeItem('token')
        window.location.href = "/"
    }

    useEffect(() => {

        if (!localStorage.getItem('token')) {
            window.location.href = "/account/login"
        }

        axios.get('https://bkneg.site/account', {headers: {'Authorization': localStorage.getItem('token')}})
        .then(res => {
            if (res.data.status === 'ok') {
                setVerified(true)
                setName(res.data.name)
                setEmail(res.data.email)
            }
            else {

                if (res.data.error === 'Not verified') {
                    setVerified(false)   
                    setName(res.data.name)
                    setEmail(res.data.email) 
                }
                else {
                    window.location.href = "/account/login"

                }
            }
        })
    }, [])

    if (!verified) {
        return (
            <>
                <Header />
                <div className="nv-cnt">
                    <div className="not-verified">We have sent a verification link to <span>{email}</span></div>
                    <h1>Wrong Email? <span onClick={() => {
                        localStorage.removeItem('token')
                        window.location.href = "/"
                    }}>Logout</span>.</h1>
                </div>
            </>
        )
    }

    else {
        return (
            <>
                <Header />
                <div className="account">
                    <h1>Account</h1>
                    <div className="account-label">
                        <label>Name</label>
                        <div>{name}</div>
                    </div>
                    <div className="account-label">
                        <label>Email</label>
                        <div>{email}</div>
                    </div>
                    <div className="change-pwd">
                    <div className="login-inputs" style={{width: '30%'}}>
                        <label>Current Password</label>
                        <input
                            //style={ emError ? {borderBottom: '0.2vh solid #ff6060'} : {border: '0.1vh solid #c5c5c5'}} 
                            onChange={e => setCurrent(e.target.value)}
                            value={current}
                            type="password"
                            placeholder="Current Password">
                        </input>
                        <label>New Password</label>
                        <input
                            //style={ pwError ? {borderBottom: '0.2vh solid #ff6060'} : {border: '0.1vh solid #c5c5c5'}} 
                            onChange={e => setNewPassword(e.target.value)}
                            value={newPassword}
                            type="password"
                            placeholder="New Password">
                        </input>
                        {error ? <div className="error" style={{width: '50%', textAlign: 'left'}}>{error}</div> : null}
                        </div>
                    </div>
                    <button onClick={handleSubmit}>Change Password</button>
                    <br></br>
                    <button style={{marginTop: 30}} onClick={handleLogout}>Logout</button>
                </div>
            </>
          )
    }

}

export default Account