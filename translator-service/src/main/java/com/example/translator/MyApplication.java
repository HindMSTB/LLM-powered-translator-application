package com.example.translator;

import org.glassfish.jersey.server.ResourceConfig;

import jakarta.ws.rs.ApplicationPath;

//defines the API base path
@ApplicationPath("/api")
public class MyApplication extends ResourceConfig {

    public MyApplication() {
        packages("com.example.translator");
    }
}
