import React, { useState, useEffect, useRef } from 'react';
import Trigram from "trigram-search";
import {
    RoundButton, TextInput,
} from 'components';
import { api } from 'helpers/services';
import { useRouter } from 'next/router';
import { Boulder, LightTopo } from 'types';
import { TrigramOutput } from 'trigram-search/build/main/lib/ITrigram';
import SearchIcon from 'assets/icons/search.svg';
import { googleAutocomplete } from 'helpers/map/mapUtils';
import { MapSearchResults } from './MapSearchResults';

export interface MapSearchbarProps {
    initialOpen?: boolean,
    placeholder?: string,
    focusOnOpen?: boolean,
    findTopos?: boolean,
    boulders?: Boulder[],
    findBoulders?: boolean,
    findPlaces?: boolean,
    topoIdToRestrict?: number,
    onButtonClick?: (barOpen: boolean) => void,
    onOpenResults?: () => void,
    onGoogleResultSelect?: (place: google.maps.places.AutocompletePrediction) => void,
    onBoulderResultSelect?: (boulder: Boulder) => void,
    // onAddTopoSelect?: () => void,
}

let timer: NodeJS.Timeout;
export const MapSearchbar: React.FC<MapSearchbarProps> = ({
    initialOpen = false,
    placeholder = 'Votre recherche',
    focusOnOpen = true,
    findTopos = false,
    findBoulders = false,
    findPlaces = false,
    ...props
}: MapSearchbarProps) => {
    const router = useRouter();
    const inputRef = useRef<HTMLInputElement>(null);

    const [barOpen, setBarOpen] = useState(initialOpen);
    const [resultsOpen, setResultsOpen] = useState(false);
    const [value, setValue] = useState('');
    const [topoApiResults, setTopoApiResults] = useState<LightTopo[]>([]);
    const [googleApiResults, setGoogleApiResults] = useState<google.maps.places.AutocompletePrediction[]>([]);
    const [boulderResults, setBoulderResults] = useState<Boulder[]>([]);
    const boulderSearcher = new Trigram(props.boulders, { idField: 'id', searchField: 'name', count: 5 });

    const getPredictions = async () => {
        if (findTopos) {
            const topoResults = await api.searchLightTopos(value, 5, 0.2);
            setTopoApiResults(topoResults);
        }
        if (findBoulders) {
            const boulderResults: TrigramOutput = boulderSearcher.find(value);
            setBoulderResults(boulderResults.map(res => res.value as Boulder));
        }
        if (findPlaces) {
            const googleResults = await googleAutocomplete(value);
            setGoogleApiResults(googleResults || []);
        }
    };
    useEffect(() => {
        if (value?.length > 2) {
            clearTimeout(timer);
            timer = setTimeout(() => {
                getPredictions();
            }, 300);
        }
    }, [value]);

    const selectTopo = (topo: LightTopo) => {
        setResultsOpen(false);
        setValue(topo.name);
        router.push('/topo/' + topo.id);
    }
    const selectPlace = (place: google.maps.places.AutocompletePrediction) => {
        setResultsOpen(false);
        setValue(place.description);
        props.onGoogleResultSelect && props.onGoogleResultSelect(place);
    }
    const selectBoulder = (boulder: Boulder) => {
        setResultsOpen(false);
        setValue(boulder.name);
        props.onBoulderResultSelect && props.onBoulderResultSelect(boulder);
    }

    useEffect(() => {
        if (resultsOpen && props.onOpenResults) props.onOpenResults();
    }, [resultsOpen]);

    // Note: I removed the useIsMounted hook here, it should not be needed,
    // since the ref should be null after the component unmounts
    useEffect(() => {
        if (barOpen && focusOnOpen && inputRef.current) inputRef.current.focus();
    }, [barOpen]);

    const handleKeyboardShortcuts = (e: KeyboardEvent) => {
        if (e.code === 'Enter' && value.length > 2) {
            if (topoApiResults.length > 0) selectTopo(topoApiResults[0]);
            else if (googleApiResults.length > 0) selectPlace(googleApiResults[0]);
        }
        else if (e.code === 'Escape') setValue('');
    };
    useEffect(() => {
        if (inputRef.current) inputRef.current.addEventListener('keyup', handleKeyboardShortcuts);
    }, [inputRef.current]);

    return (
        <>
            <div className="relative">
                <RoundButton
                    className='z-200'
                    white={!barOpen}
                    onClick={() => {
                        if (props.onButtonClick) props.onButtonClick(barOpen);
                        setBarOpen(!barOpen);
                    }}
                >
                    <SearchIcon className={'h-6 w-6 ' + (barOpen ? 'stroke-white' : 'stroke-main')} />
                </RoundButton>

                {barOpen && (
                    <div className="absolute rounded-full top-0 pl-[80px] h-[60px] w-[94%] md:w-[97%] z-100 shadow bg-white">
                        <TextInput
                            id="searchbar"
                            ref={inputRef}
                            autoComplete="off"
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
                <MapSearchResults
                    topoApiResults={topoApiResults}
                    googleApiResults={googleApiResults}
                    boulderResults={boulderResults}
                    onPlaceSelect={selectPlace}
                    onBoulderSelect={selectBoulder}
                    onClose={() => setResultsOpen(false)}
                />
            }
        </>
    );
};
