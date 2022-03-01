import { GeoCoordinates, BoulderImage } from "types";
import { v4 } from "uuid";

export const fontainebleauLocation: GeoCoordinates = [2.697569, 48.399065];

export const topogetherUrl = 'https://builder.topogether.com';// import.meta.env.VITE_TOPOGETHER_URL,
export const staticUrl = {
  logo_color: `/assets/img/Logo_green_topogether.png`,
  logo_black: `/assets/images/Logo_black_topogether.png`,
  logo_white: `/assets/images/Logo_white_topogether.png`,
  illuLogin: `${topogetherUrl}/assets/images/illustrations/login_background topogether climbing boulder.png`,
  illu404: `${topogetherUrl}/assets/images/illustrations/Error 404 Topogether climbing escalade Fontainebleau topo.png`,
  defaultProfilePicture: `/assets/img/Default_profile_picture.png`,
  defaultKayoo: `/assets/img/Kayoo_defaut_image.png`,
  deleteWarning: `/assets/img/Warning delete topogether boulder escalade topo.png`,
};

export const defaultImage: BoulderImage = {
  id: v4(),
  url: staticUrl.defaultKayoo,
  width: 501,
  height: 501
}