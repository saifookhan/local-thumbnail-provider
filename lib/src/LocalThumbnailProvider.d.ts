import sharp from "sharp";
import { ThumbnailProvider, ThumbnailSize, Storage } from "../typings";
import { formats } from "./ThumbnailProvider";
export default class LocalThumbnailProvider implements ThumbnailProvider {
    storage: Storage;
    constructor(storage: Storage);
    getThumbUrl(id: string, format: keyof typeof formats): Promise<string>;
    createThumb(id: string, thumbId: string, format: keyof typeof formats): Promise<void>;
    resize(src: string, dest: string, size: ThumbnailSize): Promise<sharp.OutputInfo>;
}
