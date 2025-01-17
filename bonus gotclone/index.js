const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const readline = require('readline');

const mediaFolder = path.join(__dirname, 'media');
if (!fs.existsSync(mediaFolder)) fs.mkdirSync(mediaFolder);

function gitClone(url) {
    const targetDir = path.join(mediaFolder, url.split('/').pop().replace('.git', ''));
    exec(`git clone ${url} ${targetDir}`, (error, stdout, stderr) => {
        if (error) return console.error(`Error: ${error.message}`);
        if (stderr) return console.error(`stderr: ${stderr}`);
        console.log(`Repo berhasil di-clone ke: ${targetDir}`);
    });
}

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

rl.question('Masukkan URL Git repository yang ingin di-clone: ', (repoUrl) => {
    if (repoUrl) gitClone(repoUrl);
    else console.log('URL repository tidak valid.');
    rl.close(); // Pindahkan close ke sini setelah pertanyaan dijawab
});
