package de.adorsys.opba.consentapi.controller;

import de.adorsys.opba.consentapi.model.generated.ConsentAuth;
import de.adorsys.opba.consentapi.resource.generated.DefaultApi;
import de.adorsys.opba.consentapi.service.ReceiveCallbackService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;

import java.util.concurrent.CompletableFuture;


@RestController
@RequiredArgsConstructor
public class ReceivCallBackController implements DefaultApi {

    private final ReceiveCallbackService receiveCallbackService;

    @Override
    public CompletableFuture<ResponseEntity<ConsentAuth>> receiveCallback(String authId, String aspspRedirectCode) {

        receiveCallbackService.receiveCallback(authId, aspspRedirectCode);
        return null;
    }







}
