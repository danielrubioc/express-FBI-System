const express = require("express");
const jwt = require("jsonwebtoken");
const app = express();
const { results } = require("./data/agentes");

app.use(express.urlencoded({ extended: true }));

app.get("/", async (req, res) => {
    res.sendFile(__dirname + "/index.html");
});

app.get("/SignIn", (req, res) => {
    const { email, password } = req.query;
    const user = results.find((el) => el.email === email);

    if (!user) return res.status(401).json({ msg: "Usuario no válido" });

    if (user.password !== password)
        return res.status(401).json({ msg: "Credenciales no válidas" });

    const payload = {
        email: user.email,
    };

    const token = jwt.sign(payload, "palabraseecreteaaaa", {
        expiresIn: "120s",
    });

    res.send(` 
        <a href="/Dashboard?token=${token}"> <p> Ir al Dashboard </p> </a>
        Bienvenido, ${user.email}.
        
        <script>
        sessionStorage.setItem('token', JSON.stringify("${token}"))
        </script>
    `);
});

app.get("/Dashboard", async (req, res) => {
    const { token } = req.query;
    if (!token) return res.status(403).json({ msg: "no existe el token" });

    try {
        const payload = jwt.verify(token, "palabraseecreteaaaa");
        return res.send(`
            Bienvenido al Dashboard ${payload.email}
        `);
    } catch (error) {
        return res.status(401).json({ msg: "token no válido" });
    }
});

app.listen(3000, console.log("Servidor Ok!"));
