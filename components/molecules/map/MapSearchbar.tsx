import React, { useState, useEffect, useRef } from 'react';
import {
 RoundButton, TextInput, MapSearchresults,
} from 'components';
import { googleAutocomplete, useIsMounted } from '../../../helpers';
import { api } from 'helpers/services';
import { useRouter } from 'next/router';
import { LightTopo } from 'types';

export interface MapSearchbarProps {
    initialOpen?: boolean,
    placeholder?: string,
    focusOnOpen?: boolean,
    findTopos?: boolean,
    findBoulders?: boolean,
    findPlaces?: boolean,
    topoIdToRestrict?: number,
    onButtonClick?: (barOpen: boolean) => void,
    onOpenResults?: () => void,
    onGoogleResultSelect?: (place: google.maps.places.AutocompletePrediction) => void,
    // onAddTopoSelect?: () => void,
}

let timer: NodeJS.Timeout;
export const MapSearchbar: React.FC<MapSearchbarProps> = ({
    initialOpen = false,
    placeholder = 'Votre recherche',
    focusOnOpen = true,
    findTopos = true,
    findBoulders = true,
    findPlaces = true,
    ...props
}: MapSearchbarProps) => {
    const router = useRouter();
    const inputRef = useRef<HTMLInputElement>(null);

    const [barOpen, setBarOpen] = useState(initialOpen);
    const [resultsOpen, setResultsOpen] = useState(false);
    const [value, setValue] = useState('');
    const [topoApiResults, setTopoApiResults] = useState<LightTopo[]>([]);
    // const [boulderApiResults, setBoulderApiResults] = useState<Boulder[]>([]);
    const [googleApiResults, setGoogleApiResults] = useState<google.maps.places.AutocompletePrediction[]>([]);

    const getPredictions = async () => {
        if (findTopos) {
            const topoResults = await api.searchLightTopos(value, 5, 0.2);
            setTopoApiResults(topoResults);
        }
        if (findBoulders) {
            const boulderResults = []; //TODO : but before, necessary to have url for boulders

        }
        if (findPlaces) {
            const googleResults = await googleAutocomplete(value);
            setGoogleApiResults(googleResults || []);
        }
    };
    useEffect(() => {
        if (value?.length > 1) {
            clearTimeout(timer);
            timer = setTimeout(() => {
                getPredictions();
            }, 300);
        }
    }, [value]);

    const selectTopo = (topo: LightTopo) => {
        setResultsOpen(false);
        setValue(topo.name);
        router.push('/topo/'+topo.id);
    }
    const selectPlace = (place: google.maps.places.AutocompletePrediction) => {
        setResultsOpen(false);
        setValue(place.description);
        props.onGoogleResultSelect && props.onGoogleResultSelect(place);
    }

    useEffect(() => {
        if (resultsOpen && props.onOpenResults) props.onOpenResults();
    }, [resultsOpen]);

    const isMounted = useIsMounted(); // prevent to autofocus initially when it is open by default.
    useEffect(() => {
        if (isMounted && barOpen && focusOnOpen && inputRef.current) inputRef.current.focus();
    }, [barOpen]);

    const handleKeyboardShortcuts = (e: KeyboardEvent) => {
        if (e.code === 'Enter' && value.length > 2) {
            if (topoApiResults.length > 0) selectTopo(topoApiResults[0]);
            else if (googleApiResults.length > 0) selectPlace(googleApiResults[0]);
        }
    };
    useEffect(() => {
        if (inputRef.current) inputRef.current.addEventListener('keyup', handleKeyboardShortcuts);
    }, [inputRef.current]);

    return (
        <>
            <div className="relative">
                <RoundButton
                    iconName="search"
                    className='z-200'
                    white={!barOpen}
                    iconClass={barOpen ? 'stroke-white' : 'stroke-main'}
                    onClick={() => {
                        if (props.onButtonClick) props.onButtonClick(barOpen);
                        setBarOpen(!barOpen);
                    }}
                />

                {barOpen && (
                    <div className="absolute rounded-full top-0 pl-[80px] h-[60px] w-[201%] z-100 shadow bg-white">
                        <TextInput
                            id="searchbar"
                            ref={inputRef}
                            label="Recherche..."
                            displayLabel={false}
                            wrapperClassName="w-[95%] mt-[4px]"
                            value={value}
                            onChange={(e) => {
                                setValue(e.target.value);
                                if (e.target.value?.length > 2) setResultsOpen(true);
                                else setResultsOpen(false);
                            }}
                            onClick={(e) => {
                                if (e.currentTarget.value?.length > 2) setResultsOpen(true);
                                else setResultsOpen(false);
                            }}
                        />
                    </div>
                )}
            </div>

            {barOpen && resultsOpen &&
                <MapSearchresults 
                    topoApiResults={topoApiResults}
                    googleApiResults={googleApiResults}
                    onPlaceSelect={(place) => selectPlace(place)}
                    onClose={() => setResultsOpen(false)}
                />
            }
        </>
    );
};
