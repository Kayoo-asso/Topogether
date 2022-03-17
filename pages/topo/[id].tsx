import React from 'react';
import type { NextPage } from 'next';
import NextImage from 'next/image';
import { Header, Loading, RootTopo } from 'components';
import { useRouter } from 'next/router';
import { quarkifyTopo } from 'helpers';
import { isUUID, Topo } from 'types';
import { watchDependencies } from 'helpers/quarky';
import { api } from 'helpers/services/ApiService';
import { useAsyncData } from 'helpers/hooks/useAsyncData';
import Link from 'next/link';

export async function getServerSideProps() {
  const data = {};
  return { props: { data } }
}

const Topo: NextPage = watchDependencies(() => {
  const router = useRouter();
  const id = router.query.id?.toString();
  if (!id || !isUUID(id)) { () => router.push('/'); return null; }

  const topoQuery = useAsyncData(() => api.getTopo2(id), [id]);

  // ERROR
  if (topoQuery.type === 'error') { () => router.push('/'); return null; }

  //LOADING
  else if (topoQuery.type === 'loading') 
    return (
      <>
        <Header
          title="Chargement du topo..."
          backLink='/'
        />
        <Loading />
      </>
    )

  // SUCCESS
  else {
    // BUT NO DATA...
    if (!topoQuery.data) { 
      return (
        <>
          <Header
            title="Topo introuvable"
            backLink='/'
          />
          <Link href='/' passHref>
            <div className='w-full h-full relative bg-white flex items-center justify-center cursor-pointer'>
              <NextImage 
                src='/assets/img/404_error_topo_climbing.png'
                priority
                alt="Erreur 404"
                layout="fill"
                objectFit="contain"
              />
            </div>
          </Link>
        </>
      ) 
    }
    else {
      const topoQuark = quarkifyTopo(topoQuery.data);
      return (
        <RootTopo 
          topoQuark={topoQuark}
        />
      );
    }
  }
});

export default Topo;