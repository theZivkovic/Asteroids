import { sound } from '@pixi/sound';

enum SoundId {
    SLAP = "SLAP",
    BLASTER = "BLASTER"
}

class SoundLoader {

    private soundToFilePath = new Map<SoundId, string>();

    constructor() {
        this.soundToFilePath.set(SoundId.SLAP, 'assets/sounds/cartoon-slap-2-189831.mp3');
        this.soundToFilePath.set(SoundId.BLASTER, 'assets/sounds/blaster-2-81267.mp3');
    }

    async loadAll() {
        [...this.soundToFilePath.entries()].forEach(([soundId, path]) => {
            sound.add(soundId, path);
        }
        );
    }

    playSound(soundId: SoundId) {
        sound.play(soundId);
    }
}

const soundLoader = new SoundLoader();
export { soundLoader, SoundId };

