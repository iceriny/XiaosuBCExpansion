import { conDebug } from "./Utilities";


/**
 * 资产管理器类，用于加载和管理游戏或应用中的图像和音频资产。
 */
export default class AssetManager {
    // 资产映射表，用于存储加载的图像和音频资产
    private static AssetMap = new Map<string, Map<string, unknown>>([
        ['img', new Map<string, HTMLImageElement>()],
        ['sound', new Map<string, HTMLAudioElement>()]
    ]);

    // 资源的基础URL
    private static readonly IOAssetSrc = 'https://iceriny.github.io/XiaosuBCExpansion'
    // 根据DEBUG标志决定资源的后缀
    private static readonly suffix = DEBUG ? 'dev' : 'main'
    // 图像资源列表
    private static readonly imgSrcMap: Map<string, string> = new Map<string, string>([
        ['logo', `${this.IOAssetSrc}/${this.suffix}/Assets/Img/logo.png`]
    ])
    // 音频资源列表
    private static readonly soundSrcMap: Map<string, string> = new Map<string, string>([
        ['heartbeat', `${this.IOAssetSrc}/${this.suffix}/Assets/Audio/heartbeat.mp3`],
        ['clock', `${this.IOAssetSrc}/${this.suffix}/Assets/Audio/clock.mp3`],
        ['snapFingers', `${this.IOAssetSrc}/${this.suffix}/Assets/Audio/snapFingers.mp3`],
        ['faultSound', `${this.IOAssetSrc}/${this.suffix}/Assets/Audio/faultSound.mp3`],
        ['sleep', `${this.IOAssetSrc}/${this.suffix}/Assets/Audio/sleep.mp3`]
    ])

    /**
     * 缓存图像资源。
     * @param src 图像的源URL
     * @param name 图像的名称
     * @returns 创建的HTMLImageElement对象
     */
    private static cacheImg(src: string, name: string): HTMLImageElement {
        const img = new Image();
        img.src = src;
        img.onload = () => {
            this.AssetMap.get('img')!.set(name, img);
        }
        return img;
    }

    /**
     * 缓存音频资源。
     * @param src 音频的源URL
     * @param name 音频的名称
     * @returns 创建的HTMLAudioElement对象
     */
    private static cacheSound(src: string, name: string): HTMLAudioElement {
        const audio = new Audio();
        audio.src = src;
        audio.load();
        this.AssetMap.get('sound')!.set(name, audio);
        return audio;
    }

    /**
     * 预加载所有指定的图像和音频资产。
     */
    public static cacheAssets(): void {
        for (const src of AssetManager.imgSrcMap) {
            this.cacheImg(src[1], src[0]);
        }
        for (const src of AssetManager.soundSrcMap) {
            this.cacheSound(src[1], src[0]);
        }
    }

    /**
     * 根据名称和类型获取资产。
     * @param name 资产的名称
     * @param type 资产的类型（'img' 或 'sound'）
     * @returns 指定名称和类型的资产，如果未找到则返回undefined
     */
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

    /**
     * 根据名称获取图像资产。
     * @param name 图像的名称
     * @returns 对应的HTMLImageElement对象，如果未找到则返回undefined
     */
    public static GatImg(name: string): HTMLImageElement {
        const img = this.AssetMap.get('img')!.get(name) as HTMLImageElement | undefined;
        if (img) return img;
        else throw new Error(`未找到图像资源: ${name}`)
    }

    public static GetImgSrc(name: string): string {
        const src = this.imgSrcMap.get(name)
        if (src) return src;
        else throw new Error(`未找到图像资源: ${name}`)
    }

    /**
     * 播放指定名称的音频。
     * @param name 音频的名称
     * @param volume 音量，默认为1（如果可用）
     */
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
    /**
     * 播放原始音频文件。
     * @param name 音频文件的名称（不带扩展名）
     * @param volume 音量，默认为1（如果可用）
     */
    public static PlayerOriginalAudio(name: string, volume?: number): void {
        AudioPlayInstantSound(`Audio/${name}.mp3`, volume)
    }
}