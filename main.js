import * as THREE from 'three';
import "./style.css"
import { gsap } from "gsap";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { CSS2DRenderer, CSS2DObject } from 'three/addons/renderers/CSS2DRenderer.js'
import { VideoTexture } from 'three';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';



// //Image assets
// import imgUrl from '/images/bg1.png'
// document.getElementById('hero-img').src = imgUrl

//Scene
const scene = new THREE.Scene()

//For GLTF to play
const clock = new THREE.Clock();
var mixer



//Video Texture
const video = document.getElementById( 'video' );
const screenTexture = new THREE.VideoTexture( video );
video.play();

const video_pop = document.getElementById( 'video_pop' );
video_pop.pause();


//GLTF Loader 


const loader = new GLTFLoader()
loader.load('/gltf/scene.gltf', function(gltf){
  const model = gltf.scene;
  scene.add(model);

  //For GLTF to play
  mixer = new THREE.AnimationMixer( gltf.scene );
        
  gltf.animations.forEach( ( clip ) => {
      mixer.clipAction( clip ).play();
  } );

  //Calling GLTF Object
  var tvScreen = scene.getObjectByName('tvScreen')
  console.log(model.getObjectByName('tvScreen'))

  gltf.scene.traverse( function ( child ) {

    if ( child.isMesh ) {
      child.castShadow = true;
      child.receiveShadow = true;
      child.geometry.computeVertexNormals(); // FIX
    }

    if(child.name === "tvScreen"){
      child.material = new THREE.MeshBasicMaterial({
        map: screenTexture,
        side: THREE.FrontSide,
        toneMapped: false,
      });
  }
})

  model.position.x = 0;
  model.position.z = 0;
  model.position.y = 2;
  model.rotation.y = -1;
;
}, function(xhr){
  console.log((xhr.loader/xhr.total * 100)+ "% loaded")
}, function(error){
  console.log('An error occured')
})




//Helper
// const axesHelper = new THREE.AxesHelper( 55 );
// scene.add( axesHelper );

// const plane = new THREE.Plane( new THREE.Vector3( 0, 90, 0 ), 0 );
// const planeHelper = new THREE.PlaneHelper( plane, 30, 0xffff00 );
// scene.add( planeHelper );



//Create object
const geometry = new THREE.OctahedronGeometry(.3,0)
const material = new THREE.MeshStandardMaterial({
  transparent: true,
  opacity:1,
  color:'#00ff83',
  // emissive:"#00ff83",
  // emissiveIntensity:1
})

//Icon1
const Icon1 = new THREE.Mesh(geometry, material)
Icon1.position.set(0,5,8)
Icon1.userData.name = 'Icon1'
scene.add(Icon1)

//Gsap Action
const icon1 = gsap.timeline()
icon1.fromTo(Icon1.rotation, 20, {z:0,x:0,y:0},{z:0, x:0, y:45, ease:"none", repeat:-1})
const icon1_y = gsap.timeline()
icon1_y.fromTo(Icon1.position, 1, {y:5},{y:4.5, repeat:-1, yoyo:true})

//Icon2
const Icon2 = new THREE.Mesh(geometry, material)
Icon2.position.set(0,7,0)
Icon2.userData.name = 'Icon2'
scene.add(Icon2)

//Gsap Action
const icon2 = gsap.timeline()
icon2.fromTo(Icon2.rotation, 20, {z:0,x:0,y:0},{z:0, x:0, y:45, ease:"none", repeat:-1})
const icon2_y = gsap.timeline()
icon2_y.fromTo(Icon2.position, 1, {y:5},{y:4.5, repeat:-1, yoyo:true})

//Icon3
const Icon3 = new THREE.Mesh(geometry, material)
Icon3.position.set(2,8,-3)
Icon3.userData.name = 'Icon3'
scene.add(Icon3)

