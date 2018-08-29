package com.company.zaria.model;

import com.company.zaria.model.audit.UserDateAudit;
import org.hibernate.annotations.Fetch;
import org.hibernate.annotations.FetchMode;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "orders")
public class Order extends UserDateAudit {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToMany(
            mappedBy = "order",
            cascade = CascadeType.ALL,
            fetch = FetchType.EAGER,
            orphanRemoval = true
    )
    @Fetch(FetchMode.SELECT)
    private List<OrderItem> items = new ArrayList<>();

    private float totalPrice;

    private float paid;

    @Column(columnDefinition = "tinyint(1) default 0")
    private boolean fromState;

    public Order() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public List<OrderItem> getItems() {
        return items;
    }

    public void setItems(List<OrderItem> items) {
        this.items = items;
    }

    public float getTotalPrice() {
        return totalPrice;
    }

    public void setTotalPrice(float totalPrice) {
        this.totalPrice = totalPrice;
    }

    public float getPaid() {
        return paid;
    }

    public void setPaid(float paid) {
        this.paid = paid;
    }

    public boolean isFromState() { return fromState; }

    public void setFromState(boolean fromState) { this.fromState = fromState; }
}
