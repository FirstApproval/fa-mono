plugins {
    `kotlin-dsl`
}

repositories {
    mavenCentral()
}

dependencies {
    implementation("org.jetbrains.kotlin:kotlin-gradle-plugin:1.8.20")
    implementation("io.spring.gradle:dependency-management-plugin:1.1.0")
    implementation("org.openapitools:openapi-generator-gradle-plugin:6.6.0")
    implementation("org.openapitools:openapi-generator:6.6.0")
}

gradlePlugin {
    plugins {
        create("openApiPlugin") {
            id = "core-openapi-plugin"
            implementationClass = "org.firstapproval.gradle.plugin.OpenApiPlugin"
        }
    }
}
