

export class AssetManager {
    private static AssetMap = new Map<string, Map<string, unknown>>([
        ['img', new Map<string, HTMLImageElement>()],
        ['sound', new Map<string, HTMLAudioElement>()]
    ]);

    private static readonly IOSrc = 'https://iceriny.github.io/XiaosuBCExpansion/'
    private static readonly suffix = DEBUG ? 'dev' : 'main'
    private static readonly imgSrcList = [['image', `${this.IOSrc}/${this.suffix}/img/image.jpg`], 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQLXPRWWi8ymGpwCkgitCPziD8boYu8pa3e8g&usqp=CAU']
    private static readonly soundSrcList = [['sound', `${this.IOSrc}/${this.suffix}/sound/sound.mp3`], ['sun', 'https://cdn.discordapp.com/attachments/1200701821811953775/1210247727313592360/Forest_Hymn.mp3?ex=65e9de07&is=65d76907&hm=e8f3c310489dcce029cd42e54c25a4b443a6e6768f6cbc3370ad53ab435d7fd2&']]


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
}