import React, { useContext } from 'react';
import type { NextPage } from 'next';
import { ProfileDesktop, ProfileMobile } from 'components';
import { isDesktop, isMobile } from 'react-device-detect';
import { UserContext } from 'helpers';

const ProfilePage: NextPage = () => {
  const { session } = useContext(UserContext);

  if (!session) {
    return null;
  }
  return (
    <>
      {isMobile && (<ProfileMobile user={session} />)}
      {isDesktop && (<ProfileDesktop user={session} />)}
    </>
  );
};

export default ProfilePage;
