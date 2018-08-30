package com.company.zaria.payload;

import java.util.List;

public class AllOrders {

    private List<PastOrder> legalUserOrders;

    private List<PastOrder> orderFromState;

    private List<OrdersByUser> ordersByUser;

    private List<OrdersByArticle> ordersByArticle;

    public List<PastOrder> getLegalUserOrders() {
        return legalUserOrders;
    }

    public void setLegalUserOrders(List<PastOrder> legalUserOrders) {
        this.legalUserOrders = legalUserOrders;
    }

    public List<PastOrder> getOrderFromState() {
        return orderFromState;
    }

    public void setOrderFromState(List<PastOrder> orderFromState) {
        this.orderFromState = orderFromState;
    }

    public List<OrdersByUser> getOrdersByUser() {
        return ordersByUser;
    }

    public void setOrdersByUser(List<OrdersByUser> ordersByUser) {
        this.ordersByUser = ordersByUser;
    }

    public List<OrdersByArticle> getOrdersByArticle() {
        return ordersByArticle;
    }

    public void setOrdersByArticle(List<OrdersByArticle> ordersByArticle) {
        this.ordersByArticle = ordersByArticle;
    }

}
