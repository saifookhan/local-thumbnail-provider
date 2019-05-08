# @cotype/local-thumbnail-provider

`npm i @cotype/local-thumbnail-provider`

```ts
import LocalThumbnailProvider from "@cotype/local-thumbnail-provider";
import { init, FsStorage /* ... */ } from "@cotype/core";

const storage = new FsStorage("./uploads");

init({
  thumbnailProvider: new LocalThumbnailProvider(storage),
  storage
  /* ... */
});
```

# License

MIT
