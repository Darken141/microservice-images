const serverError = (res, err) => {
    console.log(err)
    return res.status(500).send({
        message:'An unexpected error has occured'
    })
}

module.exports = {
    serverError
}