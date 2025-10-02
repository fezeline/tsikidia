const express = require("express");
const config = require("./config/config.env");
const verifyToken = require("./Middleware/authmiddleware");
const utilisateurRoute = require("./Route/utilisateurRoute");
const messageRoute = require("./Route/messageRoute");
const visiteRoute = require("./Route/visiteRoute");
const voitureRoute = require("./Route/voitureRoute");
const commentaireRoute = require("./Route/commentaireRoute");
const offreRoute = require("./Route/offreRoute");
const activiteRoute = require("./Route/activiteRoute");
const hebergementRoute = require("./Route/hebergementRoute");
const reservationRoute = require("./Route/reservationRoute");
const payementRoute = require("./Route/payementRoute");
const authRoute = require("./Route/authRoute");
const motRoute = require("./Route/motRoute");
const { stripeWebhookController } = require("./Controller/payementController"); // ✅ Import webhook



const app = express();
const cors = require("cors");


// Limite haute pour JSON (images base64 volumineuses)
app.use(express.json({ limit: "100mb" }));
app.use(express.urlencoded({ limit: "100mb", extended: true }));

app.use(cors({
  origin: "http://localhost:5173", // adresse de ton frontend React
  credentials: true
}));



app.use("/utilisateur", utilisateurRoute);
app.use("/message", messageRoute);
app.use("/visite", visiteRoute);
app.use("/voiture", voitureRoute);
app.use("/commentaire", commentaireRoute);
app.use("/offre", offreRoute);
app.use("/activite", activiteRoute);
app.use("/hebergement", hebergementRoute);
app.use("/reservation", reservationRoute);
app.use("/payement", payementRoute);
app.use("/api/auth", authRoute);
app.use("/api/mot", motRoute)



app.get("/api/protected", verifyToken, (req, res) => {
  res.json({ message: "Accès autorisé", user: req.user });
});

app.get("/", (req,res)=>{
    res.send("salut les gars")
})

app.post("/", (req, res)=> {
    res.send("ajout");

});

app.put("/", (req, res)=> {
    res.send("edit");

});

app.delete("/", (req, res)=> {
    res.send("delete");

});

app.listen(config.PORT, ()=>{
    console.log(`le servuer ${config.PORT}`);
})