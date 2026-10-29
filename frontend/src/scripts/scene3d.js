import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const PALETTE = {
  bg: 0xF6F5F0,
  floor: 0xFFFFFF,
  grid: 0xE2E0D8,
  rackYellow: 0xF59E0B,
  rackDark: 0x334155,
  heavyBlue: 0x2563EB,
  fastCoral: 0xFF5A5F,
  fragileGreen: 0x10B981,
  specialPurple: 0x8B5CF6,
  forkliftOrange: 0xF97316,
  white: 0xFFFFFF,
  road: 0xCBD5E1,
  tree: 0x10B981,
  trunk: 0x92400E
};

function makeClayMaterial(color, extra = {}) {
  return new THREE.MeshStandardMaterial({
    color,
    roughness: 0.6,
    metalness: 0.1,
    ...extra
  });
}

const canvas = document.getElementById('webgl-canvas');
const scene = new THREE.Scene();
scene.background = new THREE.Color(PALETTE.bg);
scene.fog = new THREE.Fog(PALETTE.bg, 62, 130);

const camera = new THREE.PerspectiveCamera(36, window.innerWidth / window.innerHeight, 0.5, 180);
const cameraState = {
  posX: -27,
  posY: 16.5,
  posZ: 25.5,
  lookX: -12,
  lookY: 1.6,
  lookZ: 4.5
};
camera.position.set(cameraState.posX, cameraState.posY, cameraState.posZ);
camera.lookAt(cameraState.lookX, cameraState.lookY, cameraState.lookZ);

