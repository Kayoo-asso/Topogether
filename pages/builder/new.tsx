import React from 'react';
import type { NextPage } from 'next';
import { RootNew } from 'components';
import { useSession } from "helpers/services";


const NewPage: NextPage = () => {
  // middleware should redirect before we hit this
  const user = useSession()!;
  return <RootNew user={user} />
};

export default NewPage;
