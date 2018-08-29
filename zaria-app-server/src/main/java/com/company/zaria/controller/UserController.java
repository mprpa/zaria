package com.company.zaria.controller;

import com.company.zaria.exception.ResourceNotFoundException;
import com.company.zaria.model.*;
import com.company.zaria.payload.*;
import com.company.zaria.repository.MessageRepository;
import com.company.zaria.repository.OrderRepository;
import com.company.zaria.repository.UserRepository;
import com.company.zaria.security.CurrentUser;
import com.company.zaria.security.UserPrincipal;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private  MessageRepository messageRepository;

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    PasswordEncoder passwordEncoder;

    private static final Logger logger = LoggerFactory.getLogger(UserController.class);

    @GetMapping("/user/me")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public UserSummary getCurrentUser(@CurrentUser UserPrincipal currentUser) {
        User user = userRepository.findByUsername(currentUser.getUsername())
                .orElseThrow(() -> new ResourceNotFoundException("User", "username", currentUser.getUsername()));

        UserSummary userSummary = new UserSummary(currentUser.getId(),
                currentUser.getUsername(),
                currentUser.getName(),
                user.getAddress(),
                user.getPhoneNumber(),
                currentUser.getAuthorities().iterator().next().getAuthority() == RoleName.ROLE_ADMIN.name(),
                currentUser.getAuthorities().iterator().next().getAuthority() == RoleName.ROLE_USER_LEGAL.name());
        return userSummary;
    }

    @GetMapping("/user/checkUsernameAvailability")
    public UserIdentityAvailability checkUsernameAvailability(@RequestParam(value = "username") String username) {
        Boolean isAvailable = !userRepository.existsByUsername(username);
        return new UserIdentityAvailability(isAvailable);
    }

    @GetMapping("/user/checkEmailAvailability")
    public UserIdentityAvailability checkEmailAvailability(@RequestParam(value = "email") String email) {
        Boolean isAvailable = !userRepository.existsByEmail(email);
        return new UserIdentityAvailability(isAvailable);
    }

    @GetMapping("/users/{username}")
    @PreAuthorize("hasRole('USER')")
    public UserProfile getUserProfile(@PathVariable(value = "username") String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User", "username", username));

        List<Order> orders = orderRepository.findAllByCreatedBy(user.getId());
        List<PastOrder> pastOrders = new ArrayList<>();
        for(Order order : orders) {
            PastOrder pastOrder = new PastOrder();
            pastOrder.setId(order.getId());
            pastOrder.setCreationDateTime(order.getCreatedAt());
            pastOrder.setTotalPrice(order.getTotalPrice());
            List<PastOrderItem> pastOrderItems = new ArrayList<>();
            for(OrderItem item : order.getItems()) {
                PastOrderItem pastOrderItem = new PastOrderItem();
                pastOrderItem.setImage(item.getArticle().getImage().getPath());
                pastOrderItem.setName(item.getArticle().getName());
                pastOrderItem.setCode(item.getArticle().getCode());
                pastOrderItem.setColor(item.getColor().getCode());
                pastOrderItem.setSize(item.getSize().name());
                pastOrderItem.setPrice(user.getRole().getName() == RoleName.ROLE_USER_LEGAL ?
                        item.getArticle().getWholesalePrice() :
                        item.getArticle().getRetailPrice());
                pastOrderItem.setQuantity(item.getAmount());
                pastOrderItems.add(pastOrderItem);
            }
            pastOrder.setItems(pastOrderItems);
            pastOrders.add(pastOrder);
        }

        UserProfile userProfile = new UserProfile(user.getId(),
                user.getUsername(),
                user.getName(),
                user.getEmail(),
                user.getPassword(),
                user.getAddress(),
                user.getPhoneNumber(),
                user.getTin(),
                user.getCreatedAt());
        userProfile.setPastOrders(pastOrders);

        return userProfile;
    }

    @PostMapping("/users/{username}/edit")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<?> editUserProfile(@PathVariable(value = "username") String username, @Valid @RequestBody SignUpRequest signUpRequest) {
        User user = userRepository.findByUsername(signUpRequest.getUsername())
                .orElseThrow(() -> new ResourceNotFoundException("User", "username", username));

        user.setPassword(passwordEncoder.encode(signUpRequest.getPassword()));
        user.setAddress(signUpRequest.getAddress());
        user.setPhoneNumber(signUpRequest.getPhoneNumber());

        userRepository.save(user);

        return ResponseEntity.ok().body(new ApiResponse(true, "User's info changed successfully"));
    }

    @PostMapping("/sendMessage")
    public ResponseEntity<?> sendMessage(@Valid @RequestBody MessageRequest messageRequest) {

        Message message = new Message(messageRequest.getName(),
                messageRequest.getEmail(),
                messageRequest.getMessage(),
                false,
                false);

        Message reponse = messageRepository.save(message);

        return ResponseEntity.ok().body(new ApiResponse(true, "Message sent!"));
    }

}
