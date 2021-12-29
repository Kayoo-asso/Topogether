import React from 'react';
import type { NextPage } from 'next';
import { NewTopoDesktop, NewTopoMobile } from 'components';
import { isDesktop, isMobile } from 'react-device-detect';

const NewTopoPage: NextPage = () => {
  { /* TODO: add Create Topo */ }
  const createTopo = () => {};

  return (
    <>
      {isMobile
        && (
        <NewTopoMobile
          createTopo={createTopo}
        />
        )}
      {isDesktop
        && (
        <NewTopoDesktop
          createTopo={createTopo}
        />
        )}
    </>
  );
};

export default NewTopoPage;
