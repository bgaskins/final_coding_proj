const URL = "https://653148804d4c2e3f333cc983.mockapi.io/stocker/items";

// Create
function createItemsList(itemsList) {
    return $.ajax({
        url: URL,
        data: JSON.stringify(itemsList),
        dataType: "json",
        type: "POST",
        contentType: "application/json",
        crossDomain: true
    });
}

// Read
function getItemsList() {
    return $.get(URL);
}

// Update
function updateItems(itemsListData) {
    const newItem = itemsListData.itemName;
    const itemId = parseInt(itemsListData.id);

    return $.ajax({
        url: `${URL}/${itemId}`,
        dataType: "json",
        data: JSON.stringify({ itemName: newItem }),
        contentType: "application/json",
        crossDomain: true,
        type: "PUT"
    });
}

// Delete
function deleteItems(id) {
    return $.ajax({
        url: `${URL}/${parseInt(id.id)}`,
        type: "DELETE"
    });
}