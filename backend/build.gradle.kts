import io.spring.gradle.dependencymanagement.dsl.DependencyManagementExtension
import org.jetbrains.kotlin.gradle.tasks.KotlinCompile

plugins {
    id("org.springframework.boot") version "3.1.0-SNAPSHOT" apply false
    id("com.github.ben-manes.versions") version "0.42.0" apply false
    id("io.spring.dependency-management") apply false
    kotlin("jvm") apply false
    kotlin("plugin.spring") version "1.8.20" apply false
    kotlin("plugin.jpa") version "1.8.20" apply false
}

subprojects {
    apply(plugin = "io.spring.dependency-management")
    apply(plugin = "org.jetbrains.kotlin.jvm")
    apply(plugin = "org.jetbrains.kotlin.kapt")
    apply(plugin = "org.jetbrains.kotlin.plugin.spring")

    if (!name.endsWith("api") && name != "common")  {
        apply(plugin = "com.github.ben-manes.versions")
        apply(plugin = "org.springframework.boot")
        apply(plugin = "org.jetbrains.kotlin.plugin.jpa")
    }

    repositories {
        mavenCentral()
        maven { url = uri("https://repo.spring.io/milestone") }
        maven { url = uri("https://repo.spring.io/snapshot") }
    }

    dependencies {
        "implementation"(kotlin("stdlib-jdk8"))
        "implementation"("net.lingala.zip4j:zip4j:2.11.3")
    }

    configure<DependencyManagementExtension> {
        imports {
            mavenBom("org.springframework.boot:spring-boot-dependencies:3.1.0-SNAPSHOT")
        }
        dependencies {
            dependency("org.springframework.security:spring-security-oauth2-authorization-server:1.0.1")
            dependency("org.openapitools:jackson-databind-nullable:0.2.6")
            dependency("com.google.code.findbugs:jsr305:3.0.2")
            dependency("javax.annotation:javax.annotation-api:1.3.2")
            dependency("io.swagger.core.v3:swagger-annotations:2.2.9")
            dependency("io.github.microutils:kotlin-logging-jvm:2.0.11")
            dependency("com.fasterxml.jackson.datatype:jackson-datatype-jsr310:2.14.2")
            dependency("com.fasterxml.jackson.core:jackson-databind:2.14.2")
            dependency("io.jsonwebtoken:jjwt:0.9.1")
            dependency("org.springframework.boot:spring-boot-starter-webflux:3.1.0-SNAPSHOT")
            dependency("com.amazonaws:aws-java-sdk-s3:1.12.449")
            dependency("net.logstash.logback:logstash-logback-encoder:7.3")
            dependency("org.springframework.data:spring-data-elasticsearch:5.1.2")
            dependency("com.vladmihalcea:hibernate-types-52:2.21.1")
            dependency("org.docx4j:docx4j-core:11.5.4")
            dependency("org.docx4j:docx4j-export-fo:11.5.4")
            dependency("org.docx4j:docx4j-JAXB-ReferenceImpl:11.5.4")
        }
    }

    tasks.withType<KotlinCompile> {
        kotlinOptions {
            freeCompilerArgs = listOf("-Xjsr305=strict")
            jvmTarget = "17"
        }
    }

    tasks.withType<JavaCompile> {
        sourceCompatibility = JavaVersion.VERSION_17.majorVersion
    }

    tasks.withType<Test> {
        useJUnitPlatform()
    }
}
