import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import * as THREE from 'three';

export async function addTiles(scene, tileUrls) {
    const loader = new GLTFLoader();
    let position_tileZ = 0;

    const loadTilePromises = tileUrls.map(url => {
        return new Promise((resolve, reject) => {
            loader.load(url, (gltf) => {
                resolve(gltf);
            }, undefined, (error) => {
                reject(error);
            });
        });
    });

    const tiles = [];
    let tilesSizeZ = 0;

    try {
        const loadedTiles = await Promise.all(loadTilePromises);
        loadedTiles.forEach((gltf, index) => {
            const tile = gltf.scene;
            const boundingBox = new THREE.Box3().setFromObject(tile);
            const tileSize = boundingBox.getSize(new THREE.Vector3());
            if (index === 0) {
                tilesSizeZ = tileSize.z;
            }
            tile.position.set(0, 0, position_tileZ);
            scene.add(tile);
            tiles.push(tile);
            position_tileZ -= tilesSizeZ;
        });
    } catch (error) {
        console.error('An error happened while loading the GLB files', error);
    }

    return { tiles, tilesSizeZ };
}