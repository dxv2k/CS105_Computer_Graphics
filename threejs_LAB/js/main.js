// console.log(THREE); 

// const { Tween } = require("../lib/tween.umd");

function init(){ 
    var scene = new THREE.Scene();
    var gui = new dat.GUI();
    var clock = new THREE.Clock(); 
    var enableFog = true; 

    if (enableFog){ 
        // Add fog to scene 
        scene.fog = new THREE.FogExp2(0xfffff, 0.2); // param: color, density
    }
    
    // var box = getBox(1,1,1);
    var boxGrid = getBoxGrid(20,2.5);
    boxGrid.name = "boxGrid"; 
    var plane = getPlane(100);
    // var pointLight = getPointLight(1);
    var directionalLight = getDirectionalLight(1);
    var spotLight = getSpotLight(1);
    var sphere = getSphere(0.05);
    // var helper = new THREE.CameraHelper(directionalLight.shadow.camera);  
    // var ambientLight = getAmbientLight(1);

    // Set object as name and we can find it, call it by name
    plane.name = 'plane-1'; 

    // box.position.y = box.geometry.parameters.height/2; // move box on top of plane  
    plane.rotation.x = Math.PI/2; // view at 90 degree angle 
    // plane.rotation.y = 1;  
    directionalLight.position.x = 13; 
    directionalLight.position.y = 4; 
    directionalLight.position.z = 5; 
    directionalLight.intensity = 2; 

    // gui.add(directionalLight,'intensity', 0,10); 
    // gui.add(directionalLight.position,'x', 0,20); 
    // gui.add(directionalLight.position,'y', 0,20); 
    // gui.add(directionalLight.position,'z', 0,20); 
    // // gui.add(directionalLight, "penumbra",0,1); 

    // scene.add(box); 
    // plane.add(box); 

    scene.add(plane); 
    directionalLight.add(sphere);
    scene.add(directionalLight); 
    scene.add(boxGrid); 
    // scene.add(helper);
    // scene.add(ambientLight);

    var camera = new THREE.PerspectiveCamera( 
        45, // field of view 
        window.innerWidth / window.innerHeight, // aspect ratio 
        // Distance can be seen
        1, // near clipping planes 
        1000 // far clipping planes 
        );
    
    var cameraZRotation = new THREE.Group(); 
    var cameraYPosition = new THREE.Group(); 
    var cameraZPosition = new THREE.Group(); 
    var cameraXRotation = new THREE.Group(); 
    var cameraYRotation = new THREE.Group(); 

    cameraYPosition.name = 'cameraYPosition'; 
    cameraZPosition.name = 'cameraZPosition'; 
    cameraXRotation.name = 'cameraXRotation'; 
    cameraYRotation.name = 'cameraYRotation'; 
    cameraZRotation.name = 'cameraZRotation'; 


    cameraZRotation.add(camera); 
    cameraYPosition.add(cameraZRotation); 
    cameraZPosition.add(cameraYPosition); 
    cameraXRotation.add(cameraZPosition); 
    cameraYRotation.add(cameraXRotation); 
    scene.add(cameraYRotation); 

    cameraXRotation.rotation.x = -Math.PI/2;
    cameraYPosition.position.y = 1;
    cameraZPosition.position.z = 100;

    new TWEEN.Tween({val: 100})
        .to({val:-50}, 12000)
        .onUpdate(function(){ 
            cameraZPosition.position.z = this.val; 
        }) 
        .start(); 

    new TWEEN.Tween({val: -Math.PI/2})
        .to({val:0},6000)
        .delay(1000)
        .easing(TWEEN.Easing.Quadratic.InOut)
        .onUpdate(function(){ 
            cameraXRotation.rotation.x = this.val; 
        })
        .start(); 

    new TWEEN.Tween({val: 0})
        .to({val:Math.PI/2},6000)
        .delay(1000)
        .easing(TWEEN.Easing.Quadratic.InOut)
        .onUpdate(function(){ 
            cameraYRotation.rotation.x = this.val; 
        })
        .start(); 


    gui.add(cameraZPosition.position,'z',0,100); 
    gui.add(cameraYRotation.rotation,'y',-Math.PI,Math.PI); //radius must use radiant 
    gui.add(cameraXRotation.rotation,'x',-Math.PI,Math.PI); //radius must use radiant 
    gui.add(cameraZRotation.rotation,'z',-Math.PI,Math.PI); //radius must use radiant 

    var renderer = new THREE.WebGLRenderer();
    renderer.shadowMap.enabled = true;
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor('rgb(120,120,120)'); // set background color 
    document.getElementById('webgl').appendChild(renderer.domElement); 

    var controls = new THREE.OrbitControls(camera,renderer.domElement); 
    update(renderer,scene,camera, controls, clock); 
    return scene; 
}

