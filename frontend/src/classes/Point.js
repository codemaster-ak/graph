class Point {
    constructor(x, y, key, colour = '#1890ff') {
        this.key = typeof key === 'string' ? key : String(key)
        this.x = x
        this.y = y
        this.colour = colour
    }
}

export default Point;