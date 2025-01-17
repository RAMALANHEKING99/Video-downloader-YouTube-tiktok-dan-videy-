const axios = require('axios');
const { URLSearchParams } = require('url');
const readline = require('readline');
const fs = require('fs');
const path = require('path');
const stream = require('stream');
const https = require('https');

async function tiktok2(query) {
  return new Promise(async (resolve, reject) => {
    try {
      const encodedParams = new URLSearchParams();
      encodedParams.set('url', query);
      encodedParams.set('hd', '1'); 

      const response = await axios({
        method: 'POST',
        url: 'https://tikwm.com/api/',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
          'Cookie': 'current_language=en',
          'User-Agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Mobile Safari/537.36'
        },
        data: encodedParams
      });

      if (response.data && response.data.data) {
        const videos = response.data.data;
        const result = {
          title: videos.title,
          cover: videos.cover,
          origin_cover: videos.origin_cover,
          no_watermark: videos.play,
          watermark: videos.wmplay, 
          music: videos.music 
        };
        resolve(result);
      } else {
        reject("Data tidak ditemukan.");
      }
    } catch (error) {
      reject(`Terjadi kesalahan: ${error.message}`);
    }
  });
}


function clean(text) {
  return text.replace(/\n/g, '').trim();
}

async function shortener(url) {
  return url; 
}

async function saveVideo(url, videoName) {
  const folderPath = path.join(__dirname, 'video');
  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath);
  }

  const filePath = path.join(folderPath, videoName);
  
  const writer = fs.createWriteStream(filePath);

  https.get(url, (response) => {
    response.pipe(writer);

    writer.on('finish', () => {
      console.log(`Video berhasil disimpan ke: ${filePath}`);
    });

    writer.on('error', (error) => {
      console.error(`Gagal mengunduh video: ${error.message}`);
    });
  });
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question('Masukkan URL TikTok: ', async (url) => {
  try {
    let res = await tiktok2(url);
    console.log('Video tanpa watermark:', res.no_watermark);
    console.log('Audio:', res.music);

    await saveVideo(res.no_watermark, 'tiktok_video.mp4');
  } catch (error) {
    console.error('Terjadi kesalahan:', error);
  } finally {
    rl.close(); 
  }
});
