package com.excelr.project.travel.planner.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;

import com.excelr.project.travel.planner.flight.dto.FlightInfo;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
public class FlightSearchService {

	@Autowired
	private AmadeusAuthService amadeusAuthService;

	private final RestTemplate restTemplate;

	public FlightSearchService(RestTemplate restTemplate) {
		this.restTemplate = restTemplate;
	}

	public Map<String, Object> searchFlights(String origin, String destination, String departureDate, int passengers) {
		String accessToken = amadeusAuthService.getAmadeusToken();
		origin = amadeusAuthService.getCityCode(origin, accessToken);
		destination = amadeusAuthService.getCityCode(destination, accessToken);

		String url = "https://test.api.amadeus.com/v2/shopping/flight-offers" + "?originLocationCode=" + origin
				+ "&destinationLocationCode=" + destination + "&departureDate=" + departureDate + "&adults="
				+ passengers + "&currencyCode=USD&max=5";

		HttpHeaders headers = new HttpHeaders();
		headers.set("Authorization", "Bearer " + accessToken);

		HttpEntity<String> entity = new HttpEntity<>(headers);

		try {
			ResponseEntity<Map> response = restTemplate.exchange(url, HttpMethod.GET, entity, Map.class);
			return response.getBody(); // Raw JSON map
		} catch (HttpClientErrorException e) {
			log.error("Amadeus API error: {}", e.getResponseBodyAsString());
			throw e;
		}
	}

	public List<FlightInfo> parseFlightOffers(Map<String, Object> rawResponse) {
		List<FlightInfo> flightList = new ArrayList<>();

		List<Map<String, Object>> data = (List<Map<String, Object>>) rawResponse.get("data");
		if (data == null)
			return flightList;

		for (Map<String, Object> offer : data) {
			String flightId = (String) offer.get("id");
			Map<String, Object> priceMap = (Map<String, Object>) offer.get("price");
			double totalPrice = Double.parseDouble(priceMap.get("total").toString());
			String currency = priceMap.get("currency") != null ? priceMap.get("currency").toString() : "N/A";

			List<Map<String, Object>> itineraries = (List<Map<String, Object>>) offer.get("itineraries");
			for (Map<String, Object> itinerary : itineraries) {
				String duration = (String) itinerary.get("duration");
				List<Map<String, Object>> segments = (List<Map<String, Object>>) itinerary.get("segments");

				for (Map<String, Object> segment : segments) {
					Map<String, Object> departure = (Map<String, Object>) segment.get("departure");
					Map<String, Object> arrival = (Map<String, Object>) segment.get("arrival");

					String carrierCode = (String) segment.get("carrierCode");
					String flightNumber = (String) segment.get("number");

					String departureAirport = (String) departure.get("iataCode");
					String arrivalAirport = (String) arrival.get("iataCode");
					String departureTime = (String) departure.get("at");
					String arrivalTime = (String) arrival.get("at");

					FlightInfo info = new FlightInfo();
					info.setFlightId(flightId);
					info.setCarrierCode(carrierCode);
					info.setFlightNumber(flightNumber);
					info.setDepartureAirport(departureAirport);
					info.setArrivalAirport(arrivalAirport);
					info.setDepartureTime(departureTime);
					info.setArrivalTime(arrivalTime);
					info.setDuration(duration);
					info.setPrice(totalPrice);
					info.setCurrency(currency);

					flightList.add(info);
				}
			}
		}

		return flightList;
	}

}
