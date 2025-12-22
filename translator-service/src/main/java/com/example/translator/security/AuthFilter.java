package com.example.translator.security;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.Base64;

import jakarta.ws.rs.container.ContainerRequestContext;
import jakarta.ws.rs.container.ContainerRequestFilter;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.ext.Provider;

@Provider
public class AuthFilter implements ContainerRequestFilter {

   @Override
   public void filter(ContainerRequestContext requestContext) throws IOException {

       
       if ("OPTIONS".equalsIgnoreCase(requestContext.getMethod())) {
           return;
       }

       String authHeader = requestContext.getHeaderString("Authorization");

       if (authHeader == null || !authHeader.startsWith("Basic ")) {
           abort(requestContext);
           return;
       }

       String base64Credentials = authHeader.substring("Basic ".length());
       String credentials = new String(
               Base64.getDecoder().decode(base64Credentials),
               StandardCharsets.UTF_8
       );

       String[] values = credentials.split(":", 2);

       if (values.length != 2 ||
           !"hind".equals(values[0]) ||
           !"0000".equals(values[1])) {
           abort(requestContext);
       }
   }

   private void abort(ContainerRequestContext requestContext) {
       requestContext.abortWith(
           Response.status(Response.Status.UNAUTHORIZED)
                   .header("WWW-Authenticate", "Basic realm=\"Translator API\"")
                   .build()
       );
   }
}
