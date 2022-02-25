import fs from 'fs';
import path from 'path';
import fetch from "node-fetch";
import { dropboxDelete, dropboxUpload } from "helpers/dropbox";

// important for the helper function to work out
// globalThis.fetch = fetch as any;

test.skip("HTTP API connection", async () => {
    const inputPath = path.join(__dirname, "/coucou.txt");
    const dropboxPath = "/coucou3.txt";
    const stream = fs.createReadStream(inputPath, "utf-8");
    const uploadPath = await dropboxUpload(dropboxPath, stream as any);
    expect(uploadPath).toBe(dropboxPath);
    const deleted = await dropboxDelete(dropboxPath);
    expect(deleted).toBe(true);
});
