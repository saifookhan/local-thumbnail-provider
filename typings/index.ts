export interface ThumbnailProvider {
  getThumbUrl(id: string, format: string): Promise<string | null>;
}

export type ThumbnailSize = {
  width: number;
  height: number;
  crop: boolean;
};

export interface Storage {
  store(id: string, stream: NodeJS.ReadableStream): Promise<number>;
  retrieve(id: string): NodeJS.ReadableStream;
  getUrl(id: string): string;
  exists(id: string): Promise<boolean>;
  remove(id: string): Promise<void>;
}
