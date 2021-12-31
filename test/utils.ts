export function getConsoleErrorSpy() {
    return jest
        .spyOn(console, 'error')
        .mockImplementation(() => { });
}