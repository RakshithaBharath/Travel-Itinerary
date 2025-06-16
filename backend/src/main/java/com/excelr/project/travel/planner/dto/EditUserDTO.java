package com.excelr.project.travel.planner.dto;

import lombok.Data;

@Data
public class EditUserDTO {
    private String name;
    private String phone;
    private String sex;
    private String preferredCurrency;
    private String preferredLanguage;
    private String defaultLocation;
}