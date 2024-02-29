import { conDebug } from "./Utilities";


export class AssetManager {
    private static AssetMap = new Map<string, Map<string, unknown>>([
        ['img', new Map<string, HTMLImageElement>()],
        ['sound', new Map<string, HTMLAudioElement>()]
    ]);

    private static readonly IOAssetSrc = 'https://iceriny.github.io/XiaosuBCExpansion'
    private static readonly suffix = DEBUG ? 'dev' : 'main'
    private static readonly imgSrcList: string[][] = [
        ['logo', `${this.IOAssetSrc}/${this.suffix}/Assets/Img/logo.png`]
    ]
    private static readonly soundSrcList: string[][] = [
        ['heartbeat', `${this.IOAssetSrc}/${this.suffix}/Assets/Audio/heartbeat.mp3`],
        ['clock', `${this.IOAssetSrc}/${this.suffix}/Assets/Audio/clock.mp3`],
        ['snapFingers', `${this.IOAssetSrc}/${this.suffix}/Assets/Audio/snapFingers.mp3`],
        ['faultSound', `${this.IOAssetSrc}/${this.suffix}/Assets/Audio/faultSound.mp3`],
        ['sleep', `${this.IOAssetSrc}/${this.suffix}/Assets/Audio/sleep.mp3`]
    ]


    private static cacheImg(src: string, name: string): HTMLImageElement {
        const img = new Image();
        img.src = src;
        img.onload = () => {
            this.AssetMap.get('img')!.set(name, img);
        }
        return img;
    }
    private static cacheSound(src: string, name: string): HTMLAudioElement {
        const audio = new Audio();
        audio.src = src;
        audio.load();
        this.AssetMap.get('sound')!.set(name, audio);
        return audio;
    }

    public static cacheAssets(): void {
        for (const src of AssetManager.imgSrcList) {
            this.cacheImg(src[1], src[0]);
        }
        for (const src of AssetManager.soundSrcList) {
            this.cacheSound(src[1], src[0]);
        }
    }

    public static getAssets<T extends HTMLImageElement | HTMLAudioElement>(name: string, type: string): T | void {
        if (type === 'img') {
            const assetMap = this.AssetMap.get('img')!;
            const asset = assetMap.get(name) as T;
            return asset;
        }
        if (type === 'sound') {
            const assetMap = this.AssetMap.get('sound')!;
            const asset = assetMap.get(name) as T;
            return asset;
        }
    }

    public static GatImg(name: string): HTMLImageElement {
        const img = this.AssetMap.get('img')!.get(name) as HTMLImageElement;
        return img;
    }

    public static PlayAudio(name: string, volume?: number): void {
        const vol = volume != null ? volume : Player.AudioSettings?.Volume ?? 1;
        if (vol > 0) {
            const audio = this.AssetMap.get('sound')!.get(name) as HTMLAudioElement;
            audio.volume = Math.min(vol, 1);
            try {
                audio.play();
            } catch (error) {
                conDebug(`声音播放失败: ${error}   Message: ${audio.error}`)
            }
        }
    }
    public static PlayerOriginalAudio(name: string, volume?: number): void {
        AudioPlayInstantSound(`Audio/${name}.mp3`, volume)
    }
}