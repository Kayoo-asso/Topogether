import { NextMiddleware, NextResponse } from "next/server";


export const middleware: NextMiddleware = async (req, event) => {
    return NextResponse.next();
}