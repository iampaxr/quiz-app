"use server";
import prisma from "@repo/db/client";
import bcrypt from "bcrypt";
import { revalidatePath } from "next/cache";
import { prism } from "react-syntax-highlighter/dist/esm/styles/prism";

export async function createAdmin(email: string, pwd: string) {
  try {
    const hashedPassword = await bcrypt.hash(pwd, 10);

    await prisma.admin.create({
      data: {
        email: email,
        password: hashedPassword,
      },
    });

    console.log("Admin created successfully!");
  } catch (error) {
    console.log("Error creating admin:", error);
  }
}

export async function createTopic(formdata: FormData, isPrev?: boolean) {
  try {
    let TopicName = formdata.get("topicName") as string;
    const name = TopicName.trim().replace(/\s+/g, "_").toLowerCase();

    if (name.includes(" ")) {
      return {
        err: true,
        data: null,
        msg: "Something went wrong",
      };
    }
    const isPresent = await prisma.category.findUnique({
      where: {
        name: TopicName,
      },
    });
    if (isPresent) {
      return {
        err: true,
        data: null,
        msg: "category already present",
      };
    }
    const data = await prisma.category.create({
      data: {
        name: TopicName,
        prevTopic: isPrev ? true : false,
      },
    });
    revalidatePath("/");
    return {
      err: false,
      msg: "Successfully created",
      data,
    };
  } catch (error) {
    return {
      err: true,
      data: null,
      msg: "Something went wrong while creating topic",
    };
  }
}

export async function getTopics() {
  const data = await prisma.category.findMany({
    include: {
      question: true,
    },
    where: {
      deleted: false,
      prevTopic: false,
    },
  });
  return {
    err: false,
    msg: "All good",
    data,
  };
}

export async function getPrevTopics() {
  try {
    const data = await prisma.category.findMany({
      where: {
        prevTopic: true,
        deleted: false,
      },
    });
    return {
      err: false,
      msg: "All good",
      data,
    };
  } catch (error) {
    console.error("Error fetching previous topics:", error);
    return {
      err: true,
      msg: "Failed to fetch previous topics",
      data: null,
    };
  }
}

export async function getQuestionsRange(
  topicId: string,
  limit: number,
  page: number = 1
) {
  try {
    const skip = (page - 1) * limit;
    const data = await prisma.question.findMany({
      where: {
        categoryId: topicId,
      },
      include: {
        choice: true,
      },
      skip: skip,
      take: limit,
    });

    const totalQuestions = await prisma.question.count({
      where: {
        categoryId: topicId,
      },
    });

    const totalPages = Math.ceil(totalQuestions / limit);
    revalidatePath(`/topics/${topicId}`);
    return {
      data,
      total: totalQuestions,
      totalPages,
      currentPage: page,
      pageSize: limit,
    };
  } catch (error) {
    console.error("Error fetching questions:", error);
    throw new Error("Failed to fetch questions");
  }
}

export async function getQuestion(id: string) {
  try {
    const data = await prisma.question.findUnique({
      where: {
        id,
      },
      include: {
        choice: true,
      },
    });
    return {
      msg: "fetched successfully",
      err: false,
      data,
    };
  } catch (error) {
    return {
      msg: "Something went wrong",
      err: true,
      data: null,
    };
  }
}

export async function editQuestion(questionId: string) {
  try {
    const findId = await prisma.question.findUnique({
      where: {
        id: questionId,
      },
    });

    if (!findId) {
      return {
        msg: "Choice not present in db",
        err: true,
        data: null,
      };
    }

    await prisma.question.update({
      where: {
        id: questionId,
      },
      data: {},
    });
  } catch (error) {
    return {
      msg: "Seomthing went wrong while editing",
      err: true,
      data: null,
    };
  }
}

export async function deleteChoice(choiceId: string) {
  try {
    const findId = await prisma.choices.findUnique({
      where: {
        id: choiceId,
      },
    });

    if (!findId) {
      return {
        msg: "Choice not present in db",
        err: true,
        data: null,
      };
    }

    await prisma.choices.delete({
      where: {
        id: choiceId,
      },
    });

    return {
      msg: "Choice deleted",
      err: false,
      data: "",
    };
  } catch (error) {
    return {
      msg: "Something went wrong while deleteing",
      err: true,
      data: null,
    };
  }
}

