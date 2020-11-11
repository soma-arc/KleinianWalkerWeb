import Vec2 from '../geometry/vector2.js';
import Vec3 from '../geometry/vector3.js';

export class Camera {
    /**
     *
     * @param {Vec3} pos
     * @param {Vec3} target
     * @param {number} fov
     */
    constructor(pos, target, fov) {
        this.pos = pos;
        this.target = target;
        this.prevTarget = target;
        this.fov = fov; // radians
        this.up = new Vec3(0, 1, 0);
    }

    /**
     *
     * @param {number} screenWidth
     * @param {number} screenHeight
     * @return {[Vec3, Vec3]}
     */
    getFocalXYVector(screenWidth, screenHeight) {
        const v = Vec3.normalize(this.target.sub(this.pos));
        const focalXAxis = Vec3.normalize(Vec3.cross(v, this.up));
        const focalYAxis = Vec3.normalize(Vec3.cross(v, focalXAxis));
        return [focalXAxis, focalYAxis];
    }
}

export class CameraOnSphere extends Camera {
    /**
     *
     * @param {Vec3} target
     * @param {number} fov
     * @param {number} cameraDistance
     * @param {Vec3} up
     */
    constructor(target, fov, cameraDistance, up) {
        super(new Vec3(0, 0, 0), target, fov);
        this.target = target;
        this.fov = fov;
        this.cameraDistance = cameraDistance;
        this.up = up;
        this.theta = 0;
        this.phi = 0;

        this.prevThetaPhi = new Vec2(this.theta, this.phi);

        this.update();
    }

    /**
     * TODO: compute up vector using quaternion
     */
    update() {
        this.pos = new Vec3(this.cameraDistance * Math.cos(this.phi) * Math.cos(this.theta),
                            this.cameraDistance * Math.sin(this.phi),
                            -this.cameraDistance * Math.cos(this.phi) * Math.sin(this.theta));
        this.pos = this.target.add(this.pos);
        if (Math.abs(this.phi) % (2 * Math.PI) > Math.PI / 2 &&
            Math.abs(this.phi) % (2 * Math.PI) < 3 * Math.PI / 2) {
            this.up = new Vec3(0, -1, 0);
        } else {
            this.up = new Vec3(0, 1, 0);
        }
    }
}
