const multer = require('multer');



const multerStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "public/files");
    },
    filename: (req, file, cb) => {
        const ext = file.mimetype.split("/")[1];
        cb(null, `${file.fieldname}-${Date.now()}-${Math.round(Math.random() * 1E9)}.${ext}`);
    },
});

const multerFilter = (req, file, cb) => {
    if (file.mimetype == "image/jpeg" || file.mimetype == "image/png" || file.mimetype == "image/webp" || file.mimetype == "image/gif") {
        cb(null, true);
    } else {
        return cb(new Error("File not supported"), false);
    }
};

const upload = multer({
    storage: multerStorage,
    fileFilter: multerFilter,
})

const uploadImages = upload.array("image", 4)
const uploadBanner = upload.single("image")


module.exports =  {
    productImage : (req, res, next) => {
    return uploadImages(req, res, (err) => {
        if (err instanceof multer.MulterError) {
            // A Multer error occurred when uploading.
          
            console.log(err)
            res.redirect("/admin/product")
        } else if (err) {
            // An unknown error occurred when uploading.
      
            console.log(err)
            res.redirect("/admin/product")
        } else {
            next()
        }
    })
},
bannerImage : (req, res, next) => {
    return uploadBanner(req, res, (err) => {
        if (err instanceof multer.MulterError) {
            // A Multer error occurred when uploading.

            console.log(err)
            res.redirect("/admin/banner")
        } else if (err) {
            // An unknown error occurred when uploading.
      
            console.log(err)
            res.redirect("/admin/banner")
        } else {
            next()
        }
    })
}
}