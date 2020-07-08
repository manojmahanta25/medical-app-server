users = [];
connections = [];

module.exports = (io)=> {
  io.on('connection',(socket)=>{
    io.emit('test', "Cheer");
    console.log('connected',socket.id);
    if(!connections.includes(socket.id)){
      connections.push(socket);
    }
    console.log('Connected: %s socket connected', connections.length);
    socket.on('disconnect',  (data) => {
        users.splice(users.indexOf(socket.username), 1);
        // updateUsernames();
        connections.splice(connections.indexOf(socket), 1)
        console.log('Disconnected: %s sockets connected', connections.length);
    });

    // socket.on('send message',  (data) => {
    //     console.log(data);
    //     io.emit('new message', {msg:data, user: socket.username});
    // })
    // socket.on('test',  (data) => {
      
    //   io.emit('new message', "hello World");
    // })
    // socket.on('new user',  (data, callback) => {
    //     callback(true);
    //     socket.username=data;
    //     users.push(socket.username);
    //     updateUsernames();
    // })
    // function updateUsernames() {
    //     io.emit('get users', users);

    // }
    // socket.on('hey', data => {
    //     console.log( data);
    //   });
    })
}