import type { NextPage } from 'next';
import { ForgotPasswordDesktop, ForgotPasswordMobile } from 'components';
import { isDesktop, isMobile } from 'react-device-detect';

const ForgotPasswordPage: NextPage = () => {

  return (
    <>
      {isMobile &&
        <ForgotPasswordMobile />
      }
      {isDesktop &&
        <ForgotPasswordDesktop />
      }
    </>
  )
};

export default ForgotPasswordPage;
