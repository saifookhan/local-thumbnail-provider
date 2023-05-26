"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
    constructor(storage) {
        this.storage = storage;
    }
    getThumbUrl(id, format) {
        return __awaiter(this, void 0, void 0, function* () {
            const exists = yield this.storage.exists(id);
            if (!exists)
                return null;
            const ext = path_1.default.extname(id);
            const dirname = path_1.default.dirname(id);
            const basename = path_1.default.basename(id, ext);
            const thumbId = `${dirname}/${basename}.thumb.${format}${ext}`;
            const url = this.storage.getUrl(thumbId);
            const thumbExists = yield this.storage.exists(thumbId);
            if (thumbExists)
                return url;
            yield this.createThumb(id, thumbId, format);
            return url;
        });
    }
    createThumb(id, thumbId, format) {
        return __awaiter(this, void 0, void 0, function* () {
            const ext = path_1.default.extname(id);
            if (ext === ".svg") {
                yield this.storage.store(thumbId, this.storage.retrieve(id));
            }
            else {
                const tmpSrc = yield (0, temp_write_1.default)(this.storage.retrieve(id));
                const tmpDest = tempy_1.default.file();
                yield this.resize(tmpSrc, tmpDest, ThumbnailProvider_1.formats[format]);
                yield this.storage.store(thumbId, fs_extra_1.default.createReadStream(tmpDest));
                yield fs_extra_1.default.remove(tmpSrc);
                yield fs_extra_1.default.remove(tmpDest);
            }
        });
    }
    resize(src, dest, size) {
        return __awaiter(this, void 0, void 0, function* () {
            const { width, height, crop } = size;
            if (crop) {
                const { topCrop } = yield smartcrop_sharp_1.default.crop(src, { width, height });
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
        });
    }
}
exports.default = LocalThumbnailProvider;
//# sourceMappingURL=LocalThumbnailProvider.js.map