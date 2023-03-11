import { GradeCircle } from "components/atoms/GradeCircle";
import { useDrawerStore } from "components/store/drawerStore";
import { SelectedBoulder, useSelectStore } from "components/store/selectStore";
import { Quark } from "helpers/quarky";
import { Grade, Track, gradeToLightGrade } from "types";

const getTextGradeColorClass = (g: Grade | undefined) => {
	if (!g) return "text-grey-light";
	else {
		const lightGrade = gradeToLightGrade(g);
		switch (lightGrade) {
			case 3: return "text-grade-3"; break;
			case 4: return "text-grade-4"; break;
			case 5: return "text-grade-5"; break;
			case 6: return "text-grade-6"; break;
			case 7: return "text-grade-7"; break;
			case 8: return "text-grade-8"; break;
			case 9: return "text-grade-9"; break;
            case 'P': return "text-grey-light"; break;
		}
	}
};

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
        <div 
            className='w-full flex flex-row gap-2 overflow-x-scroll'
        >
            {tracks.sort((a,b) => a().index - b().index).map(trackQuark => {
                const track = trackQuark();
                return (
                    <div 
                        key={track.id}
                        className={`
                            flex flex-col items-center justify-center py-1 px-[1.5px] rounded-full hide-scrollbar border-3 border-grey-superlight md:cursor-pointer
                            ${track.id === selectedId ? '' : ' border-opacity-0'} 
                            ${(selectedBoulder.selectedImage?.id !== track.lines.at(0)?.imageId && track.id !== selectedId) ? ' opacity-50' : ''}
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