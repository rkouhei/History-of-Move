import dotenv from 'dotenv'
const csv = require('csv-parser/')
dotenv.config()

// 日付表示
function datadisplay(results) {
    let text = results[0]['time']
    text = text.split(' ')
    // 先に「表示」ボタンが押されていない場合
    if (document.getElementById('exist') === null) {
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
    if (results.length === 0) {  // csvファイルが入力されていないとき
        let element = document.createElement('p') // 挿入するタグ
        let inspos = document.getElementById('disp') // 挿入する位置をidで決める
        element.innerHTML = '<div id="exist" style="text-align: center">csvファイルを入力してください</div>'
        inspos.appendChild(element)
    } else {  // 入力されているとき
        let pos_indx = samepos(results)
        markpos(results, pos_indx)
        markroute(results, pos_indx)
    }
}

// マーカーを打つ
function markpos(results, pos_indx) {

    for (let i = 0; i < pos_indx.length; i++) {
        let idx = pos_indx[i]  // 現在の位置のインデックス
        let nxtidx = i+1!=pos_indx.length ? pos_indx[i+1] : results.length-1  // 次の位置のインデックス

        // マーカーを打つ
        L.marker([results[idx]['latitude'], results[idx]['longitude']]).addTo(mymap)
        
        // テキストで座標の表示
        let text = results[idx]['time']
        text = text.split(' ')
        let element = document.createElement('div')
        element.setAttribute('style', 'text-align: left')
        let inpos = document.getElementById('exist')
        element.innerHTML = i + ' : ' + text[1] + ' : ' + results[idx]['latitude'] + results[idx]['longitude']
        inpos.appendChild(element)
        
        // 滞在時間の表示
        if ((idx+1) < nxtidx) {
            let diff_time = (Date.parse(results[nxtidx-1]['time']) - Date.parse(text))/1000
            let element = document.createElement('div')
            element.setAttribute('style', 'text-align: left')
            let inpos = document.getElementById('exist')
            element.innerHTML = '滞在時間 : 約' + Math.floor(diff_time/3600) + '時間' + Math.floor(diff_time/60) + '分' + Math.floor(diff_time%60) + '秒'
            inpos.appendChild(element)
        }
    }
}

// 経路表示
function markroute(results, pos_indx) {
    if (pos_indx.length === 1) {return}  // 一箇所の場合は経路は表示できない
    for (let i = 0; i < pos_indx.length-1; i++) {
        let idx = pos_indx[i]
        let nxtidx = pos_indx[i+1]
        L.polyline([
            [results[idx]['latitude'], results[idx]['longitude']],
            [results[nxtidx]['latitude'], results[nxtidx]['longitude']]
        ],{
            "color": "#FF0000",
            "weight": 5,
            "opacity": 0.6
        }).addTo(mymap)
    }
}

// 同じ場所滞在判定
function samepos(results) {
    let pos_indx = [0]
    let threshold = 0.0008  // 閾値(適当に設定)
    for (let i = 0; i < results.length-1; i++) {
        let diff_lati = Math.abs(results[i]['latitude'] - results[i+1]['latitude'])
        let diff_long = Math.abs(results[i]['longitude'] - results[i+1]['longitude'])
        if (diff_lati < threshold && diff_long < threshold) {
            continue
        }
        pos_indx.push(i+1)
    }
    return pos_indx  // 滞在を考慮したインデックス
}

// マップの読み込み
let pointlat = 34.2929505  // 香川大学創造工学部の緯度
let pointlon = 134.061257  // 香川大学創造工学部の経度
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
            results = []
            stream.write(e.target.result) // stream.onの処理を行う
            datadisplay(results)
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