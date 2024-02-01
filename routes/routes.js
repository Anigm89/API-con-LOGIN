const express = require("express");
const router = express.Router();
const axios = require('axios');
const {generateToken, verifyToken, searchCharacter} = require("../middlewares/middlewares");
const users = require("../data/users");

router.get("/", (req, res) => {
    if(req.session.token) {
        res.send(`
        <h1>BIENVENIDO</h1>
        <a href="/search">Buscador</a>
        <form action="/logout" method="post">
        <button type="submit">Cerrar Sesión</button>
        </form>
        `)
    } else {
        res.send(`
        <form action="/login" method="post">

        <label for="username">Usuario :</label>
        <input type="text" id="username" name="username" required>

        <label for="password">Contraseña :</label>
        <input type="password" id="password" name="password" required>

        <button type="submit">Entrar</button>
        </form>
        `)
    }
});

router.get("/search", verifyToken, (req, res) => {
    const userId = req.user;
    const user = users.find((user) => user.id === userId);


    if (user) {
      res.send(`
      <h1>Bienvenido, ${user.name}</h1>
      <p>ID: ${user.id}</p>
      <p>UserName: ${user.username}</p>

      
      <label for="characterName">Introduce el nombre del personaje</label>
      <input type="text" id="characterName" placeholder="Personaje"/>
      <button type="button" id="buscar" >Obtener informacion</button></br></br>
      <div id="container"></div>

      <a href="/">HOME</a>
      <form action="/logout" method="post">
      <button type="submit">Cerrar Sesión</button>
      </form>
      `);
    } else {
      res.status(401).json({ mensaje: 'Usuario no encontrado'});
    }
});

router.post("/login", (req, res) => {
    const {username, password} = req.body;
    const user = users.find((user) => user.username === username && user.password === password);
    if(user) {
        const token = generateToken(user);
        req.session.token = token;
        res.redirect("/search");
    } else {
        res.status(401).json({mensaje: "Credenciales incorrectas"});
    }
});

router.post("/logout", (req, res) => {
    req.session.destroy();
    res.redirect('/');
});

const url = `https://rickandmortyapi.com/api/character/`;

router.get("/character", verifyToken, async (req, res) => {
    try {
        const response = await axios.get(url);
        const characters = response.data.results;
        res.json(characters);
    } catch (error){
        res.status(500).json({error: "Error al acceder al personaje"});
    }
});

router.get("/character/:name", verifyToken, async (req, res) => {
    const name = req.params.name;
    const urlCharacter = `${url}?name=${name}`
    try {
        const response = await axios.get(urlCharacter)
        const character = response.data.results

        if (character) {
            const template = character.map((personaje) => {
                let { name: nombre, status, species, gender, origin:{name}, image } = personaje;
                return  `
                <div class="card">
                    <h2> ${nombre} </h2>
                    <img src ="${image} " alt="${nombre} ">
                    <p>Status: <span>${status}</span> </p>
                    <p>Species: <span>${species} </span></p>
                    <p>Gender: <span>${gender} </span></p>
                    <p>Origin: <span>${name} </span></p>
                </div>
                `
                }).join('')
                res.send(template)
        } else {
            res.status(404).json({error: "Error al encontrar el personaje"});
        };
        
    } catch (ERROR){
        res.status(500).json({error: "No ha podido acceder al servidor"});
    }
});

module.exports = router;