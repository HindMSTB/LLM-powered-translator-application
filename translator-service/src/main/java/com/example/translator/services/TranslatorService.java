package com.example.translator.services;

import com.example.translator.client.GeminiClient;
import com.example.translator.config.EnvConfig;

public class TranslatorService {

    public String translateToDarija(String englishText) throws Exception {

        String basePrompt = EnvConfig.get("GEMINI_TRANSLATE_PROMPT");

        String fullPrompt = basePrompt + "\n" + englishText;

        return GeminiClient.sendPrompt(fullPrompt);
    }
}
