import './Loader.css'
import React, { useEffect } from 'react'
import * as animation from './animation.json'
import Lottie from 'react-lottie';

const Loader = () => {

    const defaultOptions = {
        loop: true,
        autoplay: true, 
        animationData: animation,
        rendererSettings: {
            preserveAspectRatio: 'xMidYMid slice'
        }
    }


  return (
    <div className="background">
      <div>
        <Lottie options={defaultOptions}
            speed={1.0}
            isStopped={false}
            isPaused={false}/>
          </div>
    </div>
  )
}

export default Loader