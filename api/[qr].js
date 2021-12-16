const QRCode = require('easyqrcodejs-nodejs');
//const mergeImages = require('merge-images');
//const { Canvas, Image } = require('canvas');
const { v4: uuidv4 } = require('uuid');



function generateQr(url,bg='donate'){
    return new Promise((resolve, reject) => {
        let uid = uuidv4();
        let tempFile = './temp/'+uid+'_temp.png'
        let w = 1000;
        // Options
        let options = {
            width: w,
            height: w,
            text: url,
            colorDark : "#8bbe29",
            colorLight : "#115e67",
            logo: "logo.png",
            logoWidth: 340,
            logoHeight: 340,
            correctLevel : QRCode.CorrectLevel.H,
            quietZone: 0,
            quietZoneColor: "rgba(0,0,0,0)",

        };

        // New instance with options
        //let qrcode = new QRCode(options);

        // Save QRCode image
        //qrcode.saveImage({
        //    path: tempFile
        //}).then(data=>{
        //    mergeImages([
        //        { src: './bg/donate.png', x: 0, y: 0 },
        //        { src: tempFile, x: 40, y: 40 }
        //    ], {
        //        Canvas: Canvas,
        //        Image: Image
        //    }).then(b64=>{
        //            require("fs").unlink(tempFile,()=>{console.log('deleted')});
        //            b64 = b64.replace(/^data:image\/png;base64,/, "");
        //            return resolve(b64)
        //        }
        //    );
        //});
    });

}



module.exports = (req, res) => {

    if (req.query.b64url == undefined) {
        req.query.b64url = ''
    }

    let buff = new Buffer(req.query.b64url, 'base64');
    let url = buff.toString('ascii');

    generateQr(url).then(b64=>{
        let json={'b64':b64};
        res.send(json)
    });
};

