package com.company.zaria.repository;

import com.company.zaria.model.Article;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ArticleRepository extends JpaRepository <Article, Long> {

    Boolean existsByCode(String code);

}
