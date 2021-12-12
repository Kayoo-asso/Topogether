export const getMousePosInside = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const posX = e.clientX - rect.left;
    const posY = e.clientY - rect.top;
    return { posX, posY };
}