const renderer = new THREE.WebGLRenderer({
  canvas,
  antialias: true,
  powerPreference: 'high-performance'
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.12;

const ambientLight = new THREE.AmbientLight(0xFFFDF8, 1.8);
scene.add(ambientLight);

const hemiLight = new THREE.HemisphereLight(0xFFFFFF, 0xF3EFE6, 0.75);
hemiLight.position.set(0, 40, 0);
scene.add(hemiLight);

const dirLight = new THREE.DirectionalLight(0xFFF8E7, 2.1);
dirLight.position.set(20, 36, 24);
dirLight.castShadow = true;
dirLight.shadow.mapSize.width = 1024;
dirLight.shadow.mapSize.height = 1024;
dirLight.shadow.camera.near = 8;
dirLight.shadow.camera.far = 95;
dirLight.shadow.camera.left = -38;
dirLight.shadow.camera.right = 40;
dirLight.shadow.camera.top = 26;
dirLight.shadow.camera.bottom = -26;
dirLight.shadow.bias = -0.0008;
scene.add(dirLight);

const worldGroup = new THREE.Group();
scene.add(worldGroup);

const matFloor = makeClayMaterial(PALETTE.floor);
const matTrim = makeClayMaterial(PALETTE.grid);
const matRackYellow = makeClayMaterial(PALETTE.rackYellow);
const matRackDark = makeClayMaterial(PALETTE.rackDark);
const matBlue = makeClayMaterial(PALETTE.heavyBlue);
const matCoral = makeClayMaterial(PALETTE.fastCoral);
const matGreen = makeClayMaterial(PALETTE.fragileGreen);
const matPurple = makeClayMaterial(PALETTE.specialPurple);
const matOrange = makeClayMaterial(PALETTE.forkliftOrange);
const matWhite = makeClayMaterial(PALETTE.white);
const matRoad = makeClayMaterial(PALETTE.road, { roughness: 0.75 });

const baseBoard = new THREE.Mesh(
  new RoundedBoxGeometry(68, 1.4, 34, 2, 0.35),
  matTrim
);
baseBoard.position.set(4, -0.75, 0);
baseBoard.receiveShadow = true;
worldGroup.add(baseBoard);

const warehouseFloor = new THREE.Mesh(
  new RoundedBoxGeometry(36, 0.3, 28, 2, 0.12),
  matFloor
);
warehouseFloor.position.set(-10, -0.05, 0);
warehouseFloor.receiveShadow = true;
worldGroup.add(warehouseFloor);

const gridHelper = new THREE.GridHelper(28, 14, PALETTE.grid, PALETTE.grid);
gridHelper.position.set(-10, 0.11, 0);
gridHelper.scale.set(1.25, 1, 0.98);
worldGroup.add(gridHelper);

const backWall = new THREE.Mesh(
  new RoundedBoxGeometry(36, 6.2, 0.6, 1, 0.15),
  matFloor
);
backWall.position.set(-10, 3.1, -13.8);
backWall.castShadow = true;
backWall.receiveShadow = true;
worldGroup.add(backWall);

const leftWall = new THREE.Mesh(
  new RoundedBoxGeometry(0.6, 6.2, 28, 1, 0.15),
  matFloor
);
leftWall.position.set(-27.8, 3.1, 0);
leftWall.castShadow = true;
leftWall.receiveShadow = true;
worldGroup.add(leftWall);

const wallStripe = new THREE.Mesh(
  new THREE.BoxGeometry(35.2, 0.45, 0.68),
  matRackYellow
);
wallStripe.position.set(-10, 5.2, -13.8);
worldGroup.add(wallStripe);

const leftStripe = new THREE.Mesh(
  new THREE.BoxGeometry(0.68, 0.45, 27.2),
  matRackYellow
);
leftStripe.position.set(-27.8, 5.2, 0);
worldGroup.add(leftStripe);

const doorBFrame = new THREE.Mesh(
  new RoundedBoxGeometry(4.4, 4.2, 0.85, 1, 0.15),
  matRackDark
);
doorBFrame.position.set(-11, 2.1, -13.7);
worldGroup.add(doorBFrame);

const doorBOpening = new THREE.Mesh(
  new THREE.BoxGeometry(3.5, 3.5, 0.92),
  makeClayMaterial(0xE2E8F0)
);
doorBOpening.position.set(-11, 1.85, -13.7);
worldGroup.add(doorBOpening);

const boxMats = [matBlue, matCoral, matGreen, matPurple];

const itemShowcaseGroup = new THREE.Group();
itemShowcaseGroup.position.set(-14.5, 0.1, 11.4);
worldGroup.add(itemShowcaseGroup);

const showcasePlatform = new THREE.Mesh(
  new RoundedBoxGeometry(10.5, 0.28, 3.2, 1, 0.1),
  matWhite
);
showcasePlatform.position.set(0, 0.14, 0);
showcasePlatform.receiveShadow = true;
showcasePlatform.castShadow = true;
itemShowcaseGroup.add(showcasePlatform);

const showcaseSamples = [];
const sampleOffsets = [-3.6, -1.2, 1.2, 3.6];
const sampleBaseGeo = new THREE.CylinderGeometry(0.85, 0.95, 0.18, 16);
const sampleBoxGeo = new RoundedBoxGeometry(1.15, 1.15, 1.15, 2, 0.18);

sampleOffsets.forEach((ox, idx) => {
  const pad = new THREE.Mesh(sampleBaseGeo, matTrim);
  pad.position.set(ox, 0.32, 0);
  itemShowcaseGroup.add(pad);

  const itemMesh = new THREE.Mesh(sampleBoxGeo, boxMats[idx]);
  itemMesh.position.set(ox, 1.15, 0);
  itemMesh.castShadow = true;
  itemShowcaseGroup.add(itemMesh);
  showcaseSamples.push(itemMesh);
});

const sharedPostGeo = new THREE.BoxGeometry(0.18, 4.2, 0.18);
const sharedBeamGeo = new THREE.BoxGeometry(4.4, 0.16, 0.14);
const sharedTrayGeo = new THREE.BoxGeometry(4.15, 0.08, 1.35);
const sharedRackBoxGeoA = new RoundedBoxGeometry(0.72, 0.68, 1.05, 1, 0.1);
const sharedRackBoxGeoB = new RoundedBoxGeometry(0.72, 0.8, 1.05, 1, 0.1);

const allWarehouseBoxes = [];

function createRackUnit(populate = true) {
  const width = 4.4;
  const height = 4.2;
  const depth = 1.6;
  const rack = new THREE.Group();

  const postPositions = [
    [-width / 2 + 0.1, height / 2, -depth / 2 + 0.1],
    [width / 2 - 0.1, height / 2, -depth / 2 + 0.1],
    [-width / 2 + 0.1, height / 2, depth / 2 - 0.1],
    [width / 2 - 0.1, height / 2, depth / 2 - 0.1]
  ];
  postPositions.forEach(([px, py, pz]) => {
    const post = new THREE.Mesh(sharedPostGeo, matRackDark);
    post.position.set(px, py, pz);
    post.castShadow = true;
    rack.add(post);
  });

  const shelfLevels = [0.65, 1.95, 3.25];
  const boxesInRack = [];

  shelfLevels.forEach((sy, levelIdx) => {
    const beamFront = new THREE.Mesh(sharedBeamGeo, matRackYellow);
    beamFront.position.set(0, sy, depth / 2 - 0.1);
    rack.add(beamFront);

    const beamBack = new THREE.Mesh(sharedBeamGeo, matRackYellow);
    beamBack.position.set(0, sy, -depth / 2 + 0.1);
    rack.add(beamBack);

    const tray = new THREE.Mesh(sharedTrayGeo, matRackDark);
    tray.position.set(0, sy - 0.04, 0);
    rack.add(tray);

    if (populate) {
      const slots = [-1.35, -0.45, 0.45, 1.35];
      slots.forEach((sx, slotIdx) => {
        const matIndex = (levelIdx + slotIdx) % boxMats.length;
        const isTall = slotIdx % 2 === 1;
        const bh = isTall ? 0.8 : 0.68;
        const box = new THREE.Mesh(
          isTall ? sharedRackBoxGeoB : sharedRackBoxGeoA,
          boxMats[matIndex]
        );
        box.position.set(sx, sy + bh / 2 + 0.06, 0);
        if (levelIdx === 2) box.castShadow = true;
        rack.add(box);
        boxesInRack.push(box);
        allWarehouseBoxes.push(box);
      });
    }
  });

  rack.userData.boxes = boxesInRack;
  return rack;
}

const racksGroup = new THREE.Group();
worldGroup.add(racksGroup);

const rackCoordinates = [
  [-21.5, -8.5],
  [-15.5, -8.5],
  [-21.5, -3.2],
  [-15.5, -3.2],
  [-21.5, 2.2],
  [-15.5, 2.2],
  [-21.5, 7.5],
  [-8.0, -8.5],
  [-8.0, -3.2],
  [-8.0, 2.2],
  [-8.0, 7.5]
];

rackCoordinates.forEach(([rx, rz]) => {
  const r = createRackUnit(true);
  r.position.set(rx, 0.1, rz);
  racksGroup.add(r);
});

const extraRack = createRackUnit(true);
extraRack.position.set(-15.5, 22, 7.5);
extraRack.visible = false;
worldGroup.add(extraRack);

const dropRingGeo = new THREE.RingGeometry(0.4, 0.85, 24);
dropRingGeo.rotateX(-Math.PI / 2);
const dropRingMat = new THREE.MeshBasicMaterial({
  color: PALETTE.rackYellow,
  transparent: true,
  opacity: 0,
  side: THREE.DoubleSide
});
const dropRing = new THREE.Mesh(dropRingGeo, dropRingMat);
dropRing.position.set(-15.5, 0.16, 7.5);
worldGroup.add(dropRing);

const chaosBlockerGroup = new THREE.Group();
chaosBlockerGroup.position.set(-11, 0.1, -12.1);
chaosBlockerGroup.scale.set(0.001, 0.001, 0.001);
chaosBlockerGroup.visible = false;
worldGroup.add(chaosBlockerGroup);

const alertBase = new THREE.Mesh(
  new THREE.CylinderGeometry(1.7, 1.7, 0.12, 20),
  makeClayMaterial(PALETTE.fastCoral)
);
alertBase.position.y = 0.06;
chaosBlockerGroup.add(alertBase);

const barrierBar = new THREE.Mesh(
  new RoundedBoxGeometry(3.2, 0.45, 0.35, 1, 0.1),
  matCoral
);
barrierBar.position.set(0, 1.2, 0);
barrierBar.castShadow = true;
chaosBlockerGroup.add(barrierBar);

const barrierPillarL = new THREE.Mesh(
  new THREE.BoxGeometry(0.3, 1.4, 0.3),
  matRackDark
);
barrierPillarL.position.set(-1.3, 0.7, 0);
chaosBlockerGroup.add(barrierPillarL);

const barrierPillarR = barrierPillarL.clone();
barrierPillarR.position.set(1.3, 0.7, 0);
chaosBlockerGroup.add(barrierPillarR);

const cloudGroup = new THREE.Group();
cloudGroup.position.set(0, 4.1, 0);
const matCloud = makeClayMaterial(0x94A3B8);
const c1 = new THREE.Mesh(new THREE.SphereGeometry(0.85, 14, 14), matCloud);
const c2 = new THREE.Mesh(new THREE.SphereGeometry(0.65, 14, 14), matCloud);
c2.position.set(0.75, -0.1, 0.1);
const c3 = new THREE.Mesh(new THREE.SphereGeometry(0.65, 14, 14), matCloud);
c3.position.set(-0.75, -0.15, -0.1);
cloudGroup.add(c1, c2, c3);
chaosBlockerGroup.add(cloudGroup);

const slottingMovers = [];
const moverBoxGeo = new RoundedBoxGeometry(0.82, 0.78, 1.1, 1, 0.12);
for (let i = 0; i < 8; i++) {
  const isCoral = i % 2 === 0;
  const moverMesh = new THREE.Mesh(
    moverBoxGeo,
    isCoral ? matCoral : matBlue
  );
  const homePos = new THREE.Vector3(
    -16.8 + (i % 4) * 1.1,
    3.65,
    -8.5 + Math.floor(i / 4) * 5.3
  );
  const targetPos = new THREE.Vector3(
    -5.3,
    0.52 + (i % 2) * 0.88,
    -3.8 + Math.floor(i / 2) * 2.4
  );
  moverMesh.position.copy(homePos);
  moverMesh.castShadow = true;
  worldGroup.add(moverMesh);
  slottingMovers.push({ mesh: moverMesh, homePos, targetPos });
}

const laneMatCentral = makeClayMaterial(PALETTE.rackYellow, {
  emissive: PALETTE.rackYellow,
  emissiveIntensity: 0.18
});
const laneMatSide = makeClayMaterial(PALETTE.rackYellow, {
  emissive: PALETTE.rackYellow,
  emissiveIntensity: 0.1
});

const centralLane = new THREE.Mesh(
  new THREE.BoxGeometry(1.15, 0.05, 22),
  laneMatCentral
);
centralLane.position.set(-11.8, 0.12, 0);
worldGroup.add(centralLane);

const crossLaneGeo = new THREE.BoxGeometry(20, 0.05, 0.9);
[-5.8, -0.5, 4.9].forEach((cz) => {
  const cl = new THREE.Mesh(crossLaneGeo, laneMatSide);
  cl.position.set(-13.5, 0.12, cz);
  worldGroup.add(cl);
});

const fkBodyGeo = new RoundedBoxGeometry(1.35, 0.65, 0.95, 1, 0.14);
const fkCabinGeo = new RoundedBoxGeometry(0.85, 0.75, 0.82, 1, 0.1);
const fkMastGeo = new THREE.BoxGeometry(0.12, 1.35, 0.7);
const fkCargoGeo = new RoundedBoxGeometry(0.65, 0.58, 0.68, 1, 0.08);
const fkWheelGeo = new THREE.CylinderGeometry(0.22, 0.22, 0.2, 12);
fkWheelGeo.rotateX(Math.PI / 2);

function createForklift(boxMaterial) {
  const fg = new THREE.Group();

  const body = new THREE.Mesh(fkBodyGeo, matOrange);
  body.position.set(0, 0.48, 0);
  body.castShadow = true;
  fg.add(body);

  const cabin = new THREE.Mesh(fkCabinGeo, matWhite);
  cabin.position.set(-0.12, 1.05, 0);
  fg.add(cabin);

  const mast = new THREE.Mesh(fkMastGeo, matRackDark);
  mast.position.set(0.72, 0.8, 0);
  fg.add(mast);

  const cargo = new THREE.Mesh(fkCargoGeo, boxMaterial);
  cargo.position.set(1.08, 0.55, 0);
  fg.add(cargo);

  [
    [-0.42, 0.22, 0.45],
    [0.42, 0.22, 0.45],
    [-0.42, 0.22, -0.45],
    [0.42, 0.22, -0.45]
  ].forEach(([wx, wy, wz]) => {
    const w = new THREE.Mesh(fkWheelGeo, matRackDark);
    w.position.set(wx, wy, wz);
    fg.add(w);
  });

  return fg;
}

const forkliftPaths = [
  [
    new THREE.Vector3(-11.8, 0.1, -9.8),
    new THREE.Vector3(-11.8, 0.1, 9.8),
    new THREE.Vector3(-3.5, 0.1, 9.8),
    new THREE.Vector3(-3.5, 0.1, -9.8)
  ],
  [
    new THREE.Vector3(-24.5, 0.1, -5.8),
    new THREE.Vector3(-11.8, 0.1, -5.8),
    new THREE.Vector3(-11.8, 0.1, 4.9),
    new THREE.Vector3(-24.5, 0.1, 4.9)
  ],
  [
    new THREE.Vector3(-11.8, 0.1, -0.5),
    new THREE.Vector3(-2.5, 0.1, -0.5),
    new THREE.Vector3(-2.5, 0.1, 4.9),
    new THREE.Vector3(-11.8, 0.1, 4.9)
  ]
];

const forklifts = [];
forkliftPaths.forEach((pts, idx) => {
  const curve = new THREE.CatmullRomCurve3(pts, true, 'catmullrom', 0.18);
  const baseMesh = createForklift(boxMats[idx % boxMats.length]);
  worldGroup.add(baseMesh);
  forklifts.push({
    mesh: baseMesh,
    curve,
    progress: idx * 0.33,
    baseSpeed: 0.045 + idx * 0.006,
    isExtra: false
  });

  const extraMesh = createForklift(boxMats[(idx + 2) % boxMats.length]);
  extraMesh.visible = false;
  extraMesh.scale.set(0.001, 0.001, 0.001);
  worldGroup.add(extraMesh);
  forklifts.push({
    mesh: extraMesh,
    curve,
    progress: (idx * 0.33 + 0.5) % 1,
    baseSpeed: 0.045 + idx * 0.006,
    isExtra: true
  });
});

const dockPlatform = new THREE.Mesh(
  new RoundedBoxGeometry(6.5, 0.75, 9.5, 1, 0.15),
  makeClayMaterial(0xE2E0D8)
);
dockPlatform.position.set(4.2, 0.35, 0.5);
dockPlatform.receiveShadow = true;
dockPlatform.castShadow = true;
worldGroup.add(dockPlatform);

const truckGroup = new THREE.Group();
truckGroup.position.set(8.6, 0.1, 0.5);
worldGroup.add(truckGroup);

const trailerFloor = new THREE.Mesh(
  new RoundedBoxGeometry(6.8, 0.35, 3.6, 1, 0.1),
  matRackDark
);
trailerFloor.position.set(0, 0.65, 0);
trailerFloor.castShadow = true;
trailerFloor.receiveShadow = true;
truckGroup.add(trailerFloor);

const trailerGlassMat = new THREE.MeshStandardMaterial({
  color: 0xFFFFFF,
  transparent: true,
  opacity: 0.28,
  roughness: 0.2,
  metalness: 0.05,
  depthWrite: false
});
const trailerShell = new THREE.Mesh(
  new RoundedBoxGeometry(6.7, 3.2, 3.5, 1, 0.16),
  trailerGlassMat
);
trailerShell.position.set(0, 2.45, 0);
truckGroup.add(trailerShell);

const truckCab = new THREE.Mesh(
  new RoundedBoxGeometry(2.4, 2.3, 3.1, 2, 0.2),
  matOrange
);
truckCab.position.set(4.65, 1.85, 0);
truckCab.castShadow = true;
truckGroup.add(truckCab);

const truckCabinWhite = new THREE.Mesh(
  new RoundedBoxGeometry(1.5, 1.15, 2.85, 1, 0.14),
  matWhite
);
truckCabinWhite.position.set(4.85, 2.45, 0);
truckGroup.add(truckCabinWhite);

const truckWheelGeo = new THREE.CylinderGeometry(0.52, 0.52, 0.38, 14);
truckWheelGeo.rotateX(Math.PI / 2);
[
  [-2.2, 0.52, 1.65],
  [-0.6, 0.52, 1.65],
  [4.5, 0.52, 1.55],
  [-2.2, 0.52, -1.65],
  [-0.6, 0.52, -1.65],
  [4.5, 0.52, -1.55]
].forEach(([wx, wy, wz]) => {
  const tw = new THREE.Mesh(truckWheelGeo, matRackDark);
  tw.position.set(wx, wy, wz);
  truckGroup.add(tw);
});

const cargoSpecs = [
  { mat: matBlue, size: [1.35, 0.85, 1.35], messy: [-2.1, 2.1, -0.7, 0.25], packed: [-2.1, 1.28, -0.75], lifoAlt: [1.9, 1.28, -0.75] },
  { mat: matBlue, size: [1.35, 0.85, 1.35], messy: [-0.4, 1.9, 0.6, -0.2], packed: [-2.1, 1.28, 0.75], lifoAlt: [1.9, 1.28, 0.75] },
  { mat: matBlue, size: [1.35, 0.85, 1.35], messy: [1.3, 2.2, -0.5, 0.18], packed: [-0.5, 1.28, -0.75], lifoAlt: [-0.5, 1.28, -0.75] },
  { mat: matBlue, size: [1.35, 0.85, 1.35], messy: [1.7, 1.3, 0.7, -0.15], packed: [-0.5, 1.28, 0.75], lifoAlt: [-0.5, 1.28, 0.75] },
  { mat: matCoral, size: [1.25, 0.78, 1.25], messy: [-2.0, 1.25, 0.65, 0.12], packed: [-2.1, 2.12, -0.75], lifoAlt: [1.9, 2.12, -0.75] },
  { mat: matCoral, size: [1.25, 0.78, 1.25], messy: [0.2, 2.7, -0.6, -0.28], packed: [-2.1, 2.12, 0.75], lifoAlt: [1.9, 2.12, 0.75] },
  { mat: matPurple, size: [1.25, 0.78, 1.25], messy: [-0.7, 1.25, -0.65, 0.15], packed: [-0.5, 2.12, -0.75], lifoAlt: [-0.5, 2.12, -0.75] },
  { mat: matPurple, size: [1.25, 0.78, 1.25], messy: [1.6, 2.6, 0.55, 0.22], packed: [-0.5, 2.12, 0.75], lifoAlt: [-0.5, 2.12, 0.75] },
  { mat: matGreen, size: [1.2, 0.68, 1.2], messy: [-1.8, 2.85, -0.4, -0.22], packed: [1.1, 1.22, -0.75], lifoAlt: [-2.1, 1.22, -0.75] },
  { mat: matGreen, size: [1.2, 0.68, 1.2], messy: [-0.2, 1.25, 0.75, 0.3], packed: [1.1, 1.22, 0.75], lifoAlt: [-2.1, 1.22, 0.75] },
  { mat: matGreen, size: [1.15, 0.64, 1.15], messy: [1.1, 1.25, -0.7, -0.18], packed: [-2.1, 2.88, -0.75], lifoAlt: [-2.1, 2.0, -0.75] },
  { mat: matGreen, size: [1.15, 0.64, 1.15], messy: [-1.2, 2.75, 0.65, 0.24], packed: [-2.1, 2.88, 0.75], lifoAlt: [-2.1, 2.0, 0.75] }
];

const cargoMeshes = cargoSpecs.map((spec) => {
  const [w, h, d] = spec.size;
  const mesh = new THREE.Mesh(new RoundedBoxGeometry(w, h, d, 1, 0.1), spec.mat);
  mesh.position.set(spec.messy[0], spec.messy[1], spec.messy[2]);
  mesh.rotation.y = spec.messy[3];
  mesh.rotation.z = spec.messy[3] * 0.35;
  truckGroup.add(mesh);
  return { mesh, spec };
});

const cityGroup = new THREE.Group();
worldGroup.add(cityGroup);

const cityGround = new THREE.Mesh(
  new RoundedBoxGeometry(28, 0.28, 28, 2, 0.12),
  makeClayMaterial(0xF1F5F9)
);
cityGround.position.set(22.5, -0.05, 0);
cityGround.receiveShadow = true;
cityGroup.add(cityGround);

const mainRoadH = new THREE.Mesh(
  new THREE.BoxGeometry(25, 0.08, 3.2),
  matRoad
);
mainRoadH.position.set(22, 0.12, 0.5);
cityGroup.add(mainRoadH);

const crossRoadV1 = new THREE.Mesh(
  new THREE.BoxGeometry(3.0, 0.08, 22),
  matRoad
);
crossRoadV1.position.set(19.5, 0.12, 0);
cityGroup.add(crossRoadV1);

const crossRoadV2 = new THREE.Mesh(
  new THREE.BoxGeometry(3.0, 0.08, 22),
  matRoad
);
crossRoadV2.position.set(29.5, 0.12, 0);
cityGroup.add(crossRoadV2);

const topAve = new THREE.Mesh(
  new THREE.BoxGeometry(13, 0.08, 2.8),
  matRoad
);
topAve.position.set(24.5, 0.12, -8.5);
cityGroup.add(topAve);

const botAve = new THREE.Mesh(
  new THREE.BoxGeometry(13, 0.08, 2.8),
  matRoad
);
botAve.position.set(24.5, 0.12, 8.5);
cityGroup.add(botAve);

const workshopPins = [];
const sharedPinGeo = new THREE.SphereGeometry(0.62, 14, 14);

function createWorkshopBuilding(x, z, roofMaterial, baseSize = [3.6, 2.6, 3.2]) {
  const wg = new THREE.Group();
  wg.position.set(x, 0.1, z);

  const walls = new THREE.Mesh(
    new RoundedBoxGeometry(baseSize[0], baseSize[1], baseSize[2], 1, 0.14),
    matWhite
  );
  walls.position.y = baseSize[1] / 2;
  walls.castShadow = true;
  wg.add(walls);

  const roof = new THREE.Mesh(
    new RoundedBoxGeometry(baseSize[0] + 0.3, 0.55, baseSize[2] + 0.3, 1, 0.12),
    roofMaterial
  );
  roof.position.y = baseSize[1] + 0.25;
  wg.add(roof);

  const pinHead = new THREE.Mesh(sharedPinGeo, roofMaterial);
  pinHead.position.y = baseSize[1] + 1.85;
  wg.add(pinHead);
  workshopPins.push(pinHead);

  cityGroup.add(wg);
}

createWorkshopBuilding(16.2, -5.8, matCoral);
createWorkshopBuilding(24.5, 5.2, matBlue);
createWorkshopBuilding(32.8, -5.5, matGreen);
createWorkshopBuilding(33.2, 5.5, matPurple, [3.2, 3.4, 3.0]);

const sharedTrunkGeo = new THREE.CylinderGeometry(0.18, 0.24, 0.9, 8);
const sharedCrownGeo = new RoundedBoxGeometry(1.25, 1.45, 1.25, 2, 0.4);
const matTrunk = makeClayMaterial(PALETTE.trunk);
const matTree = makeClayMaterial(PALETTE.tree);

function createClayTree(tx, tz, scale = 1) {
  const tg = new THREE.Group();
  tg.position.set(tx, 0.1, tz);
  tg.scale.setScalar(scale);

  const trunk = new THREE.Mesh(sharedTrunkGeo, matTrunk);
  trunk.position.y = 0.45;
  tg.add(trunk);

  const crown = new THREE.Mesh(sharedCrownGeo, matTree);
  crown.position.y = 1.4;
  crown.castShadow = true;
  tg.add(crown);

  cityGroup.add(tg);
}

[
  [15.2, 5.5, 1.0],
  [16.8, 7.2, 0.85],
  [23.8, -4.2, 1.1],
  [25.6, -3.5, 0.9],
  [32.5, -1.8, 0.95],
  [23.2, 11.2, 1.0]
].forEach(([tx, tz, sc]) => createClayTree(tx, tz, sc));

const primaryRoutePoints = [
  new THREE.Vector3(12.5, 0.26, 0.5),
  new THREE.Vector3(19.5, 0.26, 0.5),
  new THREE.Vector3(19.5, 0.26, -5.8),
  new THREE.Vector3(19.5, 0.26, 8.5),
  new THREE.Vector3(24.5, 0.26, 8.5),
  new THREE.Vector3(29.5, 0.26, 8.5),
  new THREE.Vector3(29.5, 0.26, -5.5),
  new THREE.Vector3(32.5, 0.26, -5.5)
];
const primaryRouteCurve = new THREE.CatmullRomCurve3(primaryRoutePoints, false, 'catmullrom', 0.12);
const routePrimaryMesh = new THREE.Mesh(
  new THREE.TubeGeometry(primaryRouteCurve, 64, 0.22, 8, false),
  makeClayMaterial(PALETTE.fastCoral, { emissive: PALETTE.fastCoral, emissiveIntensity: 0.25 })
);
cityGroup.add(routePrimaryMesh);

const altRoutePoints = [
  new THREE.Vector3(12.5, 0.28, 0.5),
  new THREE.Vector3(19.5, 0.28, 0.5),
  new THREE.Vector3(19.5, 0.28, -8.5),
  new THREE.Vector3(29.5, 0.28, -8.5),
  new THREE.Vector3(29.5, 0.28, -5.5),
  new THREE.Vector3(29.5, 0.28, 8.5),
  new THREE.Vector3(24.5, 0.28, 8.5),
  new THREE.Vector3(19.5, 0.28, 8.5),
  new THREE.Vector3(19.5, 0.28, -5.8)
];
const altRouteCurve = new THREE.CatmullRomCurve3(altRoutePoints, false, 'catmullrom', 0.12);
const routeAltMesh = new THREE.Mesh(
  new THREE.TubeGeometry(altRouteCurve, 64, 0.24, 8, false),
  makeClayMaterial(PALETTE.fragileGreen, { emissive: PALETTE.fragileGreen, emissiveIntensity: 0.3 })
);
routeAltMesh.visible = false;
cityGroup.add(routeAltMesh);

const deliveryVan = new THREE.Group();
const vanBody = new THREE.Mesh(
  new RoundedBoxGeometry(1.5, 0.85, 0.9, 1, 0.14),
  matOrange
);
vanBody.position.y = 0.55;
vanBody.castShadow = true;
deliveryVan.add(vanBody);

const vanCabin = new THREE.Mesh(
  new RoundedBoxGeometry(0.65, 0.65, 0.82, 1, 0.1),
  matWhite
);
vanCabin.position.set(0.45, 0.68, 0);
deliveryVan.add(vanCabin);
cityGroup.add(deliveryVan);

const stageViewpoints = [
  { posX: -27, posY: 16.5, posZ: 25.5, lookX: -12, lookY: 1.6, lookZ: 4.5, badge: '00 · Tus Ítems' },
  { posX: -24, posY: 22, posZ: 27, lookX: -3, lookY: 1.5, lookZ: 0, badge: '01 · Modo Diseño' },
  { posX: -12, posY: 11.5, posZ: 11.5, lookX: -11, lookY: 1.8, lookZ: -5.5, badge: '02 · Motor Bodevia' },
  { posX: 7.5, posY: 7.2, posZ: 12.2, lookX: 8.2, lookY: 2.1, lookZ: 0.5, badge: '03 · Cero Pérdidas' },
  { posX: -13, posY: 23.5, posZ: 8.5, lookX: -12.5, lookY: 0.5, lookZ: -0.5, badge: '04 · Escalabilidad' },
  { posX: 21.5, posY: 17.5, posZ: 20.5, lookX: 21.5, lookY: 1.0, lookZ: -0.5, badge: '05 · Rutas Óptimas' },
  { posX: 4, posY: 25, posZ: 34, lookX: 6, lookY: 1.5, lookZ: 0, badge: '06 · Impacto Real' }
];

const stageBadgeEl = document.getElementById('scene-stage-badge');
const navPills = document.querySelectorAll('.nav-pill');
let lastHighlightedIdx = 0;

function highlightNav(index) {
  if (index === lastHighlightedIdx) return;
  lastHighlightedIdx = index;
  if (stageBadgeEl && stageViewpoints[index]) {
    stageBadgeEl.textContent = stageViewpoints[index].badge;
  }
  navPills.forEach((pill, idx) => {
    if (idx === index) {
      pill.classList.add('bg-white', 'shadow-sm', 'font-bold', 'text-[#1E293B]');
      pill.classList.remove('text-[#334155]');
    } else {
      pill.classList.remove('bg-white', 'shadow-sm', 'font-bold', 'text-[#1E293B]');
      pill.classList.add('text-[#334155]');
    }
  });
}

navPills.forEach((pill) => {
  pill.addEventListener('click', (e) => {
    const href = pill.getAttribute('href');
    if (href && href.startsWith('#')) {
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    }
  });
});

const masterTl = gsap.timeline({
  scrollTrigger: {
    trigger: 'main',
    start: 'top top',
    end: 'bottom bottom',
    scrub: 0.5,
    onUpdate: (self) => {
      const idx = Math.min(stageViewpoints.length - 1, Math.floor(self.progress * stageViewpoints.length));
      highlightNav(idx);
    }
  }
});

for (let i = 1; i < stageViewpoints.length; i++) {
  const vp = stageViewpoints[i];
  masterTl.to(cameraState, {
    posX: vp.posX,
    posY: vp.posY,
    posZ: vp.posZ,
    lookX: vp.lookX,
    lookY: vp.lookY,
    lookZ: vp.lookZ,
    ease: 'power1.inOut',
    duration: 1
  });
}

const presetsData = {
  general: {
    title: 'Comercio General',
    items: ['Gran Volumen', 'Alta Rotación', 'Cuidado / Frágil', 'Pedidos Express'],
    scales: [[1.15, 1.0, 1.15], [1.0, 1.0, 1.0], [0.9, 1.15, 0.9], [1.05, 0.85, 1.05]]
  },
  food: {
    title: 'Alimentos y Bebidas',
    items: ['Sacos y Bebidas', 'Consumo Diario', 'Cadena de Frío', 'Pedidos Horeca'],
    scales: [[1.25, 0.8, 1.25], [1.05, 1.1, 1.05], [0.95, 1.25, 0.95], [1.1, 0.9, 1.1]]
  },
  tech: {
    title: 'Tecnología y Equipos',
    items: ['Equipos y Cajas', 'Accesorios Top', 'Pantallas / Óptica', 'Envíos Prioritarios'],
    scales: [[1.2, 1.2, 0.85], [0.85, 0.85, 0.85], [1.3, 1.1, 0.65], [1.0, 0.95, 1.0]]
  },
  retail: {
    title: 'Moda, Retail y Hogar',
    items: ['Lotes Mayoristas', 'Temporada Alta', 'Hogar y Vidrio', 'Entregas Hoy'],
    scales: [[1.2, 0.9, 1.1], [1.0, 1.2, 1.0], [0.9, 1.05, 0.9], [1.15, 0.85, 1.15]]
  }
};

let currentPresetKey = 'general';
const presetBtns = document.querySelectorAll('.preset-btn');
const btnConfigureItems = document.getElementById('btn-configure-items');
const btnConfigureItemsLabel = document.getElementById('btn-configure-items-label');
const itemProfileStatus = document.getElementById('item-profile-status');
const legendItem1 = document.getElementById('legend-item-1');
const legendItem2 = document.getElementById('legend-item-2');
const legendItem3 = document.getElementById('legend-item-3');
const legendItem4 = document.getElementById('legend-item-4');

function applyItemPreset(presetKey) {
  currentPresetKey = presetKey;
  const data = presetsData[presetKey] || presetsData.general;

  presetBtns.forEach((b) => {
    if (b.dataset.preset === presetKey) {
      b.className = 'preset-btn px-3 py-2.5 rounded-xl text-xs font-bold bg-[#1E293B] text-white shadow-sm transition-all cursor-pointer text-left flex items-center justify-between';
    } else {
      b.className = 'preset-btn px-3 py-2.5 rounded-xl text-xs font-bold bg-white text-[#1E293B] border border-[#E2E0D8] hover:border-[#F97316] transition-all cursor-pointer text-left flex items-center justify-between';
    }
  });

  if (legendItem1) legendItem1.textContent = data.items[0];
  if (legendItem2) legendItem2.textContent = data.items[1];
  if (legendItem3) legendItem3.textContent = data.items[2];
  if (legendItem4) legendItem4.textContent = data.items[3];
  if (itemProfileStatus) itemProfileStatus.textContent = `Perfil activo: ${data.title}`;

  showcaseSamples.forEach((mesh, idx) => {
    const [sx, sy, sz] = data.scales[idx];
    gsap.fromTo(
      mesh.position,
      { y: 1.15 },
      { y: 2.1, duration: 0.25, yoyo: true, repeat: 1, delay: idx * 0.05, ease: 'power2.out' }
    );
    gsap.to(mesh.scale, {
      x: sx,
      y: sy,
      z: sz,
      duration: 0.5,
      delay: idx * 0.05,
      ease: 'back.out(1.8)'
    });
    gsap.to(mesh.rotation, {
      y: mesh.rotation.y + Math.PI * 2,
      duration: 0.65,
      delay: idx * 0.05,
      ease: 'power2.out'
    });
  });

  allWarehouseBoxes.forEach((box, idx) => {
    if (idx % 4 === 0) {
      const [sx, sy, sz] = data.scales[idx % 4];
      gsap.to(box.scale, {
        x: sx * 0.92,
        y: sy * 0.92,
        z: sz * 0.92,
        duration: 0.45,
        ease: 'back.out(1.5)'
      });
    }
  });
}

presetBtns.forEach((btn) => {
  btn.addEventListener('click', () => {
    applyItemPreset(btn.dataset.preset);
  });
});

if (btnConfigureItems) {
  const keys = Object.keys(presetsData);
  btnConfigureItems.addEventListener('click', () => {
    const nextIdx = (keys.indexOf(currentPresetKey) + 1) % keys.length;
    applyItemPreset(keys[nextIdx]);
    if (btnConfigureItemsLabel) {
      btnConfigureItemsLabel.textContent = `Catálogo 3D: ${presetsData[keys[nextIdx]].title}`;
    }
  });
}

const btnAddRack = document.getElementById('btn-add-rack');
const btnAddRackLabel = document.getElementById('btn-add-rack-label');
const capacityText = document.getElementById('capacity-text');
const capacityBar = document.getElementById('capacity-bar');
const capacityBadge = document.getElementById('capacity-badge');

if (btnAddRack) {
  btnAddRack.addEventListener('click', () => {
    extraRack.visible = true;
    extraRack.position.y = 22;

    gsap.to(extraRack.position, {
      y: 0.1,
      duration: 1.2,
      ease: 'bounce.out'
    });

    extraRack.userData.boxes.forEach((box, idx) => {
      const finalY = box.position.y;
      box.position.y = finalY + 5 + idx * 0.35;
      gsap.to(box.position, {
        y: finalY,
        duration: 1.05,
        delay: 0.035 * idx,
        ease: 'bounce.out'
      });
    });

    dropRing.scale.set(0.5, 0.5, 0.5);
    dropRingMat.opacity = 0.9;
    gsap.to(dropRing.scale, {
      x: 4.5,
      y: 4.5,
      z: 4.5,
      duration: 0.85,
      ease: 'power2.out'
    });
    gsap.to(dropRingMat, {
      opacity: 0,
      duration: 0.85,
      ease: 'power2.out'
    });

    if (capacityText) capacityText.textContent = 'Aprovechamiento del Perímetro: 84% -> 96%';
    if (capacityBar) capacityBar.style.width = '96%';
    if (capacityBadge) capacityBadge.textContent = '13 Módulos Activos';
    if (btnAddRackLabel) btnAddRackLabel.textContent = 'Estantería Integrada al Plano 3D';
  });
}

let chaosActive = false;
const btnSimulateChaos = document.getElementById('btn-simulate-chaos');
const btnSimulateChaosLabel = document.getElementById('btn-simulate-chaos-label');
const doorStatusText = document.getElementById('door-status-text');
const slottingPriorityText = document.getElementById('slotting-priority-text');

if (btnSimulateChaos) {
  btnSimulateChaos.addEventListener('click', () => {
    chaosActive = !chaosActive;

    if (chaosActive) {
      chaosBlockerGroup.visible = true;
      gsap.to(chaosBlockerGroup.scale, {
        x: 1,
        y: 1,
        z: 1,
        duration: 0.6,
        ease: 'back.out(1.7)'
      });

      slottingMovers.forEach((item, idx) => {
        const tl = gsap.timeline({ delay: idx * 0.045 });
        tl.to(item.mesh.position, {
          x: (item.homePos.x + item.targetPos.x) * 0.5,
          y: 6.2,
          z: (item.homePos.z + item.targetPos.z) * 0.5,
          duration: 0.42,
          ease: 'power2.out'
        }).to(item.mesh.position, {
          x: item.targetPos.x,
          y: item.targetPos.y,
          z: item.targetPos.z,
          duration: 0.52,
          ease: 'bounce.out'
        });
        gsap.to(item.mesh.rotation, {
          y: Math.PI * 2,
          duration: 0.9,
          delay: idx * 0.045,
          ease: 'power2.inOut'
        });
      });

      if (doorStatusText) {
        doorStatusText.innerHTML = '<span class="w-2.5 h-2.5 rounded-full bg-[#FF5A5F] animate-ping"></span> Acceso B Cerrado · Flujo Redirigido';
        doorStatusText.className = 'font-display font-bold text-sm text-[#FF5A5F] flex items-center gap-1.5';
      }
      if (slottingPriorityText) slottingPriorityText.textContent = 'Guía Directa · Salida A';
      if (btnSimulateChaosLabel) btnSimulateChaosLabel.textContent = 'Restaurar Flujo Estándar';
    } else {
      gsap.to(chaosBlockerGroup.scale, {
        x: 0.001,
        y: 0.001,
        z: 0.001,
        duration: 0.4,
        ease: 'power2.in',
        onComplete: () => {
          chaosBlockerGroup.visible = false;
        }
      });

      slottingMovers.forEach((item, idx) => {
        gsap.to(item.mesh.position, {
          x: item.homePos.x,
          y: item.homePos.y,
          z: item.homePos.z,
          duration: 0.7,
          delay: idx * 0.035,
          ease: 'power2.inOut'
        });
        gsap.to(item.mesh.rotation, {
          y: 0,
          duration: 0.7
        });
      });

      if (doorStatusText) {
        doorStatusText.innerHTML = '<span class="w-2.5 h-2.5 rounded-full bg-[#10B981]"></span> Flujo WMS Normal';
        doorStatusText.className = 'font-display font-bold text-sm text-[#10B981] flex items-center gap-1.5';
      }
      if (slottingPriorityText) slottingPriorityText.textContent = 'Secuencia Estándar';
      if (btnSimulateChaosLabel) btnSimulateChaosLabel.textContent = 'Simular Imprevisto y Reordenar Flujo';
    }
  });
}

const btnRepack = document.getElementById('btn-repack');
const btnRepackLabel = document.getElementById('btn-repack-label');
const packingScore = document.getElementById('packing-score');

if (btnRepack) {
  btnRepack.addEventListener('click', () => {
    cargoMeshes.forEach(({ mesh, spec }, idx) => {
      const [px, py, pz] = spec.packed;
      const tl = gsap.timeline({ delay: idx * 0.035 });
      tl.to(mesh.position, {
        y: py + 2.1,
        duration: 0.35,
        ease: 'power2.out'
      }).to(mesh.position, {
        x: px,
        y: py,
        z: pz,
        duration: 0.6,
        ease: 'back.out(1.6)'
      });

      gsap.to(mesh.rotation, {
        x: 0,
        y: Math.PI * 2,
        z: 0,
        duration: 0.85,
        delay: idx * 0.035,
        ease: 'power2.out',
        onComplete: () => {
          mesh.rotation.set(0, 0, 0);
        }
      });
    });

    if (packingScore) {
      packingScore.textContent = '98% → Cero Daños y Control Total';
      packingScore.className = 'font-display font-bold text-base text-[#10B981]';
    }
    if (btnRepackLabel) btnRepackLabel.textContent = 'Carga Protegida y Ordenada (98%)';
  });
}

let rushHourActive = false;
let forkliftSpeedMultiplier = 1;
const btnRushHour = document.getElementById('btn-rush-hour');
const btnRushHourLabel = document.getElementById('btn-rush-hour-label');
const trafficClock = document.getElementById('traffic-clock');
const laneStatusBadge = document.getElementById('lane-status-badge');

if (btnRushHour) {
  btnRushHour.addEventListener('click', () => {
    rushHourActive = !rushHourActive;

    if (rushHourActive) {
      forklifts.forEach((f) => {
        if (f.isExtra) {
          f.mesh.visible = true;
          gsap.to(f.mesh.scale, {
            x: 1,
            y: 1,
            z: 1,
            duration: 0.55,
            ease: 'back.out(1.7)'
          });
        }
      });

      gsap.to({ val: forkliftSpeedMultiplier }, {
        val: 4.8,
        duration: 0.5,
        onUpdate: function () {
          forkliftSpeedMultiplier = this.targets()[0].val;
        }
      });
      laneMatCentral.color.setHex(PALETTE.fragileGreen);
      laneMatCentral.emissive.setHex(PALETTE.fragileGreen);
      laneMatCentral.emissiveIntensity = 0.42;

      if (trafficClock) trafficClock.textContent = 'Equipos Activos x2 · Flujo x10';
      if (laneStatusBadge) {
        laneStatusBadge.textContent = 'Vía Rápida Activa';
        laneStatusBadge.className = 'inline-block mt-0.5 text-xs font-extrabold px-3 py-1 rounded-full bg-[#10B981]/25 text-[#10B981]';
      }
      if (btnRushHourLabel) btnRushHourLabel.textContent = 'Restaurar Recursos Base';
    } else {
      forklifts.forEach((f) => {
        if (f.isExtra) {
          gsap.to(f.mesh.scale, {
            x: 0.001,
            y: 0.001,
            z: 0.001,
            duration: 0.4,
            ease: 'power2.in',
            onComplete: () => {
              f.mesh.visible = false;
            }
          });
        }
      });

      gsap.to({ val: forkliftSpeedMultiplier }, {
        val: 1,
        duration: 0.5,
        onUpdate: function () {
          forkliftSpeedMultiplier = this.targets()[0].val;
        }
      });
      laneMatCentral.color.setHex(PALETTE.rackYellow);
      laneMatCentral.emissive.setHex(PALETTE.rackYellow);
      laneMatCentral.emissiveIntensity = 0.18;

      if (trafficClock) trafficClock.textContent = 'Equipos Base · Flujo Normal';
      if (laneStatusBadge) {
        laneStatusBadge.textContent = 'Flujo Estándar';
        laneStatusBadge.className = 'inline-block mt-0.5 text-xs font-extrabold px-3 py-1 rounded-full bg-[#F59E0B]/25 text-[#1E293B]';
      }
      if (btnRushHourLabel) btnRushHourLabel.textContent = 'Escalar Operación (+Equipos y Cámara Rápida)';
    }
  });
}

let altRouteActive = false;
const btnChangeRoute = document.getElementById('btn-change-route');
const btnChangeRouteLabel = document.getElementById('btn-change-route-label');
const routeModeBadge = document.getElementById('route-mode-badge');
const stop1Name = document.getElementById('stop-1-name');
const stop1Dot = document.getElementById('stop-1-dot');
const stop3Name = document.getElementById('stop-3-name');
const stop3Dot = document.getElementById('stop-3-dot');

if (btnChangeRoute) {
  btnChangeRoute.addEventListener('click', () => {
    altRouteActive = !altRouteActive;
    routePrimaryMesh.visible = !altRouteActive;
    routeAltMesh.visible = altRouteActive;

    cargoMeshes.forEach(({ mesh, spec }, idx) => {
      const targetCoords = altRouteActive ? spec.lifoAlt : spec.packed;
      gsap.to(mesh.position, {
        x: targetCoords[0],
        y: targetCoords[1],
        z: targetCoords[2],
        duration: 0.7,
        delay: idx * 0.025,
        ease: 'back.out(1.4)'
      });
      gsap.to(mesh.rotation, {
        x: 0,
        y: 0,
        z: 0,
        duration: 0.45
      });
    });

    if (altRouteActive) {
      if (routeModeBadge) {
        routeModeBadge.textContent = 'Ruta Alternativa Express';
        routeModeBadge.className = 'text-xs font-extrabold px-2.5 py-0.5 rounded-full bg-[#8B5CF6]/20 text-[#8B5CF6]';
      }
      if (stop1Name) stop1Name.textContent = '1ª Entrega: Centro Logístico Norte';
      if (stop1Dot) stop1Dot.className = 'w-3 h-3 rounded-full bg-[#10B981]';
      if (stop3Name) stop3Name.textContent = '3ª Entrega: Punto Comercial Centro';
      if (stop3Dot) stop3Dot.className = 'w-3 h-3 rounded-full bg-[#FF5A5F]';
      if (btnChangeRouteLabel) btnChangeRouteLabel.textContent = 'Volver a Ruta Principal';
    } else {
      if (routeModeBadge) {
        routeModeBadge.textContent = 'Ruta Óptima A';
        routeModeBadge.className = 'text-xs font-extrabold px-2.5 py-0.5 rounded-full bg-[#10B981]/20 text-[#1E293B]';
      }
      if (stop1Name) stop1Name.textContent = '1ª Entrega: Punto Comercial Centro';
      if (stop1Dot) stop1Dot.className = 'w-3 h-3 rounded-full bg-[#FF5A5F]';
      if (stop3Name) stop3Name.textContent = '3ª Entrega: Centro Logístico Norte';
      if (stop3Dot) stop3Dot.className = 'w-3 h-3 rounded-full bg-[#10B981]';
      if (btnChangeRouteLabel) btnChangeRouteLabel.textContent = 'Recalcular Ruta por Tráfico en Vivo';
    }
  });
}

let vanSpeedBonus = 1;
const ordersSlider = document.getElementById('orders-slider');
const ordersValueBadge = document.getElementById('orders-value-badge');
const metricHours = document.getElementById('metric-hours');
const metricKm = document.getElementById('metric-km');

function updateImpactMetrics(ordersPerDay) {
  const hoursSaved = Math.round(ordersPerDay * 0.9);
  const kmSaved = Math.round(ordersPerDay * 12);
  if (ordersValueBadge) ordersValueBadge.textContent = `${ordersPerDay} pedidos`;
  if (metricHours) metricHours.textContent = hoursSaved.toLocaleString('es-ES');
  if (metricKm) metricKm.textContent = kmSaved.toLocaleString('es-ES');
  vanSpeedBonus = 0.7 + (ordersPerDay / 500) * 1.8;
}

if (ordersSlider) {
  ordersSlider.addEventListener('input', (e) => {
    const val = parseInt(e.target.value, 10) || 150;
    updateImpactMetrics(val);
  });
  updateImpactMetrics(parseInt(ordersSlider.value, 10) || 150);
}

const btnCtaTrial = document.getElementById('btn-cta-trial');
const ctaFeedback = document.getElementById('cta-feedback');

if (btnCtaTrial) {
  btnCtaTrial.addEventListener('click', () => {
    if (ctaFeedback) ctaFeedback.classList.remove('hidden');
    workshopPins.forEach((pin, idx) => {
      gsap.fromTo(
        pin.scale,
        { x: 1, y: 1, z: 1 },
        { x: 1.65, y: 1.65, z: 1.65, duration: 0.35, yoyo: true, repeat: 3, delay: idx * 0.08 }
      );
    });
    gsap.fromTo(
      truckGroup.position,
      { x: 8.6 },
      { x: 11.2, duration: 0.7, yoyo: true, repeat: 1, ease: 'power2.inOut' }
    );
  });
}

const clock = new THREE.Clock();
let vanProgress = 0;

function animate() {
  requestAnimationFrame(animate);

  const delta = Math.min(clock.getDelta(), 0.05);
  const elapsed = clock.getElapsedTime();

  camera.position.set(cameraState.posX, cameraState.posY, cameraState.posZ);
  camera.lookAt(cameraState.lookX, cameraState.lookY, cameraState.lookZ);

  showcaseSamples.forEach((sample, idx) => {
    sample.rotation.y += delta * (0.45 + idx * 0.08);
  });

  forklifts.forEach((f) => {
    if (!f.mesh.visible) return;
    f.progress = (f.progress + delta * f.baseSpeed * forkliftSpeedMultiplier) % 1;
    const pos = f.curve.getPointAt(f.progress);
    const nextPos = f.curve.getPointAt((f.progress + 0.01) % 1);
    f.mesh.position.copy(pos);
    f.mesh.lookAt(nextPos.x, pos.y, nextPos.z);
    f.mesh.rotateY(-Math.PI / 2);
  });

  const activeCurve = altRouteActive ? altRouteCurve : primaryRouteCurve;
  vanProgress = (vanProgress + delta * 0.08 * vanSpeedBonus) % 1;
  const vanPos = activeCurve.getPointAt(vanProgress);
  const vanNext = activeCurve.getPointAt(Math.min(0.999, (vanProgress + 0.015) % 1));
  deliveryVan.position.copy(vanPos);
  deliveryVan.lookAt(vanNext.x, vanPos.y, vanNext.z);
  deliveryVan.rotateY(-Math.PI / 2);

  workshopPins.forEach((pin, idx) => {
    pin.position.y = 4.4 + Math.sin(elapsed * 3.2 + idx * 1.3) * 0.22;
  });

  if (chaosActive) {
    cloudGroup.position.y = 4.1 + Math.sin(elapsed * 4) * 0.18;
  }

  renderer.render(scene, camera);
}

animate();

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
});
