const ffmpeg = require('fluent-ffmpeg');
const readline = require('readline');
const path = require('path');
const fs = require('fs');


const mediaFolder = path.join(__dirname, 'media');
if (!fs.existsSync(mediaFolder)) {
    fs.mkdirSync(mediaFolder); 
}

function convertVideoToAudio(inputVideoPath, outputAudioName) {
    const outputAudioPath = path.join(mediaFolder, `${outputAudioName}.mp3`);

    if (!fs.existsSync(inputVideoPath)) {
        console.error(`Error: File "${inputVideoPath}" does not exist.`);
        process.exit(1);
    }

    ffmpeg(inputVideoPath)
        .output(outputAudioPath)
        .noVideo() 
        .on('start', (commandLine) => {
            console.log('FFmpeg process started with command:', commandLine);
        })
        .on('progress', (progress) => {
            console.log(`Processing: ${progress.percent || 0}% done`);
        })
        .on('end', () => {
            console.log(`Audio file successfully saved to: ${outputAudioPath}`);
            process.exit(0);
        })
        .on('error', (err) => {
            console.error(`An error occurred during conversion: ${err.message}`);
            console.error('Please check if the input video is valid and try again.');
            process.exit(1); 
        })
        .run();
}

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.question('Enter the path to the input video file: ', (inputVideoPath) => {
    rl.question('Enter the name for the output audio file (without extension): ', (outputAudioName) => {
        convertVideoToAudio(inputVideoPath, outputAudioName);
        rl.close();
    });
});
