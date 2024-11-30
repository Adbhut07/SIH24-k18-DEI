-- CreateTable
CREATE TABLE "Room" (
    "id" TEXT NOT NULL,
    "appId" TEXT NOT NULL,
    "channel" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "appCertificate" TEXT NOT NULL,

    CONSTRAINT "Room_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Room_channel_key" ON "Room"("channel");
