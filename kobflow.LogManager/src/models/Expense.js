class Expense {
  constructor({
    id,
    description,
    ownerId,
    amount,
    merchantId,
    merchantName,
    createdDate,
    kobHolderName,
    kobHolderId,
    categoryId,
    categoryName
  } = {}) {
    this.id = id || 0;
    this.description = description || '';
    this.ownerId = ownerId || 0;
    this.amount = amount || 0.0;
    this.merchantId = merchantId || 0;
    this.merchantName = merchantName || '';
    this.createdDate = createdDate || new Date();
    this.kobHolderName = kobHolderName || '';
    this.kobHolderId = kobHolderId || 0;
    this.categoryId = categoryId || 0;
    this.categoryName = categoryName || '';
  }
}

 
 export default Expense;