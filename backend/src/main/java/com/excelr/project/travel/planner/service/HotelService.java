package com.excelr.project.travel.planner.service;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import com.excelr.project.travel.planner.dto.BookingRequest;
import com.excelr.project.travel.planner.dto.BookingResponse;
import com.excelr.project.travel.planner.dto.Hotel;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

@Service
public class HotelService {

    private final RestTemplate restTemplate;
    private final String affiliateMarker = "f52aed9310a1261e0ae85665f2f08e73"; // from Travelpayouts
    private final String affiliateUrlTemplate = "https://www.travelpayouts.com/widget_redirect?marker=%s&hotel_id=%s";

    public HotelService(RestTemplateBuilder builder) {
        this.restTemplate = builder.build();
    }

    public List<Hotel> searchHotels(String city, String checkInDate, String checkOutDate, Integer adults, String currency, int page, int size) {
        // Example API URL — adjust as needed
        String apiUrl = String.format(
            "https://engine.hotellook.com/api/v2/cache.json?location=%s&checkIn=%s&checkOut=%s&adults=%d&currency=%s&limit=%d&offset=%d",
            city, checkInDate, checkOutDate, adults, currency, size, page * size);

        // Call Hotellook API (mocked here)
        ResponseEntity<String> response = restTemplate.getForEntity(apiUrl, String.class);

        // Parse JSON manually or using Jackson ObjectMapper
        // For brevity, let's mock response parsing here:
        List<Hotel> hotels = parseHotelsFromJson(response.getBody());
        

        // Add affiliate links
        hotels.forEach(hotel -> {
            String link = String.format(affiliateUrlTemplate, affiliateMarker, hotel.getId());
            hotel.setAffiliateLink(link);
        });

        System.out.println(hotels);
        return hotels;
    }

    private List<Hotel> parseHotelsFromJson(String json) {
        List<Hotel> hotels = new ArrayList<>();
        try {
            ObjectMapper mapper = new ObjectMapper();
            JsonNode root = mapper.readTree(json); // Assumes root is an array
            System.out.println(root);

            for (JsonNode node : root) {
                Hotel hotel = new Hotel();

                hotel.setId(node.path("hotelId").asText()); // may be "hotelId" or "id" based on API
                hotel.setName(node.path("hotelName").asText());
                hotel.setCity(node.path("location").asText(""));
                hotel.setPrice(node.path("priceAvg").asDouble(0.0));
                String apiCurrency = node.path("currency").asText();
                hotel.setImageUrl(node.path("imageUrl").asText());
                hotel.setRating(node.path("stars").asInt(0));
                
                String hotelId = node.path("id").asText();

                if (hotelId != null && !hotelId.isEmpty()) {
                    String imageUrl = String.format("https://photo.hotellook.com/image_v2/limit/h%s_0/160x120.jpg", hotelId);
                    hotel.setImageUrl(imageUrl);
                } else {
                    hotel.setImageUrl("https://tse3.mm.bing.net/th?id=OIP.pPUElbA39dJi65T7R0oZLAHaE8&pid=Api&P=0&h=180");
                }

                System.out.println(hotel);

                hotels.add(hotel);
            }
        } catch (Exception e) {
            e.printStackTrace(); // You may log it better in real code
        }
        return hotels;
    }

    public BookingResponse bookHotel(BookingRequest request) {
        // Simulate booking logic: generate a booking ref
        String bookingRef = "BK-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();

        // In real app, save booking info to DB

        return new BookingResponse(bookingRef);
    }
}
