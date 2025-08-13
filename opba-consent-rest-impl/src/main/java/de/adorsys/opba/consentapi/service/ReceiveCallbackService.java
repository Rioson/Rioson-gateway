package de.adorsys.opba.consentapi.service;

import de.adorsys.opba.db.repository.jpa.SessionRepository;
import de.adorsys.opba.tppbankingapi.orchestrated.pis.model.generated.ConsentAuth;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

@RequiredArgsConstructor
@Service
@ComponentScan({
        "de.adorsys.opba.protocol.facade.services.pis",
        "de.adorsys.opba.protocol.facade.services.psu",
        "de.adorsys.opba.protocol.facade.services.authorization",
        "de.adorsys.opba.consentapi",
        "de.adorsys.opba.tppbankingapi.service"
})
public class ReceiveCallbackService {

    private final WebClient webClient;
    private final SessionRepository sessionRepository;

    public ConsentAuth receiveCallback(String authId, String redirectState) {
        String baseUrl = "http://localhost:8085";

        return webClient.get()
                .uri(baseUrl + "/v1/consent/{authId}/fromAspsp/{redirectState}/ok",
                        authId, redirectState)
                .header(HttpHeaders.ACCEPT, MediaType.APPLICATION_JSON_VALUE)
                .cookie("Authorization-Session-Key", sessionRepository.findByAuthId(authId).get().getCookie())
                .exchangeToMono(response -> {
                    String xsrfToken = response.headers().asHttpHeaders().getFirst("X-XSRF-TOKEN");

                    // Optionnel : afficher le token pour vérification
                    System.out.println("XSRF-TOKEN: " + xsrfToken);

                    if (xsrfToken == null) {
                        return Mono.error(new RuntimeException("XSRF token not found in response headers"));
                    }

                    return webClient.get()
                            .uri(baseUrl + "/v1/consent/{authId}?xXsrfToken={xsrfToken}",
                                    authId, xsrfToken)
                            .header(HttpHeaders.ACCEPT, MediaType.APPLICATION_JSON_VALUE)
                            .retrieve()
                            .bodyToMono(ConsentAuth.class);
                }).block();
    }
}
