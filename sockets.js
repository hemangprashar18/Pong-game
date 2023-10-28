let readyPlayerCount = 0;

// make io obj available by passing it in parameter as a function
function listen(io){
    // creating new namespace
    const pongNamespace = io.of('/pong');
    //suppose we need to host multiple games on this server like tetris game so do
    // const tetrisNamespace = io.of('/tetris');
pongNamespace.on('connection',(socket) => {
    let room ; 
    // moved room here to keep it sync for whole connection
    console.log('a user connected',socket.id);

    socket.on('ready', () => {
        // when to create a room
        room = 'room' + Math.floor(readyPlayerCount / 2) ;   // Math.floor rounds to nearest integer
        // divided by 2 coz each 2 players will have one room
        socket.join(room);
        console.log('Player ready',socket.id, room);

        readyPlayerCount++ ;

        if(readyPlayerCount %2 === 0){
            // broadcast('startGame') mesage to each client
            // io.emit('startGame', socket.id);
            //broadcasting to only client of pongNamespace
            pongNamespace.emit('startGame',socket.id);
        }
    });

    socket.on('paddleMove', (paddleData) => {
        // socket.broadcast.emit('paddleMove',paddleData);
        // narrowing message to that specific room
        socket.to(room).emit('paddleMove',paddleData);
    });

    socket.on('ballMove', (ballData) => {
        // socket.broadcast.emit('ballMove',ballData);
        socket.to(room).emit('ballMove',ballData);
    });

    socket.on('disconnect', (reason) => {
        console.log(`Client ${socket.id} disconnected: ${reason}`);  
        // to leave a room
        socket.leave(room);
    });
});
}

module.exports = {
    listen,
}
