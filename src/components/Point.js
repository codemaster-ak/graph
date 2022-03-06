class Point {
    key;
    x;
    y;
    colour;

    constructor(x, y, key, colour = 'green') {
        this.key = key
        this.x = x
        this.y = y
        this.colour = colour
    }
}

export default Point;