interface ChoiceInput {
  id?: string;
  text: string;
}

interface UpdateQuestionInput {
  id: string;
  title: string;
  categoryId: string;
  question: string;
  choices: ChoiceInput[];
  answer: string[];
}

export async function updateQuestion(questionData: UpdateQuestionInput) {
  try {
    const findId = await prisma.question.findUnique({
      where: {
        id: questionData.id,
      },
    });
    if (!findId) {
      return {
        err: true,
        msg: "Question not present in db",
      };
    }
    const updatedQuestion = await prisma.question.update({
      where: { id: questionData.id },
      data: {
        title: questionData.title,
        categoryId: questionData.categoryId,
        question: questionData.question,
        answer: questionData.answer,
        choice: {
          upsert: questionData.choices.map((choice) => ({
            where: { id: choice.id || "" },
            update: { text: choice.text },
            create: { text: choice.text },
          })),
        },
      },
      include: {
        category: true,
        choice: true,
      },
    });

    const choiceIdsToKeep = new Set(
      questionData.choices.map((c) => c.id).filter(Boolean)
    );
    const choicesToDelete = updatedQuestion.choice.filter(
      (c) => !choiceIdsToKeep.has(c.id)
    );

    if (choicesToDelete.length > 0) {
      await prisma.choices.deleteMany({
        where: {
          id: { in: choicesToDelete.map((c) => c.id) },
        },
      });
    }

    return { err: false, msg: "Successfully updated" };
  } catch (error) {
    console.error("Error updating question:", error);
    return { err: true, msg: "Failed to update question" };
  }
}

export async function deleteCategory(id: string) {
  try {
    // Check if the category exists
    const findId = await prisma.category.findUnique({
      where: { id, deleted: false },
    });

    if (!findId) {
      return {
        msg: "Category not present in db",
        err: true,
      };
    }

    await prisma.category.update({
      where: { id },
      data: {
        deleted: true,
        name: "deleted_" + findId.name + "_" + Date.now(),
      },
    });

    revalidatePath("/topics");

    return {
      msg: "Category successfully deleted",
      err: false,
    };
  } catch (error) {
    console.error("Error deleting category:", error);
    return { err: true, msg: "Failed to delete the category" };
  }
}

export async function editCategoryName(id: string, newName: string) {
  try {
    const findId = await prisma.category.findUnique({
      where: {
        id,
      },
    });

    if (!findId) {
      return {
        msg: "Topic not present in db",
        err: true,
      };
    }

    const findName = await prisma.category.findUnique({
      where: {
        name: newName,
      },
    });

    if (findName) {
      return {
        msg: "Name already present",
        err: true,
      };
    }

    await prisma.category.update({
      where: {
        id,
      },
      data: {
        name: newName,
      },
    });

    return {
      msg: "Topic name updated",
      err: false,
    };
  } catch (error) {
    return {
      msg: "Something went wrong while updating",
      err: true,
    };
  }
}

export async function getDeletedCategorys() {
  try {
    const deletedCategories = await prisma.category.findMany({
      where: {
        deleted: true,
      },
      select: {
        id: true,
        name: true,
      },
    });

    if (deletedCategories.length === 0) {
      return {
        err: true,
        msg: "No deleted categories to undo",
        data: null,
      };
    }

    return {
      err: false,
      msg: "Successfully undone delete",
      data: deletedCategories,
    };
  } catch (error) {
    console.error("Error undoing delete category:", error);
    return {
      err: true,
      msg: "Something went wrong while undo ",
      data: null,
    };
  }
}

export async function undoDeleteCategory(id: string) {
  try {
    const findId = await prisma.category.findUnique({
      where: { id },
    });

    if (!findId) {
      return {
        msg: "Category not present in db",
        err: true,
      };
    }
    const originalName = extractOriginalName(findId.name);
    const idPresent = await prisma.category.findUnique({
      where: {
        name: originalName,
        deleted: false,
      },
    });
    if (idPresent) {
      return {
        msg: "Name with this category already present",
        err: true,
      };
    }
    await prisma.category.update({
      where: { id },
      data: {
        deleted: false,
        name: originalName,
      },
    });
    revalidatePath("/");
    return {
      msg: "Category successfully restored",
      err: false,
    };
  } catch (error) {
    console.error("Error undoing delete category:", error);
    return { err: true, msg: "Failed to undo delete" };
  }
}

