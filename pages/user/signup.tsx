import React from 'react';
import type { NextPage } from 'next';
import { SignupDesktop, SignupMobile } from 'components';
import { isDesktop, isMobile } from 'react-device-detect';

const SignupPage: NextPage = () => (
  <>
    {isMobile
        && <SignupMobile />}
    {isDesktop
        && <SignupDesktop />}
  </>
);

export default SignupPage;