function getDirectionalLight(intensity){ 
    var light = new THREE.DirectionalLight(0xffffff, intensity); 
    light.castShadow = true; 
    light.shadow.camera.left = -40; 
    light.shadow.camera.bottom = -40; 
    light.shadow.camera.right = 40; 
    light.shadow.camera.top = 40; 

    light.shadow.mapSize.width = 4096; 
    light.shadow.mapSize.height = 4096; 
    return light;  
}

function getAmbientLight(intensity){ 
    var light = new THREE.AmbientLight("rgb(10,30,50)", intensity); 
    return light;  
}


function getPointLight(intensity){ 
    var light = new THREE.PointLight(0xffffff, intensity); 
    light.castShadow = true; 

    return light;  
}

function getSpotLight(intensity){ 
    var light = new THREE.SpotLight(0xffffff, intensity); 
    light.castShadow = true; 
    light.shadow.bias = 0.001;
    light.shadow.mapSize.width = 2048;
    light.shadow.mapSize.height = 2048;

    return light;  
}


function update(renderer, scene, camera, controls,clock){ 
    renderer.render(scene, camera);

    controls.update();
    TWEEN.update(); 

    var timeElapsed = clock.getElapsedTime(); 

    var cameraZRotation = scene.getObjectByName('cameraZRotation'); 
    cameraZRotation.rotation.z = noise.simplex2(timeElapsed * 1.5, timeElapsed * 1.5) * 0.02; 

    var boxGrid = scene.getObjectByName('boxGrid'); 
    boxGrid.children.forEach(function(child, index) { 
        var x = timeElapsed + index; 
        child.scale.y = (noise.simplex2(x,x) + 1)/ 2 + 0.001; 
        child.position.y = child.scale.y/2 ; 
    })
    
    requestAnimationFrame(function(){    
        update(renderer, scene, camera,controls,clock); 
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

function getBoxGrid(amount, seperationMultiplier){ 
    var group = new THREE.Group(); 

    for (var i=0; i<amount; i++){ 
        var obj = getBox(1,3,1); 
        obj.position.x = i* seperationMultiplier; 
        obj.position.y = obj.geometry.parameters.height/2; 
        group.add(obj); 
        for (var j = 1; j < amount; j++){ 
            var obj = getBox(1,1,1); 
            obj.position.x = i * seperationMultiplier; 
            obj.position.y = obj.geometry.parameters.height/2; 
            obj.position.z = j * seperationMultiplier; 
            group.add(obj); 
        }
    }

    group.position.x = -(seperationMultiplier * (amount-1))/2;  
    group.position.z = -(seperationMultiplier * (amount-1))/2;  
    return group; 
}

function getBox(w, h, d){ 
    var geometry = new THREE.BoxGeometry(w,h,d); 
    var material = new THREE.MeshPhongMaterial({ 
        // color: 0x00ff00 // green 
        color: 'rgb(120,120,120)'
    }); 
    var mesh = new THREE.Mesh(geometry, material); 
    mesh.castShadow = true; 
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
    mesh.receiveShadow = true; 
    return mesh; 
}


var scene = init(); 