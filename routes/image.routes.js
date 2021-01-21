const express = require('express')
const router = express.Router()
const multer = require('multer')
const fs = require('fs')
const {serverError} = require('../utils/utils')

const Image = require('../model/image.model')

const storage = multer.diskStorage({
    destination: './uploads/',
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, uniqueSuffix + '-' + file.originalname)
    }
})

// accept only jpeg/png iamge formats
const fileFilter = (req, file, cb) => {
    if (file.mimetype == 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true)
    } else {
        cb(null, false) 
    }
}

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024, // no larger than 5mb, you can change as needed.
    },
    fileFilter
})

router.get('/', async (req, res) => {
    try {
        const images = await Image.find()
        return res.json({
            message: "Images retrieved successfully",
            count: images.length,
            images: images
        })
    } catch (err) {
        serverError(res, err)
    }
})

router.get('/:id', getImage, async (req, res) => {
    try {
        if(res.image) {
            return res.json({
                message: "Image retrieved successfully",
                image: res.image
            })
        } else {
            return res.json({
                message: "Image not found",
                error: "not found"
            })
        }
    } catch (err) {
        serverError(res, err)
    }
})

router.post('/', upload.array('imagesToUpload', 10), async (req, res) => {
    try {
        let imgArr = []
        req.files.forEach(file => {
            const image = new Image({
                name: file.originalname,
                alt: file.originalname,
                imagePath: file.path,
                size: file.size
            })

            image.save()
            imgArr.push(image._id)
        })

        res.json({
            message: "Successfully uploaded",
            count: req.files.length,
            images: imgArr
        })

    } catch (err) {
        serverError(res, err)
    }
})

router.delete('/:id', getImage, async (req, res) => {
    try {
        if(res.image) {
            if(fs.existsSync(`../app/${res.image.imagePath}`)) {
                fs.unlinkSync(`../app/${res.image.imagePath}`)
                await res.image.delete()
                res.json({
                    message: "Successfully deleted",
                    image: res.image
                })
            } else {
                res.json({
                    message: "I found an image but I can't delete it",
                })    
            }
        } else {
            res.json({
                message: "No image found",
            })
        }

    } catch (err) {
        serverError(res, err)
    }
})

//middleware 
async function getImage(req, res, next) {
    let image
    try {
        image = await Image.findById(req.params.id)
        if( image == null ) {
            return res.status(404).json({message: "Cannot find image reference"})
        }
    } catch (err) {
        serverError(res, err)
    }

    res.image = image
    next()
}

module.exports = router