/*
  Warnings:

  - Changed the type of `betResult` on the `Transaction` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `betAmount` on the `Transaction` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `balance` on the `User` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Transaction" DROP COLUMN "betResult",
ADD COLUMN     "betResult" INTEGER NOT NULL,
DROP COLUMN "betAmount",
ADD COLUMN     "betAmount" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "balance",
ADD COLUMN     "balance" INTEGER NOT NULL;
