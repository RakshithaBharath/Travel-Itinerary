package com.excelr.project.travel.planner.dto;

import lombok.Data;

@Data
public class TripData {

	 // Markdown text describing the itinerary (without image)
    private String markdown;

    // Base64 encoded image string (as received from OpenAI)
    private String base64Image;

    // URL after uploading the image to Cloudinary (for frontend use)
    private String cloudinaryImageUrl;

    // Optional: A title or identifier for the itinerary (if needed)
    private String title;

	}


