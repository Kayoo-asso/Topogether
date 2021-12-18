import type { NextPage } from 'next';
import { ProfileDesktop, ProfileMobile } from 'components';
import { isDesktop, isMobile } from 'react-device-detect';

const ProfilePage: NextPage = () => {

  return (
    <>
      {isMobile &&
        <ProfileMobile />
      }
      {isDesktop &&
        <ProfileDesktop />
      }
    </>
  )
};

export default ProfilePage;
