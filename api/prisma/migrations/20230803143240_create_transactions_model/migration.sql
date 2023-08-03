/*
  Warnings:

  - A unique constraint covering the columns `[user_id]` on the table `bank_accounts` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateTable
CREATE TABLE "transactions" (
    "id" UUID NOT NULL,
    "credited_bank_account_id" UUID NOT NULL,
    "debited_bank_account_id" UUID NOT NULL,
    "bank_account_id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "value" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "transactions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "bank_accounts_user_id_key" ON "bank_accounts"("user_id");

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_credited_bank_account_id_fkey" FOREIGN KEY ("credited_bank_account_id") REFERENCES "bank_accounts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_debited_bank_account_id_fkey" FOREIGN KEY ("debited_bank_account_id") REFERENCES "bank_accounts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_bank_account_id_fkey" FOREIGN KEY ("bank_account_id") REFERENCES "bank_accounts"("id") ON DELETE CASCADE ON UPDATE CASCADE;
