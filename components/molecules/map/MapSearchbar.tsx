import React, { useState, useEffect, useRef } from 'react';
import { RoundButton, TextInput } from 'components';
import { googleAutocomplete, useIsMounted } from '../../../helpers';
import { topogetherUrl } from 'const';

interface MapSearchbarProps {
    initialOpen?: boolean,
    placeholder?: string,
    focusOnOpen?: boolean,
    findTopos?: boolean,
    findBoulders?: boolean,
    findPlaces?: boolean,
    topoIdToRestrict?: number,
    onButtonClick?: (barOpen: boolean) => void,
    onOpenResults?: () => void,
    onResultSelect?: () => void,
    onAddTopoSelect?: () => void,
}

let timer;
export const MapSearchbar: React.FC<MapSearchbarProps> = ({
    initialOpen = true,
    placeholder = 'Votre recherche',
    focusOnOpen = true,
    findTopos = true,
    findBoulders = true,
    findPlaces = true,
    ...props
}: MapSearchbarProps) => {
    const inputRef = useRef();

    const [barOpen, setBarOpen] = useState(initialOpen);
    // const [resultsOpen, setResultsOpen] = useState(false);
    // const [value, setValue] = useState('');
    // const [topoApiResults, setTopoApiResults] = useState([]);
    // const [googleApiResults, setGoogleApiResults] = useState([]);

    // const getPredictions = async () => {
    //     if (findTopos || findBoulders) {
    //         const res = await axios.post(topogetherUrl+'/public/api/v1/topo-boulder/search', { search: value });
    //         let topoResults = !findTopos ? res.data.filter(r => r.boulderId !== null) 
    //             : !findBoulders ? res.data.filter(r => r.boulderId === null)
    //             : res.data;
    //         if (!isNaN(props.topoIdToRestrict)) topoResults = topoResults.filter(r => r.topoId === props.topoIdToRestrict);
    //         setTopoApiResults(topoResults);
    //     }
    //     if (findPlaces) {
    //         const googleResults = await googleAutocomplete(value);
    //         setGoogleApiResults(googleResults);
    //     }
    // }
    // useEffect(() => {
    //     if (value?.length > 1) {
    //         clearTimeout(timer);
    //         timer = setTimeout(() => { 
    //             getPredictions(); 
    //         }, 300);
    //     }
    // }, [value]);

    // useEffect(() => {
    //     if (resultsOpen && props.onOpenResults) props.onOpenResults();
    // }, [resultsOpen]);

    // const isMounted = useIsMounted(); //prevent to autofocus initially when it is open by default.
    // useEffect(() => {
    //     if (isMounted && open && focusOnOpen) inputRef.current.focus();
    // }, [open]);

    // const handleKeyboardShortcuts = (e) => {
    //     if (e.code === 'Enter' && value.length > 2) {
    //         setResultsOpen(false);
    //         props.onResultSelect(topoApiResults.concat(googleApiResults)[0]);
    //     }
    // }
    // useEffect(() => {
    //     if inputRef.current.addEventListener("keyup", handleKeyboardShortcuts);
    // }, [inputRef.current]);

    return (
        <>
            <RoundButton 
                iconName='search'
                white={barOpen}
                iconClass={barOpen ? 'stroke-main' : 'stroke-white'}
                onClick={() => {                  
                    if (props.onButtonClick) props.onButtonClick(barOpen);
                    setBarOpen(!barOpen);
                }}
            />
            

            {/* {barOpen && 
                <div className={"shadow bg-white "}>
                    <TextInput
                        id="search-bar-input"
                        ref={inputRef.current}
                        placeholder={placeholder}
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

            {barOpen && resultsOpen &&
                <div className="results-container shadow">
                    <div className="results-content">
                        <div className="topo-results-container">
                            {topoApiResults?.length > 0 && topoApiResults.map((res, index) => {
                                return (
                                    <Row 
                                        key={index}
                                        className="result-row topos-results"
                                        onClick={() => {
                                            setValue(res.name);
                                            setResultsOpen(false);
                                            props.onResultSelect(res);
                                        }}
                                    >
                                        <Col s={2} className="icon-container">
                                            <KIcon 
                                                name={res.boulderId ? "rock" : "waypoint"}
                                                size="12px"
                                                fillColored={!res.boulderId}
                                                strokeColored={!!res.boulderId}
                                                color="black"
                                                wrapper="span"
                                            />
                                        </Col>
                                        <Col s={6} className="name-container">
                                            {res.name}
                                        </Col>
                                        <Col s={4} className="info-container">

                                        </Col>
                                    </Row>
                                )
                            })}
                        </div>
                        
                        <div className="google-results-container">
                            {googleApiResults?.length > 0 &&
                                <div className="title-container">Lieux</div>}
                            {googleApiResults?.length > 0 && googleApiResults.map((res, index) => {
                                return (
                                    <Row 
                                        key={index}
                                        className="result-row google-results"
                                        onClick={() => {
                                            setValue(res.structured_formatting.main_text);
                                            setResultsOpen(false);
                                            props.onResultSelect(res);
                                        }}
                                    >
                                        <Col s={2} className="icon-container">
                                            <KIcon 
                                                name="flag"
                                                size="12px"
                                                color="black"
                                                wrapper="span"
                                            />
                                        </Col>
                                        <Col s={6} className="name-container">
                                            {res.structured_formatting.main_text}
                                        </Col>
                                        <Col s={4} className="info-container">

                                        </Col>
                                    </Row>
                                )
                            })}
                        </div>

                        {props.open && props.findTopos && (!topoApiResults || topoApiResults.length === 0) &&
                            <>
                                <Row className="title-container">Aucun topo</Row>
                                <Row 
                                    className="result-container no-result"
                                    onClick={() => {
                                        props.onAddTopoSelect();
                                    }}
                                >
                                    <Col s={2} className="icon-container">
                                        <KIcon 
                                            name="waypoint-add"
                                            size="14px"
                                            color="main"
                                            wrapper="span"
                                        />
                                    </Col>
                                    <Col s={10} className="name-container">
                                        Créer un topo manquant
                                    </Col>
                                </Row>
                            </>
                        }
                    </div>
                </div>
            } */}
        </>
    )
}