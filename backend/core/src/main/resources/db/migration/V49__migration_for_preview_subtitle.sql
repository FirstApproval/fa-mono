UPDATE publications SET preview_subtitle = substr(description::json->>0, 0, 200) WHERE TRUE;
