var camera, scene, renderer, cube;

window.onload = function() {
	initAudio();
	initRenderer();
	animate();
};

function initRenderer() {
	var container = document.createElement('div');
	document.body.appendChild(container);
}

function animate() {
	requestAnimationFrame(animate);
	render();
}

function render() {
	renderer.render(scene, camera);
}
