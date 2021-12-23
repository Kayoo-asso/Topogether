let functionRef = (e: WheelEvent) => {};
export const horizontalScroll = (container: HTMLElement, exceptionContainers: HTMLElement[]=[], launch=true) => {
    if (launch)
        window.addEventListener('wheel', functionRef = (e) => {
            if (container.contains(e.currentTarget) &&
                !Array.from(exceptionContainers).map(cont => cont.contains(e.target)).includes(true)
            ) {
                e.preventDefault();
                if (e.deltaY > 0 || e.deltaX > 0) container.scrollLeft += 150;
                else container.scrollLeft -= 150;
            } 
        }, { passive: false });
    else
        window.removeEventListener('wheel', functionRef, { passive: false });
}