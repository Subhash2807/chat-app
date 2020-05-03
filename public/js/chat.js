const socket  = io()
//Elements
const $messageForm = document.querySelector('#message-form')
const $messageFormInput = $messageForm.querySelector('input')
const $messageFormButton = $messageForm.querySelector('button')
const $locationButton = document.querySelector('#send-location')
const $messages = document.querySelector('#messages')
const $sidebarTemplate = document.querySelector('#sidebar-template').innerHTML

//Templates
const messageTemplate = document.querySelector('#message-template').innerHTML
const locationTemplate = document.querySelector('#location-template').innerHTML


//Options
const {username,room} = Qs.parse(location.search,{ignoreQueryPrefix:true})

const autoscroll = ()=>{
    //new message element
    const $newMessage = $messages.lastElementChild

    //Height of the new message
    const newMessageStyles = getComputedStyle($newMessage)
    const newMessageMargin = parseInt(newMessageStyles.marginBottom)
    const newMessageHeight = $newMessage.offsetHeight + newMessageMargin

    //visible height
    const visibleHeight = $messages.offsetHeight

    //Height of messages container
    const containerHeight = $messages.scrollHeight

    //how far have i scrolled?
    const scrollOffset = $messages.scrollTop + visibleHeight

    if(containerHeight - newMessageHeight <= scrollOffset){
        $messages.scrollTop = $messages.scrollHeight
    }
}

socket.on('message',(message)=>{
    console.log(message);
    const html = Mustache.render(messageTemplate,{
        username:message.username,
        message:message.text,
        createdAt:moment(message.createdAt).format('h:mm a')
    })
    $messages.insertAdjacentHTML('beforeend',html)
    autoscroll();
})

socket.on('locationMessage',(message)=>{
    console.log(message)
    const html = Mustache.render(locationTemplate,{
        username:message.username,
        url:message.url,
        createdAt:moment(message.createdAt).format('h:mm a')

    })
    $messages.insertAdjacentHTML('beforeend',html)
    autoscroll();
})

socket.on('roomData',({users,room})=>{
    console.log(users,room)
    const html = Mustache.render($sidebarTemplate,{
        room,
        users
        
    })
    document.querySelector('#sidebar').innerHTML = html
})

document.querySelector('#message-form').addEventListener('submit',(e)=>{
    e.preventDefault();


    $messageFormButton.setAttribute('disabled','disabled')
    // const message = document.querySelector('input').value
    const message = e.target.elements.message.value


    socket.emit('sendMessage',message,(error)=>{

        $messageFormButton.removeAttribute('disabled')
        $messageFormInput.value = ''
        $messageFormInput.focus()

        if(error){
            return console.log(error)
        }
        console.log('message is delivered!')
    });
})

document.querySelector('#send-location').addEventListener('click',()=>{
    $locationButton.setAttribute('disabled','disabled')
    if(!navigator.geolocation)
    {
        return alert('geolocation is not supported by your browser')
    }

    navigator.geolocation.getCurrentPosition((position)=>{

        socket.emit('sendLocation',{
            latitude:position.coords.latitude,
            longitude:position.coords.longitude
        },()=>{
            console.log('Location is shared')
            $locationButton.removeAttribute('disabled')
            $messageFormInput.focus()
        });

    })
})

socket.emit('join',{username,room},(error)=>{
    if(error){
        alert(error)
        location.href ='/'
    }
})