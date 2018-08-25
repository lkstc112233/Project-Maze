export enum Images {
    BODY = 'res/body.png',
    HEAD = 'res/head.png',
}

export const ImagesLoaded: {[id in keyof typeof Images]: HTMLImageElement} = {
    BODY: new Image(),
    HEAD: new Image(),
};

export var loadedImageSum = 0;
export const totalImageSum = Object.keys(Images).length;

export function loadAll() {
    const keys = <(keyof typeof Images)[]> Object.keys(Images);
    for (const key of keys) {
        const value: string = Images[key];
        ImagesLoaded[key].src = value;
        ImagesLoaded[key].onload = () => loadedImageSum += 1;
    }
}