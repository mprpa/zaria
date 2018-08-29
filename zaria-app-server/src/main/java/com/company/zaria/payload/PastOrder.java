package com.company.zaria.payload;

import java.time.Instant;
import java.util.List;

public class PastOrder {

    private Long id;
    private Instant creationDateTime;
    private float totalPrice;
    private List<PastOrderItem> items;

    public PastOrder() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Instant getCreationDateTime() {
        return creationDateTime;
    }

    public void setCreationDateTime(Instant creationDateTime) {
        this.creationDateTime = creationDateTime;
    }

    public float getTotalPrice() {
        return totalPrice;
    }

    public void setTotalPrice(float totalPrice) {
        this.totalPrice = totalPrice;
    }

    public List<PastOrderItem> getItems() {
        return items;
    }

    public void setItems(List<PastOrderItem> items) {
        this.items = items;
    }

}
