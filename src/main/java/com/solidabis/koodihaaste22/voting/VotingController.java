package com.solidabis.koodihaaste22.voting;

import com.solidabis.koodihaaste22.restaurants.dtos.VoteResponseDTO;
import com.solidabis.koodihaaste22.voting.db.VotingResult;
import com.solidabis.koodihaaste22.voting.dtos.VotingResultDTO;
import com.solidabis.koodihaaste22.voting.dtos.RestaurantVotesDTO;
import com.solidabis.koodihaaste22.utils.Constants;
import com.solidabis.koodihaaste22.utils.TimeSource;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletResponse;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@CrossOrigin(origins = "*", allowedHeaders = "*")
@RequestMapping(value = "/api/v1", produces = "application/json")
public class VotingController {
    public static final int VOTERID_EXPIRY_TIME_SECONDS = 60 * 60 * 24;
    private final VoteRepository voteRepository;
    private final TimeSource timeSource;

    public VotingController(VoteRepository voteRepository, TimeSource timeSource) {
        this.voteRepository = voteRepository;
        this.timeSource = timeSource;
    }

    @CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
    @GetMapping("/vote")
    @Operation(summary = "Get today's vote. Will return a cookie containing the voter id if not set for the request")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "OK"),
    })
    public VoteResponseDTO getVote(@CookieValue(name= Constants.VOTERID_COOKIE_NAME, required = false) String voterIdCookie, HttpServletResponse response) {
        String voterId = makeOrReturnVoterCookie(voterIdCookie, response);

        return VoteResponseDTO.builder()
                .votedFor(voteRepository.todaysVote(voterId, timeSource.today()))
                .date(timeSource.today().format(DateTimeFormatter.ISO_LOCAL_DATE))
                .build();
    }

    private String makeOrReturnVoterCookie(String voterIdCookie, HttpServletResponse response) {
        if(voterIdCookie != null) return voterIdCookie;
        var voterId = UUID.randomUUID().toString();
        var cookie = new Cookie(Constants.VOTERID_COOKIE_NAME, voterId);
        cookie.setPath("/");
        cookie.setHttpOnly(true);
        cookie.setMaxAge(VOTERID_EXPIRY_TIME_SECONDS);
        response.addCookie(cookie);
        return voterId;
    }

    @PostMapping("/vote/{restaurantid}")
    @Operation(summary = "Give/remove a vote for given restaurant")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Vote/vote removal was succesful"),
            @ApiResponse(responseCode = "400", description = "VOTERID cookie was missing"),
            @ApiResponse(responseCode = "404", description = "Restaurant with given id not found"),
            @ApiResponse(responseCode = "500", description = "Database error occurred")
    })
    @Transactional
    public void registerVote(@PathVariable("restaurantid") String restaurantId,
                             @CookieValue(name = Constants.VOTERID_COOKIE_NAME) String voterIdCookie) {
        voteRepository.registerVote(restaurantId, voterIdCookie, timeSource.today());
    }

    @GetMapping("/results")
    @Operation(summary = "Return todays voting results")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Result retrieval was successful"),
            @ApiResponse(responseCode = "500", description = "Database error occurred")
    })
    @Transactional
    public VotingResultDTO results() {
        return buildVotingResultDTO(voteRepository.getResults(timeSource.today()));
    }

    @GetMapping("/results/{date}")
    @Operation(summary = "Return voting results for given date")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Result retrieval was successful"),
            @ApiResponse(responseCode = "500", description = "Database error occurred")
    })
    @Transactional
    public VotingResultDTO resultsByDate(@PathVariable("date") @DateTimeFormat(pattern = "yyyy-MM-dd") LocalDate date) {
        return buildVotingResultDTO(voteRepository.getResults(date));
    }

    private VotingResultDTO buildVotingResultDTO(List<VotingResult> results) {
        var resultList = results.stream().map(result -> RestaurantVotesDTO.builder()
                .votes(result.getVotes())
                .restaurantid(result.getRestaurantId())
                .name(result.getName())
                .city(result.getCity())
                .build());
        return VotingResultDTO.builder()
                .date(timeSource.today().format(DateTimeFormatter.ISO_LOCAL_DATE))
                .results(resultList.collect(Collectors.toList()))
                .build();
    }
}
