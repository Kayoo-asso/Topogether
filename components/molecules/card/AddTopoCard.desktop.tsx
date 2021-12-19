import { Icon } from 'components';
import { Card } from 'components/atoms/Card';
import React from 'react';

export const AddTopoCard: React.FC = () => (
  <Card className="items-center p-10 text-center text-grey-medium bg-grey-superlight">
    <div className="flex flex-col items-center">
      <Icon SVGClassName="stroke-grey-medium h-16 w-16 stroke-[0.25px]" name="add" />
      <span>Aucun topo en attente de validation</span>
    </div>
  </Card>
);
