import React, { useContext, useState } from 'react';
import { Flash, Icon, SlideagainstRightDesktop, SlideoverMobile } from 'components';
import { Quark, watchDependencies } from 'helpers/quarky';
import { Waypoint } from 'types';
import { DeviceContext } from 'helpers';
import { CFImage } from 'components/atoms/CFImage';

interface WaypointSlideProps {
    open: boolean,
    waypoint: Quark<Waypoint>,
    onClose?: () => void,
}

export const WaypointSlide: React.FC<WaypointSlideProps> = watchDependencies(({
    open = true,
    ...props
  }: WaypointSlideProps) => {
    const device = useContext(DeviceContext);

    const [flashMessage, setFlashMessage] = useState<string>();
    const waypoint = props.waypoint();

    const waypointContent = () => (
        <>
            <div className='flex flex-col h-[90%] md:h-[85%] pt-10 md:pt-0 gap-6'>
                <div className='flex flex-col items-center md:items-start px-6'>
                    <div className='ktext-big-title flex flex-row gap-3 items-center'>
                        <Icon 
                            name='help-round'
                            SVGClassName='h-6 w-6 stroke-third fill-third'
                            center
                        />
                        {waypoint.name}
                    </div>
                    <div 
                        className='ktext-label text-grey-medium cursor-pointer'
                        onClick={() => {
                            const data = [new ClipboardItem({ "text/plain": new Blob([waypoint.location[1] + ',' + waypoint.location[0]], { type: "text/plain" }) })];
                            navigator.clipboard.write(data).then(function() {
                                setFlashMessage("Coordonnées copiées dans le presse papier.");
                            }, function() {
                                setFlashMessage("Impossible de copier les coordonées.");
                            });
                        }}
                    >{parseFloat(waypoint.location[1].toFixed(12)) + ',' + parseFloat(waypoint.location[0].toFixed(12))}</div>
                </div>

                <div className='w-full relative max-h-[200px] h-[60%] md:h-[25%]'>
                    <CFImage 
                        image={waypoint.image}
                        alt="Parking"
                        priority
                        layout="fill"
                        objectFit="contain"
                    />
                </div>

                <div className='px-6 ktext-base-little'>
                    {waypoint.description}
                </div>
                
            </div>
        </>
    );

    return (
        <>
            {device === 'MOBILE' &&
                <SlideoverMobile
                    open
                    initialFull={true}
                    onlyFull
                    onClose={props.onClose}
                >
                    {waypointContent()}
                </SlideoverMobile>
            }
            {device !== 'MOBILE' && 
                <SlideagainstRightDesktop
                    open
                    onClose={props.onClose}
                >
                    {waypointContent()}
                </SlideagainstRightDesktop>
            }

            <Flash 
                open={!!flashMessage}
                onClose={() => setFlashMessage(undefined)}
                >
                {flashMessage}
            </Flash>
        </>
    )
});

WaypointSlide.displayName = "WaypointSlide";