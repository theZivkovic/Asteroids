import { Assets, Texture, TextureSource } from "pixi.js";

enum TextureId {
    HAND = 'HAND',
    ASTEROID = "ASTEROID"
}

class TextureLoader {

    private assetIdToFilePath = new Map<TextureId, string>();
    private assetIdToTexture = new Map<TextureId, Texture<TextureSource<any>>>();

    constructor() {
        this.assetIdToFilePath.set(TextureId.ASTEROID, 'assets/asteroids/asteroid.png');
        this.assetIdToFilePath.set(TextureId.HAND, 'assets/hand.png');
    }

    async loadAll() {
        const assetsAndTextures = await Promise.all([...this
            .assetIdToFilePath.entries()]
            .map(async ([assetId, filePath]) => {
                return [assetId, await Assets.load(filePath)];
            })
        ) as Array<[TextureId, Texture]>;
        this.assetIdToTexture = new Map(assetsAndTextures.map(obj => [obj[0], obj[1]]));
    }

    getTexture(assetId: TextureId) {
        return this.assetIdToTexture.get(assetId);
    }
}

const textureLoader = new TextureLoader();
export { textureLoader, TextureId };

