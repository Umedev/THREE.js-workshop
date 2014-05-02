var camera, scene, renderer, analyser, audioData, averages, audio, cubes, segmentLength;

// let this be a power of 2
var SEGMENT_COUNT = 16;

var TIME_FRAME = 200;

window.onload = function() {
	initAudio();
	initRenderer();
	animate();
};

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

function initRenderer() {
	var container = document.createElement( 'div' );
	document.body.appendChild( container );

	// create camera
	camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 1000);
	camera.position.set(15, 6, 12);
	camera.up = new THREE.Vector3(0,1,0);
	camera.lookAt(new THREE.Vector3(9,3,-5));

	// create scene
	scene = new THREE.Scene();
	scene.fog = new THREE.Fog( 0xe5e5e5, 1, 50);

	//create a floor
	var planeGeometry = new THREE.PlaneGeometry(100,100)
	var cubeMaterial = new THREE.MeshPhongMaterial({color : '#f1f1f1'});
	var plane = new THREE.Mesh(planeGeometry, cubeMaterial);
	plane.position.set(0,0,0);
	plane.rotation.x = -Math.PI/2;
	plane.receiveShadow = true;
	scene.add(plane);

	// create cubes
	var cubeGeometry = new THREE.CubeGeometry(1, 1, 0.2);
	cubes = [];
	for (var i = 0; i < TIME_FRAME; i++) {
		cubes[i] = [];
		for (var j = 0; j < SEGMENT_COUNT; j++) {
			cubes[i][j] = new THREE.Mesh(cubeGeometry, new THREE.MeshPhongMaterial({color : '#2980b9'}));
			cubes[i][j].position.set(j*1.2,0.5,-0.2*i);
			scene.add(cubes[i][j]);
		}
	}
	
	// add some ambient light
	scene.add(new THREE.AmbientLight(0x222222));

	// create light looking at the middle cube
	var light = new THREE.DirectionalLight(0xffffff, 1);
	light.position.set(8, 2, 3);
	light.target.position = new THREE.Vector3(8,0,0)
	scene.add(light);

	// create renderer
	renderer = new THREE.WebGLRenderer();
	renderer.setClearColor(0xe5e5e5);
	renderer.setSize(window.innerWidth, window.innerHeight);

	// add canvas to dom
	container.appendChild(renderer.domElement);
}

function animate() {
	requestAnimationFrame(animate);
	render();
}

function render() {
	if (!audio.paused) {
		updateFrequencyAverages();

		// animate cubes using audio data
		for (var i = 0; i < TIME_FRAME; i++) {
			for (var j = 0; j < SEGMENT_COUNT; j++) {
				var scale = Math.max(0.01, averages[i][j]*5);
				cubes[i][j].scale.y = scale;
				cubes[i][j].position.y = scale / 2;

				var color = HSVtoRGB(0.55, (scale/2)*0.82, 0.82);
				cubes[i][j].material.color.setRGB(color.r, color.g, color.b);
			}
		}
	}

	renderer.render(scene, camera);
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
