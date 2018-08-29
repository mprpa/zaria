package com.company.zaria.repository;

import com.company.zaria.model.Article;
import com.company.zaria.model.ArticleState;
import com.company.zaria.model.Color;
import com.company.zaria.model.Size;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ArticleStateRepository extends JpaRepository<ArticleState, Long> {

    List<ArticleState> findAllByAmountGreaterThan(int amount);

    boolean existsByArticle(Article article);

    List<ArticleState> getAllByArticle(Article article);

    ArticleState getByArticleAndColorAndSize(Article article, Color color, Size size);

}
