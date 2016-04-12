/**
 * Get the inner rectangle with a specific ratio
 *
 * @param width
 * @param height
 * @returns {{}}
 */
function getInnerSize(width, height) {
    var ratio = 2;
    var currentRatio = width / height;
    var size = {};
    if (currentRatio > ratio) {
        size.height = height;
        size.width = height * ratio;
    } else {
        size.width = width;
        size.height = width / ratio;
    }
    return size;
}
export {getInnerSize}