import { NextRequest, NextResponse } from "next/server";
import { getLinkPreview } from "link-preview-js";
import { unstable_noStore } from "next/cache";

export async function POST(request: NextRequest) {
  unstable_noStore();
  try {
    const body = await request.json();
    const data: ImagePreviewResType = (await getLinkPreview(body.url, {
      imagesPropertyType: "og",
      followRedirects: "follow",
    })) as ImagePreviewResType;
    return NextResponse.json({ status: 200, data });
  } catch (error) {
    return NextResponse.json({ status: 404, message: "Not found" });
  }
}
