module.exports = (socket)=> {
    socket.on('hey', data => {
        console.log( data);
      });
}