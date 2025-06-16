package com.excelr.project.travel.planner.service;

import org.springframework.cache.annotation.Cacheable;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import lombok.extern.slf4j.Slf4j;

import java.util.Collections;
import java.util.List;
import java.util.Map;

@Slf4j
@Service
public class AmadeusAuthService {

    private final RestTemplate restTemplate;

    public AmadeusAuthService(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    public String getAmadeusToken() {
        String url = "https://test.api.amadeus.com/v1/security/oauth2/token";

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

        MultiValueMap<String, String> body = new LinkedMultiValueMap<>();
        body.add("grant_type", "client_credentials");
        body.add("client_id", "LGnMnRvZ1eM0j2GuPQdWcNcJBYo7P1CN");
        body.add("client_secret", "Dx3tjv03An6ZhP8z");

        HttpEntity<MultiValueMap<String, String>> request = new HttpEntity<>(body, headers);

        try {
            ResponseEntity<Map> response = restTemplate.postForEntity(url, request, Map.class);
            return (String) response.getBody().get("access_token");
        } catch (Exception e) {
            log.error("Failed to fetch Amadeus token: {}", e.getMessage());
            return null;
        }
    }
    
    @Cacheable(value = "iataCache", key = "#cityName")
    public String getCityCode(String cityName, String accessToken) {
        String url = UriComponentsBuilder.fromHttpUrl("https://test.api.amadeus.com/v1/reference-data/locations")
                .queryParam("keyword", cityName)
                .queryParam("subType", "CITY")
                .toUriString();

        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(accessToken);
        headers.setAccept(Collections.singletonList(MediaType.APPLICATION_JSON));

        HttpEntity<Void> request = new HttpEntity<>(headers);

        ResponseEntity<Map> response = restTemplate.exchange(url, HttpMethod.GET, request, Map.class);

        List<Map<String, Object>> data = (List<Map<String, Object>>) response.getBody().get("data");

        if (data != null && !data.isEmpty()) {
        	log.info((String) data.get(0).get("iataCode"));
            return (String) data.get(0).get("iataCode"); // e.g., "BLR"
        }
        

        return null;
    }

}


