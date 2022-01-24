import React, { useState, useEffect, useRef } from 'react';
import { RoundButton, TextInput, Dropdown, DropdownOption } from 'components';
import { googleAutocomplete, useIsMounted } from '../../../helpers';

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
    onResultSelect?: (result: any) => void,
    onAddTopoSelect?: () => void,
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
    const inputRef = useRef<HTMLInputElement>(null);

    const [barOpen, setBarOpen] = useState(initialOpen);
    const [resultsOpen, setResultsOpen] = useState(false);
    const [value, setValue] = useState('');
    const [topoApiResults, setTopoApiResults] = useState<string[]>([]);
    const [googleApiResults, setGoogleApiResults] = useState<google.maps.places.AutocompletePrediction[]>([]);

    const getPredictions = async () => {
        if (findTopos || findBoulders) {
            // TODO
            // const res = await axios.post(topogetherUrl+'/public/api/v1/topo-boulder/search', { search: value });
            // let topoResults = !findTopos ? res.data.filter(r => r.boulderId !== null) 
            //     : !findBoulders ? res.data.filter(r => r.boulderId === null)
            //     : res.data;
            // if (!isNaN(props.topoIdToRestrict)) topoResults = topoResults.filter(r => r.topoId === props.topoIdToRestrict);
            const topoResults: string[] = [];
            setTopoApiResults(topoResults);
        }
        if (findPlaces) {
            const googleResults = await googleAutocomplete(value);
            setGoogleApiResults(googleResults || []);
        }
    }
    useEffect(() => {
        if (value?.length > 1) {
            clearTimeout(timer);
            timer = setTimeout(() => { 
                getPredictions(); 
            }, 300);
        }
    }, [value]);

    useEffect(() => {
        if (resultsOpen && props.onOpenResults) props.onOpenResults();
    }, [resultsOpen]);

    const isMounted = useIsMounted(); //prevent to autofocus initially when it is open by default.
    useEffect(() => {
        if (isMounted && barOpen && focusOnOpen && inputRef.current) inputRef.current.focus();
    }, [barOpen]);

    const handleKeyboardShortcuts = (e: KeyboardEvent) => {
        if (e.code === 'Enter' && value.length > 2) {
            setResultsOpen(false);
            if (props.onResultSelect) {
                if (topoApiResults.length > 0) props.onResultSelect(topoApiResults[0]);
                else if (googleApiResults.length > 0) props.onResultSelect(googleApiResults[0]);
            }
        }
    }
    useEffect(() => {
        if (inputRef.current) inputRef.current.addEventListener("keyup", handleKeyboardShortcuts);
    }, [inputRef.current]);

    const constructChoices = () => {
        let choices: DropdownOption[] = [];
        choices.push({
            value: "foo",
            icon: 'rock'
            //TODO
        });
        if (topoApiResults.length > 0) {
            googleApiResults.forEach(res => {
                choices.push({
                    value: "foo"
                    //TODO
                });
            });
        }
        if (googleApiResults.length > 0) {
            choices.push({
                value: "Lieux",
                isSection: true,
            });
            googleApiResults.forEach(res => {
                choices.push({
                    value: res.place_id,
                    label: res.description,
                    icon: 'flag',
                })
            })
        }
        return choices;
    }

    return (
        <>
        <div className='relative'>
            <RoundButton 
                iconName='search'
                white={!barOpen}
                iconClass={barOpen ? 'stroke-white' : 'stroke-main'}
                onClick={() => {                  
                    if (props.onButtonClick) props.onButtonClick(barOpen);
                    setBarOpen(!barOpen);
                }}
            />  

            {barOpen && 
                <div className={"absolute rounded-full top-0 pl-[80px] h-[60px] w-[201%] z-30 shadow bg-white"}>
                    <TextInput
                        id="searchbar"
                        ref={inputRef}
                        label='Recherche...'
                        displayLabel={false}
                        wrapperClassName='w-[95%] mt-[4px]'
                        value={value}
                        onChange={e => {
                            setValue(e.target.value);
                            if (e.target.value?.length > 2) setResultsOpen(true);
                            else setResultsOpen(false);
                        }}
                        onClick={e => {
                            if (e.currentTarget.value?.length > 2) setResultsOpen(true);
                            else setResultsOpen(false);
                        }}
                    />
                </div>
            }
        </div>

            {barOpen && resultsOpen &&
                <Dropdown 
                    options={constructChoices()}
                    className="w-[200%] mt-[-30px] pt-[50px] z-20 relative"
                    onSelect={(option) => {
                        setResultsOpen(false);
                        setValue(option.label || option.value);
                        props.onResultSelect && props.onResultSelect(option);
                    }}
                />

                //         {props.open && props.findTopos && (!topoApiResults || topoApiResults.length === 0) &&
                //             <>
                //                 <Row className="title-container">Aucun topo</Row>
                //                 <Row 
                //                     className="result-container no-result"
                //                     onClick={() => {
                //                         props.onAddTopoSelect();
                //                     }}
                //                 >
                //                     <Col s={2} className="icon-container">
                //                         <KIcon 
                //                             name="waypoint-add"
                //                             size="14px"
                //                             color="main"
                //                             wrapper="span"
                //                         />
                //                     </Col>
                //                     <Col s={10} className="name-container">
                //                         Créer un topo manquant
                //                     </Col>
                //                 </Row>
                //             </>
                //         }
                //     </div>
                // </div>
            }
        </>
    )
}