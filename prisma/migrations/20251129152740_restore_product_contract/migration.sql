-- CreateTable
CREATE TABLE "contracts" (
    "id" TEXT NOT NULL,
    "contractAddress" TEXT NOT NULL,
    "maxSupply" DECIMAL(20,2) NOT NULL,

    CONSTRAINT "contracts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "products" (
    "id" TEXT NOT NULL,
    "productName" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "loanInterest" DECIMAL(5,2) NOT NULL,
    "loanAmount" DECIMAL(20,2) NOT NULL,
    "loanTenor" INTEGER NOT NULL,
    "creditRate" TEXT NOT NULL,
    "contractId" TEXT NOT NULL,

    CONSTRAINT "products_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "contracts_contractAddress_key" ON "contracts"("contractAddress");

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_contractId_fkey" FOREIGN KEY ("contractId") REFERENCES "contracts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
