const mongoose=require('mongoose')
mongoose.set('strictQuery',true)
function connectMongoDB(url) {
    return mongoose.connect(url)
}

module.exports={connectMongoDB}