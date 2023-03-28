import './NotFound.css'
import * as animation from './astro.json'
import Lottie from 'react-lottie';
import Header from '../../components/header/Header';

const NotFound = () => {

const defaultOptions = {
    loop: true,
    autoplay: true, 
    animationData: animation,
    rendererSettings: {
        preserveAspectRatio: 'xMidYMid slice'
        }
    }

  return (
    <>
      <Header />
      <div className="notfound">
          <Lottie options={defaultOptions}
              height={'25%'}
              width={'30%'}
              speed={1}
              isStopped={false}
              isPaused={false}/>
      </div>
    </>
  )
}

export default NotFound