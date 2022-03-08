export default function getMousePos(event) {
    const position = event.target.position()
    const stage = event.target.getStage()
    const pointerPosition = stage.getPointerPosition()
    return {
        x: pointerPosition.x - position.x,
        y: pointerPosition.y - position.y
    }
}