import { Isotope, IsotopeSelect, IsotopeResult } from "isotopes";

const createModel = <T extends Model>(name: string) =>
  new Isotope<T>(
    {
      domain: `artsy-studio-${name}`,
      key: "id",
    },
    {
      accessKeyId: process.env.ACCESS_KEY_ID,
      secretAccessKey: process.env.SECRET_ACCESS_KEY,
      region: process.env.REGION,
    }
  );

export interface Model {
  id: string;
}

export interface ImageCacheModel extends Model {
  type: "image";
  imageUrl: string;
}

class Metadata {
  private model: Isotope<
    ImageCacheModel,
    ImageCacheModel,
    ImageCacheModel
  > = createModel<ImageCacheModel>("metadata");
  private init() {
    if (!this.model) {
      this.model = createModel<ImageCacheModel>("metadata");
      return this.model.create();
    }
    return this.model;
  }
  async erase() {
    await this.init();
    await this.model.destroy();
    // Free the model reference
    this.model = null as any;
    await this.init();
  }
  async get(id?: string) {
    await this.init();
    return this.model.get(id as string);
  }
  async set(data: ImageCacheModel) {
    await this.init();
    return this.model.put(data);
  }
  async delete(id: string) {
    await this.init();
    return this.model.delete(id);
  }
  async select(
    callback: (
      query: IsotopeSelect<ImageCacheModel>
    ) => IsotopeSelect<ImageCacheModel>,
    cursor?: string
  ): Promise<IsotopeResult<ImageCacheModel>> {
    await this.init();
    return this.model.select(callback(this.model.getQueryBuilder()), cursor);
  }
}

export const metadata = new Metadata();

export const imageCache = {
  async list() {
    let allItems: ImageCacheModel[] = [];
    let cursor: string | undefined;
    do {
      const { items, next } = await metadata.select(
        (query) => query.where("`type` LIKE ?", "%image%"),
        cursor
      );
      allItems = allItems.concat(items);
      cursor = next;
    } while (cursor);
    return allItems;
  },
  clear() {
    return this.list();
  },
  async get(id: string): Promise<string | undefined> {
    return (await metadata.get(`image-${id}`))?.imageUrl;
  },
  set(id: string, imageUrl: string) {
    return metadata.set({ id: `image-${id}`, type: "image", imageUrl });
  },
  delete(id: string) {
    console.log(`Deleting... ${id}`);
    return metadata.delete(id.startsWith("image-") ? id : `image-${id}`);
  },
};