function extractOriginalName(fullName: string): string {
  const parts = fullName.split("_");
  if (parts.length >= 3) {
    // Remove the first part ("deleted") and the last part (timestamp)
    return parts.slice(1, -1).join("_");
  }
  return fullName; // Return the full name if it doesn't match the expected format
}

export async function addTopicDoc(name: string) {
  try {
    const findTopic = await prisma.topic.findUnique({
      where: {
        name,
      },
    });
    console.log("inside");
    if (findTopic) {
      return {
        err: true,
        msg: "Topic already present in db",
        data: null,
      };
    }

    const data = await prisma.topic.create({
      data: {
        name,
      },
    });

    console.log("Topic created successfully!", data);
    revalidatePath("/docs");
    return {
      err: false,
      msg: "Topic created",
      data,
    };
  } catch (error) {
    console.log("Error creating topic:", error);
    return {
      err: true,
      msg: "Something went wrong while creating the topic",
      data: null,
    };
  }
}

export async function getTopicDocs() {
  try {
    const data = await prisma.topic.findMany({
      select: {
        id: true,
        name: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    return {
      err: false,
      msg: "All good",
      data,
    };
  } catch (error) {
    console.log(error);
    return {
      err: true,
      msg: "Something went wrong while fetching topics",
      data: null,
    };
  }
}
export async function getTopicDoc(topicId: string) {
  try {
    const data = await prisma.topic.findUnique({
      where: {
        id: topicId,
      },
    });

    if (!data) {
      return {
        err: true,
        msg: "Topic not found",
        data: null,
      };
    }

    return {
      err: false,
      msg: "All good",
      data,
    };
  } catch (error) {
    console.log(error);
    return {
      err: true,
      msg: "Something went wrong while fetching topics",
    };
  }
}

export async function deleteTopicDoc(topicId: string) {
  try {
    const findTopic = await prisma.topic.findUnique({
      where: {
        id: topicId,
      },
    });

    if (!findTopic) {
      return {
        err: true,
        msg: "Topic not found",
      };
    }

    await prisma.userLearningTopicIdsDetails.deleteMany({
      where: {
        topicId: topicId,
      },
    });

    await prisma.topic.delete({
      where: {
        id: topicId,
      },
    });

    return {
      err: false,
      msg: "Topic and attached documents deleted",
    };
  } catch (error) {
    console.log(error);
    return {
      err: true,
      msg: "Something went wrong while deleting topic and documents",
    };
  }
}

export async function editTopicDocName(topicId: string, newName: string) {
  try {
    const findTopic = await prisma.topic.findUnique({
      where: {
        id: topicId,
      },
    });

    if (!findTopic) {
      return {
        err: true,
        msg: "Topic not found",
      };
    }

    const findName = await prisma.topic.findUnique({
      where: {
        name: newName,
      },
    });

    if (findName) {
      return {
        err: true,
        msg: "Name already present",
      };
    }

    await prisma.topic.update({
      where: {
        id: topicId,
      },
      data: {
        name: newName,
      },
    });
    return {
      err: false,
      msg: "Topic name updated",
    };
  } catch (error) {
    console.log(error);
    return {
      err: true,
      msg: "Something went wrong while updating topic name",
    };
  }
}

export async function editParagraph(questionId: string, paragraph: string) {
  try {
    //paragraph is the new paragraph to be added which we get from the rich text editor in the frontend
    const findQuestion = await prisma.question.findUnique({
      where: {
        id: questionId,
      },
    });

    if (!findQuestion) {
      return {
        err: true,
        msg: "Question not found",
      };
    }

    await prisma.question.update({
      where: {
        id: questionId,
      },
      data: {
        paragraph,
      },
    });

    return {
      err: false,
      msg: "Paragraph added",
    };
  } catch (error) {
    console.log(error);
    return {
      err: true,
      msg: "Something went wrong while adding paragraph",
    };
  }
}
