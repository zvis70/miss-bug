import { Console } from 'console'
import fs from 'fs'
import http from 'http'
import https from 'https'

export const utilService = {
    readJsonFile,
    download,
    httpGet,
    makeId,
    formatedDataForDisplay,
    dateTooltip
}


function readJsonFile(path) {
    const str = fs.readFileSync(path, 'utf8')
    const json = JSON.parse(str)
    return json
}

function download(url, fileName) {
    return new Promise((resolve, reject) => {
        const file = fs.createWriteStream(fileName)
        https.get(url, (content) => {
            content.pipe(file)
            file.on('error', reject)
            file.on('finish', () => {
                file.close()
                resolve()
            })
        })
    })
}

function httpGet(url) {
    const protocol = url.startsWith('https') ? https : http
    const options = {
        method: 'GET'
    }

    return new Promise((resolve, reject) => {
        const req = protocol.request(url, options, (res) => {
            let data = ''
            res.on('data', (chunk) => {
                data += chunk
            })
            res.on('end', () => {
                resolve(data)
            })
        })
        req.on('error', (err) => {
            reject(err)
        })
        req.end()
    })

}

function formatedDataForDisplay(createdAtTimestamp) {
    //const createdAtTimestamp = 1709239731247; // Your timestamp here

    const createdAtDate = new Date(createdAtTimestamp);

    // Extract date components
    const day = createdAtDate.getDate().toString().padStart(2, '0');
    const month = (createdAtDate.getMonth() + 1).toString().padStart(2, '0');
    const year = createdAtDate.getFullYear().toString();

    // Extract time components
    const hours = createdAtDate.getHours().toString().padStart(2, '0');
    const minutes = createdAtDate.getMinutes().toString().padStart(2, '0');
    const seconds = createdAtDate.getSeconds().toString().padStart(2, '0');
    const milliseconds = createdAtDate.getMilliseconds().toString().padStart(3, '0');

    // Construct formatted string
    const formattedCreatedAt = `${day}/${month}/${year} ${hours}:${minutes}:${seconds}.${milliseconds}`;

    return (formattedCreatedAt)

}

function dateTooltip(createdAtTimestamp, tooltipType) {
    var now = Date.now()
    console.log("now ", now ) 

    // var tooltipDate = createdAtTimestamp//new Date(createdAtTimestamp)
    var timeDifference = now - createdAtTimestamp
    
    if (tooltipType === "short") {
        
        var years = Math.floor(timeDifference / (1000 * 60 * 60 * 24 * 365));
        var months = Math.floor(timeDifference / (1000 * 60 * 60 * 24 * 30));
        var weeks = Math.floor(timeDifference / (1000 * 60 * 60 * 24 * 7));
        var days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
        var hours = Math.floor(timeDifference / (1000 * 60 * 60));
        var minutes = Math.floor(timeDifference / (1000 * 60));

        console.log("years", years)

        var timeDifferenceTooltip

        if (years > 0) {
            timeDifferenceTooltip = years + "y"
        } else if (months > 0) {
            timeDifferenceTooltip = months + "mo"
        } else if (weeks > 0) {
            timeDifferenceTooltip = weeks + "w"
        } else if (days > 0) {
            timeDifferenceTooltip = days + "d"
        } else if (hours > 0){
            timeDifferenceTooltip = hours + "h"
        }else {
            timeDifferenceTooltip = minutes + "m"
        }
console.log("timeDifferenceTooltip", timeDifferenceTooltip)
        return (timeDifferenceTooltip)

    } else if (tooltipType === "hebrew") {

        const tooltipHebDateText = tooltipDate.toLocaleDateString("he-IL", { year: 'numeric', month: 'short', day: 'numeric', weekday: 'long' })

        return (tooltipHebDateText)
    } else {
        return ("no tooltip type was given")
    }
}

function makeId(type, length) {
    var txt = ''
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

    for (var i = 0; i < length; i++) {
        txt += possible.charAt(Math.floor(Math.random() * possible.length))
    }
    if (type === "BUG") {
        var newTxt = 'B_' + txt
    }
    else {
        var newTxt = 'U_' + txt
    }
    return newTxt
}