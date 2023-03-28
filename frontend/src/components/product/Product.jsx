import './Product.css'

const Product = ({ link, name, sizes, price, img }) => {
  return (
    <div className="product-cointainer">
      <a href={link}>
        <img src={img} className="product"></img>
      </a>
      <div className="product-text">{name}</div>
      <div className="product-sizes">{sizes.map(size => size + " ")}</div>
      <div className="product-text">${price} USD</div>
    </div>
  )
}

export default Product