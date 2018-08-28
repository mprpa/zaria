package com.company.zaria.controller;

import com.company.zaria.model.Article;
import com.company.zaria.model.ArticleState;
import com.company.zaria.model.Color;
import com.company.zaria.payload.ArticleInfo;
import com.company.zaria.payload.Availability;
import com.company.zaria.repository.ArticleRepository;
import com.company.zaria.repository.ArticleStateRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/article")
public class ArticleController {

    @Autowired
    private ArticleRepository articleRepository;

    @Autowired
    private ArticleStateRepository articleStateRepository;

    private static final Logger logger = LoggerFactory.getLogger(ArticleController.class);

    @GetMapping("/allProducts")
    public List<ArticleInfo> getAllProducts() {
        List<ArticleInfo> articles = new ArrayList<>();

        List<Article> articleList = articleRepository.findAll();

        for(Article article : articleList) {
            ArticleInfo articleInfo = new ArticleInfo();
            articleInfo.setCode(article.getCode());
            articleInfo.setName(article.getName());
            articleInfo.setGender(article.getGender());
            articleInfo.setChildren(article.isChildren());
            articleInfo.setRetailPrice(article.getRetailPrice());
            articleInfo.setWholesalePrice(article.getWholesalePrice());
            articleInfo.setFabric(article.getFabric().getComposition());
            articleInfo.setImagePath(article.getImage().getPath());
            List<String> colors = new ArrayList<>();
            for(Color color : article.getFabric().getColors()) {
                colors.add(color.getCode());
            }
            articleInfo.setColors(colors);

            if(articleStateRepository.existsByArticle(article)) {
                List<Availability> availabilities = new ArrayList<>();
                for(ArticleState articleState : articleStateRepository.getAllByArticle(article)) {
                    Availability a = new Availability();
                    a.setColor(articleState.getColor().getCode());
                    a.setSize(articleState.getSize().name());
                    a.setAmount(articleState.getAmount());
                    availabilities.add(a);
                }
                articleInfo.setAvailabilities(availabilities);
            }

            articles.add(articleInfo);
        }

        return articles;
    }
}
