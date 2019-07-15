import dotenv from 'dotenv'
const csv = require('csv-parser/')
dotenv.config()

// 日付表示
function datadisplay(results) {
    let text = results[0]['time']
    text = text.split(' ')
    // 先に「表示」ボタンが押されていない場合
    if (document.getElementById('exist') === null ) {
        let element = document.createElement('p') // 挿入するタグ
        let inspos = document.getElementById('disp') // 挿入する位置をidで決める
        element.innerHTML = '<div id="exist" style="text-align: center">'+ text[0] + 'の行動履歴' + '</div>'
        inspos.appendChild(element) 
    } else {  // 押されている場合
        let element = document.getElementById('exist')
        element.innerHTML = '<div id="exist" style="text-align: center">'+ text[0] + 'の行動履歴' + '</div>'
    }
}

// ボタンクリック時の動作
document.getElementById('btn').onclick = function() {
    if (results.length === 0) {
        let element = document.createElement('p') // 挿入するタグ
        let inspos = document.getElementById('disp') // 挿入する位置をidで決める
        element.innerHTML = '<div id="exist" style="text-align: center">csvファイルを入力してください</div>'
        inspos.appendChild(element)
    } else {
        markpos(results)
        markroute(results)
    }
}

// マーカーを打つ
function markpos(results) {
    for (let i = 0; i < results.length; i++) {
        L.marker([results[i]['latitude'], results[i]['longitude']]).addTo(mymap)
        let text = results[i]['time']
        text = text.split(' ')
        let element = document.createElement('div')
        element.setAttribute('style', 'text-align: left')
        let inpos = document.getElementById('exist')
        element.innerHTML = i + ' : ' + text[1] + ' : ' + results[i]['latitude'] + results[i]['longitude']
        inpos.appendChild(element)
    }
}

// 経路表示
function markroute(results) {
    for (let i = 0; i < results.length-1; i++) {
        L.polyline([
            [results[i]['latitude'], results[i]['longitude']],
            [results[i+1]['latitude'], results[i+1]['longitude']]
        ],{
            "color": "#FF0000",
            "weight": 5,
            "opacity": 0.6
        }).addTo(mymap)
    }
}

// マップの読み込み
let pointlat = 34.2929505
let pointlon = 134.061257
const mymap = L.map('mapid').setView([pointlat, pointlon], 13)
L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox.streets', 
    accessToken: process.env.ACCESS_TOKEN
}).addTo(mymap)

// データの読み込み
const stream = csv()
document.querySelector('input')
    .addEventListener('change', (e) => { // ファイルが入力されると呼ばれる
        const reader = new FileReader
        reader.onload = (e) => {
            stream.write(e.target.result) // stream.onの処理を行う
            datadisplay(results)
            // console.log(results.length)
        }
        
        if (e.target.files[0]) {
            const file = e.target.files[0]
            reader.readAsText(file)
        }
    });

// 1行ずつ処理
let results = []
stream.on('data', function(data) {
    results.push(data)
})

// マーカー
// var marker = L.marker([pointlat, pointlon]).addTo(mymap)