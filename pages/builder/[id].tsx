import React from 'react';
import type { NextPage } from 'next';
import NextImage from 'next/image';
import { useRouter } from 'next/router';
import { api } from 'helpers/services/ApiService';
import { useAsyncData } from 'helpers/hooks/useAsyncData';
import { watchDependencies } from 'helpers/quarky';
import { isUUID } from 'types';
import { Header, Loading, RootBuilder } from 'components';
import { quarkifyTopo } from 'helpers';
import Link from 'next/link';

export async function getServerSideProps() {
  const data = {};
  return { props: { data } }
}

const BuilderMapPage: NextPage = watchDependencies(() => {
  const router = useRouter();
  const id = router.query.id?.toString();
  if (!id || !isUUID(id)) { () => router.push('/'); return null; }

  const session = api.user();
  if (!session) { () => router.push('/'); return null; }

  const topoQuery = useAsyncData(() => api.getTopo2(id), [id]);

  // ERROR
  if (topoQuery.type === 'error') { router.push('/'); return null; }

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
        <RootBuilder 
          topoQuark={topoQuark}
          user={session}
        />
      );
    }
  }
});

export default BuilderMapPage;
