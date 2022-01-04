const express = require('express');
const { Canvas, Image } = require("canvas");
const QRCode = require('easyqrcodejs-nodejs');
const mergeImages = require('merge-images');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');

let dir = './temp';

if (!fs.existsSync(dir)){
    fs.mkdirSync(dir);
}

const app = express()
const port = 3000
app.get('/api/qr',function (req, res) {
    if (req.query.b64url == undefined) {
        res.send({"error":"URL not defined"})
    }else{
        let buff = new Buffer(req.query.b64url, 'base64');
        let url = buff.toString('ascii');
        generateQr(url).then(b64=>{
            let json={'b64':b64};
            res.send(json)
        }).catch(msg=>{
            let json={'b64':false,'error':msg};
            console.log(msg);
            res.send(json)
        });
    }
})

app.use(express.static('public'))
app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`)
})

function generateQr(url,bg='donate'){
    return new Promise((resolve, reject) => {
        let uid = uuidv4();
        let tempFile = './temp/'+uid+'_temp.png'
        let w = 1000;
        // Options
        try {
            if(url.length>500){
                return reject('URL too long.');
            }

            let options = {
                width: w,
                height: w,
                text: url,
                colorDark: "#8bbe29",
                colorLight: "#115e67",
                logo: "logo.png",
                logoWidth: 340,
                logoHeight: 340,
                correctLevel: QRCode.CorrectLevel.H,
                quietZone: 0,
                quietZoneColor: "rgba(0,0,0,0)",

            };

            // New instance with options
            let qrcode = new QRCode(options);

            // Save QRCode image
            qrcode.saveImage({
                path: tempFile
            }).then(data => {
                mergeImages([
                    {src: './bg/donate.png', x: 0, y: 0},
                    {src: tempFile, x: 50, y: 40}
                ], {
                    Canvas: Canvas,
                    Image: Image
                }).then(b64 => {
                        require("fs").unlink(tempFile, () => {
                            console.log('deleted')
                        });
                        b64 = b64.replace(/^data:image\/png;base64,/, "");
                        return resolve(b64)
                    }
                );
            });
        }catch (err){
            return reject(err)
        }
    });
}
