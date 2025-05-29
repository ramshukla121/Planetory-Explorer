import * as THREE from "three";
export class CtruhSphereGeometry {
    constructor(radius, widthSegments, heightSegments) {
        this.radius = radius;
        this.widthSegments = widthSegments;
        this.heightSegments = heightSegments;
        this.geometry = this.generateGeometry();
    }

    generateGeometry() {
        const geometry = new THREE.BufferGeometry();
        const vertices = [];
        const normals = [];
        const uvs = [];
        const indices = [];

        for (let y = 0; y <= this.heightSegments; y++) {
            const v = y / this.heightSegments;
            const theta = v * Math.PI; // angle from top (y-axis)

            for (let x = 0; x <= this.widthSegments; x++) {
                const u = x / this.widthSegments;
                const phi = u * 2 * Math.PI; // angle from center (x-axis)

                const sinTheta = Math.sin(theta);
                const cosTheta = Math.cos(theta);
                const sinPhi = Math.sin(phi);
                const cosPhi = Math.cos(phi);

                const xPos = cosPhi * sinTheta;
                const yPos = cosTheta;
                const zPos = sinPhi * sinTheta;

                vertices.push(this.radius * xPos, this.radius * yPos, this.radius * zPos);
                normals.push(xPos, yPos, zPos);
                uvs.push(u, 1 - v);
            }
        }

        for (let y = 0; y < this.heightSegments; y++) {
            for (let x = 0; x < this.widthSegments; x++) {
                const a = y * (this.widthSegments + 1) + x;
                const b = y * (this.widthSegments + 1) + x + 1;
                const c = (y + 1) * (this.widthSegments + 1) + x + 1;
                const d = (y + 1) * (this.widthSegments + 1) + x;

                indices.push(a, b, d);
                indices.push(b, c, d);
            }
        }

        geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
        geometry.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3));
        geometry.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
        geometry.setIndex(indices);

        return geometry;
    }
}