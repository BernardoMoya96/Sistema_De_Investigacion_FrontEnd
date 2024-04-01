export default class Node {

    constructor(private name: string, private children: Node[] = []) {}

    public addChild(child: Node) {
        this.children.push(child);
    }

    public getChildren(): Node[] {
        return this.children;
    }

    public getName(): string {
        return this.name;
    }
}
