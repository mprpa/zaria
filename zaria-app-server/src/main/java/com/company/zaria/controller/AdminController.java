package com.company.zaria.controller;

import com.company.zaria.model.*;
import com.company.zaria.payload.*;
import com.company.zaria.repository.*;
import com.company.zaria.util.EmailService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.validation.Valid;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
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

    private String getFileExtension(String fileName) {
        int dotIndex = fileName.lastIndexOf(".");
        if(dotIndex < 0) {
            return null;
        }
        return fileName.substring(dotIndex+1);
    }
}
