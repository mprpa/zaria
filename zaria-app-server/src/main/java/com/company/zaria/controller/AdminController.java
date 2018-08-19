package com.company.zaria.controller;

import com.company.zaria.payload.ApiResponse;
import com.company.zaria.payload.ArticleCodeAvailability;
import com.company.zaria.repository.ArticleRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.ByteArrayInputStream;
import java.io.File;
import java.io.IOException;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    @Autowired
    private ArticleRepository articleRepository;

    private static final Logger logger = LoggerFactory.getLogger(AdminController.class);

    @GetMapping("/checkArticleAvailability")
    public ArticleCodeAvailability checkArticleCodeAvailability(@RequestParam(value = "code") String code) {
        Boolean isAvailable = !articleRepository.existsByCode(code);
        return new ArticleCodeAvailability(isAvailable);
    }

//    @RequestMapping(value="/upload", method=RequestMethod.POST)
//    public @ResponseBody ResponseEntity<String>  handleFileUpload(@RequestParam("name") String name,
//                                                                  @RequestParam("file") MultipartFile file) throws Exception{
//        if (name.contains("/")) {
//            return ResponseEntity.status(HttpStatus.UNPROCESSABLE_ENTITY).body("Folder separators not allowed.");
//        } else if (name.contains("/")) {
//            return ResponseEntity.status(HttpStatus.UNPROCESSABLE_ENTITY).body("Relative pathnames not allowed.");
//        } else if (!name.endsWith(".jar")) {
//            return ResponseEntity.status(HttpStatus.UNPROCESSABLE_ENTITY).body("File type not allowed.  Must be a Jar file type ending in '.jar'.");
//        }
//
//        if (!file.isEmpty()) {
//            try {
//                byte[] bytes = file.getBytes();
//                BufferedOutputStream stream =
//                        new BufferedOutputStream(new FileOutputStream(new File(name)));
//                stream.write(bytes);
//                stream.close();
//                return ResponseEntity.ok("File " + name + " uploaded.");
//            } catch (Exception e) {
//                return ResponseEntity.status(HttpStatus.UNPROCESSABLE_ENTITY).body(e.getMessage());
//            }
//        } else {
//            return ResponseEntity.status(HttpStatus.UNPROCESSABLE_ENTITY).body("You failed to upload " + name + " because the file was empty.");
//        }
//    }

    @RequestMapping(value = "/upload", method = RequestMethod.POST)
    public ResponseEntity<?> handleFormUpload(
            @RequestParam("file") MultipartFile file) throws IOException {
        if (!file.isEmpty()) {
            BufferedImage src = ImageIO.read(new ByteArrayInputStream(file.getBytes()));
            File destination = new File("/Users/marijanaprpa/Downloads/uploadimage.png"); // something like C:/Users/tom/Documents/nameBasedOnSomeId.png
            ImageIO.write(src, "png", destination);
            //Save the id you have used to create the file name in the DB. You can retrieve the image in future with the ID.
        }
        return ResponseEntity.ok().body(new ApiResponse(true, "Image uploaded successfully!"));
    }
}
