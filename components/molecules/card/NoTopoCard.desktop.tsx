import { Card } from 'components/atoms/Card';
import React from 'react';

export const NoTopoCard: React.FC = () => (
  <Card className="items-center p-10 text-center text-grey-medium bg-grey-superlight w-80 h-52">
    Aucun topo en attente de validation
  </Card>
);
