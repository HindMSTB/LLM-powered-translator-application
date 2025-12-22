package com.example.translator.client;

import java.io.BufferedReader;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.io.StringReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.nio.charset.StandardCharsets;

import com.example.translator.config.EnvConfig;

import jakarta.json.Json;
import jakarta.json.JsonObject;

public class GeminiClient {

    private static final String API_KEY = EnvConfig.get("GEMINI_API_KEY");

    public static String sendPrompt(String prompt) throws Exception {

        URL url = new URL(
            "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=" + API_KEY
        );

        HttpURLConnection conn = (HttpURLConnection) url.openConnection();
        conn.setDoOutput(true);
        conn.setRequestMethod("POST");
        conn.setRequestProperty("Content-Type", "application/json; charset=UTF-8");

        String jsonBody = """
        {
          "contents": [
            { "parts": [{ "text": "%s" }] }
          ]
        }
        """.formatted(prompt);

        try (OutputStream os = conn.getOutputStream()) {
            os.write(jsonBody.getBytes(StandardCharsets.UTF_8));
        }

        int status = conn.getResponseCode();
        InputStream is = (status < 400) ? conn.getInputStream() : conn.getErrorStream();

        StringBuilder response = new StringBuilder();
        try (BufferedReader br = new BufferedReader(new InputStreamReader(is))) {
            String line;
            while ((line = br.readLine()) != null) response.append(line);
        }

        if (status >= 400) {
            throw new RuntimeException("Gemini API Error: " + response);
        }

        JsonObject json = Json.createReader(new StringReader(response.toString())).readObject();

        return json.getJsonArray("candidates")
                   .getJsonObject(0)
                   .getJsonObject("content")
                   .getJsonArray("parts")
                   .getJsonObject(0)
                   .getString("text");
    }
}
