package com.company.zaria.model;

import com.company.zaria.model.audit.DateAudit;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;

@Entity
@Table(name = "article_state", uniqueConstraints = {
        @UniqueConstraint(columnNames = {
                "article_id",
                "color_id"
        })
})
public class ArticleState extends DateAudit {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "article_id", nullable = false)
    private Article article;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "color_id", nullable = false)
    private Color color;

    @Enumerated(EnumType.STRING)
    @Column(length = 5)
    private Size size;

    private int amount;

    public ArticleState() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Article getArticle() {
        return article;
    }

    public void setArticle(Article article) {
        this.article = article;
    }

    public Color getColor() {
        return color;
    }

    public void setColor(Color color) {
        this.color = color;
    }

    public Size getSize() {
        return size;
    }

    public void setSize(Size size) {
        this.size = size;
    }

    public int getAmount() {
        return amount;
    }

    public void setAmount(int amount) {
        this.amount = amount;
    }

}
