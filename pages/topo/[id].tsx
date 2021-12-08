import type { NextPage } from 'next'
import { useRouter } from 'next/router'

const Topo: NextPage = () => {
    const router = useRouter();
    const { id } = router.query;

    if (typeof id === 'string' && isNaN(parseInt(id))) return null;
    return (
        <p>Topo: {id}</p>
    )
}

export default Topo;