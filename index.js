import express from "express"

const app = express();

const PORT = 86;


app.use( express.static('./'))

app.get('/', (req, res) => {
    res.sendFile("./index.html")
})

app.listen(PORT, '::', () => {
    console.log(`Prescript escuchando en :${PORT}`)
})