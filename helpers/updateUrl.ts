import { SelectedInfo, SelectedItem } from "components/pages/selectStore";
import { NextRouter } from "next/router";
import { encodeUUID } from "./utils";

export const updateUrl = (selectedInfo: SelectedInfo, selectedItem: SelectedItem, router: NextRouter) => {
    let newQ: { i?: SelectedInfo, p?: string, w?: string, b?: string, t?: string } = { ...router.query };

    if (selectedInfo === 'NONE') delete newQ.i;
    else if (router.query.i !== selectedInfo) newQ.i = selectedInfo;

    delete newQ.p; delete newQ.w; delete newQ.b; delete newQ.t;
    const type = selectedItem.type;
    if (type !== 'none') {
        const id = encodeUUID(selectedItem.value().id);
        if (type === 'parking') newQ.p = id;
        else if (type === 'waypoint') newQ.w = id;
        else if (type === 'boulder') { 
            newQ.b = id;
            if (selectedItem.selectedTrack) newQ.t = encodeUUID(selectedItem.selectedTrack().id)
        }
    }
    router.push(
        {
            pathname: window.location.href.split("?")[0],
            query: newQ,
        },
        undefined,
        { shallow: true }
    );
}