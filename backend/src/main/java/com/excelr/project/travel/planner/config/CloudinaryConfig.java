package com.excelr.project.travel.planner.config;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;

import java.io.IOException;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;


@Configuration
public class CloudinaryConfig {
	
    private final Cloudinary cloudinary = new Cloudinary();

    @Value("${cloudinary.cloud_name}")
    private String cloudName;

    @Value("${cloudinary.api_key}")
    private String apiKeyS;

    @Value("${cloudinary.api_secret}")
    private String apiSecret;

    @Bean
    public Cloudinary cloudinary() {
        return new Cloudinary(ObjectUtils.asMap(
            "cloud_name", cloudName,
            "api_key", apiKeyS,
            "api_secret", apiSecret));
    }
    
    public String uploadBase64Image(String base64Image, String publicId) throws IOException{
        Map uploadResult = cloudinary.uploader().upload(base64Image, ObjectUtils.asMap(
            "public_id", publicId,
            "folder", "booked_trips"
        ));
        return (String) uploadResult.get("secure_url");
    }

}
