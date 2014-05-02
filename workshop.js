var camera, scene, renderer, analyser, audioData, audio, cubes;

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

	// we only need one value at this point, the minimum size allowed for fftSize is 32
	analyser.fftSize = 32;
	analyser.smoothingTimeConstant = 0.1;

	// the amplitude of the audio will be saved into this variable each frame
	audioData = new Uint8Array(analyser.frequencyBinCount);
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

function initRenderer() {
	var container = document.createElement( 'div' );
	document.body.appendChild( container );

	// create camera
	camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 10000);
	camera.position.set(16, 4, 10);
	camera.up = new THREE.Vector3(0,1,0);
	camera.lookAt(new THREE.Vector3(8,0,0));

	// create scene
	scene = new THREE.Scene();

	// create cube
	var geometry = new THREE.CubeGeometry(1, 1, 1);
	var material = new THREE.MeshBasicMaterial({color : '#f00'});
	cubes = [];
	for (var i = 0; i < 8; i++) {
		cubes[i] = new THREE.Mesh(geometry, material);

		cubes[i].position.set(i*2,0,0);
		scene.add(cubes[i]);
	};
	

	// create light
	var ambientLight = new THREE.AmbientLight(0x202020);
	scene.add(ambientLight);

	// create renderer
	renderer = new THREE.WebGLRenderer();
	renderer.setClearColor(0xf0f0f0);
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

		// animate cubes using audio data
		var averages = getFrequencyAverages();
		for (var i = 0; i < cubes.length; i++) {
			cubes[i].scale.y = Math.max(0.1, averages[i]);
			cubes[i].position.y = cubes[i].scale.y / 2;
		}
		
	}

	renderer.render(scene, camera);
}
