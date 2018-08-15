package com.company.zaria.model;

import com.company.zaria.model.audit.DateAudit;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;

@Entity
@Table(name = "fabric_state", uniqueConstraints = {
        @UniqueConstraint(columnNames = {
                "fabric_id",
                "color_id"
        })
})
public class FabricState extends DateAudit {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "fabric_id", nullable = false)
    private Fabric fabric;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "color_id", nullable = false)
    private Color color;

    @NotBlank
    private float amount;

    public FabricState() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Fabric getFabric() {
        return fabric;
    }

    public void setFabric(Fabric fabric) {
        this.fabric = fabric;
    }

    public Color getColor() {
        return color;
    }

    public void setColor(Color color) {
        this.color = color;
    }

    public float getAmount() {
        return amount;
    }

    public void setAmount(float amount) {
        this.amount = amount;
    }

}
