package com.company.zaria.model;

import com.company.zaria.model.audit.DateAudit;

import javax.persistence.*;
import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;

@Entity
@Table(name = "message")
public class Message extends DateAudit {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Size(max = 40)
    private String name;

    @NotBlank
    @Size(max = 40)
    @Email
    private String email;

    @Lob
    private String message;

    @Column(columnDefinition = "tinyint(1) default 0")
    private boolean seen;

    @Column(columnDefinition = "tinyint(1) default 0")
    private boolean answered;

    public Message() {
    }

    public Message(String name, String email, String message, boolean seen, boolean answered) {
        this.name = name;
        this.email = email;
        this.message = message;
        this.seen = seen;
        this.answered = answered;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public boolean isSeen() {
        return seen;
    }

    public void setSeen(boolean seen) {
        this.seen = seen;
    }

    public boolean isAnswered() {
        return answered;
    }

    public void setAnswered(boolean answered) {
        this.answered = answered;
    }

}
