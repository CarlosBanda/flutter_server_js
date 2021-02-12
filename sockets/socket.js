const { io } = require('../index');
const Band = require('../models/band');
const Bands = require('../models/bands');

const bands = new Bands();

bands.addBand(new Band('Queen'));
bands.addBand(new Band('Iron made'));
bands.addBand(new Band('ac dc'));
bands.addBand(new Band('Metalica'));

// Mensajes de Sockets
io.on("connection", client => {
    console.log("Servidor Conectado")
    client.emit('Active-bands', bands.getBands());

    // print in the console when some device disconnects
    client.on("disconnect", data => {
        console.log("Desconectado!")
    })

    client.on('emitir-mensaje', (payload)=>{
        io.emit('nuevo-mensaje', payload);
    })

    client.on('vote-band', (payload)=>{
        bands.voteBand(payload.id)
        io.emit('Active-bands', bands.getBands());
    });
    client.on('add-name', (payload)=>{
        const newBand = new Band(payload.name);
        bands.addBand(newBand);
        io.emit('Active-bands', bands.getBands());
    });
    client.on('delete-band', (payload)=>{
        bands.deletBand(payload.id)
        io.emit('Active-bands', bands.getBands());
    });

    // client.on('emitir-mensaje', (payload)=>{
    //     console.log(payload)
    //     // clientbroadcast.emit('nuevo-mensaje',payload)
    //     client.broadcast.emit('nuevo-mensaje', payload);
    // })
})