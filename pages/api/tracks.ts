import { Track } from ".prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../lib/prisma";
import { Prisma } from "@prisma/client";

interface Error {
    error: string
}

// Simple example of a Next.js API route using the Prisma client to interact with the database
export default async function handler(req: NextApiRequest, res: NextApiResponse<Track[] | Error> ) {
    const { method } = req;

    switch (method) {
        case "GET":
            try {
                const tracks = await prisma.track.findMany();
                res.status(200).json(tracks);
            } catch (e) {
                res.status(500).json({ error: "Error fetching tracks" });
            }
            break;

        case "POST":
            try {
                const track: Prisma.TrackCreateInput = req.body;
                await prisma.track.create(
                    {
                        data: {
                            name: track.name,
                            description: track.description
                        }
                    }
                )
                res.status(200);
            } catch (e) {
                console.error("Request error", e);
                res.status(400).json({ error: "Malformed POST request" });
            }

            break;
        default:
            res.setHeader("Allow", ["GET", "POST"]);
            res.status(405).end(`Method ${method} Not Allowed`);
            break;
    }
}