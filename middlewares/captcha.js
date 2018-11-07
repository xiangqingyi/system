let svgCaptcha = require('svg-captcha');


exports.create =function (req, res, next){
    var captcha = svgCaptcha.create({
        width:140,
        height:45,
        fontSize:35
    });
    //var captcha = svgCaptcha.create();
	req.session.captcha = captcha.text;
	console.log('captcha:'+captcha.text);
	res.set('Content-Type', 'image/svg+xml');
	res.status(200).send(captcha.data);
};
