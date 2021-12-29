import React from 'react';
import type { NextPage } from 'next';
import { LoginDesktop, LoginMobile } from 'components';
import { isDesktop, isMobile } from 'react-device-detect';

const LoginPage: NextPage = () => (
  <>
    {isMobile
        && <LoginMobile />}
    {isDesktop
        && <LoginDesktop />}
  </>
);

export default LoginPage;
