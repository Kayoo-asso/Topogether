import React, { useContext } from 'react';
import type { NextPage } from 'next';
import { UserContext } from 'helpers';

const ProfilePage: NextPage = () => {
  const { session } = useContext(UserContext);

  if (!session) {
    return null;
  }
  return (
    <>
      
    </>
  );
};

export default ProfilePage;
