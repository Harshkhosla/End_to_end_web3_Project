-- CreateTable
CREATE TABLE "public"."User" (
    "id" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Key" (
    "id" SERIAL NOT NULL,
    "User" INTEGER NOT NULL,
    "privateKey" TEXT NOT NULL,
    "publicKey" TEXT NOT NULL,

    CONSTRAINT "Key_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."Key" ADD CONSTRAINT "Key_User_fkey" FOREIGN KEY ("User") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
