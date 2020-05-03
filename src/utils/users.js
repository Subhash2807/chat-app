const users = []

const addUser = ({id,username,room}) => {
//clean the data(trim , lowercase)
    username = username.trim().toLowerCase()
    room = room.trim().toLowerCase()

    if(!username || !room)
    {
        return{
            error:'username and room are required'
        }
    }

    //check for existing user
    const existingUser = users.find((user)=>{
        return user.room === room && user.username===username
    })

    //validate username
    if(existingUser){
        return {
            error:'Username is in use!'
        }
    }

    //Store user
    const user = {id,username,room}
    users.push(user)

    return {user} 

}

const removeUser = (id) =>{
    const index = users.findIndex((user)=>user.id ===id)

    if(index !== -1){
        return users.splice(index,1)[0]
    }
}
addUser({
    id:1,
    username:'subhash',
    room:'rustam'
})
addUser({
    id:5,
    username:'abhishek',
    room:'rustam'
})
addUser({
    id:9,
    username:'harsh',
    room:'iiitl'
})
const getUser = (id)=>{
     return users.find((user)=>user.id === id)
}


const getUserInRoom = (room) =>{
    room = room.trim().toLowerCase()
    return users.filter((user)=>user.room ===  room)
    
}

module.exports ={
    getUser,
    addUser,
    removeUser,
    getUserInRoom
}