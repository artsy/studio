import { Isotope } from "isotopes";

const TEAM_NAV_IMGS = "team-nav-images";

interface Model {
  id: string;
}

const createModel = <T extends Model>(name: string) =>
  new Isotope<T>({
    domain: `artsy-studio-${name}`,
    key: "id"
  });

export interface TeamNavImageCache extends Model {
  id: typeof TEAM_NAV_IMGS;
  images: { [imageUrl: string]: string };
}

export const Metadata = createModel<TeamNavImageCache>("metadata");

const teamNavImageCacheDefault = {
  id: TEAM_NAV_IMGS,
  images: {}
} as const;

export const teamNavImageCache = {
  async get() {
    return (await Metadata.get(TEAM_NAV_IMGS)) ?? teamNavImageCacheDefault;
  },
  set(value: TeamNavImageCache) {
    return Metadata.put({ ...teamNavImageCacheDefault, ...value });
  },
  delete(names?: string[]) {
    return Metadata.delete(TEAM_NAV_IMGS, names);
  }
};
