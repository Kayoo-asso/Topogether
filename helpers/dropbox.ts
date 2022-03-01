export async function dropboxUpload(path: string, body: BodyInit): Promise<string> {
    const res = await fetch("https://content.dropboxapi.com/2/files/upload", {
        method: "POST",
        headers: {
            "Authorization": "Bearer " + process.env.DROPBOX_API_KEY,
            "Content-Type": "application/octet-stream",
            "Dropbox-API-Arg": JSON.stringify({
                path
            })
        },
        body
    });
    const json = await res.json();
    if (json.error) {
        console.error("Error during Dropbox file upload!", json.error);
        // Vercel keeps logs for serverless functions that throw during execution
        throw new Error("File upload failed");
    }
    return json.path_lower as string;
}

export async function dropboxDelete(path: string): Promise<void> {
    const res = await fetch("https://api.dropboxapi.com/2/files/delete_v2", {
        method: "POST",
        headers: {
            "Authorization": "Bearer " + process.env.DROPBOX_API_KEY,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ path })
    });
    const json = await res.json();
    if (json.error) {
        console.error("Error during Dropbox file deletion!", json.error);
        // Vercel keeps logs for serverless functions that throw during execution
        throw new Error("File deletion failed");
    }
}