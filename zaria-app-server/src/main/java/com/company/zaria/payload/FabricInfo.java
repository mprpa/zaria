package com.company.zaria.payload;

public class FabricInfo {

    private int totalCount;

    private int runningLowCount;

    private int notEnoughCount;

    public int getTotalCount() {
        return totalCount;
    }

    public void setTotalCount(int totalCount) {
        this.totalCount = totalCount;
    }

    public int getRunningLowCount() {
        return runningLowCount;
    }

    public void setRunningLowCount(int runningLowCount) {
        this.runningLowCount = runningLowCount;
    }

    public int getNotEnoughCount() {
        return notEnoughCount;
    }

    public void setNotEnoughCount(int notEnoughCount) {
        this.notEnoughCount = notEnoughCount;
    }
}
