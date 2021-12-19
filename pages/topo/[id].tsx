import type { NextPage } from 'next';
import { TopoDesktop, TopoMobile } from 'components';
import { useRouter } from 'next/router';
import { isDesktop, isMobile } from 'react-device-detect';

const Topo: NextPage = () => {
  const router = useRouter();
  const { id } = router.query;

  if (typeof id !== 'string') return null;
  return (
    <>
      {isMobile &&
        <TopoMobile />
      }
      {isDesktop &&
        <TopoDesktop />
      }
    </>
  )
};

export default Topo;
