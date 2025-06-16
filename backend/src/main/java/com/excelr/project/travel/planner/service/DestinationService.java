package com.excelr.project.travel.planner.service;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import com.excelr.project.travel.planner.dto.DestinationDTO;
import com.excelr.project.travel.planner.entity.Destination;
import com.excelr.project.travel.planner.repository.DestinationRepository;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class DestinationService {

    private final DestinationRepository destinationRepo;

    public DestinationService(DestinationRepository destinationRepo) {
        this.destinationRepo = destinationRepo;
    }

    public List<DestinationDTO> getDestinations(int page, int size) {
    	int startRow = page * size;
        int endRow = startRow + size;

        List<Destination> destinations = destinationRepo.findDestinationsPaginated(startRow, endRow);

        return destinations.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    private DestinationDTO convertToDTO(Destination dest) {
        DestinationDTO dto = new DestinationDTO();
        dto.setId(dest.getId());
        dto.setName(dest.getName());
        dto.setCountry(dest.getCountry());
        dto.setDescription(dest.getDescription());
        dto.setImageUrl(dest.getImageUrl());
        dto.setAvgPackagePriceInr(dest.getAvgPackagePriceInr());
        return dto;
    }
}
