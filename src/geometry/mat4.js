const ARRAY_TYPE = Float32Array;

export default class Mat4 {
    /**
     * column-major m_column_row
     * | m00 m10 m20 m30 |
     * | m01 m11 m21 m31 |
     * | m02 m12 m22 m32 |
     * | m03 m13 m23 m33 |
     * @param {Number} m00
     * @param {Number} m01
     * @param {Number} m02
     * @param {Number} m03
     * @param {Number} m10
     * @param {Number} m11
     * @param {Number} m12
     * @param {Number} m13
     * @param {Number} m20
     * @param {Number} m21
     * @param {Number} m22
     * @param {Number} m23
     * @param {Number} m30
     * @param {Number} m31
     * @param {Number} m32
     * @param {Number} m33
     */
    constructor(m00, m01, m02, m03,
                m10, m11, m12, m13,
                m20, m21, m22, m23,
                m30, m31, m32, m33) {
        this.elem = new ARRAY_TYPE(16);
        // column 0
        this.elem[0] = m00;
        this.elem[1] = m01;
        this.elem[2] = m02;
        this.elem[3] = m03;
        // column 1
        this.elem[4] = m10;
        this.elem[5] = m11;
        this.elem[6] = m12;
        this.elem[7] = m13;
        // column 2
        this.elem[8] = m20;
        this.elem[9] = m21;
        this.elem[10] = m22;
        this.elem[11] = m23;
        // column 3
        this.elem[12] = m30;
        this.elem[13] = m31;
        this.elem[14] = m32;
        this.elem[15] = m33;
    }

    /**
     *
     * @returns {Mat4}
     */
    transpose() {
        return new Mat4(this.elem[0], this.elem[4], this.elem[8], this.elem[12],
                        this.elem[1], this.elem[5], this.elem[9], this.elem[13],
                        this.elem[2], this.elem[6], this.elem[10], this.elem[14],
                        this.elem[3], this.elem[7], this.elem[11], this.elem[15]);
    }

    /**
     * Compute inverted matrix.
     * This formula may be slower than other implementations.
     * gl-matrix uses this formula.
     * Gauss-Jordan elimination routine may be faster than this implementation.
     * PBRT-v3 uses Gauss-Jordan elimination.
     * @returns {Mat4}
     */
    inverse() {
        const a00 = this.elem[0], a01 = this.elem[1], a02 = this.elem[2], a03 = this.elem[3];
        const a10 = this.elem[4], a11 = this.elem[5], a12 = this.elem[6], a13 = this.elem[7];
        const a20 = this.elem[8], a21 = this.elem[9], a22 = this.elem[10], a23 = this.elem[11];
        const a30 = this.elem[12], a31 = this.elem[13], a32 = this.elem[14], a33 = this.elem[15];

        const b00 = a00 * a11 - a01 * a10;
        const b01 = a00 * a12 - a02 * a10;
        const b02 = a00 * a13 - a03 * a10;
        const b03 = a01 * a12 - a02 * a11;
        const b04 = a01 * a13 - a03 * a11;
        const b05 = a02 * a13 - a03 * a12;
        const b06 = a20 * a31 - a21 * a30;
        const b07 = a20 * a32 - a22 * a30;
        const b08 = a20 * a33 - a23 * a30;
        const b09 = a21 * a32 - a22 * a31;
        const b10 = a21 * a33 - a23 * a31;
        const b11 = a22 * a33 - a23 * a32;

        let det = b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;

        if (!det) {
            console.log('Error! This matrix is singular.');
            return undefined;
        }
        det = 1.0 / det;

        return new Mat4(
            (a11 * b11 - a12 * b10 + a13 * b09) * det,
            (a02 * b10 - a01 * b11 - a03 * b09) * det,
            (a31 * b05 - a32 * b04 + a33 * b03) * det,
            (a22 * b04 - a21 * b05 - a23 * b03) * det,
            (a12 * b08 - a10 * b11 - a13 * b07) * det,
            (a00 * b11 - a02 * b08 + a03 * b07) * det,
            (a32 * b02 - a30 * b05 - a33 * b01) * det,
            (a20 * b05 - a22 * b02 + a23 * b01) * det,
            (a10 * b10 - a11 * b08 + a13 * b06) * det,
            (a01 * b08 - a00 * b10 - a03 * b06) * det,
            (a30 * b04 - a31 * b02 + a33 * b00) * det,
            (a21 * b02 - a20 * b04 - a23 * b00) * det,
            (a11 * b07 - a10 * b09 - a12 * b06) * det,
            (a00 * b09 - a01 * b07 + a02 * b06) * det,
            (a31 * b01 - a30 * b03 - a32 * b00) * det,
            (a20 * b03 - a21 * b01 + a22 * b00) * det
        );
    }

