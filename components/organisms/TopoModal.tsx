import React, { useState } from 'react';
import {
  Button, DownloadButton, Icon, LikeButton, Modal, ParkingButton, ParkingModal
} from 'components';
import launchNavigation from 'helpers/map/launchNavigation';
import Image from 'next/image';
import { LightTopo } from 'types';
import { GradeScale } from '../molecules';
import { Signal } from 'helpers/quarky';
import { staticUrl } from 'helpers';

interface TopoModalProps {
  open: boolean,
  topo: Signal<LightTopo>,
  onClose: () => void,
}

export const TopoModal: React.FC<TopoModalProps> = ({
  open = false,
  ...props
}: TopoModalProps) => {
  const [modalParkingOpen, setModalParkingOpen] = useState(true);
  const topo = props.topo();

  return (
    <>
      <Modal
        open={open}
        withBackground={false}
        onClose={props.onClose}
      >
        <div className="flex flex-row gap-5 px-6 pt-4">
          <LikeButton
            item={props.topo}
          />
          <DownloadButton
            topo={props.topo}
          />
        </div>

        <div className="flex flex-col">
          <div className="px-4 ktext-section-title text-center">
            {props.topo.name}
          </div>

          <div className="w-full h-[180px] relative mt-2">
            <Image
              src={topo.image?.url || staticUrl.defaultKayoo}
              alt="image principale du topo"
              priority
              layout="fill"
              objectFit="cover"
            />
          </div>

          <div className="ktext-base mt-4 px-4 hide-after-two-lines overflow-hidden">
            {topo.description}
          </div>

          <div className="grid grid-cols-12 gap-4 mt-4 px-4">
            <div>
              <Icon
                name="rock"
                SVGClassName="h-6 w-6 stroke-dark"
              />
            </div>
            <div className="col-span-11 ml-2">
              {topo.nbBoulders}
              {' '}
              blocs
            </div>
            <div>
              <Icon
                name="many-tracks"
                SVGClassName="h-6 w-6 stroke-dark"
              />
            </div>
            <div className="col-span-5 ml-2">
              {topo.nbTracks}
              {' '}
              passages
            </div>
            <div className="col-span-6 ml-2">
              <GradeScale
                histogram={() => topo.grades}
                circleSize="little"
              />
            </div>
          </div>

          <div className="p-4 mt-4 w-full">
            <Button
              content="Entrer"
              fullWidth
              href={'/topo/'+topo.id}
            />
          </div>
          <div className="pb-4">
            <ParkingButton
              onClick={() => setModalParkingOpen(true)}
            />
          </div>
        </div>
      </Modal>

      <ParkingModal
        open={modalParkingOpen}
        onGoogleClick={() => launchNavigation(topo.firstParkingLocation, 'google')}
        onAppleClick={() => launchNavigation(topo.firstParkingLocation, 'apple')}
        onClose={() => setModalParkingOpen(false)}
      />
    </>
  );
};
