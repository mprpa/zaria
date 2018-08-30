package com.company.zaria.payload;

import java.util.List;

public class OrdersByUser {

    private UserSummary userSummary;

    private List<PastOrder> pastOrders;

    public OrdersByUser() {
    }

    public OrdersByUser(UserSummary userSummary, List<PastOrder> pastOrders) {
        this.userSummary = userSummary;
        this.pastOrders = pastOrders;
    }

    public UserSummary getUserSummary() {
        return userSummary;
    }

    public void setUserSummary(UserSummary userSummary) {
        this.userSummary = userSummary;
    }

    public List<PastOrder> getPastOrders() {
        return pastOrders;
    }

    public void setPastOrders(List<PastOrder> pastOrders) {
        this.pastOrders = pastOrders;
    }

}
