import { Wrapper } from '@googlemaps/react-wrapper';
import {
  Button,
  Checkbox, Dropdown, GradeCircle, MapComponent, MobileHeader,
} from 'components';
import { fontainebleauLocation } from 'const/global';
import type { NextPage } from 'next';
import { useState } from 'react';

const Map: NextPage = () => {
  const [test, setTest] = useState(true);
  return (
    <div className="flex flex-col h-full">

      <MobileHeader
        title="La meilleure app du monde"
        menu={[]}
        onBackClick={() => {}}
      />

      <div className="flex-1 h-full">
        <Wrapper
          apiKey="AIzaSyDoHIGgvyVVi_1_6zVWD4AOQPfHWN7zSkU"
          callback={(e) => console.log(e)}
        >
          <MapComponent
            center={fontainebleauLocation}
            zoom={8}
          />
        </Wrapper>
      </div>

    </div>
  );
};

export default Map;
