import type { NextPage } from 'next';
import { useRouter } from 'next/router';

const Topo: NextPage = () => {
  const router = useRouter();
  const { id } = router.query;

  if (typeof id === 'string' && Number.isNaN(Number(id))) return null;
  return (
    <p>
      Topo:
      {id}
    </p>
  );
};

export default Topo;
