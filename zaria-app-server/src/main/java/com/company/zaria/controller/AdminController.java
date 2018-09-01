package com.company.zaria.controller;

import com.company.zaria.exception.AppException;
import com.company.zaria.model.*;
import com.company.zaria.payload.*;
import com.company.zaria.repository.*;
import com.company.zaria.util.AppConstants;
import com.company.zaria.util.EmailService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.validation.Valid;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    @Autowired
    private ArticleRepository articleRepository;

    @Autowired
    private ImageRepository imageRepository;

    @Autowired
    private FabricRepository fabricRepository;

    @Autowired
    private ColorRepository colorRepository;

    @Autowired
    private MessageRepository messageRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private OrderItemRepository orderItemRepository;

    @Autowired
    private FabricStateRepository fabricStateRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private EmailService emailService;

    @Value("${file.upload-dir}")
    private String uploadDirectory;

    @Value("${file.upload-extensions}")
    private String validExtensions;

    private static final Logger logger = LoggerFactory.getLogger(AdminController.class);

    @GetMapping("/checkArticleAvailability")
    public ArticleCodeAvailability checkArticleCodeAvailability(@RequestParam(value = "code") String code) {
        Boolean isAvailable = !articleRepository.existsByCode(code);
        return new ArticleCodeAvailability(isAvailable);
    }

    @RequestMapping(value = "/upload", method = RequestMethod.POST)
    public ResponseEntity<?> handleImageUpload(
            @RequestParam("file") MultipartFile file) throws IOException {
        if (!file.isEmpty()) {

            String fileName = file.getOriginalFilename();
            String cleanFileName = fileName.replaceAll("[^A-Za-z0-9.()]", "");
            String extension = getFileExtension(cleanFileName);

            if (extension == null) {
                return ResponseEntity.status(HttpStatus.UNPROCESSABLE_ENTITY).body("No file extension.");
            }

            extension = extension.toLowerCase();

            boolean correctExtension = false;
            for (String validExtension : validExtensions.split(",")) {
                if (extension.equals(validExtension)) {
                    correctExtension = true;
                }
            }
            if(!correctExtension) {
                return ResponseEntity.status(HttpStatus.UNPROCESSABLE_ENTITY).body("Invalid File Extension");
            }

            Path path = Paths.get(uploadDirectory, fileName);
            Files.copy(file.getInputStream(), path);

            Image image = new Image();
            image.setPath(path.toString());
            image.setType(extension);
            imageRepository.save(image);

            return ResponseEntity.ok().body(new ApiResponse(true, "Image uploaded successfully with id: " + image.getId() + "!"));
        } else {
            return ResponseEntity.status(HttpStatus.UNPROCESSABLE_ENTITY).body("You failed to upload image because the file was empty.");
        }
    }

    @PostMapping("/newArticle")
    public ResponseEntity<?> createArticle(@Valid @RequestBody NewArticleRequest newArticleRequest) {
        if(articleRepository.existsByCode(newArticleRequest.getCode())) {
            return new ResponseEntity(new ApiResponse(false, "Code is already taken!"),
                    HttpStatus.BAD_REQUEST);
        }

        Article article = new Article();

        article.setCode(newArticleRequest.getCode());
        article.setName(newArticleRequest.getName());
        article.setGender("male".equals(newArticleRequest.getGender()) ? Gender.MALE : Gender.FEMALE);
        article.setChildren(newArticleRequest.isChildren());
        article.setRetailPrice(newArticleRequest.getRetailPrice());
        article.setWholesalePrice(newArticleRequest.getWholesalePrice());
        article.setWeight(newArticleRequest.getWeight());

        Fabric fabric;
        if(fabricRepository.existsByComposition(newArticleRequest.getFabric())) {
            fabric = fabricRepository.getByComposition(newArticleRequest.getFabric());
        } else {
            fabric = new Fabric();
            fabric.setComposition(newArticleRequest.getFabric());
        }

        for(String colorCode: newArticleRequest.getColors()) {
            Color color;
            if(colorRepository.existsByCode(colorCode)) {
                color = colorRepository.getByCode(colorCode);
            } else {
                color = new Color();
                color.setCode(colorCode);
                color.setName(colorCode);
            }
            color.getFabrics().add(fabric);
            color.setFabrics(color.getFabrics().stream().distinct().collect(Collectors.toList()));

            fabric.getColors().add(color);
            fabric.setColors(fabric.getColors().stream().distinct().collect(Collectors.toList()));

            if(!fabricStateRepository.existsByFabricAndColor(fabric, color)) {
                FabricState fabricState = new FabricState();
                fabricState.setFabric(fabric);
                fabricState.setColor(color);
                fabricState.setAmount(0);
                fabricState.setReserved(0);
                fabricStateRepository.save(fabricState);
            }
        }

        fabricRepository.save(fabric);

        article.setFabric(fabric);
        article.setImage(imageRepository.getById(newArticleRequest.getImageId()));

        articleRepository.save(article);

        return ResponseEntity.ok().body(new ApiResponse(true, "Article created successfully!"));
    }

    @GetMapping("/numUnreadMessages")
    public NotAnsweredMessages getUnreadMessages() {
        NotAnsweredMessages notAnsweredMessages = new NotAnsweredMessages();

        List<Message> messages = messageRepository.findAllByAnswered(false);
        for(Message message : messages) {
            NotAnsweredMessage notAnsweredMessage = new NotAnsweredMessage();
            notAnsweredMessage.setId(message.getId());
            notAnsweredMessage.setEmail(message.getEmail());
            notAnsweredMessage.setName(message.getName());
            notAnsweredMessage.setMessage(message.getMessage());
            notAnsweredMessage.setSeen(message.isSeen());
            notAnsweredMessages.getMessageList().add(notAnsweredMessage);
        }

        messages = messageRepository.findAllBySeen(false);
        notAnsweredMessages.setCountUnseen(messages.size());

        return notAnsweredMessages;
    }

    @GetMapping("/readMessages")
    public ResponseEntity<?> readMessages() {

        List<Message> messages = messageRepository.findAllBySeen(false);
        for(Message message : messages) {
            message.setSeen(true);
            messageRepository.save(message);
        }

        return ResponseEntity.ok().body(new ApiResponse(true, "Messages read!"));
    }

    @PostMapping("/sendMessageResponse")
    public ResponseEntity<?> sendMessageResponse(@Valid @RequestBody MessageResponse messageResponse) {

        Message message = messageRepository.findByIdIn(new ArrayList<>(Arrays.asList(messageResponse.getId()))).get(0);

        emailService.sendSimpleMessage(message.getEmail(), messageResponse.getTitle(), messageResponse.getDescription());

        message.setAnswered(true);
        messageRepository.save(message);

        return ResponseEntity.ok().body(new ApiResponse(true, "Message sent!"));
    }

    @PostMapping("/newUser")
    public ResponseEntity<?> addNewUser(@Valid @RequestBody NewUserRequest newUserRequest) {

        // Creating user's account
        User user = new User(newUserRequest.getTin(),
                newUserRequest.getTin() + "@zaria.com",
                newUserRequest.getTin(),
                newUserRequest.getName(),
                newUserRequest.getTin(),
                newUserRequest.getAddress(),
                newUserRequest.getPhoneNumber());

        user.setPassword(passwordEncoder.encode(user.getPassword()));

        Role userRole = roleRepository.findByName(RoleName.ROLE_USER_LEGAL)
                .orElseThrow(() -> new AppException("User Role not set."));

        user.setRole(userRole);

        userRepository.save(user);

        return ResponseEntity.ok().body(new ApiResponse(true, "User added!"));
    }

    @GetMapping("/allLegalUsers")
    public List<UserSummary> getAllLegalUsers() {
        List<UserSummary> userSummaries = new ArrayList<>();

        Role userRole = roleRepository.findByName(RoleName.ROLE_USER_LEGAL)
                .orElseThrow(() -> new AppException("User Role not set."));
        List<User> users = userRepository.findByRole(userRole);

        for(User user : users) {
            UserSummary userSummary = new UserSummary(user.getId(),
                    user.getUsername(),
                    user.getName(),
                    user.getAddress(),
                    user.getPhoneNumber(),
                    false,
                    true);
            userSummary.setTin(user.getTin());

            userSummaries.add(userSummary);
        }

        return userSummaries;
    }

    @GetMapping("/allOrders")
    public AllOrders getAllOrders() {
        AllOrders allOrders = new AllOrders();

        List<Order> orders = orderRepository.findAll();
        List<PastOrder> pastOrders = new ArrayList<>();
        for(Order order : orders) {
            if(order.getPaid() >= order.getTotalPrice()) {
                continue;
            }

            User user = order.getUser();
            UserSummary userSummary = new UserSummary(user.getId(),
                    user.getUsername(),
                    user.getName(),
                    user.getAddress(),
                    user.getPhoneNumber(),
                    false,
                    user.getRole().getName() == RoleName.ROLE_USER_LEGAL);
            userSummary.setTin(user.getTin());

            PastOrder pastOrder = new PastOrder();
            pastOrder.setUser(userSummary);
            pastOrder.setId(order.getId());
            pastOrder.setCreationDateTime(order.getCreatedAt());
            pastOrder.setTotalPrice(order.getTotalPrice());
            pastOrder.setPaid(order.getPaid());
            pastOrder.setFromState(order.isFromState());

            List<PastOrderItem> pastOrderItems = new ArrayList<>();
            for(OrderItem item : order.getItems()) {
                PastOrderItem pastOrderItem = new PastOrderItem();
                pastOrderItem.setId(item.getId());
                pastOrderItem.setUser(userSummary.getName());
                pastOrderItem.setTin(userSummary.getTin());
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

        List<PastOrder> pastLegalOrders = pastOrders.stream().filter(pastOrder -> !pastOrder.isFromState()).collect(Collectors.toList());
        allOrders.setLegalUserOrders(pastLegalOrders);
        allOrders.setOrderFromState(pastOrders.stream().filter(pastOrder -> pastOrder.isFromState()).collect(Collectors.toList()));

        Map<UserSummary, List<PastOrder>> ordersByUser = new HashMap<>();
        for(PastOrder pastOrder : pastLegalOrders) {
            List<PastOrder> userOrders;
            if(ordersByUser.containsKey(pastOrder.getUser())) {
                userOrders = ordersByUser.get(pastOrder.getUser());
            } else {
                userOrders = new ArrayList<>();
            }
            userOrders.add(pastOrder);
            ordersByUser.put(pastOrder.getUser(), userOrders);
        }
        List<OrdersByUser> ordersByUserList = ordersByUser.entrySet()
                .stream()
                .map(e -> new OrdersByUser(e.getKey(), e.getValue()))
                .collect(Collectors.toList());
        allOrders.setOrdersByUser(ordersByUserList);

        Map<ArticleInfo, List<PastOrderItem>> ordersByArticle = new HashMap<>();
        for(PastOrder pastOrder : pastLegalOrders) {
            for(PastOrderItem pastOrderItem : pastOrder.getItems()) {
                ArticleInfo articleInfo = new ArticleInfo();
                articleInfo.setCode(pastOrderItem.getCode());
                articleInfo.setFabric(articleRepository.findByCode(pastOrderItem.getCode()).getFabric().getComposition());
                articleInfo.setName(pastOrderItem.getName());
                articleInfo.setImagePath(pastOrderItem.getImage());
                List<PastOrderItem> articleOrderItems;
                if(ordersByArticle.containsKey(articleInfo)) {
                    articleOrderItems = ordersByArticle.get(articleInfo);
                } else {
                    articleOrderItems = new ArrayList<>();
                }
                articleOrderItems.add(pastOrderItem);
                ordersByArticle.put(articleInfo, articleOrderItems);
            }
        }
        List<OrdersByArticle> ordersByArticleList = ordersByArticle.entrySet()
                .stream()
                .map(e -> new OrdersByArticle(e.getKey(), e.getValue()))
                .collect(Collectors.toList());
        allOrders.setOrdersByArticle(ordersByArticleList);

        return allOrders;
    }

    @GetMapping("/sendArticlesFromState/{orderId}")
    public ResponseEntity<?> sendArticlesFromState(@PathVariable Long orderId) {

        Order order = orderRepository.getOne(orderId);
        order.setPaid(order.getTotalPrice());
        for(OrderItem orderItem : order.getItems()) {
            orderItem.setDelivered(true);
        }
        orderRepository.save(order);

        return ResponseEntity.ok().body(new ApiResponse(true, "Order sent!"));
    }

    @GetMapping("/updateOrderPaidValue/{orderId}/{value}")
    public ResponseEntity<?> updateOrderPaidValue(@PathVariable(value = "orderId") Long orderId, @PathVariable(value = "value") int value) {

        Order order = orderRepository.getOne(orderId);
        order.setPaid(order.getPaid() + value);
        orderRepository.save(order);

        return ResponseEntity.ok().body(new ApiResponse(true, "Order updated!"));
    }

    @GetMapping("/deliverItem/{itemId}")
    public ResponseEntity<?> deliverItem(@PathVariable Long itemId) {

        OrderItem orderItem = orderItemRepository.getOne(itemId);
        orderItem.setDelivered(true);
        orderItemRepository.save(orderItem);

        Article article = orderItem.getArticle();
        FabricState fabricState = fabricStateRepository.getByFabricAndColor(article.getFabric(), orderItem.getColor());
        float fabric = article.getWeight() * AppConstants.SIZE_FLOAT_MAP.get(orderItem.getSize());
        fabricState.setReserved(fabricState.getReserved() - fabric);
        fabricState.setAmount(fabricState.getAmount() - fabric);

        return ResponseEntity.ok().body(new ApiResponse(true, "Item delivered!"));
    }

    @GetMapping("/allFabrics")
    public List<FabricStateInfo> getAllFabrics() {
        List<FabricStateInfo> fabricStateInfos = new ArrayList<>();

        List<Fabric> fabrics = fabricRepository.findAll();
        for(Fabric fabric : fabrics) {
            FabricStateInfo fabricStateInfo = new FabricStateInfo();

            fabricStateInfo.setId(fabric.getId());
            fabricStateInfo.setComposition(fabric.getComposition());

            List<FabricColorState> fabricColorStates = new ArrayList<>();
            for(Color color : fabric.getColors()) {
                FabricColorState fabricColorState = new FabricColorState();
                FabricState fabricState = fabricStateRepository.getByFabricAndColor(fabric, color);
                fabricColorState.setId(fabricState.getId());
                fabricColorState.setCode(color.getCode());
                fabricColorState.setAmount(fabricState.getAmount());
                fabricColorState.setReserved(fabricState.getReserved());
                fabricColorStates.add(fabricColorState);
            }
            fabricStateInfo.setColors(fabricColorStates);

            fabricStateInfos.add(fabricStateInfo);
        }

        return fabricStateInfos;
    }

    @GetMapping("/updateFabricState/{fabricStateId}/{value}")
    public ResponseEntity<?> updateFabricState(@PathVariable(value = "fabricStateId") Long fabricStateId, @PathVariable(value = "value") float value) {

        FabricState fabricState = fabricStateRepository.getOne(fabricStateId);
        fabricState.setAmount(fabricState.getAmount() + value);
        fabricStateRepository.save(fabricState);

        return ResponseEntity.ok().body(new ApiResponse(true, "Fabric state updated!"));
    }

    @GetMapping("/getFabricInfo")
    public FabricInfo getFabricInfo() {
        FabricInfo fabricInfo = new FabricInfo();
        int runningLowCount = 0;
        int notEnoughCount = 0;

        List<FabricState> fabricStates = fabricStateRepository.findAll();
        for(FabricState fabricState : fabricStates) {
            if(fabricState.getReserved() > fabricState.getAmount()) {
                notEnoughCount++;
            } else if(fabricState.getAmount() - fabricState.getReserved() <= 5 && fabricState.getAmount() != 0) {
                runningLowCount++;
            }
        }

        fabricInfo.setRunningLowCount(runningLowCount);
        fabricInfo.setNotEnoughCount(notEnoughCount);
        fabricInfo.setTotalCount(runningLowCount + notEnoughCount);
        return fabricInfo;
    }

    private String getFileExtension(String fileName) {
        int dotIndex = fileName.lastIndexOf(".");
        if(dotIndex < 0) {
            return null;
        }
        return fileName.substring(dotIndex+1);
    }
}
