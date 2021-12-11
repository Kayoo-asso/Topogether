import { RoundButton } from 'components/atoms/buttons/RoundButton';
import type { NextPage } from 'next'

const Map: NextPage = () => {
    return (
        <div className='bg-dark'>
            <RoundButton 
                iconName="filter"
                iconClass="stroke-main fill-main"
                onClick={() => {}}
            />
        </div>
    )
}

export default Map;