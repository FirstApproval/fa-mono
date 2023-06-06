plugins {
    id("core-openapi-plugin")
}

openApi {
    clientApi("core") {
        spec {
            path = file("src/core.openapi.yaml")
            packageName = "org.firstapproval.api.client"
        }
    }
}

tasks.named<Jar>("jar") {
    archiveBaseName.set("core-client")
}
