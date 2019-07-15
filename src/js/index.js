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
    if (results.length === 0) {
        let element = document.createElement('p') // 挿入するタグ
        let inspos = document.getElementById('disp') // 挿入する位置をidで決める
        element.innerHTML = '<div id="exist" style="text-align: center">csvファイルを入力してください</div>'
        inspos.appendChild(element)
    } else {
        let pos_indx = samepos(results)
        // console.log(pos_indx);
        console.log(pos_indx);
        markpos(results, pos_indx)
        markroute(results, pos_indx)
    }
}

// マーカーを打つ
function markpos(results, pos_indx) {

    

    for (let i = 0; i < pos_indx.length; i++) {
        let idx = pos_indx[i]
        let nxtidx = i+1!=pos_indx.length ? pos_indx[i+1] : results.length-1

        L.marker([results[idx]['latitude'], results[idx]['longitude']]).addTo(mymap)
        let text = results[idx]['time']
        text = text.split(' ')
        // console.log(Date.parse('2008/5/1 2:00:00'));
        // let difftime = Date.parse(text) - Date.parse(results[26]['time'])
        // console.log(Date.parse(text), Date.parse(results[26]['time']));
        // console.log(Date.toString(Date.parse(text) - Date.parse(results[26]['time'])));
        // console.log(difftime/1000);
        let element = document.createElement('div')
        element.setAttribute('style', 'text-align: left')
        let inpos = document.getElementById('exist')
        element.innerHTML = i + ' : ' + text[1] + ' : ' + results[idx]['latitude'] + results[idx]['longitude']
        inpos.appendChild(element)
        
        console.log(idx, nxtidx);
        if ((idx+1) < nxtidx) {
            let diff_time = (Date.parse(results[nxtidx-1]['time']) - Date.parse(text))/1000
            // console.log(diff_time);
            // console.log(diff_time/60);
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
    if (pos_indx.length === 1) {return}
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
    let threshold = 0.0008
    for (let i = 0; i < results.length-1; i++) {
        let diff_lati = Math.abs(results[i]['latitude'] - results[i+1]['latitude'])
        let diff_long = Math.abs(results[i]['longitude'] - results[i+1]['longitude'])
        if (diff_lati < threshold && diff_long < threshold) {
            continue
        }
        pos_indx.push(i+1)
    }
    // console.log(results,pos_indx);
    return pos_indx
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
            results = []
            stream.write(e.target.result) // stream.onの処理を行う
            // console.log(results);
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
    // console.log(results);
})

// マーカー
// var marker = L.marker([pointlat, pointlon]).addTo(mymap)