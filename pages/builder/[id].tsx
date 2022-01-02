import React, { useContext } from 'react';
import type { NextPage } from 'next';
import { BuilderMapDesktop, BuilderMapMobile } from 'components';
import { isDesktop, isMobile } from 'react-device-detect';
import { useRouter } from 'next/router';
import { UserContext } from 'helpers';
import { quarkTopo } from 'helpers/fakeData/fakeTopoV2';

const BuilderMapPage: NextPage = () => {
  const { session } = useContext(UserContext);
  if (!session) return (<></>);

  const router = useRouter();
  const { id } = router.query;
  if (typeof id !== 'string') return null;

  const topoQuark = quarkTopo;

  return (
    <>
      {isMobile
                && (
                <BuilderMapMobile
                  topo={topoQuark}
                />
                )}
      {isDesktop
                && (
                <BuilderMapDesktop
                  topo={topoQuark}
                />
                )}
    </>
  );
};

export default BuilderMapPage;
