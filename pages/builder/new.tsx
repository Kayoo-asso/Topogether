import React from 'react';
import type { GetServerSideProps, NextPage } from 'next';
import { RootNew } from 'components';
import { User } from 'types';
import { withAuth } from 'helpers/auth';

type BuilderNewProps = {
  user: User
}

export const getServerSideProps: GetServerSideProps<BuilderNewProps> = withAuth(
  async () => ({ props: {} }),
  "/builder/new"
);

const NewPage: NextPage<BuilderNewProps> = ({ user }) => {
  return <RootNew user={user} />
};

export default NewPage;
