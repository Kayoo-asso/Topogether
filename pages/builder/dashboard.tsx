import { RootDashboard } from 'components';
import { loginRedirect } from 'helpers/auth';
import { getServerUser } from 'helpers/getServerUser';
import { api } from 'helpers/services';
import type { GetServerSideProps, NextPage } from 'next';
import { LightTopo } from 'types';

type DashboardProps = {
  myTopos: LightTopo[]
}

export const getServerSideProps: GetServerSideProps<DashboardProps> = async ({ req }) => {
  const session = await getServerUser(req.cookies);
  if (!session) {
    return loginRedirect("/builder/dashboard");
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
