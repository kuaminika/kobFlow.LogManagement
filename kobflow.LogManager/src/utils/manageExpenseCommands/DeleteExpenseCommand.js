function DeleteExpenseCommand({ listLoader })
{
  const self = this;

  self.execute = async function({ item, stateFns, confirmFn })
  {
    const { setItems, addPending, removePending } = stateFns;

    const confirmMessage = buildConfirmMessage(item);

    if (confirmFn(confirmMessage)) {
      addPending(item.id);
      listLoader.delete(item)
        .then(response => {
          console.log("Deleted:", item);
          console.log("Here's the response:", response);
          setItems(prev => prev.filter(i => i.id !== item.id));
        })
        .catch(err => {
          console.error("Failed to delete item:", err);
        })
        .finally(() => {
          removePending(item.id);
        });
    }
  };

  function buildConfirmMessage(item) {
    const amount = Number(item.amount).toFixed(2);
    const date = item.createdDate
      ? new Date(item.createdDate).toISOString().slice(0, 10)
      : "unknown date";

    return [
      "Are you sure you want to delete this expense?",
      "",
      `Description: ${item.description || "(none)"}`,
      `Amount: $${amount}`,
      `Merchant: ${item.merchantName || "—"}`,
      `Category: ${item.categoryName || "—"}`,
      `Date: ${date}`,
    ].join("\n");
  }
}

export default DeleteExpenseCommand;