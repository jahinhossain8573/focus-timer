"use server";

import { Session } from "inspector";
import { PrismaClient } from "../generated/prisma";
import prisma from "@/app/db";

export async function dbLog(duration, title) {
  await prisma.session.create({
    data: {
      time: Number(duration),
      title: title,
    },
  });
}
