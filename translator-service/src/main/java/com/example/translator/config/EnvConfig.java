package com.example.translator.config;

import io.github.cdimascio.dotenv.Dotenv;

public class EnvConfig {

    private static final Dotenv dotenv = Dotenv.configure()
                                               .filename("config.env")  
                                               .directory("D:/projectIA/translator-service") 
                                               .load();

    public static String get(String key) {
        return dotenv.get(key);
    }
}
