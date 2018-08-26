export enum Images {
    BODY = 'res/body.png',
    BODY_HOLDING = 'res/body-holding.png',
    HEAD = 'res/head.png',
    KEY = 'res/goldenkey.png',
}

export const ImagesLoaded: {[id in keyof typeof Images]: HTMLImageElement} = {
    BODY: new Image(),
    BODY_HOLDING: new Image(),
    HEAD: new Image(),
    KEY: new Image(),
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