import dotenv from 'dotenv'
const csv = require('csv-parser/')
dotenv.config()

function datadisplay(results) {
    let element = document.createElement('b') // 挿入するタグ
    let inspos = document.getElementById('csv') // 挿入する位置をidで決める
    let text = results[0]['time']
    text = text.split(' ')
    element.innerHTML = text[0] + 'の行動履歴'
    inspos.appendChild(element)
    console.log('debug');
}

let pointlat = 34.2929505
let pointlon = 134.061257

const mymap = L.map('mapid').setView([pointlat, pointlon], 13)

L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox.streets', 
    accessToken: process.env.ACCESS_TOKEN
}).addTo(mymap)


const stream = csv()
// 1行ずつ処理
let results = []
stream.on('data', function(data) {
    results.push(data)
})

// データの読み込み
document.querySelector('input')
    .addEventListener('change', (e) => { // ファイルが入力されると呼ばれる
        const reader = new FileReader
        reader.onload = (e) => {
            stream.write(e.target.result) // stream.onの処理を行う
            // console.log(results[0]['time'])
            datadisplay(results)
            // console.log(results.length)
        }
        
        if (e.target.files[0]) {
            const file = e.target.files[0]
            reader.readAsText(file)
        }
    });

// マーカー
// var marker = L.marker([pointlat, pointlon]).addTo(mymap);