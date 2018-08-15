package com.company.zaria.model;

import com.company.zaria.model.audit.DateAudit;
import org.hibernate.annotations.NaturalId;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;


@Entity
@Table(name = "article", uniqueConstraints = {
        @UniqueConstraint(columnNames = {
                "code"
        })
})
public class Article extends DateAudit {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NaturalId
    @NotBlank
    @Size(max = 40)
    private String code;

    @NotBlank
    @Size(max = 40)
    private String name;

    @Enumerated(EnumType.STRING)
    @Column(length = 60)
    private Gender gender;

    @Column(columnDefinition = "tinyint(1)")
    private boolean children;

    @NotBlank
    private float retailPrice;

    @NotBlank
    private float wholesalePrice;

    @NotBlank
    private float weight;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "fabric_id", nullable = false)
    private Fabric fabric;

    @OneToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "image_id", nullable = false)
    private Image image;

    public Article() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Gender getGender() {
        return gender;
    }

    public void setGender(Gender gender) {
        this.gender = gender;
    }

    public boolean isChildren() {
        return children;
    }

    public void setChildren(boolean children) {
        this.children = children;
    }

    public float getRetailPrice() {
        return retailPrice;
    }

    public void setRetailPrice(float retailPrice) {
        this.retailPrice = retailPrice;
    }

    public float getWholesalePrice() {
        return wholesalePrice;
    }

    public void setWholesalePrice(float wholesalePrice) {
        this.wholesalePrice = wholesalePrice;
    }

    public float getWeight() {
        return weight;
    }

    public void setWeight(float weight) {
        this.weight = weight;
    }

    public Fabric getFabric() {
        return fabric;
    }

    public void setFabric(Fabric fabric) {
        this.fabric = fabric;
    }

    public Image getImage() {
        return image;
    }

    public void setImage(Image image) {
        this.image = image;
    }
}
