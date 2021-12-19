import type { NextPage } from 'next';
import { NewTopoDesktop, NewTopoMobile } from 'components';
import { isDesktop, isMobile } from 'react-device-detect';

const NewTopoPage: NextPage = () => {

  return (
    <>
      {isMobile &&
        <NewTopoMobile />
      }
      {isDesktop &&
        <NewTopoDesktop />
      }
    </>
  )
};

export default NewTopoPage;
