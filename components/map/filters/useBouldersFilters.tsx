import { Checkbox } from "components/atoms"
import { GradeSliderInput, SliderInput } from "components/molecules"
import { SpecSelector } from "components/molecules/form/SpecSelector";
import { hasSomeFlags, toggleFlag } from "helpers/bitflags";
import { Quark, useCreateDerivation } from "helpers/quarky";
import { useCallback, useEffect, useState } from "react";
import { Boulder, LightGrade, Topo, TrackDanger, TrackSpec, gradeToLightGrade } from "types";

export interface BoulderFilterOptions {
	spec: TrackSpec;
	tracksRange: [number, number];
	gradeRange: [Exclude<LightGrade, "P">, Exclude<LightGrade, "P">];
	mustSee: boolean;
}

export type BouldersFiltersComponents = {
    SpecFilter: () => JSX.Element,
    NbOfTracksFilter: () => JSX.Element,
    DifficultyFilter: () => JSX.Element,
    MustSeeFilter: () => JSX.Element
}


export function useBouldersFilters (topo: Topo): [
    BouldersFiltersComponents,
    (boulders: Iterable<Quark<Boulder>>) => Quark<Boulder>[],
    boolean
] {
    // TODO: memoize that?
    const maxTracks = useCreateDerivation<number>(() => {
        return topo.boulders
            .toArray()
            .map((b) => b.tracks.length)
            .reduce((a, b) => a + b, 0);
    }, [topo.boulders]);
    // TODO: memoize that?
    const filtersDomain: BoulderFilterOptions = {
        spec: TrackDanger.None,
        tracksRange: [0, maxTracks()],
        gradeRange: [3, 9],
        mustSee: false,
    };
    const [filters, setFilters] = useState(filtersDomain);
    useEffect(() => {
        const max = maxTracks();
        if (max !== filters.tracksRange[1]) {
            setFilters((opts) => ({
                ...opts,
                tracksRange: [opts.tracksRange[0], max],
            }));
        }
    }, [maxTracks()]);
    const updateBoulderFilters = useCallback(
		<K extends keyof BoulderFilterOptions>(
			option: K,
			value: BoulderFilterOptions[K]
		) => {
			setFilters({
				...filters,
				[option]: value,
			});
		}, [filters]);

    const filterBoulders = useCallback((
        boulders: Iterable<Quark<Boulder>>,
    ): Quark<Boulder>[] => {
        const result: Quark<Boulder>[] = [];
        for (const boulderQ of boulders) {
            const boulder = boulderQ();
            // First apply the general filters
            if (
                boulder.tracks.length < filters.tracksRange[0] ||
                boulder.tracks.length > filters.tracksRange[1]
            ) {
                continue;
            }
            if (filters.mustSee && !boulder.mustSee) continue;
    
            // Then check out the tracks
            const minGrade = filters.gradeRange[0];
            const maxGrade = filters.gradeRange[1];
            // Skip the iteration in the common case where the options are the default ones
            // - options.spec === TrackDanger.None means the user does not want to filter based on spec
            // - `maxGrade - minGrade` is 6 only if the range goes from grade 3 to grade 9, which always matches all tracks
            let hasGrade = maxGrade - minGrade === 6;
            let hasSpec = filters.spec === TrackDanger.None;
            if (!hasGrade || !hasSpec) {
                for (const track of boulder.tracks) {
                    hasSpec =
                    hasSpec || hasSomeFlags(track.spec, filters.spec);
                    const lightGrade = gradeToLightGrade(track.grade);
                    hasGrade =
                        hasGrade || (lightGrade >= minGrade && lightGrade <= maxGrade);
                }
                if (!hasGrade || !hasSpec) continue;
            }
            result.push(boulderQ);
        }
        return result;
    }, [filters]);

    // TODO: memoize that?
    const isFilterEmpty = (filters.spec === TrackDanger.None && !filters.mustSee && filters.gradeRange[0] === 3 && filters.gradeRange[1] === 9 && filters.tracksRange[0] === 0 && filters.tracksRange[1] === maxTracks())


    const SpecFilter = useCallback(() => (
        <SpecSelector
            value={filters.spec}
            onChange={(val) => updateBoulderFilters("spec", val)}
        />
    ), [filters.spec]);
    const NbOfTracksFilter = useCallback(() => (
        <div>
            <div className="ktext-label text-grey-medium">Nombre de voies</div>
            <SliderInput
                domain={filtersDomain.tracksRange}
                values={filters.tracksRange}
                onChange={(value) => updateBoulderFilters("tracksRange", value)}
            />
        </div>
    ), [filtersDomain.tracksRange, filters.tracksRange]);
    const DifficultyFilter = useCallback(() => (
        <div>
            <div className="ktext-label text-grey-medium">Difficultés</div>
            <GradeSliderInput
                values={filtersDomain.gradeRange}
                onChange={(value) => updateBoulderFilters("gradeRange", value)}
            />
        </div>
    ), [filtersDomain.gradeRange])
    const MustSeeFilter = useCallback(() => (
        <Checkbox
            label="Incontournable"
            checked={filters.mustSee}
            onClick={(isChecked) => updateBoulderFilters("mustSee", isChecked)}
        />
    ), [filters.mustSee]);

    return [
        { 
            SpecFilter, 
            NbOfTracksFilter,
            DifficultyFilter,
            MustSeeFilter 
        },
        filterBoulders,
        isFilterEmpty,
    ];
}