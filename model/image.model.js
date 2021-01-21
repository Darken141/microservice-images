const mongoose = require('mongoose')
const {imageModel } = require('../config')

const imageSchema = mongoose.Schema(imageModel)

module.exports = mongoose.model("Image", imageSchema)