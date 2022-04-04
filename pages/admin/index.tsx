import type { NextPage } from 'next';
import { api } from 'helpers/services';
import { useAsyncData } from 'helpers/hooks/useAsyncData';
import { useRouter } from 'next/router';
import { Error404, Header, Loading } from 'components';
import { RootAdmin } from 'components/pages/admin/RootAdmin';
import { useSession } from "helpers/services";

export async function getServerSideProps() {
    const data = {};
    return { props: { data } }
  }

const AdminPage: NextPage = () => {
    const router = useRouter();
    const session = useSession();
    if (!session || session.role !== 'ADMIN') { () => router.push('/'); return null; }

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
