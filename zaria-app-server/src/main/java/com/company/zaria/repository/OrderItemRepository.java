package com.company.zaria.repository;

import com.company.zaria.model.Article;
import com.company.zaria.model.Order;
import com.company.zaria.model.OrderItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {

    List<OrderItem> findAllByOrder(Order order);

    List<OrderItem> findAllByArticle(Article article);
    
}
