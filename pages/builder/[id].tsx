import type { NextPage } from 'next';
import { BuilderMapDesktop, BuilderMapMobile } from 'components';
import { isDesktop, isMobile } from 'react-device-detect';
import { useRouter } from 'next/router';
import React, { useCallback, useContext, useState } from 'react';
import { fakeTopo } from 'helpers/fakeData/fakeTopo';
import {
  Boulder, GeoCoordinates, Sector, StringBetween, stringBetween, Topo, Track, User,
} from 'types';
import { v4 as uuid } from 'uuid';
import { UserContext } from 'helpers';

const BuilderMapPage: NextPage = () => {
  const { session } = useContext(UserContext);
  if (!session) return (<></>);

  const router = useRouter();
  const { id } = router.query;
  if (typeof id !== 'string') return null;

  const [topo, setTopo] = useState(fakeTopo);
  const updateTopo = useCallback(<K extends keyof Topo>(key: K, value: Topo[K], save = true, now = false) => {
    const newTopo = JSON.parse(JSON.stringify(topo));
    newTopo[key] = value;
    // if (save && !savingImage.current) { // If an image is in the process of being saved, prevent to save something else because it would lead to saving a second time the image
    //     if (now) submitTopo(newTopo);
    //     else timer = submitTimer(timer, submitTopo, newTopo);
    // }
    setTopo(newTopo);
  }, [topo]);
  const deleteTopo = () => {
    console.log('delete topo');
  };

  { /* TODO: GET TOPO */ }

  // CRUD
  const createSector = useCallback((display = true) => {
    const newSector: Sector = {
      id: uuid(),
      name: stringBetween(`Secteur ${topo.sectors.length + 1}`, 1, 255) as StringBetween<1, 255>,
      boulders: [],
      waypoints: [],
    };
    const newSectors = [
      ...topo.sectors,
      newSector,
    ];
    updateTopo('sectors', newSectors, true, true);
    // if (display) setCurrentItem({ type: "sector", sectorIndex: newSectors.length-1 });
  }, [topo]);
  const updateSector = useCallback(<K extends keyof Sector>(index: number, key: K, value: Sector[K], save = true, now = false) => {
    const newSectors = JSON.parse(JSON.stringify(topo.sectors));
    newSectors[index][key] = value;
    updateTopo('sectors', newSectors, save, now);
  }, [topo]);
  const deleteSector = useCallback((index: number, display = true) => {
    const newSectors = JSON.parse(JSON.stringify(topo.sectors));
    newSectors.splice(index, 1);
    updateTopo('sectors', newSectors);
    // if (display) {
    //     if (topo.sectors.length === 0) createSector();
    //     else setCurrentItem({
    //         type:"sector",
    //         sectorIndex: index-1,
    //     });
    // }
  }, [topo]);

  const createBoulder = useCallback((sectorIndex: number, location: GeoCoordinates, display = true) => {
    const boulderNumberInTopo = topo.sectors.map((sector) => sector.boulders).flat().length + 1;
    const newBoulder: Boulder = {
      id: uuid(),
      name: stringBetween(`Nouveau bloc ${boulderNumberInTopo}`, 1, 255) as StringBetween<1, 255>,
      orderIndex: boulderNumberInTopo,
      location: location || { lat: '', lng: '' },
      isHighball: false,
      mustSee: false,
      images: [],
      tracks: [],
    };
    const newSectors = JSON.parse(JSON.stringify(topo.sectors));
    newSectors[sectorIndex].boulders.push(newBoulder);
    updateTopo('sectors', newSectors);
    // if (display) setCurrentItem({
    //     type: "boulder",
    //     sectorIndex: sectorIndex,
    //     boulderIndex: newSectors[sectorIndex].boulders.length-1,
    // });
  }, [topo]);
  const updateBoulder = useCallback(<K extends keyof Boulder>(sectorIndex: number, boulderIndex: number, key: K, value: Boulder[K]) => {
    const newSectors = JSON.parse(JSON.stringify(topo.sectors));
    newSectors[sectorIndex].boulders[boulderIndex][key] = value;
    if (key === 'images') {
      updateTopo('sectors', newSectors, true, true);
      // TODO
      // setSavingImage({ sectorIndex, boulderIndex });
    } else updateTopo('sectors', newSectors);
  }, [topo]);
  const deleteBoulder = useCallback((sectorIndex: number, boulderIndex: number, display = true) => {
    const newSectors = JSON.parse(JSON.stringify(topo.sectors));
    newSectors[sectorIndex].boulders.splice(boulderIndex, 1);
    updateTopo('sectors', newSectors, true, true);
    // if (display) {
    //     if (newSectors[sectorIndex].boulders.length === 0) setCurrentItem({ //If the user deleted the last boulder of a sector
    //         type: "sector",
    //         sectorIndex,
    //     });
    //     else if (boulderIndex === 0) setCurrentItem({ //If the user deleted the first boulder of the list, we display the next one
    //         type:"boulder",
    //         sectorIndex,
    //         boulderIndex: boulderIndex,
    //     });
    //     else setCurrentItem({ //If the user deleted another boulder, we display the previous one
    //         type:"boulder",
    //         sectorIndex,
    //         boulderIndex: boulderIndex-1,
    //     });
    // }
  }, [topo]);

  const createTrack = useCallback((sectorIndex: number, boulderIndex: number, display = true) => {
    const trackNumberInBoulder = topo.sectors[sectorIndex].boulders[boulderIndex].tracks.length + 1;
    const newTrack: Track = {
      id: uuid(),
      name: stringBetween(`Passage ${trackNumberInBoulder}`, 1, 255) as StringBetween<1, 255>,
      orderIndex: trackNumberInBoulder,
      isTraverse: false,
      isSittingStart: false,
      hasMantle: false,
      lines: [],
      creatorId: session.id,
    };
    const newSectors = JSON.parse(JSON.stringify(topo.sectors));
    newSectors[sectorIndex].boulders[boulderIndex].tracks.push(newTrack);
    updateTopo('sectors', newSectors, true, true);
    // if (display) setCurrentItem({
    //     type: "track",
    //     sectorIndex,
    //     boulderIndex,
    //     trackIndex: newSectors[sectorIndex].boulders[boulderIndex].tracks.length-1,
    // });
  }, [topo]);
  const updateTrack = useCallback(<K extends keyof Track>(sectorIndex: number, boulderIndex: number, trackIndex: number, key: K, value: Track[K]) => {
    const newSectors = JSON.parse(JSON.stringify(topo.sectors));
    newSectors[sectorIndex].boulders[boulderIndex].tracks[trackIndex][key] = value;
    updateTopo('sectors', newSectors);
  }, [topo]);
  const deleteTrack = useCallback((sectorIndex: number, boulderIndex: number, trackIndex: number, display = true) => {
    const newSectors = JSON.parse(JSON.stringify(topo.sectors));
    newSectors[sectorIndex].boulders[boulderIndex].tracks.splice(trackIndex, 1);
    updateTopo('sectors', newSectors, true, true);
    // if (display) {
    //     if (newSectors[sectorIndex].boulders[boulderIndex].tracks.length === 0) setCurrentItem({ //If the user deleted the last track of a boulder
    //         type: "boulder",
    //         sectorIndex,
    //         boulderIndex,
    //     })
    //     else if (trackIndex === 0) setCurrentItem({
    //         type:"track",
    //         sectorIndex,
    //         boulderIndex,
    //         trackIndex: trackIndex,
    //     });
    //     else setCurrentItem({
    //         type:"track",
    //         sectorIndex,
    //         boulderIndex,
    //         trackIndex: trackIndex-1,
    //     });
    // }
  }, [topo]);

  const crud = {
    topo: {
      update: updateTopo,
      delete: deleteTopo,
    },
    sector: {
      create: createSector,
      update: updateSector,
      delete: deleteSector,
    },
    boulder: {
      create: createBoulder,
      update: updateBoulder,
      delete: deleteBoulder,
    },
    track: {
      create: createTrack,
      update: updateTrack,
      delete: deleteTrack,
    },
  };

  return (
    <>
      {isMobile
                && (
                <BuilderMapMobile
                  topo={topo}
                  crud={crud}
                />
                )}
      {isDesktop
                && (
                <BuilderMapDesktop
                  topo={topo}
                  crud={crud}
                />
                )}
    </>
  );
};

export default BuilderMapPage;
