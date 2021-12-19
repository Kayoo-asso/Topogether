import { EditTopoDetails } from 'components/organisms/topo/EditTopoDetails';
import { fakeTopo } from 'helpers/fakeData/fakeTopo';
import React from 'react';

export const LoginMobile:React.FC = (props) => (
  <EditTopoDetails topo={fakeTopo} />
);
