const express = require('express');
const http = require('http');
const { Server } = require("socket.io");
const fs = require('fs');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server, { allowEIO3: true, cors: { origin: "*" } });

const externalDir = process.cwd();

app.use('/maps', express.static(path.join(externalDir, 'maps')));
app.get('/locales.js', (req, res) => {
    const externalLocales = path.join(externalDir, 'locales.js');
    if (fs.existsSync(externalLocales)) return res.sendFile(externalLocales);
    res.sendFile(path.join(__dirname, 'public', 'locales.js'));
});
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'public', 'index.html')));
app.use((req, res, next) => {
    if (req.url.startsWith('/socket.io')) return next();
    express.static(path.join(__dirname, 'public'))(req, res, next);
});

app.get('/api/maps', (req, res) => {
    const mapsDir = path.join(externalDir, 'maps');
    if (!fs.existsSync(mapsDir)) return res.json({});
    const result = {};
    const folders = fs.readdirSync(mapsDir);
    folders.forEach(folder => {
        const folderPath = path.join(mapsDir, folder);
        if (fs.statSync(folderPath).isDirectory()) {
            const files = fs.readdirSync(folderPath).filter(file => 
                ['.png', '.jpg', '.jpeg', '.webp'].includes(path.extname(file).toLowerCase())
            );
            if (files.length > 0) result[folder] = files;
        }
    });
    res.json(result);
});

let globalState = { currentMap: null, annotations: [] };

io.on('connection', (socket) => {
    socket.emit('init_state', globalState);
    socket.on('change_map', (mapData) => {
        globalState.currentMap = mapData;
        globalState.annotations = [];
        io.emit('map_changed', globalState.currentMap);
    });
    socket.on('reset_map', () => {
        globalState.currentMap = null;
        globalState.annotations = [];
        io.emit('map_reset');
    });
    socket.on('object_added', (obj) => {
        globalState.annotations.push(obj);
        socket.broadcast.emit('object_added', obj);
    });
    socket.on('object_modified', (obj) => {
        const index = globalState.annotations.findIndex(x => x.id === obj.id);
        if (index !== -1) globalState.annotations[index] = obj;
        socket.broadcast.emit('object_modified', obj);
    });
    socket.on('object_removed', (id) => {
        globalState.annotations = globalState.annotations.filter(x => x.id !== id);
        socket.broadcast.emit('object_removed', id);
    });
    socket.on('clear_annotations', () => {
        globalState.annotations = [];
        io.emit('clear_canvas_content');
    });
});

server.listen(3000, '0.0.0.0', () => console.log('Server running on port 3000'));