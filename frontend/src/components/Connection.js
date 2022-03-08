class Connection {
    from;
    to;
    weight;
    colour;

    constructor(from, to, weight, colour = 'black') {
        this.from = from
        this.to = to
        this.weight = weight
        this.colour = colour
    }
}

export default Connection;