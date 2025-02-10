import { Assets, Texture, TextureSource } from "pixi.js";

enum AssetId {
    HAND = 'HAND',
    ASTEROID = "ASTEROID",
    BIG_VUCIC = "BIG_VUCIC",
    MEDIUM_BRNABIC = "MEDIUM_BRNABIC",
    SMALL_SAPIC = "SMALL_SAPIC"
}

class AssetLoader {

    private assetIdToFilePath = new Map<AssetId, string>();
    private assetIdToTexture = new Map<AssetId, Texture<TextureSource<any>>>();

    constructor() {
        // this.assetIdToFilePath.set(AssetId.BIG_VUCIC, 'assets/asteroids/big_vucic.png');
        // this.assetIdToFilePath.set(AssetId.MEDIUM_BRNABIC, 'assets/asteroids/medium_brnabic.png')
        // this.assetIdToFilePath.set(AssetId.SMALL_SAPIC, 'assets/asteroids/small_sapic.png')
        this.assetIdToFilePath.set(AssetId.ASTEROID, 'assets/asteroids/asteroid.png')
        this.assetIdToFilePath.set(AssetId.HAND, 'assets/hand.png');
    }

    async loadAll() {
        const assetsAndTextures = await Promise.all([...this
            .assetIdToFilePath.entries()]
            .map(async ([assetId, filePath]) => {
                return [assetId, await Assets.load(filePath)];
            })
        ) as Array<[AssetId, Texture]>;
        this.assetIdToTexture = new Map(assetsAndTextures.map(obj => [obj[0], obj[1]]));
    }

    getTexture(assetId: AssetId) {
        return this.assetIdToTexture.get(assetId);
    }
}

const assetLoader = new AssetLoader();
export { assetLoader, AssetId };

