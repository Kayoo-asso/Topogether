import { Dropdown } from 'components';
import { DrawerToolEnum } from 'enums';
import type { NextPage } from 'next';


const cursorColor = '6';
const getCursorUrl = () => {  
  let cursorUrl = '';
  if (cursorColor === '5')
    cursorUrl = `/assets/icons/colored/hand-full/_hand-full-5.svg`
  else if (cursorColor === '6')
    cursorUrl = `/assets/icons/colored/hand-full/_hand-full-6.svg`
  return cursorUrl;
}

const Map: NextPage = () => (
  <div 
    className={"bg-dark h-40"}
    style={{cursor: "url("+getCursorUrl()+"), auto"}}
  ></div>
);

export default Map;
