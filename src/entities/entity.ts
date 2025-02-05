export default class Entity {

    private id: number;
    private static nextId: number = 0;

    constructor(id: number) {
        this.id = id;
    }

    getId() {
        return this.id;
    }

    static generateNextId() {
        const nextId = this.nextId + 1;
        this.nextId++;
        return nextId;
    }
}