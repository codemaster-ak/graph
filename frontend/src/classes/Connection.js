class Connection {
    constructor(from, to, weight, colour = 'black', key) {
        this.from = from
        this.to = to
        this.weight = weight
        this.colour = colour
        this.key = typeof key === 'string' ? key : String(key)
    }
}

export default Connection;