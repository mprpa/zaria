package com.company.zaria.controller;

import com.company.zaria.exception.ResourceNotFoundException;
import com.company.zaria.model.*;
import com.company.zaria.payload.*;
import com.company.zaria.repository.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/article")
public class ArticleController {

    @Autowired
    private ArticleRepository articleRepository;

    @Autowired
    private ArticleStateRepository articleStateRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ColorRepository colorRepository;

    @Autowired
    private OrderRepository orderRepository;

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

    @PostMapping("/placeOrder")
    public ResponseEntity<?> placeOrder(@Valid @RequestBody OrderRequest orderRequest) {

        Order order = new Order();

        User user = userRepository.findByUsername(orderRequest.getUsername())
                .orElseThrow(() -> new ResourceNotFoundException("User", "username", orderRequest.getUsername()));
        order.setUser(user);

        float totalPrice = 0;
        for (ItemRequest itemRequest : orderRequest.getItems()) {
            OrderItem item = new OrderItem();
            item.setArticle(articleRepository.findByCode(itemRequest.getCode()));
            item.setColor(colorRepository.getByCode(itemRequest.getColor()));
            item.setSize(Size.valueOf(itemRequest.getSize()));
            item.setAmount(itemRequest.getQuantity());
            item.setDelivered(false);
            totalPrice += itemRequest.getPrice() * itemRequest.getQuantity();
            order.getItems().add(item);
        }

        order.setTotalPrice(totalPrice);
        order.setPaid(0);

        orderRepository.save(order);

        return ResponseEntity.ok().body(new ApiResponse(true, "Order sent!"));
    }
}
