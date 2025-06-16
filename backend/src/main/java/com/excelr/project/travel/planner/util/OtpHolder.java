package com.excelr.project.travel.planner.util;

import com.excelr.project.travel.planner.enums.OtpPurpose;

public class OtpHolder {
    private final String otp;
    private final OtpPurpose purpose;
    private final long timestamp;

    public OtpHolder(String otp, OtpPurpose purpose) {
        this.otp = otp;
        this.purpose = purpose;
        this.timestamp = System.currentTimeMillis();
    }

    public String getOtp() {
        return otp;
    }

    public OtpPurpose getPurpose() {
        return purpose;
    }

    public long getTimestamp() {
        return timestamp;
    }
}
