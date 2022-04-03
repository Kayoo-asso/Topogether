import React from 'react';
import type { GetServerSideProps, NextPage } from 'next';
import { getServerSession } from 'helpers/getServerSession';
import { User } from 'types';
import { RootNew } from 'components';

type NewProps = {
  user: User,
}

export const getServerSideProps: GetServerSideProps<NewProps> = async ({ req }) => {
  const session = await getServerSession(req.headers['cookie']);
  if (!session?.user) {
    return {
      redirect: {
        destination: encodeURIComponent(`/user/login?redirectTo=/builder/new`),
        permanent: false
      }
    };
  }
  return { props: { user: session.user } }
}

const NewPage: NextPage<NewProps> = ({ user }) => {
  return <RootNew user={user} />
};

export default NewPage;
