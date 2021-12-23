import type { NextPage } from 'next';
import { TopoDesktop, TopoMobile } from 'components';
import { useRouter } from 'next/router';
import { isDesktop, isMobile } from 'react-device-detect';
import { useState } from 'react';
import { Topo } from 'types';

const Topo: NextPage = () => {
  const router = useRouter();
  const { id } = router.query;
  if (typeof id !== 'string') return null;

  const [topo, setTopo] = useState<Topo>();
  
  return (
    <>
      {isMobile && topo &&
        <TopoMobile
          topo={topo}
        />
      }
      {isDesktop && topo &&
        <TopoDesktop
          topo={topo}
        />
      }
    </>
  )
};

export default Topo;