    /**
     *
     * @param {Mat4} a
     * @param {Mat4} b
     * @return {Mat4}
     */
    static prod(a, b) {
        const a00 = a.elem[0], a01 = a.elem[1], a02 = a.elem[2], a03 = a.elem[3];
        const a10 = a.elem[4], a11 = a.elem[5], a12 = a.elem[6], a13 = a.elem[7];
        const a20 = a.elem[8], a21 = a.elem[9], a22 = a.elem[10], a23 = a.elem[11];
        const a30 = a.elem[12], a31 = a.elem[13], a32 = a.elem[14], a33 = a.elem[15];

        const b0 = b.elem[0], b1 = b.elem[1], b2 = b.elem[2], b3 = b.elem[3];
        const b4 = b.elem[4], b5 = b.elem[5], b6 = b.elem[6], b7 = b.elem[7];
        const b8 = b.elem[8], b9 = b.elem[9], b10 = b.elem[10], b11 = b.elem[11];
        const b12 = b.elem[12], b13 = b.elem[13], b14 = b.elem[14], b15 = b.elem[15];

        return new Mat4(
            b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30,
            b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31,
            b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32,
            b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33,
            b4 * a00 + b5 * a10 + b6 * a20 + b7 * a30,
            b4 * a01 + b5 * a11 + b6 * a21 + b7 * a31,
            b4 * a02 + b5 * a12 + b6 * a22 + b7 * a32,
            b4 * a03 + b5 * a13 + b6 * a23 + b7 * a33,
            b8 * a00 + b9 * a10 + b10 * a20 + b11 * a30,
            b8 * a01 + b9 * a11 + b10 * a21 + b11 * a31,
            b8 * a02 + b9 * a12 + b10 * a22 + b11 * a32,
            b8 * a03 + b9 * a13 + b10 * a23 + b11 * a33,
            b12 * a00 + b13 * a10 + b14 * a20 + b15 * a30,
            b12 * a01 + b13 * a11 + b14 * a21 + b15 * a31,
            b12 * a02 + b13 * a12 + b14 * a22 + b15 * a32,
            b12 * a03 + b13 * a13 + b14 * a23 + b15 * a33
        );
    }

    /**
     *
     * @param {Mat4} a
     * @param {Mat4} b
     * @param {Mat4} out
     */
    static prodOut(a, b, out) {
        const a00 = a.elem[0], a01 = a.elem[1], a02 = a.elem[2], a03 = a.elem[3];
        const a10 = a.elem[4], a11 = a.elem[5], a12 = a.elem[6], a13 = a.elem[7];
        const a20 = a.elem[8], a21 = a.elem[9], a22 = a.elem[10], a23 = a.elem[11];
        const a30 = a.elem[12], a31 = a.elem[13], a32 = a.elem[14], a33 = a.elem[15];

        let b0 = b.elem[0], b1 = b.elem[1], b2 = b.elem[2], b3 = b.elem[3];
        out.elem[0] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
        out.elem[1] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
        out.elem[2] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
        out.elem[3] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;

        b0 = b.elem[4]; b1 = b.elem[5]; b2 = b.elem[6]; b3 = b.elem[7];
        out.elem[4] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
        out.elem[5] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
        out.elem[6] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
        out.elem[7] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;

        b0 = b.elem[8]; b1 = b.elem[9]; b2 = b.elem[10]; b3 = b.elem[11];
        out.elem[8] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
        out.elem[9] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
        out.elem[10] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
        out.elem[11] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;

        b0 = b.elem[12]; b1 = b.elem[13]; b2 = b.elem[14]; b3 = b.elem[15];
        out.elem[12] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
        out.elem[13] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
        out.elem[14] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
        out.elem[15] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
    }

    /**
     *
     * @param {Mat4} m
     * @returns {Boolean}
     */
    eq(m) {
        return this.elem[0] === m.elem[0] && this.elem[1] === m.elem[1] &&
            this.elem[2] === m.elem[2] && this.elem[3] === m.elem[3] &&
            this.elem[4] === m.elem[4] && this.elem[5] === m.elem[5] &&
            this.elem[6] === m.elem[6] && this.elem[7] === m.elem[7] &&
            this.elem[8] === m.elem[8] && this.elem[9] === m.elem[9] &&
            this.elem[10] === m.elem[10] && this.elem[11] === m.elem[11] &&
            this.elem[12] === m.elem[12] && this.elem[13] === m.elem[13] &&
            this.elem[14] === m.elem[14] && this.elem[15] === m.elem[15];
    }

    isIdentity() {
        return this.elem[0] === 1 && this.elem[1] === 0 &&
            this.elem[2] === 0 && this.elem[3] === 0 &&
            this.elem[4] === 0 && this.elem[5] === 1 &&
            this.elem[6] === 0 && this.elem[7] === 0 &&
            this.elem[8] === 0 && this.elem[9] === 0 &&
            this.elem[10] === 1 && this.elem[11] === 0 &&
            this.elem[12] === 0 && this.elem[13] === 0 &&
            this.elem[14] === 0 && this.elem[15] === 1
    }

    /**
     *
     * @param {Mat4} a
     * @param {Mat4} b
     * @returns {Boolean}
     */
    static eq(a, b) {
        return a.elem[0] === b.elem[0] && a.elem[1] === b.elem[1] &&
            a.elem[2] === b.elem[2] && a.elem[3] === b.elem[3] &&
            a.elem[4] === b.elem[4] && a.elem[5] === b.elem[5] &&
            a.elem[6] === b.elem[6] && a.elem[7] === b.elem[7] &&
            a.elem[8] === b.elem[8] && a.elem[9] === b.elem[9] &&
            a.elem[10] === b.elem[10] && a.elem[11] === b.elem[11] &&
            a.elem[12] === b.elem[12] && a.elem[13] === b.elem[13] &&
            a.elem[14] === b.elem[14] && a.elem[15] === b.elem[15];
    }

    static get IDENTITY() {
        return new Mat4(1, 0, 0, 0,
                        0, 1, 0, 0,
                        0, 0, 1, 0,
                        0, 0, 0, 1);
    }

    toString() {
        return `[ [${this.elem[0]}, ${this.elem[4]}, ${this.elem[8]}, ${this.elem[12]}]\n` +
            `  [${this.elem[1]}, ${this.elem[5]}, ${this.elem[9]}, ${this.elem[13]}]\n` +
            `  [${this.elem[2]}, ${this.elem[6]}, ${this.elem[10]}, ${this.elem[14]}]\n` +
            `  [${this.elem[3]}, ${this.elem[7]}, ${this.elem[11]}, ${this.elem[15]}] ]`;
    }
}
