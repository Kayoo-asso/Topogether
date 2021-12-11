import { Icon } from 'components/atoms/Icon';
import type { NextPage } from 'next'

const Map: NextPage = () => {
    return (
        <div>
            <Icon 
                name="position"
                className="stroke-main h-24 w-24"
            />
        </div>
    )
}

export default Map;