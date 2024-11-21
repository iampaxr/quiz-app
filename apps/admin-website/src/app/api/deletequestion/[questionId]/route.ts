import prisma from "@repo/db/client";
import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  { params }: { params: { questionId: string } }
) {
  try {
    const findId = await prisma.question.findUnique({
      where: {
        id: params.questionId,
      },
    });

    if (!findId) {
      return NextResponse.json(
        { msg: "Question not found", err: true },
        { status: 404 }
      );
    }

    await prisma.question.delete({
      where: {
        id: params.questionId,
      },
    });

    return NextResponse.json(
      { msg: "Successfully deleted", err: false },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting question:", error);
    return NextResponse.json(
      { msg: "Something went wrong", err: true },
      { status: 500 }
    );
  }
}
