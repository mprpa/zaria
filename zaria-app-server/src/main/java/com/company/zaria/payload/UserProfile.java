package com.company.zaria.payload;

import java.time.Instant;
import java.util.List;

public class UserProfile {

    private Long id;
    private String username;
    private String name;
    private String email;
    private String password;
    private String address;
    private String phoneNumber;
    private String tin;
    private Instant joinedAt;
    private List<PastOrder> pastOrders;

    public UserProfile(Long id, String username, String name, String email, String password, String address, String phoneNumber, String tin, Instant joinedAt) {
        this.id = id;
        this.username = username;
        this.name = name;
        this.email = email;
        this.password = password;
        this.address = address;
        this.phoneNumber = phoneNumber;
        this.tin = tin;
        this.joinedAt = joinedAt;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public String getTin() {
        return tin;
    }

    public void setTin(String tin) {
        this.tin = tin;
    }

    public Instant getJoinedAt() {
        return joinedAt;
    }

    public void setJoinedAt(Instant joinedAt) {
        this.joinedAt = joinedAt;
    }

    public List<PastOrder> getPastOrders() {
        return pastOrders;
    }

    public void setPastOrders(List<PastOrder> pastOrders) {
        this.pastOrders = pastOrders;
    }
}
