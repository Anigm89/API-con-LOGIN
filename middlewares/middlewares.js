const jwt = require('jsonwebtoken');
const hashedSecret = require("../crypto/crypto");

function generateToken(user)  {
    return jwt.sign({user: user.id}, hashedSecret, {expiresIn: "1h"});
};

function verifyToken(req, res, next) {
    const token = req.session.token;
    if (!token) {
        return res.status(401).json({mensaje: "Token no generado"});
    }
    jwt.verify(token, hashedSecret, (err, decoded) => {
        if (err) {
            return res.status(401).json({mensaje: "Token invalido"});
        };
        req.user = decoded.user;
        next()
    });
};

function searchCharacter() {
    console.log("hola")
    const characterName = document.getElementById("characterName").value;
    const result = document.getElementById("container");

    const apiURL = `http://localhost:3000/character/${characterName}`;
    result.innerHTML = ``;

    fetch(`${apiURL}`)
    .then(response => response.json())
    .then(data => {
        if (data) {
            data.map(item => {

                let characterName = item.name
                const {status, species, gender, origin: {name}, image} = item 
                result.innerHTML += `
                <div>
                <img src="${image}" alt="${characterName}"/>
                <p>Name: ${characterName}</p>
                <p>Estatus: ${status}</p>
                <p>Especie: ${species}</p>
                <p>Genero: ${gender}</p>
                <p>Origen: ${name}</p>
                </div>
                `
            })
        }else {
           result.innerHTML = `<p>Imposible acceder al personaje</p>`
        }
    })
    .catch(error => result.innerHTML = `<p>Imposible acceder al personaje</p>`);
};

module.exports = {generateToken, verifyToken, searchCharacter};