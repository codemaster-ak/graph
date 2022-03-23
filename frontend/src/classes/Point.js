import {BASE_POINT_COLOR} from "../consts";

class Point {
    constructor(x, y, key, colour = BASE_POINT_COLOR) {
        this.key = typeof key === 'string' ? key : String(key)
        this.x = x
        this.y = y
        this.colour = colour
    }
}

export default Point;