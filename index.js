const express = require("express");
const app = express();

app.use(express.json());

app.get("/", (req, res) => {
    res.send("Hello, world!");
});

const pizze = [
    {id: 1, naziv: "Margerita", cijena: 7.0},
    {id: 2, naziv: "Capricciosa", cijena: 9.0},
    {id: 3, naziv: "Šunka sir", cijena: 8.0},
    {id: 4, naziv: "Vegetariana", cijena: 12.0},
    {id: 5, naziv: "Quattro formaggi", cijena: 15.0}
];

app.get("/pizze", (req, res) => {
    res.json(pizze);
});

app.get("/pizze/:id", (req, res) => {
    const id_pizza = req.params.id;
    if(isNaN(id_pizza)){
        res.json({ message: 'Proslijedili ste parametar id koji nije broj!' });
        return;
    }
    
    const pizza = pizze.find(pizza => pizza.id == id_pizza);
    
    if(pizza){
        res.json(pizza);
    } else {
        res.json({ message: 'Pizza s traženim ID-em ne postoji.' });
    }
});

let narudzbe = [];

app.post("/naruci", (req, res) => {
    const { narudzba, prezime, adresa, broj_telefona } = req.body;

    if(!narudzba || !prezime || !adresa || !broj_telefona){
        res.send('Niste poslali sve potrebne podatke za narudžbu!');
        return;
    }

    let ukupno = 0;
    const nazivi = [];

    for(const stavka of narudzba){
        const { pizza, velicina, kolicina } = stavka;

        if(!pizza || !velicina || !kolicina){
            res.send('Svaka stavka mora imati naziv pizze, veličinu i količinu!');
            return;
        }

        const narucenaPizza = pizze.find(p => p.naziv === pizza);

        if(!narucenaPizza){
            res.send(`Pizza ${pizza} ne postoji u jelovniku.`);
            return;
        }

        ukupno += narucenaPizza.cijena * kolicina;
        nazivi.push(`${pizza} (${velicina})`);
    }

    narudzbe.push({ narudzba, prezime, adresa, broj_telefona, ukupno });

    const poruka = {
        message: `Vaša narudžba za ${nazivi.join(" i ")} je uspješno zaprimljena!`,
        prezime,
        adresa,
        ukupna_cijena: ukupno
    };

    res.json(poruka);
});

const PORT = 3000;
app.listen(PORT, (error) => {
    if(error){
        console.error(`Greška prilikom pokretanja poslužitelja: ${error.message}`);
    } else {
        console.log(`Server je pokrenut na http://localhost:${PORT}`);
    }
});