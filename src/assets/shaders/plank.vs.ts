export const plankVS = `
    attribute vec2 instanceSize;
    attribute vec3 instancePosition;
    attribute vec4 instanceRotation;

    varying vec2 vUv;

    // Функция для преобразования кватерниона в матрицу вращения
    mat3 fromQuat(vec4 q) {
        float x2 = q.x * q.x;
        float y2 = q.y * q.y;
        float z2 = q.z * q.z;
        float xy = q.x * q.y;
        float xz = q.x * q.z;
        float yz = q.y * q.z;
        float wx = q.w * q.x;
        float wy = q.w * q.y;
        float wz = q.w * q.z;

        return mat3(
            1.0 - 2.0 * (y2 + z2), 2.0 * (xy - wz), 2.0 * (xz + wy),
            2.0 * (xy + wz), 1.0 - 2.0 * (x2 + z2), 2.0 * (yz - wx),
            2.0 * (xz - wy), 2.0 * (yz + wx), 1.0 - 2.0 * (x2 + y2)
        );
    }

    void main() {
        vUv = uv;

        // Масштабируем вершину по размерам плашки
        vec3 transformed = position * vec3(instanceSize.x, instanceSize.y, 1.0);

        // Применяем вращение через кватернион
        mat3 rotationMatrix = fromQuat(instanceRotation);
        transformed = rotationMatrix * transformed;

        // Перемещаем в позицию
        transformed += instancePosition;

        gl_Position = projectionMatrix * modelViewMatrix * vec4(transformed, 1.0);
    }
`
