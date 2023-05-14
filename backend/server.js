const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const multer = require('multer');  
const jwt = require('jsonwebtoken')
const User = require('./model/user')
const Product = require('./model/product')
const Collection = require('./model/collection')
const nodemailer = require("nodemailer");
const axios = require('axios')


const JWT_SECRET = "1NiJIUzIVwNk1z5YeCigtIJubhIn0.iybVj1lIsInR5cFkZ2FkZ2FkZyIsImlhdCI6ImhmYWGvfHuti3CvFJhbGciOiHp.eyJzdWIiOiJhc2RkZGFnZGZnICI6IkpXVCJ9FkZ2iwibmFtZSI6ImFkZ2E0Heytxw0"

function randomString(length, chars) {
    var result = '';
    for (var i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
    return result;
}

mongoose.connect("mongodb://localhost:27017/broken", {
    useNewUrlParser: "true",
})

const app = express()

app.use(cors())
app.use(express.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.use(express.static('public')); 
app.use('/images', express.static('images'));

var storage =   multer.diskStorage({  
    destination: function (req, file, callback) {  
      callback(null, './images');  
    },  
    filename: function (req, file, callback) {  
      callback(null, file.originalname);  
    }  
});  

const upload = multer({ storage : storage}).single('file');

const validateEmail = (email) => {
    return email.match(
      /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
};
  

app.get('/', (req, res) => {
    return res.redirect('https://google.com')
})

app.get('/account', async (req, res) => {

    const token = req.header('Authorization');

    console.log({ token })

    if (token === undefined || token === null || token === 'undefined') {
        return res.json({status: 'error'})
    }

    if (!token) {
        return res.json({status: 'error', error: 'Invalid Token.'})
    }

    const _user = jwt.verify(token, JWT_SECRET)

    if (!_user) {
        return res.json({status: 'error', error: 'Invalid Token.'})
    }

    const user = await User.findOne({ _id: _user.id })

    if (!user) {
        return res.json({status: 'error', error: 'Invalid Token.'})
    }

    if (!user.verified) {
        return res.json({status: 'error', error: 'Not verified', name: user.name, email: user.email})
    }

    return res.json({status: 'ok', name: user.name, email: user.email})
})

app.post('/login', async (req, res) => {
    const { email, password } = req.body

    if (!email | typeof email !== 'string') {
        return res.json({ status: 'error', error: 'Invalid Email.' })
    }

    if (!password | typeof password !== 'string') {
        return res.json({ status: 'error', error: 'Invalid Password.' })
    }

    const user = await User.findOne({ email }).lean()

    if (!user) { 
        return res.json({ status: 'error', error: 'Invalid Credentials.' })
    }

    if (password !== user.password) {
        return res.json({ status: 'error', error: 'Invalid Credentials.' })
    }

    const token = jwt.sign({ id: user._id, password: password, email: email, verified: user.verified  }, JWT_SECRET)

    return res.json({ status: 'ok', token: token })

})

app.post('/register', async (req, res) => {
    const { firstname, lastname, email, password } = req.body

    if (!firstname || firstname.length < 1 || firstname.length > 200) {
        return res.json({status: 'error', error: 'Invalid First Name.'})
    }

    if (!lastname || lastname.length < 1 || lastname.length > 200) {
        return res.json({status: 'error', error: 'Invalid Last Name.'})
    }

    if (!email || email.length < 1 || email.length > 200) {
        return res.json({status: 'error', error: 'Invalid Email.'})
    }

    if (!password || password.length < 5) {
        return res.json({status: 'error', error: 'Password must be at least 5 characters long.'})
    }

    if (!validateEmail(email)) {
        return res.json({status: 'error', error: 'Invalid Email.'})
    }

    //jasamklosar12345@gmail.com

    var token = ""

    var verification_token = randomString(64, "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ")

    try {
        const user = await User.create({
            name: firstname + " " + lastname,
            email: email,
            password: password,
            ip: req.connection.remoteAddress,
            created_at: new Date(),
            admin: false,
            verification_token: verification_token
        })

        let transporter = nodemailer.createTransport({
            host: 'smtpout.secureserver.net',
            port: 465,
            secure: true,
            secureConnection: false,
            tls: {
                ciphers:'SSLv3'
            },
            auth: {
              user: 'help@bkneg.com',
              pass: 'theredeye123YY',
            },
            send: true
          });
        
          let info = await transporter.sendMail({
            from: 'help@bkneg.com',
            to: email,
            subject: "Verification link",
            text: `http://178.148.119.105:3000/verify/${verification_token}`,
          });
        
          console.log("Message sent: %s", info.messageId);
        
          console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));

        token = jwt.sign({ id: user._id, password: password, email: email, verified: user.verified  }, JWT_SECRET)
        console.log(user._id)

    }
    catch(error) {

        if (error.code === 11000) {
            return res.json({ status: 'error', error: 'Email already in use.' })
        }

        console.log(error)

        return res.json({status: 'ok', error: 'Something went wrong.'})
    }

    return res.json({status: 'ok', token})
})

app.post('/reset-password', async (req, res) => {

    const { current, newPassword } = req.body

    if (!current || !newPassword) {
        return res.json({status: 'error', error: 'Password cannot be empty. '})
    }

    const token = req.header('Authorization');

    if (!token) {
        return res.json({status: 'error', error: 'Invalid Token.'})
    }

    const _user = jwt.verify(token, JWT_SECRET)

    if (!_user) {
        return res.json({status: 'error', error: 'Invalid Token.'})
    }

    const user = await User.findOne({ _id: _user.id })

    if (!user) {
        return res.json({status: 'error', error: 'Invalid Token.'})
    }

    if (user.password !== current) {
        return res.json({status: 'error', error: 'Invalid Password.'})
    }

    await user.updateOne({password: newPassword})

    const _token = jwt.sign({ id: user._id, password: newPassword, email: user.email, name: user.firstname + " " + user.lastname, created_at: user.created_at, verified: user.verified }, JWT_SECRET)

    return res.json({status: 'ok', token: _token})

})

app.get('/featured-products', async (req, res) => {

    const product = await Product.find({ featured: true })

    return res.json({status: 'ok', product})

})

app.get('/fetch-users', (req, res) => { 
    
    if (!req.headers.authorization || typeof req.headers.authorization != String) {
        return res.json({status: 'error', error: 'Not logged in'})
    }


})

app.post('/product-image', async (req, res) => {

    const token = req.header('Authorization');

    if (!token || token === null) {
        return res.json({status: 'error', error: 'Invalid Token.'})
    }

    const _user = jwt.verify(token, JWT_SECRET)

    if (!_user) {
        return res.json({status: 'error', error: 'Invalid Token.'})
    }

    const user = await User.findOne({ _id: _user.id })

    if (!user) {
        return res.json({status: 'error', error: 'Invalid Token.'})
    }

    if (user.admin === false) {
        return res.json({status: 'error', error: 'Not admin'})
    }

    upload(req, res, function(err) {

        if(err) {  
            console.log("Error uploading file.");
        }
    })

    return res.json({status: 'ok'})

})

app.post('/add-product', async (req, res) => {

    const { name, price, sizes, color, quantity, collection, featured, filenames } = req.body

    const token = req.header('Authorization')

    if (!token) {
        return res.json({status: 'error', error: 'Invalid Token.'})
    }

    const _user = jwt.verify(token, JWT_SECRET)

    if (!_user) {
        return res.json({status: 'error', error: 'Invalid Token.'})
    }

    const user = await User.findOne({ _id: _user.id })

    if (!user) {
        return res.json({status: 'error', error: 'Invalid Token.'})
    }

    if (user.admin === false) {
        return res.json({status: 'error', error: 'Not admin'})
    }

    console.log(name, price, sizes, color, quantity, collection)

    if (!name || !price || !sizes || !color || !quantity || !collection) {
        return res.json({status: 'error', error: 'Bad request'})
    }

    var arr = []

    arr = filenames.map(i => 'http://178.148.119.105:5000/images/' + i);

    console.log(arr)

    try {
        await Product.create({
            name,
            price,
            sizes,
            color,
            quantity,
            _collection: collection,
            featured,
            url: arr
        })
    }

    catch(error) {
        console.log(error)
        return res.json({status: 'error', error: 'Something went wrong'})
    }

    return res.json({status: 'ok'})

    //create entry

})

app.get('/remove-product/:name', async (req, res) => {

    const { name } = req.params

    const token = req.header('Authorization');

    if (!token) {
        return res.json({status: 'error', error: 'Invalid Token.'})
    }

    const _user = jwt.verify(token, JWT_SECRET)

    if (!_user) {
        return res.json({status: 'error', error: 'Invalid Token.'})
    }

    const user = await User.findOne({ _id: _user.id })

    if (!user) {
        return res.json({status: 'error', error: 'Invalid Token.'})
    }

    if (user.admin === false) {
        return res.json({status: 'error', error: 'Not admin'})
    }

    const product = await Product.deleteOne({ name })

    return res.json({ status: 'ok' })

    //remove mongodb
})

app.post('/cart', async (req, res) => {

    const { items } = req.body

    var prodArray = []

    if (!items) {
        return res.json({status: 'error'})
    }

    for (var i = 0; i < items.length; i++) {

        if (!items[i].name) {
            continue
        }

        const prod = await Product.findOne({ name: items[i].name })
        prodArray.push(prod)
    }

    return res.json({status: 'ok', products: prodArray})

})

app.get('/remove-collection/:name', async (req, res) => {

    const { name } = req.params

    const token = req.header('Authorization')

    if (!token) {
        return res.json({status: 'error', error: 'Invalid Token.'})
    }

    const _user = jwt.verify(token, JWT_SECRET)

    if (!_user) {
        return res.json({status: 'error', error: 'Invalid Token.'})
    }

    const user = await User.findOne({ _id: _user.id })

    if (!user) {
        return res.json({status: 'error', error: 'Invalid Token.'})
    }

    if (user.admin === false) {
        return res.json({status: 'error', error: 'Not admin'})
    }

    if (!name) {
        return res.json({status: 'error', error: 'Empty collection'})
    }

    await Collection.deleteOne({ name }).lean()

    return res.json({status: 'ok', error: 'Collection removed'})
})

app.get('/add-collection/:name', async (req, res) => {

    const { name } = req.params

    const token = req.header('Authorization')

    if (!token) {
        return res.json({status: 'error', error: 'Invalid Token.'})
    }

    const _user = jwt.verify(token, JWT_SECRET)

    if (!_user) {
        return res.json({status: 'error', error: 'Invalid Token.'})
    }

    const user = await User.findOne({ _id: _user.id })

    if (!user) {
        return res.json({status: 'error', error: 'Invalid Token.'})
    }

    if (user.admin === false) {
        return res.json({status: 'error', error: 'Not admin'})
    }

    if (!name) {
        return res.json({status: 'error', error: 'Empty collection'})
    }

    try {
        await Collection.create({name})
    }

    catch(error) {
        console.log(error)
        return res.json({status: 'error', error: 'Collection with the same name already exists'})
    }

    return res.json({status: 'ok', error: 'Collection added'})

})

app.get('/collections', async(req, res) => {

    const collections = await Collection.find({})

    return res.json({status: 'ok', collections})
})

app.get('/collection/:name', async (req, res) => {

    const { name } = req.params

    if (name === "All") {

        const products = await Product.find({})

        return res.json({status: 'ok', products})
    }

    const products = await Product.find({ _collection: name })

    return res.json({status: 'ok', products})

})

app.get('/product/:name', async (req, res) => {
    const { name } = req.params

    if (!name) {
        return res.json({status: 'error', error: 'Empty product'})
    }

    const product = await Product.findOne({ name }).lean()

    if (!product) {
        return res.json({status: 'error', error: 'Empty product'})
    }

    const similar_products = await Product.find({ _collection: product._collection, name: { $ne: product.name } })

    return res.json({
        status: 'ok', 
        name: product.name, 
        price: product.price, 
        sizes: product.sizes, 
        color: product.color, 
        quantity: product.quantity,
        url: product.url,
        collection: product._collection,
        similar_products: similar_products.slice(0, 4)
    })

})

app.get('/admin', async (req, res) => {
    
    const token = req.header('Authorization');

    if (!token || token === null) {
        return res.json({status: 'error', error: 'Invalid Token.'})
    }

    const _user = jwt.verify(token, JWT_SECRET)

    if (!_user) {
        return res.json({status: 'error', error: 'Invalid Token.'})
    }

    const user = await User.findOne({ _id: _user.id })

    if (!user) {
        return res.json({status: 'error', error: 'Invalid Token.'})
    }

    if (user.admin === false) {
        return res.json({status: 'error', error: 'Not admin'})
    }

    const products = await Product.find()
    const collections = await Collection.find()

    return res.json({status: 'ok', products, collections})

})

app.get('/verify/:token', async (req, res) => {

    const { token } = req.params

    if (!token || typeof token !== 'string') {
        return res.json({status: 'error', error: 'a'})
    }

    const user = await User.findOne({ verification_token: token })

    if (!user || user.verified) {
        return res.json({status: 'error'})
    }

    await user.updateOne({ verification_token: '' })
    await user.updateOne({ verified: true })

    const _token = jwt.sign({ id: user._id, password: user.password, email: user.email, name: user.name, created_at: user.created_at, verified: user.verified  }, JWT_SECRET)

    return res.json({ status: 'ok', token: _token })

})

app.post('/checkout', async(req, res) => {

    const { amount, billing_data } = req.body

    console.log({ billing_data })

    const api_key = 'ZXlKaGJHY2lPaUpJVXpVeE1pSXNJblI1Y0NJNklrcFhWQ0o5LmV5SnVZVzFsSWpvaWFXNXBkR2xoYkNJc0luQnliMlpwYkdWZmNHc2lPams1TnpJekxDSmpiR0Z6Y3lJNklrMWxjbU5vWVc1MEluMC5oQWhnaGVDWld2c21nSFBFZEhxQTk0d3Bib3hBTi1BdTQ5cFhpcTAyRHI0ejQ2TzdneEM3NjIxaGRyb3ZXR0JVdVhhdjZYZmZWTnVTRFRrMWFZYXhEZw= ='

    var token = ""
    var payment_token = ""
    var id = 0
    
    axios.post('https://accept.paymob.com/api/auth/tokens', {api_key})
    .then(resp => {
        token = resp.data.token
        id = resp.id
    
        axios.post('https://accept.paymob.com/api/acceptance/payment_keys', {
        auth_token: token,
        amount_cents: parseInt(amount).toString(),
        expiration: 3600,
        order_id: id,
        billing_data: billing_data,
        currency: 'EGP',
        integration_id: 252111,//256166 live id,
        /*lock_order_when_paid: "false"*/}).then(resp => {
            payment_token = resp.data.token
            console.log(resp.data)
            console.log(resp.status)
            return res.json({status: 'ok', link: `https://accept.paymob.com/api/acceptance/iframes/232741?payment_token=${payment_token}`})
        })
        
    })

    console.log(payment_token)


})

app.get('/order/:id', async (req, res) => {

    const { id, amount, items } = req.params

    let transporter = nodemailer.createTransport({
        host: 'smtpout.secureserver.net',
        port: 465,
        secure: true,
        secureConnection: false,
        tls: {
            ciphers:'SSLv3'
        },
        auth: {
          user: 'help@bkneg.com',
          pass: 'theredeye123YY',
        },
        send: true
      });
    
      let info = await transporter.sendMail({
        from: 'help@bkneg.com',
        to: 'help@bkneg.com',
        subject: "Verification link",
        text: `http://178.148.119.105:3000/verify/${verification_token}`,
      });
    
      console.log("Message sent: %s", info.messageId);
    
      console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));

})

app.post('/contact', async(req, res) => {
    const { name, email, message } = req.body

    if (!name || !email || !message) {
        return res.json({status: 'error'})
    }

    let transporter = nodemailer.createTransport({
        host: 'smtpout.secureserver.net',
        port: 465,
        secure: true,
        secureConnection: false,
        tls: {
            ciphers:'SSLv3'
        },
        auth: {
          user: 'help@bkneg.com',
          pass: 'theredeye123YY',
        },
        send: true
      });
    
      let info = await transporter.sendMail({
        from: 'help@bkneg.com',
        to: 'help@bkneg.com',
        subject: `Contact Inquiry, ${name}`,
        text: message,
      });
    
      console.log("Message sent: %s", info.messageId);
    
      console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));

      return res.json({status: 'ok'})

})

app.listen(5000, () => console.log('started'))