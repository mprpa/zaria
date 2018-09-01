package com.company.zaria.payload;

import java.util.List;

public class FabricStateInfo {

    private Long id;

    private String composition;

    private List<FabricColorState> colors;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getComposition() {
        return composition;
    }

    public void setComposition(String composition) {
        this.composition = composition;
    }

    public List<FabricColorState> getColors() {
        return colors;
    }

    public void setColors(List<FabricColorState> colors) {
        this.colors = colors;
    }

}
