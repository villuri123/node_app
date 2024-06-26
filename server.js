const express = require('express')
const compression = require('compression');
const fs = require("fs");
const path = require("path");
const app = express();
require('dotenv').config();
const expressLayouts = require('express-ejs-layouts');
var cookieParser = require('cookie-parser')
const multiparser = require("./multiparser");
const port = 8000
const dev = true;
let httpServer;
if (dev) {
    httpServer = require("http").createServer(app);
} else {
    httpServer = require("https").createServer({
        key: fs.readFileSync("/var/app/keys/ssl/private-key.pem", 'utf8'),
        cert: fs.readFileSync("/var/app/keys/ssl/8b6e8e8fe2422896.crt", 'utf8'),
        ca: fs.readFileSync('/var/app/keys/ssl/gd_bundle-g2-g1.crt', 'utf8'),
        requestCert: false,
        rejectUnauthorized: false
    }, app);
}
httpServer.keepAliveTimeout = 0;
app.disable('x-powered-by');
app.use(multiparser());
app.use(express.json({ limit: '50mb', extended: true }));
app.set('views', path.join(__dirname, 'views'));
app.use('/static', express.static(path.join(__dirname, 'static')))
app.set('view engine', 'ejs');
app.set('layout', 'layouts/layout');
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate');
    res.header('Expires', '0');
    res.header('Pragma', 'no-cache');
    res.header('Content-Type: text/javascript');
    next();
});
app.use(compression());
app.use(cookieParser("nodeproject"));
app.use(expressLayouts);
app.get('/', (req, res) => {
    res.render("login", { layout: false });
})
app.get('/forgot-password', (req, res) => {
    res.render("forgot-password", { layout: false });
})
app.get('/reset-password', (req, res) => {
    res.render("reset-password", { layout: false });
})
app.use("/admin", require("./routes/admin"));
app.use("/api", require('./routes/api'));

app.listen(port, () => {
    console.log(`node project listening on port ${port}`)
})