//Gsap Action
const icon3 = gsap.timeline()
icon3.fromTo(Icon3.rotation, 20, {z:0,x:0,y:0},{z:0, x:0, y:45, ease:"none", repeat:-1})
const icon3_y = gsap.timeline()
icon3_y.fromTo(Icon3.position, 1, {y:8},{y:7.5, repeat:-1, yoyo:true})


 // CSS2DObject 
 const label1Div = document.createElement( 'div' )
 label1Div.className = 'label'
 label1Div.textContent = 'Tv Console'
 const Label1 = new CSS2DObject( label1Div)
 Icon1.add( Label1 );

 const label2Div = document.createElement( 'div' )
 label2Div.className = 'label'
 label2Div.textContent = 'Overall View'
 const Label2 = new CSS2DObject( label2Div)
 Icon2.add( Label2 );

 const label3Div = document.createElement( 'div' )
 label3Div.className = 'label'
 label3Div.textContent = 'Top Floor'
 const Label3 = new CSS2DObject( label3Div)
 Icon3.add( Label3 );


//  testLabel.position.x = 5200;
//  testLabel.position.y = 900;
//  testLabel.position.z = 0;

 const labelRenderer = new CSS2DRenderer()
 labelRenderer.setSize( window.innerWidth, window.innerHeight )
 labelRenderer.domElement.style.position = 'absolute'
 labelRenderer.domElement.style.top = '-4%'
 labelRenderer.domElement.style.pointerEvents = 'none'
 labelRenderer.domElement.style.zIndex = '1'
 document.body.appendChild( labelRenderer.domElement )


//Mouse interact
const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();
function onPointerMove( event ) {
	// calculate pointer position in normalized device coordinates
	// (-1 to +1) for both components
	pointer.x = ( event.clientX / window.innerWidth ) * 2 - 1;
	pointer.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
}

window.addEventListener( 'pointer', onPointerMove );
window.addEventListener( 'click', function(e) {
  raycaster.setFromCamera(pointer, camera)
  const intersects = raycaster.intersectObjects(scene.children, true)
  if ( intersects.length > 0 ) {
    if (intersects[0].object.userData.name === 'Icon1') {
      console.log('Icon1')
      const tl = gsap.timeline()
      // tl.fromTo(Icon1.scale, 1, {z:0,x:0,y:0},{z:1, x:1, y:1})
      tl.to(controls.target, 2, {x:0, y:4, z:4})
      tl.to(camera.position, 2, {x: -0.5, y: 0, z: 0},'-=2')

    
    }

    if (intersects[0].object.userData.name === 'Icon2') {
      console.log('Icon2')
      const tl = gsap.timeline()
      // tl.fromTo(Icon1.scale, 1, {z:0,x:0,y:0},{z:1, x:1, y:1})
      tl.to(controls.target, 2, {x:0.5, y:0, z:0})
      tl.to(camera.position, 2, {x:0, y:16, z:24},'-=2')
    }

    if (intersects[0].object.userData.name === 'Icon3') {
      console.log('Icon3')
      const tl = gsap.timeline()
      // tl.fromTo(Icon1.scale, 1, {z:0,x:0,y:0},{z:1, x:1, y:1})
      tl.to(controls.target, 2, {x:1, y:6, z:-7})
      tl.to(camera.position, 2, {x: 0, y: 12, z: 0},'-=2')
    }


    if (intersects[0].object.userData.name === "tvScreen") {
      console.log('tvScreen')
      const tlTv = gsap.timeline({paused:true})
      tlTv.fromTo('#overlay', .5, {opacity:0, top:'0%'},{top:'0%',opacity:1, display:'flex'})
      tlTv.call(playVideo())

      function playVideo(){
        tlTv.play()
        video_pop.play()
      }

      this.document.getElementById("overlay").addEventListener("click",closeVideo)
      
      function closeVideo(){
        tlTv.to('#overlay', .5, {opacity:0, display:"none"})
        tlTv.call(pauseVideo())
      }

      function pauseVideo(){
        video_pop.pause()
      }

      
    }

   
} 

  // renderer.render( scene, camera );
});

window.addEventListener( 'pointermove', onPointerMove );

//Sizes
const sizes = { 
  width: window.innerWidth,
  height: window.innerHeight,
} 

//Light
const ambient = new THREE.AmbientLight( 0xffffff, .6); // soft white light
scene.add(ambient)
const directionalLight = new THREE.DirectionalLight( 0xffffff, .6);
directionalLight.position.set(10,30,10)
directionalLight.castShadow = true;

directionalLight.shadow.camera.near = 0.1;
directionalLight.shadow.camera.far = 500;
directionalLight.shadow.camera.right = 17;
directionalLight.shadow.camera.left = - 17;
directionalLight.shadow.camera.top	= 17;
directionalLight.shadow.camera.bottom = - 17;
directionalLight.shadow.mapSize.width = 3024;
directionalLight.shadow.mapSize.height = 3024;
directionalLight.shadow.radius = 4;
directionalLight.shadow.bias = - 0.0005;
      //Light Helper
      // const directionalLightHelper1 = new THREE.DirectionalLightHelper( directionalLight, 5 );
      // scene.add( directionalLightHelper1 );
scene.add( directionalLight );

const directionalLight2 = new THREE.DirectionalLight( 0xffffff, .5);
directionalLight2.position.set(-15,25,30)
//scene.add( directionalLight2 );

// Light Helper
      // const directionalLightHelper = new THREE.DirectionalLightHelper( directionalLight2, 5 );
      // scene.add( directionalLightHelper );





//Camera
const camera = new THREE.PerspectiveCamera(45,sizes.width/sizes.height, 0.1, 100)
camera.position.y = 16
camera.position.z = 24
camera.rotation.x = 0
camera.rotation.y = 40
camera.rotation.z = 0
scene.add(camera)


// const helper = new THREE.CameraHelper( camera );
// scene.add( helper );

//Renderer
const canvas = document.querySelector('.webgl')
// const renderer = new THREE.WebGL1Renderer({canvas, antialias:true, alpha:true})
const renderer = new THREE.WebGL1Renderer({canvas, antialias:true})
renderer.setClearColor(0xffddae);
renderer.setSize(sizes.width,sizes.height)
renderer.setPixelRatio(2)

renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.VSMShadowMap;

renderer.render(scene, camera)


//Bloom Effect
const renderScene = new RenderPass(scene, camera);
const composer = new EffectComposer(renderer);
composer .addPass(renderScene);

const bloomPass = new UnrealBloomPass(
  new THREE.Vector2(window.innerWidth, window.innerHeight),
  0.2,
  0.1,
  0.1,
);

composer.addPass(bloomPass);

//Orbit Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true
controls.enablePan = true
controls.maxPolarAngle = Math.PI /2
controls.enableDamping = true;
controls.enableZoom = true
controls.autoRotate = false
controls.autoRotateSpeed = 5
controls.addEventListener( "change", event => {  
  console.log( controls.object.position );
})


//Resize
window.addEventListener('resize', () => {
  //update Sizes
  sizes.width = window.innerWidth
  sizes.height = window.innerHeight
  //Update Camera
  camera.aspect = sizes.width / sizes.height
  camera.updateProjectionMatrix()
  renderer.setSize(sizes.width, sizes.height)
  labelRenderer.setSize( window.innerWidth, window.innerHeight );
})



animate()



function animate(){
  requestAnimationFrame(animate)
  controls.update()
  VideoTexture.needsUpdate = true
  labelRenderer.render( scene, camera )

  //For GLTF to play
  const delta = clock.getDelta();
  if ( mixer ) mixer.update( delta );

  // renderer.render(scene, camera)
  
  //Bloom Effect
  composer.render()
}


// Timeline magic
// const tl = gsap.timeline()
// tl.fromTo(Icon1.rotation, 20, {z:0,x:0,y:0},{z:0, x:0, y:45, ease:"none", repeat:-1})
// const tl2 = gsap.timeline()
// tl2.fromTo(Icon1.position, 1, {y:5},{y:4.5, repeat:-1, yoyo:true})