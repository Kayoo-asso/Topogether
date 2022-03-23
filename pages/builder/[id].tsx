import React from 'react';
import type { GetServerSideProps, NextPage } from 'next';
import { useRouter } from 'next/router';
import { api } from 'helpers/services';
import { useAsyncData } from 'helpers/hooks/useAsyncData';
import { Quark, watchDependencies } from 'helpers/quarky';
import { isUUID, Topo, TopoData } from 'types';
import { Error404, Header, Loading, RootBuilder } from 'components';
import { editTopo, quarkifyTopo } from 'helpers';

type BuilderProps = {
  topo: TopoData
}

export const getServerSideProps: GetServerSideProps<BuilderProps> = async (context) => {
  const { id } = context.query;

  if (typeof id === "string" && isUUID(id)) {
    console.log("Fetching topo " + id);
    const topo = await api.getTopo(id);
    if (topo !== null) {
      return { props: { topo } };
    }
  }

  return {
    redirect: {
      destination: '/',
      permanent: false
    }
  };
}

const BuilderMapPage: NextPage<BuilderProps> = watchDependencies(({ topo }) => {
  const router = useRouter();
  // const id = router.query.id?.toString();
  // if (typeof window !== "undefined" && !id || !isUUID(id)) {
  //   router.push('/');
  //   return null;
  // }

  const session = api.user();
  if (!session) {
    // router.push('/');
    return null;
  }

  const quark = editTopo(topo);
  return <RootBuilder topoQuark={quark} user={session} />

  // const topoQuery = useAsyncData(() => api.getTopo(id), [id]);

  // ERROR
  // if (topoQuery.type === 'error') { router.push('/'); return null; }

  //LOADING
  // else if (topoQuery.type === 'loading') 
  //   return (
  //     <>
  //       <Header
  //         title="Chargement du topo..."
  //         backLink='/'
  //       />
  //       <Loading />
  //     </>
  //   )

  // // SUCCESS
  // else {
  //   // BUT NO DATA...
  //   if (!topoQuery.data) return <Error404 title="Topo introuvable" />
  //   else {
  //     const topoQuark: Quark<Topo> = editTopo(topoQuery.data);
  //     return (
  //       <RootBuilder 
  //         topoQuark={topoQuark}
  //         user={session}
  //       />
  //     );
  //   }
  // }
});

export default BuilderMapPage;
