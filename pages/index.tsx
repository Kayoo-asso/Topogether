import { Icon } from 'components/atoms/Icon';
import type { NextPage } from 'next'

const Map: NextPage = () => {
    return (
        <div className='bg-second'>
            <Icon 
                name="climbing-shoe"
                className="stroke-main fill-white h-24 w-24"
            />
        </div>
    )
}

export default Map;