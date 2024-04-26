
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import { UTApi } from "uploadthing/server";
import type { NextRequest } from "next/server";

const utapi = new UTApi();

export async function POST(req: NextRequest): Promise<NextResponse> {
    const { userId } = auth();
    if (!userId) return new NextResponse("Unauthorized", { status: 401 });

    const { imageKey } = await req.json() as { imageKey: string };

    try {
        const res = await utapi.deleteFiles(imageKey);
        // Correct usage based on the initial assumption
        // const res = await utapi.deleteFiles({ imageKey });

        return NextResponse.json(res);
    } catch (error) {
        console.error(error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
