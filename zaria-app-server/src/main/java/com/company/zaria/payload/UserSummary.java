package com.company.zaria.payload;

public class UserSummary {

    private Long id;
    private String username;
    private String name;
    private boolean admin;

    public UserSummary(Long id, String username, String name, boolean admin) {
        this.id = id;
        this.username = username;
        this.name = name;
        this.admin = admin;
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

    public boolean isAdmin() {
        return admin;
    }

    public void setAdmin(boolean admin) {
        this.admin = admin;
    }

}
