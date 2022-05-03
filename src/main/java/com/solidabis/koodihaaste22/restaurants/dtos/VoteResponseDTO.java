package com.solidabis.koodihaaste22.restaurants.dtos;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Builder;
import lombok.Getter;

import java.util.List;

@Builder
@Getter
public class VoteResponseDTO {
    @Schema(description = "If non-null, contains the voted restaurant id for today")
    private String votedFor;
    @Schema(description = "Current date")
    private String date;
}
