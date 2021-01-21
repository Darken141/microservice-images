const imageModel = {
    name:{
        type:String
    },
    alt:{
        type:String
    },
    imagePath:{
        type:String,
        required:true
    },
    dateCreated:{
        type:Date,
        default:Date.now
    },
    size: {
        type: Number
    }
}

module.exports = {
    imageModel
}