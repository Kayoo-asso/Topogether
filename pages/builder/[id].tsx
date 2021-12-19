import type { NextPage } from 'next';
import { BuilderMapDesktop, BuilderMapMobile } from 'components';
import { isDesktop, isMobile } from 'react-device-detect';
import { useRouter } from 'next/router';

const BuilderMapPage: NextPage = () => {
  const router = useRouter();
  const { topoCleanId } = router.query;

  if (typeof topoCleanId !== 'string') return null;
  return (
    <>
      {isMobile && <BuilderMapMobile />}
      {isDesktop && <BuilderMapDesktop />}
    </>
  );
};

export default BuilderMapPage;
