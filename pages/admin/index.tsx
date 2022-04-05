import type { GetServerSideProps, NextPage } from 'next';
import { api } from 'helpers/services';
import { RootAdmin } from 'components/pages/admin/RootAdmin';
import { DBLightTopo, User } from 'types';
import { getServerUser } from 'helpers/getServerUser';
import { quarkifyLightTopos } from 'helpers/topo';

type AdminProps = {
    user: User & { role: "ADMIN" }
    topos: DBLightTopo[]
}

export const getServerSideProps: GetServerSideProps<AdminProps> = async ({ req }) => {
    const [user, topos] = await Promise.all([
        getServerUser(req.cookies),
        api.getLightTopos()
    ]);
    if (!user || user.role !== "ADMIN") return { notFound: true };
    return {
        props: {
            user: user as AdminProps["user"],
            topos
        }
    }
};
const AdminPage: NextPage<AdminProps> = ({ user, topos }) => {
    return <RootAdmin
        lightTopos={quarkifyLightTopos(topos)}
    />
};

export default AdminPage;
