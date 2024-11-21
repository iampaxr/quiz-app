import { GetObjectCommand } from "@aws-sdk/client-s3";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@repo/db/client";
import { s3 } from "@/src/lib/utils";
import { Readable } from "stream";

// Helper function to convert Node.js Readable stream to Buffer
async function streamToBuffer(stream: Readable): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    stream.on("data", (chunk) => chunks.push(chunk));
    stream.on("error", reject);
    stream.on("end", () => resolve(Buffer.concat(chunks)));
  });
}

// Function to get the document from S3
async function getDocumentFromS3(s3Key: string): Promise<Buffer> {
  const s3Params = {
    Bucket: "quiz-app-doctor",
    Key: s3Key,
  };

  try {
    const command = new GetObjectCommand(s3Params);
    const response = await s3.send(command);

    // Convert the readable stream (Node.js stream) to a Buffer
    if (response.Body instanceof Readable) {
      return streamToBuffer(response.Body);
    } else {
      throw new Error("Unexpected stream type");
    }
  } catch (error) {
    console.error("Error retrieving document from S3:", error);
    throw new Error("Failed to retrieve document from storage");
  }
}

export async function GET(
  request: NextRequest,
  {
    params,
  }: {
    params: { topicId: string };
  }
) {
  try {
    const { searchParams } = new URL(request.url);
    const topicId = params.topicId;

    if (!topicId) {
      return NextResponse.json(
        { error: true, message: "Missing topicId parameter" },
        { status: 400 }
      );
    }

    // Step 1: Query the database to get the document details
    const topic = await prisma.topic.findUnique({
      where: { id: topicId },
    });

    if (!topic) {
      return NextResponse.json(
        { error: true, message: "No document found for the given topicId" },
        { status: 404 }
      );
    }

    if (topic.docfileName === null) {
      return NextResponse.json(
        { error: true, message: "No pdf found for the given topicId" },
        { status: 404 }
      );
    }

    const s3Key = topic.docfileName;

    let pdfBuffer;
    try {
      pdfBuffer = await getDocumentFromS3(s3Key);
    } catch (error) {
      return NextResponse.json(
        { error: true, message: "Failed to retrieve document" },
        { status: 500 }
      );
    }

    return new NextResponse(pdfBuffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `inline; filename="${topic.docfileName}.pdf"`,
      },
    });
  } catch (error) {
    console.error("Error retrieving document:", error);
    return NextResponse.json(
      {
        error: true,
        message: "An error occurred while retrieving the document",
      },
      { status: 500 }
    );
  }
}
