import { Error404, Header, Loading, RootDashboard } from 'components';
import { useAsyncData } from 'helpers/hooks/useAsyncData';
import { api } from 'helpers/services';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';

export async function getServerSideProps() {
  const data = {};
  return { props: { data } }
}

const DashboardPage: NextPage = () => {
  const router = useRouter();
  const session = api.user();
  if (!session) { () => router.push('/'); return null; }

  const toposQuery = useAsyncData(() =>
    api.getLightTopos({
      userId: session.id
    }),
    [session.id]);

  // ERROR
  if (toposQuery.type === 'error') { router.push('/'); return null; }

  //LOADING
  else if (toposQuery.type === 'loading')
    return (
      <>
        <Header
          title="Chargement des topos..."
          backLink='/'
        />
        <Loading />
      </>
    )

  // SUCCESS
  else {
    // BUT NO DATA...
    if (!toposQuery.data) return <Error404 title="Topos introuvables" />
    else {
      return (
        <RootDashboard
          lightTopos={toposQuery.data}
        />
      );
    }
  }
};

export default DashboardPage;
