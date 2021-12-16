const QRCode = require('easyqrcodejs-nodejs');
const mergeImages = require('merge-images');
const { Canvas, Image } = require('canvas');
const { v4: uuidv4 } = require('uuid');
const express = require('express');

const app = express()
const port = 3000

app.use(express.static('public'))

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})