export enum Images {
    BODY = 'res/body.png',
    BODY_HOLDING = 'res/body-holding.png',
    HEAD = 'res/head.png',
    KEY = 'res/goldenkey.png',
    CHEST = 'res/treasure-chest.png',
    RESET_BUTTON = 'res/reset-button.png',
}

const ImagesLoaded: { [id: string]: HTMLImageElement } = {};

export function getLoadedImage(id: keyof typeof Images): HTMLImageElement {
    if (ImagesLoaded[id]) {
        return ImagesLoaded[id];
    }
    return ImagesLoaded[id] = new Image();
};

export var loadedImageSum = 0;
export const totalImageSum = Object.keys(Images).length;

export function loadAll() {
    const keys = <(keyof typeof Images)[]>Object.keys(Images);
    for (const key of keys) {
        const value: string = Images[key];
        getLoadedImage(key).onload = () => loadedImageSum += 1;
        getLoadedImage(key).src = value;
    }
}