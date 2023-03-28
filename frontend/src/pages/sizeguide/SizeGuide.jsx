import Header from '../../components/header/Header'
import './SizeGuide.css'

import sizeguide from './sizeguide.jpeg'

const SizeGuide = () => {
  return (
    <div>
        <Header />
        <div className="sizeguide">
          <img src={sizeguide}></img>
        </div>
    </div>
  )
}

export default SizeGuide