// Items for input. Items also come from MockAPI.io
class ListItems {
    constructor(itemName, price) {
        this.itemName = itemName;
        this.price = price;
        this.items = [];
    }
// Saves new item and price to the items array 
    addItem(itemName, price) {
        this.items.push(new Item(itemName, price));
    }
}

// A single item and its price 
class Item {
    constructor(itemName, price) {
        this.itemName = itemName;
        this.price = price;
    }
}

class ListItemsService {
    // API endpoint for items and prices with MockAPI.io 
    static url = "https://653148804d4c2e3f333cc983.mockapi.io/stocker/items";

    // This method fetches all items from the API endpoint
    static getAllItems() {
        return $.get(this.url);
    }
    // This method fetches a single item by its ID from the API
    static getItem(id) {
        return $.get(`${this.url}/${id}`);
    }
    // This method sends a POST request to create a new item in the API
    static createItem(item) {
        return $.post(this.url, item);
    }
    // This method sends a PUT request to update an existing item in the API.
    static updateItem(item) {
        return $.ajax({
            url: `${this.url}/${item.id}`, // Specify the URL of the item to be updated
            dataType: 'json', 
            data: JSON.stringify(item), // Send the updated item data as JSON
            contentType: 'application/json', // Set the content type to JSON.
            type: 'PUT' // Use the PUT HTTP method for updates
        });
    }

    // This method sends a DELETE request to remove an item from the API.
    static deleteItem(id) {
        return $.ajax({
            url: `${this.url}/${id}`, // Specify the URL of the item to be deleted
            type: 'DELETE' // Use the DELETE HTTP method for deletion
        });
    }
}

// Interaction between DOM and app data
class DOMManager {
    static items;

    // Fetches all items from the API and renders them
    static getAllItems() {
        ListItemsService.getAllItems().then(items => this.render(items));
    }
    // Creates a new item then refreshes and renders the list of items once one is added
    static createItem(itemName, price) {
        ListItemsService.createItem(new Item(itemName, price))
            .then(() => ListItemsService.getAllItems())
            .then((items) => this.render(items));
    }

    // Deletes an item by the ID and updates the item list
    static deleteItem(id) {
        if (id) {
            ListItemsService.deleteItem(id)
                .then(() => ListItemsService.getAllItems())
                .then(items => this.render(items));
        } else {
            console.error("Invalid item ID for deletion.");
        }
    }
    

    // Edits an item, updating its name and price
    static editItem(id) {
        const itemToUpdate = this.items.find(item => item.id === id);
    
        if (itemToUpdate) {
            const newItemName = prompt("Edit item name:", itemToUpdate.itemName);
            const newPrice = parseFloat(prompt("Edit item price:", itemToUpdate.price));
    
            if (newItemName !== null && !isNaN(newPrice)) {
                itemToUpdate.itemName = newItemName;
                itemToUpdate.price = newPrice;
    
                // Updates the item
                ListItemsService.updateItem(itemToUpdate)
                    .then(() => ListItemsService.getAllItems())
                    .then(items => this.render(items)); 
            }
        }
    }

    static render(items) {
        // Displays the list of items on the web page
        this.items = items;
        $('#app').empty();

        if (items.length === 0) {
            $('#app').append('<p>No items found.</p>');
        } else {
            for (let item of items) {
                // Generates HTML for each item, including buttons for delete and edit
                $('#app').prepend(`
                <div id="${item._id}" class="card my-2" style="background-color: #ffffff; border: none; width: 50%; margin-left: 5em;">
                    <div class="card-body d-flex align-items-center">
                        <div class="col-md-6">
                            <h3 class="card-title text-left">${item.itemName}</h3> {`/* Item Name*/`}
                            <h6 class="card-subtitle text-muted text-left">$${item.price}</h6> {`/* Item price in USD */`}
                        </div>
                        <div class="col-md-6">
                            {`/* Delete and Edit item buttons */`}
                            <div class="btn-group" style="margin-left: 10px;">
                                <button class="btn btn-sm btn-danger" onclick="DOMManager.deleteItem('${item.id}')">Delete</button>
                                <button class="btn btn-sm btn-primary" onclick="DOMManager.editItem('${item.id}')">Edit</button>
                            </div>
                        </div>
                    </div>
                </div>
                `
                );
            }
        }
    }
}
// Listens for a click event to gain new info for a new item and fetches existing items on page load
$(document).ready(function () {
    $('#create-new-item').click(function () {
        const newItemName = $('#new-item-name').val();
        const newItemPrice = parseFloat($('#new-item-price').val());

        // If conditions are met a new item is created and sent to the API
        if (newItemName && !isNaN(newItemPrice)) {
            DOMManager.createItem(newItemName, newItemPrice);
             // Clear input fields
            $('#new-item-name').val('');
            $('#new-item-price').val('');
        }
    });
    // Reads all items in the items array
    DOMManager.getAllItems();
});