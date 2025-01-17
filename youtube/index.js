const fs = require("fs");
const path = require("path");
const { youtube } = require("btch-downloader");
const readline = require("readline");
const axios = require("axios");

async function downloadyt(urlnyu) {
  try {
    const downloadFolder = path.resolve(__dirname, "down");
    if (!fs.existsSync(downloadFolder)) {
      fs.mkdirSync(downloadFolder);
    }

    try {
      console.log("Mengunduh video dari URL:", urlnyu);
      const vidUrl = await youtube(urlnyu);
      const filePath = path.join(downloadFolder, "video_download.mp4");

      const response = await axios({
        url: vidUrl.mp4,
        method: "GET",
        responseType: "stream",
      });

      const fileStream = fs.createWriteStream(filePath);
      response.data.pipe(fileStream);

      await new Promise((resolve, reject) => {
        fileStream.on("finish", resolve);
        fileStream.on("error", reject);
      });

      console.log("Video berhasil diunduh ke:", filePath);
    } catch (e) {
      console.error("Kesalahan saat mengunduh video:", e);
      throw new Error("Gagal mengunduh video.");
    }
  } catch (error) {
    console.error("Error dalam fungsi downloadyt:", error);
    throw error;
  }
}

if (require.main === module) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  rl.question("Masukkan URL YouTube: ", async (url) => {
    try {
      await downloadyt(url);
    } catch (err) {
      console.error("Error:", err.message);
    } finally {
      rl.close();
    }
  });
}

module.exports = { downloadyt };
