import dotenv from 'dotenv'
// import csvParse from 'csv-parse'
import fs from 'fs'
import path from 'path'
dotenv.config();

let pointlat = 34.2929505;
let pointlon = 134.061257;

const mymap = L.map('mapid').setView([pointlat, pointlon], 13);

L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox.streets', 
    accessToken: process.env.ACCESS_TOKEN
}).addTo(mymap);

const csv = require('csv-parser/');
const stream = csv();

stream.on('data', function(data) {
    console.log(data)
});

document.querySelector('input')
    .addEventListener('change', (e) => {
        const reader = new FileReader
        reader.onload = (e) => {
            stream.write(e.target.result)
        }
        
        if (e.target.files[0]) {
            const file = e.target.files[0]
            reader.readAsText(file)
        }
    });

// let csvdir = path.resolve(__dirname, '/log_2019-05-23.csv');
// console.log(csvdir);
// fs.createReadStream(csvdir)
//     .pipe(csv.parse({columns: true}, function(err, data) {

//         console.log(JSON.stringify(data));
//     }));

// マーカー
// var marker = L.marker([pointlat, pointlon]).addTo(mymap);