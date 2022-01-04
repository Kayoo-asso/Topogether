import React, { useState } from 'react';
import type { NextPage } from 'next';
import { TopoDesktop, TopoMobile } from 'components';
import { useRouter } from 'next/router';
import { isDesktop, isMobile } from 'react-device-detect';
import { TopoData } from 'types';
import { fakeTopo } from 'helpers/fakeData/fakeTopo';

const Topo: NextPage = () => {
  const router = useRouter();
  const { id } = router.query;
  // if (typeof id !== 'string') return null;

  const [topo, setTopo] = useState<TopoData>(fakeTopo);

  return (
    <>
      {isMobile && topo
        && (
        <TopoMobile
          topo={topo}
        />
        )}
      {isDesktop && topo
        && (
        <TopoDesktop
          topo={topo}
        />
        )}
    </>
  );
};

export default TopoData;
