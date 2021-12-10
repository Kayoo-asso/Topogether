import { Button } from 'components/atoms/buttons/Button';
import type { NextPage } from 'next'

const Map: NextPage = () => {
    return (
        <div>
            <Button 
                content="Accueil"
                color="main"
                href="/"
            />
        </div>
    )
}

export default Map;