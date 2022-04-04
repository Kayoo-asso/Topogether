import type { GetServerSideProps, NextPage } from 'next';
import { api } from 'helpers/services';
import { useAsyncData } from 'helpers/hooks/useAsyncData';
import { useRouter } from 'next/router';
import { Error404, Header, Loading } from 'components';
import { RootAdmin } from 'components/pages/admin/RootAdmin';
import { useSession } from "helpers/services";
import { User } from 'types';
import { injectAuth } from 'helpers/auth';
import { getServerUser } from 'helpers/getServerUser';

type AdminProps = {
    user: User & { role: "ADMIN" }
}

export const getServerSideProps: GetServerSideProps<AdminProps> = async ({ req }) => {
    const user = await getServerUser(req.cookies);
    if (!user || user.role !== "ADMIN") return { notFound: true };
    return {
        props: {
            user: user as AdminProps["user"]
        }
    }
};
const AdminPage: NextPage<AdminProps> = ({ user }) => {
    const toposQuery = useAsyncData(() => api.getLightTopos(), []);

    // ERROR
    if (toposQuery.type === 'error') return <Error404 title="Aucun topo n'a été trouvé" />

    //LOADING
    else if (toposQuery.type === 'loading') return (
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
        if (!toposQuery.data) return <Error404 title="Aucun topo n'a été trouvé" />
        else {
            return (
                <RootAdmin 
                    lightTopos={toposQuery.data}
                />
            );
        }
    }
    
};

export default AdminPage;
