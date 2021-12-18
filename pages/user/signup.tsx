import type { NextPage } from 'next';
import { SignupDesktop, SignupMobile } from 'components';
import { isDesktop, isMobile } from 'react-device-detect';

const SignupPage: NextPage = () => {

  return (
    <>
      {isMobile &&
        <SignupMobile />
      }
      {isDesktop &&
        <SignupDesktop />
      }
    </>
  )
};

export default SignupPage;
