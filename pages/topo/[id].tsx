import React, { useEffect } from 'react';
import type { GetServerSideProps, NextPage } from 'next';
import { RootTopo } from 'components';
import { editTopo, decodeUUID, useLoader } from 'helpers';
import { isUUID, TopoData } from 'types';
import { api } from 'helpers/services';
import { useRouter } from 'next/router';
import { useQuery } from 'react-query';

// type TopoProps = {
//   topo: TopoData,
// }

// const redirect = (destination: string) => ({
//   redirect: {
//     destination,
//     permanent: false
//   }
// });

// export const getServerSideProps: GetServerSideProps = async ({ query }) => {
//   const { id } = query;
//   if (typeof id !== "string") return redirect("/");

//   const expanded = decodeUUID(id);

//   if (!isUUID(expanded)) return redirect("/");

//   const topo = await api.getTopo(expanded);
  
//   if (!topo) {
//     return { notFound: true };
//   }

//   return { props: { topo } };
// }

const Topo: NextPage = ({ }) => {
  const router = useRouter();
  const [Loader, showLoader] = useLoader();
  let loader = false;

  const { id } = router.query;

  if (typeof id !== "string") {
    router.push("/404");
    showLoader();
    return <Loader />;
  }

  const uuid = decodeUUID(id);

  if (!isUUID(uuid)) {
    router.push("/404");
    showLoader();
    return <Loader />;
  }

  const { data: topo, isError, isLoading } = useQuery(['topo', uuid], () => {
    return api.getTopo(uuid)
  }, {
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  });

  if (isError) {
    router.push("/");
    showLoader();
    return <Loader />;
  }

  if (isError || isLoading) {
    loader = true;
    showLoader();
    return <Loader />;
  }


  // TODO: how to encode the fact that this topo cannot be edited?
  const topoQuark = editTopo(topo!);
  return <RootTopo topoQuark={topoQuark} />
};

Topo.displayName = "TopoPage";

export default Topo;