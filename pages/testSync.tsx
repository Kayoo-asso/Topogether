import { batch, quark, Quark, watchDependencies } from "helpers/quarky";
import { syncQuark } from "helpers/quarky/quarky-sync";
import { NextPage } from "next";

const N = 10_000;
const quarks: Quark<number>[] = new Array(N);
for (let i = 0; i < N; i++) {
    quarks[i] = syncQuark("sync" + i, i);
}

const Page: NextPage = watchDependencies(() => {
    const incrementAll = () => {
        batch(() => {
            for (let i = 0; i < N; i++) {
                quarks[i].set(x => x + 1);
            }
        })
    }
    return <>
        <div>
            <button onClick={incrementAll}>
                Increment all quarks by 1
            </button>
        </div>
        <div>
            Values: [{quarks.map(x => x()).join(", ")}]
        </div>
    </>
});

export default Page;