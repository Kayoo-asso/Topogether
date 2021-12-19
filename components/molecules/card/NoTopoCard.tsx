import { Card } from 'components/atoms/Card';
import React from 'react';

export const NoTopoCard: React.FC = () => (
  <Card className="items-center lg:p-10 text-center text-grey-medium bg-grey-superlight">
    Aucun topo en attente de validation
  </Card>
);

NoTopoCard.displayName = 'TextInput';
