import React from 'react';
import type { GetServerSideProps, NextPage } from 'next';
import { api } from 'helpers/services';
import { watchDependencies } from 'helpers/quarky';
import { isUUID, Session, TopoData, User } from 'types';
import { RootBuilder } from 'components';
import { editTopo} from 'helpers';
import { getServerSession } from 'helpers/getServerSession';
import { returnTo } from 'pages/user/login';

type BuilderProps = {
  topo: TopoData,
  session: Session
}

const redirect = (destination: string) => ({
  redirect: {
    destination,
    permanent: false
  }
});

// TODO: check the user is a contributor of the topo

export const getServerSideProps: GetServerSideProps<BuilderProps> = async ({ req, query, res }) => {
  const { id } = query;
  if (typeof id !== "string" || !isUUID(id)) {
    console.log(`Invalid id ${id} on builder page. isUUID=${isUUID(typeof id === "string" ? id : '')}`)
    return redirect("/");
  }

  const [topo, session] = await Promise.all([
    api.getTopo(id),
    getServerSession(req)
  ]);

  if (!session) {
    console.log("Redirecting to login from builder")
    return redirect(
      `/user/login?${returnTo}=${encodeURIComponent(`/builder/${id}`)}`
    );
  }

  if (!topo) {
    return redirect("/404");
  }

  return { props: { topo, session } };
}

const BuilderMapPage: NextPage<BuilderProps> = watchDependencies(({ topo, session }) => {
  // const router = useRouter();
  // // const id = router.query.id?.toString();
  // // if (typeof window !== "undefined" && !id || !isUUID(id)) {
  // //   router.push('/');
  // //   return null;
  // // }

  // const session = auth.session();
  // if (!session) {
  //   // router.push('/');
  //   return null;
  // }

  const quark = editTopo(topo);
  return <RootBuilder topoQuark={quark} session={session} />

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
