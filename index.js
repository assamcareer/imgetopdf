/import the multer library
var multer = require('multer');
var path = require('path');

//multer file storage configuration
let storage = multer.diskStorage({
	//store the images in the public/images folder
	destination: function(req, file, cb){
		cb(null, 'public/images')
	},
	//rename the images
	filename: function(req, file, cb){
		cb(null, file.fieldname + '-' + Date.now() + '.' + file.mimetype.split('/')[1] )
	}
})

//configuration for file filter
let fileFilter = (req, file, callback) => {
	let ext = path.extname(file.originalname);
	//if the file extension isn't '.png' or '.jpg' return an error page else return true
	if (ext !== '.png' && ext !== '.jpg'){
		return callback(new Error('Only png and jpg files are accepted'))
	} else {
		return callback(null, true)
	}
}

//initialize Multer with the configurations for storage and file filter
var upload = multer({ storage, fileFilter: fileFilter});

router.post('/upload', upload.array('images'), function (req, res){
	let files = req.files;
	let imgNames = [];
	
	//extract the filenames 
	for( i of files){
		let index = Object.keys(i).findIndex( function (e){return e === 'filename'})
		imgNames.push( Object.values(i)[index] )
	}
	//store the image filenames in a session
	req.session.imagefiles = imgNames
		
    //redirect the request to the root URL route
	res.redirect('/')
})
