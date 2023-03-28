import Header from '../../components/header/Header'
import './Verification.css'

import verification from './verification.png'

import { useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import axios from 'axios'
import NotFound from '../notfound/NotFound'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faThumbsUp } from '@fortawesome/free-solid-svg-icons'

const Verification = () => {

    const { token } = useParams()

    const [verified, setVerified] = useState(false)

    useEffect(() => {
        axios.get(`http://178.148.119.105:5000/verify/${token}`, {headers: {'Authorization': localStorage.getItem('token')}})
        .then(res => {
            if (res.data.status === 'ok') {
                setVerified(true)
                localStorage.setItem('token', res.data.token)
            }
        })
    }, [])

    if (verified) {
        return (
            <>
                <Header />
                <div className="verify-container">
                    <div className="verification">
                        <FontAwesomeIcon className="verification-icon" icon={faThumbsUp} />
                        <h1>You have been sucessfuly verified.</h1>
                    </div>
                </div>
            </>
          )
    }

    else {
        return (
            <NotFound />
        )
    }


}

export default Verification