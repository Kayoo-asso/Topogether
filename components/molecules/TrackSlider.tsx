import { GradeCircle } from "components/atoms/GradeCircle";
import { useDrawerStore } from "components/store/drawerStore";
import { SelectedBoulder, useSelectStore } from "components/store/selectStore";
import { getTextGradeColorClass } from "helpers/gradeColors";
import { Quark } from "helpers/quarky";
import { Track, gradeToLightGrade } from "types"

interface TrackSliderProps {}

export const TrackSlider: React.FC<TrackSliderProps> = (props: TrackSliderProps) => {
    const select = useSelectStore(s => s.select);
    const selectedBoulder = useSelectStore(s => s.item) as SelectedBoulder;
    const selectedId = selectedBoulder.selectedTrack && selectedBoulder.selectedTrack().id;
    const tracks = selectedBoulder.value().tracks.quarks().toArray();

    const openDrawer = useDrawerStore(d => d.openDrawer);
    const selectTool = useDrawerStore(d => d.selectTool)

    const handleSelectTrack = (tQuark: Quark<Track>) => {
        select.track(tQuark);
        selectTool('LINE_DRAWER');
        openDrawer();
    }

    return (
        <div className='w-full flex flex-row gap-3'>
            {tracks.sort((a,b) => a().index - b().index).map(trackQuark => {
                const track = trackQuark();
                return (
                    <div 
                        key={track.id}
                        className={`
                            flex flex-col items-center justify-center py-1 px-[1.5px] rounded-full hide-scrollbar md:cursor-pointer 
                            ${track.id === selectedId ? 'border-3 border-grey-superlight' : ''}
                        `}
                        onClick={() => handleSelectTrack(trackQuark)}
                    >
                        <GradeCircle 
                            grade={gradeToLightGrade(track.grade)}
                            size="big"
                            content={(track.index + 1).toString()}
                            onClick={() => handleSelectTrack(trackQuark)}
                        />
                        <div className={'ktext-base-little font-semibold pb-1 ' + getTextGradeColorClass(track.grade)}>{track.grade}</div>
                    </div>
                )
            })}
        </div>
    )
}