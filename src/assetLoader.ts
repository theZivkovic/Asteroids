import { Assets, Texture, TextureSource } from "pixi.js";

enum AssetId {
    BIG_VUCIC = "BIG_VUCIC",
}

class AssetLoader {

    private assetIdToFilePath = new Map<AssetId, string>();
    private assetIdToTexture = new Map<AssetId, Texture<TextureSource<any>>>();

    constructor() {
        this.assetIdToFilePath.set(AssetId.BIG_VUCIC, 'assets/asteroids/big_vucic.png');
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

