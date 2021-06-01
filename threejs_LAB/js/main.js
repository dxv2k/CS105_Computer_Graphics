// console.log(THREE); 

function init(){ 
    var scene = new THREE.Scene();
    var gui = new dat.GUI();
    var enableFog = false; 

    if (enableFog){ 
        // Add fog to scene 
        scene.fog = new THREE.FogExp2(0xfffff, 0.2); // param: color, density
    }
    
    var box = getBox(1,1,1);
    var plane = getPlane(20);
    var pointLight = getPointLight(1);
    var sphere = getSphere(0.05);

    // Set object as name and we can find it, call it by name
    plane.name = 'plane-1'; 

    box.position.y = box.geometry.parameters.height/2; // move box on top of plane  
    plane.rotation.x = Math.PI/2; // view at 90 degree angle 
    // plane.rotation.y = 1;  
    pointLight.position.y = 2; 
    pointLight.intensity = 2; 

    gui.add(pointLight,'intensity', 0,10); 
    gui.add(pointLight.position,'y', 0,5); 

    scene.add(box); 
    // plane.add(box); 
    scene.add(plane); 
    pointLight.add(sphere);
    scene.add(pointLight); 

    var camera = new THREE.PerspectiveCamera( 
        45, // field of view 
        window.innerWidth / window.innerHeight, // aspect ratio 
        // Distance can be seen
        1, // near clipping planes 
        1000 // far clipping planes 
        );

    // Set up camera position manually 
    camera.position.x = 1;   
    camera.position.y = 2;   
    camera.position.z = 5;   
    // use lookAt to set camera position 
    camera.lookAt(new THREE.Vector3(0,0,0)); 

    var renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);

    // renderer.setClearColor(0xffff); // set background color 
    // use css style for color setting 

    // renderer.setClearColor('rgb(255,255,255)'); // set background color 
    renderer.setClearColor('rgb(120,120,120)'); // set background color 
    // document.body.appendChild( renderer.domElement );
    document.getElementById('webgl').appendChild(renderer.domElement); 
    renderer.render(scene, camera);
    update(renderer,scene,camera); 
    return scene; 
}

function getPointLight(intensity){ 
    var light = new THREE.PointLight(0xffffff, intensity); 
    return light;  
}


function update(renderer, scene, camera){ 
    renderer.render(scene, camera);

    // // Call object by name
    // var plane = scene.getObjectByName('plane-1');
    // // Rotation animation 
    // plane.rotation.y += 0.001; 
    // plane.rotation.z += 0.001; 

    // // traverse by scaling child objecet
    // scene.traverse(function(child){ 
    //     child.scale.x += 0.001; 
    // }); 

    requestAnimationFrame(function(){    
        update(renderer, scene, camera); 
    }); // get callback in recursive manner
}

function getSphere(size){ 
    var geometry = new THREE.SphereGeometry(size, 24, 24); // 24,24 "smoothness" of surface 
    var material = new THREE.MeshBasicMaterial({ 
        // color: 0x00ff00 // green 
        color: 'rgb(255,255,255)'
    }); 
    var mesh = new THREE.Mesh(geometry, material); 
    return mesh; 
}


function getBox(w, h, d){ 
    var geometry = new THREE.BoxGeometry(w,h,d); 
    var material = new THREE.MeshPhongMaterial({ 
        // color: 0x00ff00 // green 
        color: 'rgb(120,120,120)'
    }); 
    var mesh = new THREE.Mesh(geometry, material); 
    return mesh; 
}

function getPlane(size){ 
    var geometry = new THREE.PlaneGeometry(size, size); 
    var material = new THREE.MeshPhongMaterial({ 
        // color: "red", 
        color: 'rgb(120,120,120)', 
        side: THREE.DoubleSide
    }); 
    var mesh = new THREE.Mesh(geometry, material); 
    return mesh; 
}


var scene = init(); 