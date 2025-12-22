package com.example.translator;

//data model for the API request
public class TranslationRequest {

    private String text;

    public String getText() {
        return text;
    }

    public void setText(String text) {
        this.text = text;
    }
}
