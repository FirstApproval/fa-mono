plugins {
    id("core-openapi-plugin")
}

openApi {
    serverApiSpec {
        path = file("api/src/core.openapi.yaml")
        packageName = "org.firstapproval.api.server"
    }
}

dependencies {
    implementation("org.springframework.boot:spring-boot-starter-web")
    implementation("org.springframework.boot:spring-boot-starter-data-jpa")
    implementation("org.springframework.boot:spring-boot-starter-security")
    implementation("org.springframework.boot:spring-boot-starter-websocket")
    implementation("org.springframework.boot:spring-boot-starter-mail")
    implementation("org.springframework.boot:spring-boot-starter-thymeleaf")
    implementation("org.springframework.boot:spring-boot-starter-validation")
    implementation("org.jetbrains.kotlin:kotlin-reflect")
    implementation("org.jetbrains.kotlinx:kotlinx-coroutines-core:1.10.1")
    implementation("org.flywaydb:flyway-core")
    implementation("org.postgresql:postgresql")
    implementation("org.springframework.boot:spring-boot-starter-webflux")
    implementation("org.openapitools:jackson-databind-nullable:0.2.6")
    implementation("javax.annotation:javax.annotation-api:1.3.2")
    implementation("javax.xml.bind:jaxb-api:2.3.1")
    implementation("io.github.microutils:kotlin-logging-jvm:2.0.11")
    implementation("io.swagger:swagger-annotations:1.6.10")
    implementation("io.jsonwebtoken:jjwt")
    implementation("com.amazonaws:aws-java-sdk-s3")
    implementation("com.auth0:java-jwt:4.4.0")
    implementation("com.fasterxml.jackson.module:jackson-module-kotlin")
    implementation("com.google.code.findbugs:jsr305:3.0.2")
    implementation("com.fasterxml.jackson.module:jackson-module-kotlin")
    implementation("com.fasterxml.jackson.datatype:jackson-datatype-jsr310")
    implementation("com.auth0:jwks-rsa:0.21.1")
    implementation("com.vladmihalcea:hibernate-types-60:2.21.1")
    implementation("net.logstash.logback:logstash-logback-encoder:7.3")
    implementation("net.javacrumbs.shedlock:shedlock-spring:4.42.0")
    implementation("net.javacrumbs.shedlock:shedlock-provider-jdbc-template:4.42.0")
    implementation("org.springframework.data:spring-data-elasticsearch:5.1.2")
    implementation("org.apache.commons:commons-io:1.3.2")
    implementation("com.openhtmltopdf:openhtmltopdf-core:1.0.10")
    implementation("com.openhtmltopdf:openhtmltopdf-pdfbox:1.0.10")
    implementation("com.openhtmltopdf:openhtmltopdf-java2d:1.0.10")
    implementation("com.openhtmltopdf:openhtmltopdf-rtl-support:1.0.10")
    implementation("javax.validation:validation-api")
}
