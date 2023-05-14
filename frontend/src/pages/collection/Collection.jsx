import axios from 'axios'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import Header from '../../components/header/Header'
import Product from '../../components/product/Product'

import './Collection.css'

const Collection = () => {

    const { name } = useParams()

    const [products, setProducts] = useState([])

    useEffect(() => {
        axios.get(`https://bkneg.site/collection/${name}`)
        .then(res => {
            if (res.data.status === 'ok') {
                setProducts(res.data.products)
            }
        })
    }, [])

    return (
        <>
            <Header />
            <div className="collection">
                <h1>{name} Collection</h1>
                <div className="collection-flex">
                    {products ? products.map(({name, sizes, price, url}) =>
                        <Product 
                            link={`/products/${name}`} 
                            price={price} 
                            sizes={sizes}
                            img={url[0]}
                            name={name}/>) : null}
                </div>
            </div>
        </>
    )
}

export default Collection