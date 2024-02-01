const express = require("express");
const session = require("express-session");
const hashedSecret = require("./crypto/crypto");
const route = require("./routes/routes");
const app = express();
 


app.use(express.urlencoded({ extended: true}));
app.use(express.json());


app.use(
    session ({
        secret: hashedSecret,
        resave: false,
        saveUninitialized: true,
        cookie: { secure: false },
    })
);

app.use("/", route);


app.listen(3000, () => {
    console.log("express esta escuchando en el puerto http://localhost:3000");
});








