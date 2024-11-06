const dotenv = require('dotenv');
const http = require('http');
dotenv.config();

const app = require('./app');
const db = require('./app/configs/db/index.db');
const route = require('./routes/index.route');

const port = process.env.PORT || 3000;

db.connect();
route(app);

const server = http.createServer(app);

////
app.use((req, res, next) => {
    if (req.method === 'POST') {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString(); 
        });
        req.on('end', () => {
            console.log('Received POST data:', body);
        });
    }
    next();
});

server.listen(port, '0.0.0.0', () => {
    console.log(`App listening on port: ${port}`);
});
