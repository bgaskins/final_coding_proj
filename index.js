class ListItems {
    constructor(itemName, price) {
        this.itemName = itemName;
        this.price = price;
        this.items = [];
    }

    addItem(itemName, price) {
        this.items.push(new Item(itemName, price));
    }
}

class Item {
    constructor(itemName, price) {
        this.itemName = itemName;
        this.price = price;
    }
}

class ListItemsService {
    static url = "https://653148804d4c2e3f333cc983.mockapi.io/stocker/items";

    static getAllItems() {
        return $.get(this.url);
    }

    static getItem(id) {
        return $.get(`${this.url}/${id}`);
    }

    static createItem(item) {
        return $.post(this.url, item);
    }

    static updateItem(item) {
        return $.ajax({
            url: `${this.url}/${item.id}`,
            dataType: 'json',
            data: JSON.stringify(item),
            contentType: 'application/json',
            type: 'PUT'
        });
    }

    static deleteItem(id) {
        return $.ajax({
            url: `${this.url}/${id}`,
            type: 'DELETE'
        });
    }
}

class DOMManager {
    static items;

    static getAllItems() {
        ListItemsService.getAllItems().then(items => this.render(items));
    }

    static createItem(itemName, price) {
        ListItemsService.createItem(new Item(itemName, price))
            .then(() => ListItemsService.getAllItems())
            .then((items) => this.render(items));
    }

    static deleteItem(id) {
        if (id) {
            ListItemsService.deleteItem(id)
                .then(() => ListItemsService.getAllItems())
                .then(items => this.render(items));
        } else {
            console.error("Invalid item ID for deletion.");
        }
    }
    

    
    static editItem(id) {
        const itemToUpdate = this.items.find(item => item.id === id);
    
        if (itemToUpdate) {
            const newItemName = prompt("Edit item name:", itemToUpdate.itemName);
            const newPrice = parseFloat(prompt("Edit item price:", itemToUpdate.price));
    
            if (newItemName !== null && !isNaN(newPrice)) {
                itemToUpdate.itemName = newItemName;
                itemToUpdate.price = newPrice;
    
                ListItemsService.updateItem(itemToUpdate)
                    .then(() => ListItemsService.getAllItems())
                    .then(items => this.render(items));
            }
        }
    }

    static render(items) {
        this.items = items;
        $('#app').empty();

        if (items.length === 0) {
            $('#app').append('<p>No items found.</p>');
        } else {
            for (let item of items) {
                $('#app').prepend(`
                    <div id="${item._id}" class="card">
                        <div class="card-header">
                            <h3>${item.itemName}</h3>
                            <h6>$${item.price}</h6>
                            <button class="btn btn-danger" onclick="DOMManager.deleteItem('${item.id}')">Delete</button>
                            <button class="btn btn-primary" onclick="DOMManager.editItem('${item.id}')">Edit</button>
                        </div>
                    </div>`
                );
            }
        }
    }
}

$(document).ready(function () {
    $('#create-new-item').click(function () {
        const newItemName = $('#new-item-name').val();
        const newItemPrice = parseFloat($('#new-item-price').val());

        if (newItemName && !isNaN(newItemPrice)) {
            DOMManager.createItem(newItemName, newItemPrice);
            $('#new-item-name').val('');
            $('#new-item-price').val('');
        }
    });

    DOMManager.getAllItems();
});