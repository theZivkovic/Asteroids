import { TextureId } from "./textureLoader";

class AsteroidImageNode {
    children: Array<AsteroidImageNode> = null!;
    textureId: TextureId = null!;
    level: number;

    private constructor(level: number, textureId: TextureId, children: Array<AsteroidImageNode>) {
        this.textureId = textureId;
        this.children = children;
        this.level = level;
    }

    static fromJson(level: number, obj: any): AsteroidImageNode {
        const objKeys = Object.keys(obj);
        if (objKeys.length > 1) {
            throw new Error(`Only on root key allowed, found more: ${objKeys.length}`)
        }
        const rootKey = objKeys[0] as TextureId;
        const newNode = new AsteroidImageNode(level, rootKey, []);

        const nextLevelObjects = obj[rootKey];
        Object.keys(nextLevelObjects).forEach(nextLevelKey => {
            const objToTraverse: any = {
                [nextLevelKey]: nextLevelObjects[nextLevelKey]
            };
            newNode.addChild(AsteroidImageNode.fromJson(level + 1, objToTraverse))
        });

        return newNode;
    }

    private addChild(child: AsteroidImageNode) {
        this.children.push(child);
    }
}

class AsteroidImageHierarchy {
    root: AsteroidImageNode;

    private constructor(root: AsteroidImageNode) {
        this.root = root;
    }

    static fromJson(obj: any) {
        return new AsteroidImageHierarchy(AsteroidImageNode.fromJson(0, obj));
    }

    getRootTexture(): TextureId {
        return this.root.textureId;
    }

    getRandomTextureOnLevel(level: number) {
        if (level == 2) {
            return this.root.textureId;
        }
        if (level == 1) {
            return this.root.children[Math.floor(Math.random() * this.root.children.length)].textureId;
        }
        if (level == 0) {
            const flatChildren = this.root.children.flatMap(x => x.children);
            return flatChildren[Math.floor(Math.random() * flatChildren.length)].textureId;
        }
    }

    getRandomNextLevelTexture(textureId: TextureId) {
        let node = this.root;

        let breakWhile = false;
        while (true) {
            if (node.textureId == textureId) {
                break;
            }
            for (const childNode of node.children) {
                if (childNode.textureId == textureId) {
                    node = childNode;
                    breakWhile = true;
                    break;
                }
            }
            if (breakWhile) {
                break;
            }
        }

        if (node.children.length == 0) {
            return null;
        }

        const randomIndex = Math.floor(node.children.length * Math.random());
        return node.children[randomIndex].textureId;
    }
}

export { AsteroidImageHierarchy, AsteroidImageNode }