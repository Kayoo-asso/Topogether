import React from 'react';
import { Icon, Card } from 'components';
import Link from 'next/link';

// corriger l'icone
export const AddTopoCard: React.FC = () => (
  <Card className="items-center lg:p-10 text-center text-grey-medium bg-grey-superlight cursor-pointer">
    <Link href="/builder/new" passHref>
      <div className="w-full flex flex-col items-center">
        <Icon
          wrapperClassName="rounded-full border-t-transparent"
          SVGClassName="stroke-grey-medium fill-white h-16 w-16 stroke-[0.25px]"
          name="add"
        />
        <span>Créer un topo</span>
      </div>
    </Link>
  </Card>
);
