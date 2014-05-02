
// let this be a power of 2
var SEGMENT_COUNT = 16;
var TIME_FRAME = 200;

var analyser, audioData, averages, audio, segmentLength;

function initAudio() {
    var ctx;
    try {
        ctx = new AudioContext();
    } catch(e) {
        ctx = new webkitAudioContext();
    }

    analyser = ctx.createAnalyser();
    audio = document.getElementsByTagName('audio').item(0);
    var audioSrc = ctx.createMediaElementSource(audio);
    // we have to connect the MediaElementSource with the analyser 
    audioSrc.connect(analyser);
    analyser.connect(ctx.destination);

    // the minimum size allowed for fftSize is 32
    if(SEGMENT_COUNT > 32) {
        analyser.fftSize = SEGMENT_COUNT;
    } else {
        analyser.fftSize = 32;
    }

    segmentLength = analyser.fftSize / (SEGMENT_COUNT * 2);
    
    analyser.smoothingTimeConstant = 0.1;

    // the amplitude of the audio will be saved into this variable each frame
    audioData = new Uint8Array(analyser.frequencyBinCount);
    averages = [];
    for (var i = 0; i < TIME_FRAME; i++) {
        averages[i] = [];
        for (var j = 0; j < SEGMENT_COUNT; j++) {
            averages[i][j] = 0;
        }
    }
     
}

function getAverageFrequency() {
    analyser.getByteFrequencyData(audioData);

    //get average level
    var sum = 0;
    for(var j = 0; j < audioData.length; ++j) {
        sum += audioData[j];
    }

    return (sum / audioData.length) / 256;
}

function getFrequencyAverages() {
    analyser.getByteFrequencyData(audioData);

    var averages = [];
    for (var i = 0; i < 8; i++) {
        averages[i] = 0;
        for(var j = i*2; j < (i+1)*2; j++) {
            averages[i] += audioData[j];
        }
        averages[i] = (averages[i] / 2) / 256;
    };

    return averages;
}

function updateFrequencyAverages() {

    analyser.getByteFrequencyData(audioData);

    var avg = [];
    for (var i = 0; i < SEGMENT_COUNT; i++) {
        avg[i] = 0;
        for(var j = i*segmentLength; j < (i+1)*segmentLength; j++) {
            avg[i] += audioData[j];
        }
        avg[i] = (avg[i] / 2) / 256;
    };

    // add the current timeframes averages to the first position in the array
    averages.splice(0, 0, avg);

    // remove the last element in the array
    averages.pop();
}

function HSVtoRGB(h, s, v) {
    var r, g, b, i, f, p, q, t;
    if (h && s === undefined && v === undefined) {
        s = h.s, v = h.v, h = h.h;
    }
    i = Math.floor(h * 6);
    f = h * 6 - i;
    p = v * (1 - s);
    q = v * (1 - f * s);
    t = v * (1 - (1 - f) * s);
    switch (i % 6) {
        case 0: r = v, g = t, b = p; break;
        case 1: r = q, g = v, b = p; break;
        case 2: r = p, g = v, b = t; break;
        case 3: r = p, g = q, b = v; break;
        case 4: r = t, g = p, b = v; break;
        case 5: r = v, g = p, b = q; break;
    }
    return {
        r: r,
        g: g,
        b: b
    };
}