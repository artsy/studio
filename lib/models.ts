import { Isotope, IsotopeSelect, IsotopeResult } from "isotopes";

const createModel = <T extends Model>(name: string) =>
  new Isotope<T>(
    {
      domain: `artsy-studio-${name}`,
      key: "id"
    },
    {
      accessKeyId: process.env.ACCESS_KEY_ID,
      secretAccessKey: process.env.SECRET_ACCESS_KEY,
      region: process.env.REGION
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
  private model: Isotope<ImageCacheModel, ImageCacheModel, ImageCacheModel>;
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
    this.model = null;
    await this.init();
  }
  async get(id?: string) {
    await this.init();
    return this.model.get(id);
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
    ) => IsotopeSelect<ImageCacheModel>
  ): Promise<IsotopeResult<ImageCacheModel>> {
    await this.init();
    return this.model.select(callback(this.model.getQueryBuilder()));
  }
}

export const metadata = new Metadata();

export const imageCache = {
  list() {
    return metadata.select(query => query.where("`type` LIKE ?", "%image%"));
  },
  clear() {
    return this.list();
  },
  async get(id: string): Promise<string> {
    return (await metadata.get(`image-${id}`))?.imageUrl;
  },
  set(id: string, imageUrl: string) {
    return metadata.set({ id: `image-${id}`, type: "image", imageUrl });
  },
  delete(id) {
    return metadata.delete(`image-${id}`);
  }
};
