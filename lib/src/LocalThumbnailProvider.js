"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_extra_1 = __importDefault(require("fs-extra"));
const tempy_1 = __importDefault(require("tempy"));
const sharp_1 = __importDefault(require("sharp"));
const smartcrop_sharp_1 = __importDefault(require("smartcrop-sharp"));
const temp_write_1 = __importDefault(require("temp-write"));
const path_1 = __importDefault(require("path"));
const ThumbnailProvider_1 = require("./ThumbnailProvider");
class LocalThumbnailProvider {
    storage;
    constructor(storage) {
        this.storage = storage;
    }
    async getThumbUrl(id, format) {
        const exists = await this.storage.exists(id);
        if (!exists)
            return null;
        const ext = path_1.default.extname(id);
        const dirname = path_1.default.dirname(id);
        const basename = path_1.default.basename(id, ext);
        const thumbId = `${dirname}/${basename}.thumb.${format}${ext}`;
        const url = this.storage.getUrl(thumbId);
        const thumbExists = await this.storage.exists(thumbId);
        if (thumbExists)
            return url;
        await this.createThumb(id, thumbId, format);
        return url;
    }
    async createThumb(id, thumbId, format) {
        const ext = path_1.default.extname(id);
        if (ext === ".svg") {
            await this.storage.store(thumbId, this.storage.retrieve(id));
        }
        else {
            const tmpSrc = await (0, temp_write_1.default)(this.storage.retrieve(id));
            const tmpDest = tempy_1.default.file();
            await this.resize(tmpSrc, tmpDest, ThumbnailProvider_1.formats[format]);
            await this.storage.store(thumbId, fs_extra_1.default.createReadStream(tmpDest));
            await fs_extra_1.default.remove(tmpSrc);
            await fs_extra_1.default.remove(tmpDest);
        }
    }
    async resize(src, dest, size) {
        const { width, height, crop } = size;
        if (crop) {
            const { topCrop } = await smartcrop_sharp_1.default.crop(src, { width, height });
            return (0, sharp_1.default)(src)
                .extract({
                width: topCrop.width,
                height: topCrop.height,
                left: topCrop.x,
                top: topCrop.y
            })
                .resize(width, height)
                .toFile(dest);
        }
        else {
            return (0, sharp_1.default)(src)
                .resize(width, height, { fit: "inside" })
                .toFile(dest);
        }
    }
}
exports.default = LocalThumbnailProvider;
//# sourceMappingURL=LocalThumbnailProvider.js.map