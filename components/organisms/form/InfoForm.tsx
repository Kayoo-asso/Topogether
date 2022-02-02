import React, { useCallback } from 'react';
import {
 Checkbox, ImageInput, Select, Show, TextArea, TextInput,
} from 'components';
import { Quark, watchDependencies } from 'helpers/quarky';
import {
 Amenities, Description, Name, Topo,
} from 'types';
import { hasFlag, toggleFlag } from 'helpers';

interface InfoFormProps {
    topo: Quark<Topo>,
    className?: string,
}

export const InfoForm: React.FC<InfoFormProps> = watchDependencies((props: InfoFormProps) => {
    const topo = props.topo();

    const handleChildren = useCallback(() => {
        const amenities = toggleFlag<Amenities>(topo.amenities, Amenities.AdaptedToChildren);
        props.topo.set({
        ...topo,
        amenities,
    });
    }, [props.topo, topo]);

    const handleToilets = useCallback(() => {
        const amenities = toggleFlag<Amenities>(topo.amenities, Amenities.Toilets);
        props.topo.set({
        ...topo,
        amenities,
    });
    }, [props.topo, topo]);

    return (
      <div
        className={`flex flex-col gap-6 h-[95%] overflow-auto ${props.className ? props.className : ''}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-row gap-6 items-end">
          <div className="w-32 md:mt-4">
            <ImageInput
              value={topo.image}
              onChange={(files) => {
                            props.topo.set({
                                ...topo,
                                image: files[0],
                            });
                        }}
              onDelete={() => console.log('delete')}
            />
          </div>
          <TextInput
            id="topo-name"
            label="Nom du spot"
            value={topo.name}
            onChange={(e) => props.topo.set({
                        ...topo,
                        name: e.target.value as Name,
                    })}
          />
        </div>

        <Checkbox
          label="Spot adapté aux enfants"
          checked={hasFlag(topo.amenities, Amenities.AdaptedToChildren)}
          onClick={handleChildren}
        />

        <Checkbox
          label="Toilettes"
          checked={hasFlag(topo.amenities, Amenities.Toilets)}
          onClick={handleToilets}
        />

      </div>
    );
});
    function handleCheck<T>(amenities: Amenities | undefined, AdaptedToChildren: Amenities): Amenities | undefined {
        throw new Error('Function not implemented.');
    }
