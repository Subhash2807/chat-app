const generateMessages = (username,text) =>{
    return{
        text,
        username,
        createdAt : new Date().getTime()
    }
}
const genearteLocationMessages = (username,url) =>{
    return {
        url,
        username,
        createdAt:new Date().getTime()
    }
}
module.exports = {
    generateMessages,
    genearteLocationMessages
}