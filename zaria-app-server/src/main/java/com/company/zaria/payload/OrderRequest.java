package com.company.zaria.payload;

import java.util.List;

public class OrderRequest {

    private String username;

    private List<ItemRequest> items;

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public List<ItemRequest> getItems() {
        return items;
    }

    public void setItems(List<ItemRequest> items) {
        this.items = items;
    }

}

