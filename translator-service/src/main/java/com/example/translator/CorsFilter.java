package com.example.translator;

import java.io.IOException;

import jakarta.ws.rs.container.ContainerRequestContext;
import jakarta.ws.rs.container.ContainerResponseContext;
import jakarta.ws.rs.container.ContainerResponseFilter;
import jakarta.ws.rs.ext.Provider;

@Provider
public class CorsFilter implements ContainerResponseFilter {

    @Override
    public void filter(ContainerRequestContext requestContext,
                       ContainerResponseContext responseContext) throws IOException {

        responseContext.getHeaders().putSingle(
                "Access-Control-Allow-Origin",
                "http://127.0.0.1:5500"
        );

        responseContext.getHeaders().putSingle(
                "Access-Control-Allow-Headers",
                "Origin, Content-Type, Accept, Authorization"
        );

        responseContext.getHeaders().putSingle(
                "Access-Control-Allow-Methods",
                "GET, POST, PUT, DELETE, OPTIONS"
        );

        responseContext.getHeaders().putSingle(
                "Access-Control-Max-Age",
                "1209600"
        );
    }
}
