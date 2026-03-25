-- CreateTable
CREATE TABLE "Movie" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "embedding" vector NOT NULL,

    CONSTRAINT "Movie_pkey" PRIMARY KEY ("id")
);
