import { RootDashboard } from 'components';
import { getServerSession } from 'helpers/getServerSession';
import { api } from 'helpers/services';
import type { GetServerSideProps, NextPage } from 'next';
import { LightTopo } from 'types';

type DashboardProps = {
  myTopos: LightTopo[]
}

export const getServerSideProps: GetServerSideProps<DashboardProps> = async ({ req }) => {
  const session = await getServerSession(req.headers['cookie']);
  if (!session) {
    return {
      redirect: {
        destination: encodeURIComponent(`/user/login?redirectTo=/builder/dashboard`),
        permanent: false
      }
    };
  }
  const myTopos = await api.getLightTopos({
    userId: session.id
  })
  return { props: { myTopos } }
}

const DashboardPage: NextPage<DashboardProps> = ({ myTopos }) => {
  return <RootDashboard lightTopos={myTopos} />;
};

export default DashboardPage;
