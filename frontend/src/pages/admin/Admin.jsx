import { useState } from 'react'
import './Admin.css'
import Header from '../../components/header/Header'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser } from '@fortawesome/free-solid-svg-icons'
import { useEffect } from 'react'

import NotFound from '../notfound/NotFound'

import axios from 'axios'


const Admin = () => {

    const [admin, setAdmin] = useState(false)

    const [name, setName] = useState("")
    const [price, setPrice] = useState("")

    const [size1, setSize1] = useState()
    const [size2, setSize2] = useState()
    const [size3, setSize3] = useState()
    const [size4, setSize4] = useState()
    const [size5, setSize5] = useState()
    const [size6, setSize6] = useState()

    const [color1, setColor1] = useState()
    const [color2, setColor2] = useState()
    const [color3, setColor3] = useState()
    const [color4, setColor4] = useState()
    const [color5, setColor5] = useState()
    const [color6, setColor6] = useState()

    const [colorArray, setColorArray] = useState([])
    const [sizeArray, setSizeArray] = useState([])

    const [currentQuantity, setCurrentQuantity] = useState(0)
    const [currentPlaceholder, setCurrentPlaceholder] = useState(0)
    const [quantity, setQuantity] = useState({})

    const [isRing, setIsRing] = useState(false)

    const [color, setColor] = useState("")
    const [collection, setCollection] = useState("")
    const [featured, setFeatured] = useState(false)

    const [collectionName, setCollectionName] = useState("")

    const [products, setProducts] = useState([])
    const [collections, setCollections] = useState([])

    const [file, setFile] = useState([])


    useEffect(() => {

        if (!localStorage.getItem('token')) {
            window.location.href = "/account/login"
        }

        axios.get('https://bkneg.site/admin', {headers: {'Authorization': localStorage.token}})
        .then(res => {
            if (res.data.status === 'ok') {
                setAdmin(true)
                setProducts(res.data.products)
                setCollections(res.data.collections)
            }
        })
    }, [])

    const handleProduct = () => {

        const fnArray = []

        for (var i = 0; i < file.length; i++) {
            fnArray.push(file[i].name)
        }

        axios.post('https://bkneg.site/add-product',
        { name, price, quantity, sizes: sizeArray, color: colorArray, collection: collection.toString(), featured, filenames: fnArray },
        {headers: {'Authorization': localStorage.token}})
        .then(res => {
            window.location.reload()
        })
    }

    const handleImage = () => {

        for (var i = 0; i < file.length; i++) {

            const data = new FormData()
            data.append('file', file[i], file[i].name)

            axios.post('https://bkneg.site/product-image',
            data, 
            {headers: {'Authorization': localStorage.token, "Content-Type": "multipart/form-data"}})
            .then(res => {
                alert(res.data.status)
            })

        }

    }

    const handleSubmit = () => {
        handleProduct()
        handleImage()

    }

    const handleColor = e => {
        var options = e.target.options;
        var value = [];
        for (var i = 0, l = options.length; i < l; i++) {
            if (options[i].selected) {
            value.push(options[i].value);
            }
        }

        setColor(value)
    }

    const handleCollection = e => {
        var options = e.target.options;
        var value = [];
        for (var i = 0, l = options.length; i < l; i++) {
            if (options[i].selected) {
                value.push(options[i].value);
            }
        }

        setCollection(value)
    }

    const removeProduct = (name) => {
        axios.get(`https://bkneg.site/remove-product/${name}`, {headers: {'Authorization': localStorage.token}})
        .then(res => {
            if (res.data.status === 'ok') {
                window.location.reload()
            }
        })
    }

    const removeCollection = (name) => {
        axios.get(`https://bkneg.site/remove-collection/${name}`, {headers: {'Authorization': localStorage.token}})
        .then(res => {
            if (res.data.status === 'ok') {
                alert('Collection removed')
                window.location.reload()
            }
        })

        
    }
    
    const MiniProduct = ({ img, price, name }) => {
        return (
            <div className="mini-product">
                <img src={img} className="prod-img"></img>
                <div className="prod-content">
                    <div className="prod-text">{name}</div>
                    <p>{price}</p>
                </div>
                <button onClick={() => removeProduct(name)} style={{backgroundColor: 'red'}}>Remove Product</button>
            </div>
        )
    }

    const MiniCollection = ({ name }) => {
        return (
            <div className="mini-product">
                <h1 className="prod-text" style={{marginLeft: 15, fontSize: 20}}>{name}</h1>
                <button onClick={() => removeCollection(name)} style={{backgroundColor: 'red'}}>Remove Collection</button>
            </div>
        )
    }

    const addCollection = (name) => {
        axios.get(`https://bkneg.site/add-collection/${name}`, {headers: {'Authorization': localStorage.token}})
        .then(res => {
            if (res.data.status === 'ok') {
                alert('Collection added')
                window.location.reload()
            }
        })
    }

    const createArrays = () => {
        var newSizeArray = new Array()
        var newColorArray = new Array()

        if (size1) {
            newSizeArray.push(size1)
        }
        if (size2) {
            newSizeArray.push(size2)
        }
        if (size3) {
            newSizeArray.push(size3)
        }
        if (size4) {
            newSizeArray.push(size4)
        }
        if (size5) {
            newSizeArray.push(size5)
        }
        if (size6) {
            newSizeArray.push(size6)
        }

        if (color1) {
            newColorArray.push(color1)
        }
        if (color2) {
            newColorArray.push(color2)
        }
        if (color3) {
            newColorArray.push(color3)
        }
        if (color4) {
            newColorArray.push(color4)
        }
        if (color5) {
            newColorArray.push(color5)
        }
        if (color6) {
            newColorArray.push(color6)
        }

        setSizeArray(newSizeArray)
        setColorArray(newColorArray)

        console.log(sizeArray)

    }

    if (admin) {
        return (
            <> 
                <Header />
                <div className="admin">
                    <h1>Admin Panel</h1>
                    <div className="admin-prod">
                        <div className="admin-products">
                            <h1>Products</h1>
                            <div className="add-product">
                                <input onChange={e => setName(e.target.value)} value={name} placeholder="Name (LOVE LIFE HOODIE)"></input>
                                <input onChange={e => setPrice(e.target.value)} value={price} placeholder="Price ($19.99 USD)"></input>
                                <div style={{marginTop: 30}}>Colors</div>
                                <div className="colors">
                                <input onChange={(e) => setColor1(e.target.value)}></input>
                                    <input onChange={(e) => setColor2(e.target.value)}></input>
                                    <input onChange={(e) => setColor3(e.target.value)}></input>
                                    <input onChange={(e) => setColor4(e.target.value)}></input>
                                    <input onChange={(e) => setColor5(e.target.value)}></input>
                                    <input onChange={(e) => setColor6(e.target.value)}></input>
                                </div>
                                <div style={{marginTop: 30}}>Sizes</div>
                                <div className="colors">
                                    <input onChange={(e) => setSize1(e.target.value)}></input>
                                    <input onChange={(e) => setSize2(e.target.value)}></input>
                                    <input onChange={(e) => setSize3(e.target.value)}></input>
                                    <input onChange={(e) => setSize4(e.target.value)}></input>
                                    <input onChange={(e) => setSize5(e.target.value)}></input>
                                    <input onChange={(e) => setSize6(e.target.value)}></input>
                                </div>
                                <button onClick={() => createArrays()}>Enter Quantity</button>
                                {
                                    sizeArray.map((size) => colorArray.map((color) => <input onChange={(e) => setQuantity(prev => ({...prev, [size+'/'+color] : e.target.value}))} placeholder={size + "/" + color}></input>))
                                }
                                <select onChange={e => handleCollection(e)} defaultValue={'New'} name="Collection">
                                    {collections.map(collection =>
                                        <option value={collection.name}>{collection.name}</option>
                                    )}
                                </select>
                                <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
                                    <input 
                                        onChange={e => setFeatured(e.target.checked)} 
                                        style={{border: '0.1vh solid red'}} 
                                        name="featured" 
                                        id="featured" 
                                        type="checkbox"/>

                                    <label for="featured">Featured at home?</label>
                                </div>
                                <input type="file" onChange={e => setFile(e.target.files)} name="photos" accept="image/png, image/jpeg" multiple></input>
                                
                            </div>
                            <button onClick={handleSubmit}>ADD</button>
                        </div>
                        <div className="admin-products-remove">
                            {products.map(product =>
                                <MiniProduct 
                                    img={product.url[0]} 
                                    price={product.price} 
                                    name={product.name} 
                                    sizes={product.sizes} />
                            )}
                        </div>
                    </div>
                    <div className="admin-col">
                        <div className="admin-collections">
                            <h1>Collections</h1>
                            <input onChange={e => setCollectionName(e.target.value)} value={collectionName} placeholder="Collection name"></input>
                            <button onClick={() => addCollection(collectionName)}>Add</button>
                        </div>
                        <div className="admin-products-remove">
                            {collections.map(collection =>
                                <MiniCollection
                                    name={collection.name}  />
                            )}
                        </div>
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

export default Admin