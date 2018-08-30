package com.company.zaria.payload;

import java.util.List;

public class OrdersByArticle {

    private ArticleInfo articleInfo;

    private List<PastOrderItem> pastOrderItems;

    public OrdersByArticle() {
    }

    public OrdersByArticle(ArticleInfo articleInfo, List<PastOrderItem> pastOrderItems) {
        this.articleInfo = articleInfo;
        this.pastOrderItems = pastOrderItems;
    }

    public ArticleInfo getArticleInfo() {
        return articleInfo;
    }

    public void setArticleInfo(ArticleInfo articleInfo) {
        this.articleInfo = articleInfo;
    }

    public List<PastOrderItem> getPastOrderItems() {
        return pastOrderItems;
    }

    public void setPastOrderItems(List<PastOrderItem> pastOrderItems) {
        this.pastOrderItems = pastOrderItems;
    }

}
