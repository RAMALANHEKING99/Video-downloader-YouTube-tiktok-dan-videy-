const fs = require('fs'); 
const axios = require('axios'); 
const readline = require('readline'); 

function getParameterByName(name, currentUrl) {
    const queryParams = new URLSearchParams(new URL(currentUrl).search);
    return queryParams.get(name);
}

async function downloadVideo(url, filename) {
    try {
        const response = await axios({
            url: url,
            method: 'GET',
            responseType: 'stream' 
        });

        const writer = fs.createWriteStream(filename);
        response.data.pipe(writer);

        writer.on('finish', () => {
            console.log(`Video berhasil diunduh: ${filename}`);
        });

        writer.on('error', (err) => {
            console.error('Terjadi kesalahan saat mengunduh video:', err);
        });
    } catch (error) {
        console.error('Terjadi kesalahan:', error);
    }
}

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.question('Masukkan URL video yang ingin diunduh: ', (currentUrl) => {
    const paramValue = getParameterByName('id', currentUrl);

    if (paramValue) {
        const videoLink = `https://cdn.videy.co/${paramValue}.mp4`;

        downloadVideo(videoLink, 'video_unduhan.mp4');
    } else {
        console.log("Tidak ditemukan parameter 'id' dalam URL.");
    }

    rl.close();
});
