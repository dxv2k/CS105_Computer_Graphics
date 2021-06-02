function init(){ 
    var scene = new THREE.Scene();
    var gui = new dat.GUI();

    // init objects 
    var sphereMaterial = getMaterial('standard', 'rgb(255,255,255)');
    var sphere = getSphere(sphereMaterial,1,24); 

    var planeMaterial = getMaterial('standard', 'rgb(255,255,255)');
    var plane = getPlane(planeMaterial,300); 

    var lightLeft = getSpotLight(1, 'rgb(255,220,180)');
    var lightRight = getSpotLight(1, 'rgb(255,220,180)');

    // manipulate objects
    sphere.position.y = sphere.geometry.parameters.radius; 
    plane.rotation.x = Math.PI/2; 

    lightLeft.position.x = -5; 
    lightLeft.position.y = 2; 
    lightLeft.position.z = -4; 

    lightRight.position.x = 5; 
    lightRight.position.y = 2; 
    lightRight.position.z = -4; 

    // manipulate materials
    // load the cube map 
    var reflectionCube = new THREE.CubeTextureLoader()
	                .setPath( 'assets/' )
	                .load( [
                            'px.jpg',
                            'nx.jpg',
                            'py.jpg',
                            'ny.jpg',
                            'pz.jpg',
                            'nz.jpg'
	] );
    reflectionCube.format = THREE.RGBFormat; 

    scene.background = reflectionCube; 

    var loader = new THREE.TextureLoader(); 
    planeMaterial.map = loader.load('assets/concrete.jpg');
    planeMaterial.bumpMap = loader.load('assets/concrete.jpg');
    planeMaterial.roughnessMap = loader.load('assets/concrete.jpg');
    planeMaterial.bumpScale = 0.01;
    planeMaterial.metalness = 0.1;
    planeMaterial.roughness = 0.7;
    planeMaterial.envMap = reflectionCube;  
    sphereMaterial.roughnessMap = loader.load('assets/fingerprint.jpg');
    sphereMaterial.envMap = reflectionCube;  

    var maps = ['map', 'bumpMap','roughnessMap']; 
    maps.forEach(function(mapName){ 
        var texture = planeMaterial[mapName]; 
        texture.wrapS = THREE.RepeatWrapping; 
        texture.wrapT = THREE.RepeatWrapping; 
        texture.repeat.set(15,15);
    }); 

    // dat.gui  
    var folder1 = gui.addFolder('light_1');
    // folder1.add(lightLeft, 'intesity' ,0,10);
    folder1.add(lightLeft.position, 'x',-5,15);
    folder1.add(lightLeft.position, 'y',-5,15);
    folder1.add(lightLeft.position, 'z',-5,15);

    var folder2 = gui.addFolder('light_2');
    // folder2.add(lightRight, 'intesity',0,10);
    folder2.add(lightRight.position, 'x',-5,15);
    folder2.add(lightRight.position, 'y',-5,15);
    folder2.add(lightRight.position, 'z',-5,15);

    var folder3 = gui.addFolder('materials'); 
    folder3.add(sphereMaterial,'roughness',0,1000); 
    folder3.add(planeMaterial,'roughness',0,1000); 
    folder3.add(sphereMaterial,'metalness',0,1000); 
    folder3.add(planeMaterial,'metalness',0,1000); 
    folder3.open();

    // add to scene 
    scene.add(sphere); 
    scene.add(plane); 
    scene.add(lightLeft); 
    scene.add(lightRight); 

    //camera 
    var camera = new THREE.PerspectiveCamera( 
        45, // field of view 
        window.innerWidth / window.innerHeight, // aspect ratio 
        // Distance can be seen
        1, // near clipping planes 
        1000 // far clipping planes 
    );
    camera.position.y = 10;
    camera.position.z = 10;

    // renderer
    var renderer = new THREE.WebGLRenderer();
    renderer.shadowMap.enabled = true;
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.getElementById('webgl').appendChild(renderer.domElement); 

    var controls = new THREE.OrbitControls(camera,renderer.domElement); 
    update(renderer,scene,camera, controls); 

    return scene; 
}

function update(renderer, scene, camera,controls){ 
    renderer.render(scene, camera);
    controls.update();
    requestAnimationFrame(function(){    
        update(renderer, scene, camera,controls); 
    }); // get callback in recursive manner
}

// BUG: not working because lack of DoubleSize param 
function getPlane(material, size){ 
    var geometry = new THREE.PlaneGeometry(size,size);  
    material.side = THREE.DoubleSide; 
    var obj = new THREE.Mesh(geometry, material); 
    obj.receiveShadow = true;
    return obj; 
}
function getSphere(material, size, segments){ 
    var geometry = new THREE.SphereGeometry(size, segments, segments); // 24,24 "smoothness" of surface 
    var obj = new THREE.Mesh(geometry,material); 
    obj.castShadow = true; 

    return obj; 
}

function getSpotLight(intensity, color){ 
    color = color === undefined ? 'rgb(255,255,255)' : color;
    var light = new THREE.SpotLight(color, intensity); 
    light.penumbra = 0.5; 
    light.castShadow = true; 
    light.shadow.bias = 0.001;
    light.shadow.mapSize.width = 1024;
    light.shadow.mapSize.height = 1024;

    return light;  
}

function getMaterial(type, color){ 
    var selectedMaterial; 
    var materialOptions = { 
        color: color === undefined ? 'rgb(255,255,255)': color, 
    };
    switch (type){ 
        case 'basic': 
            selectedMaterial = new THREE.MeshBasicMaterial(materialOptions); 
            break; 
        case 'lambert': 
            selectedMaterial = new THREE.MeshLambertMaterial(materialOptions); 
            break; 
        case 'phong': 
            selectedMaterial = new THREE.MeshPhongMaterial(materialOptions); 
            break; 
        case 'standard': 
            selectedMaterial = new THREE.MeshStandardMaterial(materialOptions); 
            break; 
    }
    return selectedMaterial; 
} 


var scene = init();  
