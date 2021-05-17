
// console.log(THREE); 

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 
    45, 
    window.innerWidth / window.innerHeight, 
    1, 
    1000 );

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );



