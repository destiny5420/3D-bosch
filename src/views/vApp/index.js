import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import Stats from "stats.js";

export default {
  name: "vApp",
  props: {},
  components: {},
  data: function() {
    return {
      three: {
        parameter: {
          canvasWidth: window.innerWidth,
          canvasHeight: 1080
        },
        models: [
          {
            path: "/models/model.glb"
          }
        ],
        animations: {
          grip: {
            mixer: null,
            action: null
          }
        },
        lights: {
          main: {
            object: null,
            dynamic: null,
            position: {
              x: 10,
              y: 0,
              z: 10
            },
            intensity: 1,
            minIntensity: 1,
            maxIntensity: 5
          },
          second: {
            object: null,
            dynamic: null,
            position: {
              x: 0,
              y: 0,
              z: 0
            },
            intensity: 0.5,
            minIntensity: 0.1,
            maxIntensity: 2
          }
        },
        container: null,
        main_view: null,
        stats: null,
        clock: null,
        loader: null,
        scene: null,
        renderer: null,
        camera: null,
        control: null,
        box: null
      },
      rangeBar: {
        min: -9.9,
        max: 9.9,
        step: 0.01,
        x: 0,
        y: 5,
        z: 10
      }
    };
  },
  methods: {
    init: function() {
      console.log("-- Initialize Function --");
      const vm = this;

      // get element
      vm.three.container = vm.$refs.container;
      vm.three.main_view = document.getElementById("three-main");

      // set stats
      vm.stats = new Stats();
      vm.three.container.appendChild(vm.stats.dom);

      // create clock
      vm.three.clock = new THREE.Clock();

      // create GLTFLoader
      vm.three.loader = new GLTFLoader();

      vm.createScene(vm);
      vm.createLight(vm);
      vm.createObject(vm);
      vm.renderScene();
    },
    createScene: function(vm) {
      console.log("-- 1. Create Scene --");

      // -- create scene
      vm.three.scene = new THREE.Scene();

      // -- create camera
      const fov = 60; // Field of view
      const aspect =
        vm.three.parameter.canvasWidth / vm.three.parameter.canvasHeight;
      const near = 0.1; // the near clipping plane
      const far = 1000; // the far clipping plane
      vm.three.camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
      vm.three.camera.position.set(vm.rangeBar.x, vm.rangeBar.y, vm.rangeBar.z);
      vm.three.scene.add(vm.three.camera);

      // -- create renderer
      vm.three.renderer = window.WebGLRenderingContext
        ? new THREE.WebGLRenderer({
            antialias: true,
            alpha: true
          })
        : new THREE.CanvasRenderer();
      vm.three.renderer.setSize(
        vm.three.parameter.canvasWidth,
        vm.three.parameter.canvasHeight
      );
      vm.three.renderer.setPixelRatio(window.devicePixelRatio);
      vm.three.main_view.appendChild(vm.three.renderer.domElement);

      // -- create orbit control
      vm.three.control = new OrbitControls(vm.three.camera, vm.three.container);
    },
    createLight: function(vm) {
      console.log("-- 2. Create Light --");

      vm.three.lights.main.object = new THREE.DirectionalLight(
        0xffffff,
        vm.three.lights.main.intensity
      );
      vm.three.lights.main.object.position.set(
        vm.three.lights.main.position.x,
        vm.three.lights.main.position.y,
        vm.three.lights.main.position.z
      );
      vm.three.scene.add(vm.three.lights.main.object);
    },
    createObject: function() {
      console.log("-- 3. Create Object --");
      const vm = this;

      // create dynamic for main light
      const cubeGeometry = new THREE.BoxBufferGeometry(1, 1, 1, 1, 1);
      const cubeMaterial = new THREE.MeshLambertMaterial({
        color: 0xffeeee,
        wireframe: true
      });

      vm.three.lights.main.dynamic = new THREE.Mesh(cubeGeometry, cubeMaterial);
      vm.three.lights.main.dynamic.position.set(
        vm.three.lights.main.position.x,
        vm.three.lights.main.position.y,
        vm.three.lights.main.position.z
      );
      vm.three.scene.add(vm.three.lights.main.dynamic);

      // create custom model
      vm.three.loader.load(
        vm.three.models[0].path,
        function(gltf) {
          console.log("GLTF / data: ", gltf);
          // catch data
          let animations = gltf.animations;
          let models = gltf.scene;

          let lockMesh = models.children[0];
          vm.three.scene.add(lockMesh);

          let gripMesh = models.children[0];
          vm.three.scene.add(gripMesh);
          vm.three.animations.grip.mixer = new THREE.AnimationMixer(gripMesh);
          vm.three.animations.grip.action = vm.three.animations.grip.mixer.clipAction(
            animations[0]
          );
          vm.three.animations.grip.action.play();
        },
        undefined,
        function(err) {
          console.error("load error msg: ", err);
        }
      );
    },
    renderScene: function() {
      const vm = this;

      requestAnimationFrame(vm.renderScene); // 產生動畫
      this.stats.update();
      //vm.three.box.rotation.y += 0.005; // 令box的Y軸在每格動畫中轉動一點點

      vm.objectUpdate();
      vm.lightUpdate();
      vm.animationUpdate();

      vm.three.renderer.render(vm.three.scene, vm.three.camera);
    },
    objectUpdate: function() {
      const vm = this;

      // main light dynamic update
      vm.three.lights.main.dynamic.position.set(
        vm.three.lights.main.position.x,
        vm.three.lights.main.position.y,
        vm.three.lights.main.position.z
      );
    },
    lightUpdate: function() {
      const vm = this;

      vm.three.lights.main.object.intensity = vm.three.lights.main.intensity;
      vm.three.lights.main.object.position.set(
        vm.three.lights.main.position.x,
        vm.three.lights.main.position.y,
        vm.three.lights.main.position.z
      );
    },
    animationUpdate: function() {
      const vm = this;

      let time = vm.three.clock.getDelta();
      if (vm.three.animations.grip.mixer) {
        vm.three.animations.grip.mixer.update(time);
      }
    }
  },
  computed: {},
  // life cycle
  beforeCreate: function() {},
  created: function() {},
  beforeMounted: function() {},
  mounted: function() {
    this.init();
  },
  beforeUpdate: function() {},
  updated: function() {},
  beforeDestroy: function() {},
  Destroy: function() {}
};
