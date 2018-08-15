package com.company.zaria.repository;

import com.company.zaria.model.ArticleState;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ArticleStateRepository extends JpaRepository<ArticleState, Long> {
}
