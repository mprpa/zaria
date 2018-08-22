package com.company.zaria.payload;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;

public class MessageResponse {

    private  long id;

    @NotBlank
    @Size(max = 40)
    private String title;

    private String description;

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }
}
