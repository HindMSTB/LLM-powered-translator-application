package com.example.translator.controllers;

import com.example.translator.TranslationRequest;
import com.example.translator.services.TranslatorService;

import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;


@Path("/translator")
public class TranslatorController {

    private final TranslatorService service = new TranslatorService();

    @POST
    @Path("/translate")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response translate(TranslationRequest request) {

        try {
            String translation = service.translateToDarija(request.getText());
            return Response.ok("{\"translation\":\"" + translation + "\"}").build();

        } catch (Exception e) {
            e.printStackTrace();
            return Response.status(500)
                    .entity("{\"error\":\"" + e.getMessage() + "\"}")
                    .build();
        }
    }
}
