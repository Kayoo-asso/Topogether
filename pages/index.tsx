import type { NextPage } from 'next';
import {
  Icon, ImageButton, ImageInput, ImageThumb,
} from '../components';

const Map: NextPage = () => (
  <div className="bg-grey-light w-screen h-screen">
    <ImageThumb
      deletable
      image={{
        id: 1,
        url: 'https://image-component.nextjs.gallery/_next/image?url=%2Fdog.jpg&w=750&q=75',
      }}
    />
  </div>
);

export default Map;
