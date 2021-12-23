import { Card } from 'components/atoms/Card';
import React from 'react';
import { TopoStatus } from 'types';

interface NoTopoCardProps {
  topoStatus: TopoStatus.Submitted | TopoStatus.Validated;
}
export const NoTopoCard: React.FC<NoTopoCardProps> = (props :NoTopoCardProps) => (
  <Card className="items-center lg:p-10 text-center text-grey-medium bg-grey-superlight">
    {`Aucun topo ${props.topoStatus === TopoStatus.Submitted ? 'en attente de validation' : 'validé'}`}
  </Card>
);

NoTopoCard.displayName = 'TextInput';
